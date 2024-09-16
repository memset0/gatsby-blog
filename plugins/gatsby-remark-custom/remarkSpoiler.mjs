/**
 * @import {Processor} from 'unified'
 */

import { markdownLineEnding } from "micromark-util-character";
import { factorySpace } from "micromark-factory-space";
import { codes, types, constants } from "micromark-util-symbol";

function tokenizeSpoiler(effects, ok, nok) {
  const self = this;
  const start = function (code) {
    effects.enter("spoiler");
    return effects.attempt(marker, factorySpace(effects, contentStart, types.whitespace), nok);
  };
  const contentStart = function (code) {
    effects.enter(types.chunkText, {
      contentType: constants.contentTypeText,
    });
    return content;
  };
  const content = function (code) {
    return effects.check(marker, factorySpace(effects, contentAfter, types.whitespace), comsumeData);
  };
  const comsumeData = function (code) {
    if (markdownLineEnding(code) || code === codes.eof) {
      return nok;
    }
    effects.consume(code);
    return content;
  };
  const contentAfter = function (code) {
    effects.exit(types.chunkText);
    return effects.attempt(marker, after, nok);
  };
  const after = function (code) {
    effects.exit("spoiler");
    return ok;
  };
  return start;
}

// 定义分界符 (!!) 的 Tokenizer
const tokenizeMarker = function (effects, ok, nok) {
  let markerSize = 0;
  if (this.previous === codes.exclamationMark) {
    return nok;
  }
  const start = function (code) {
    effects.enter("spoilerMarker");
    return marker;
  };
  const marker = function (code) {
    if (code === codes.exclamationMark) {
      effects.consume(code);
      markerSize++;
      return marker;
    }
    if (markerSize == 2) {
      effects.exit("spoilerMarker");
      markerSize = 0;
      return ok;
    }
    return nok;
  };
  return factorySpace(effects, start, types.whitespace);
};

const marker = {
  tokenize: tokenizeMarker,
  partial: true,
};

const spoiler = {
  name: "spoiler",
  tokenize: tokenizeSpoiler,
};

function syntax() {
  return {
    text: {
      [codes.exclamationMark]: spoiler,
    },
  };
}

function fromMarkdown() {
  const enterSpoiler = function (token) {
    this.enter(
      {
        type: "spoiler",
        children: [],
      },
      token
    );
  };
  const exitSpoiler = function (token) {
    const node = this.exit(token);
    node.data = {
      ...node.data,
      hName: "span",
      hProperties: {
        className: "m-spoiler",
      },
    };
  };
  return {
    enter: {
      spoiler: enterSpoiler,
    },
    exit: {
      spoiler: exitSpoiler,
    },
  };
}

export default function remarkSpoiler() {
  const self = /** @type {Processor<Root>} */ (this);
  const data = self.data();
  function add(key, value) {
    if (Array.isArray(data[key])) {
      data[key].push(value);
    } else {
      data[key] = [value];
    }
  }

  add("micromarkExtensions", syntax());
  add("fromMarkdownExtensions", fromMarkdown());
}
