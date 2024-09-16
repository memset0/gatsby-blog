/**
 * @import {Processor} from 'unified'
 */

import { markdownLineEnding } from "micromark-util-character";
import { factorySpace } from "micromark-factory-space";
import { codes, types, constants } from "micromark-util-symbol";

function micromarkExt() {
  const marker = {
    partial: true,
    tokenize: function (effects, ok, nok) {
      let markerSize = 0;
      if (this.previous === codes.equalsTo) {
        return nok;
      }
      const start = function (code) {
        effects.enter("markMarker");
        return marker;
      };
      const marker = function (code) {
        if (code === codes.equalsTo) {
          effects.consume(code);
          markerSize++;
          return marker;
        }
        if (markerSize == 2) {
          effects.exit("markMarker");
          markerSize = 0;
          return ok;
        }
        return nok;
      };
      return factorySpace(effects, start, types.whitespace);
    },
  };

  const mark = {
    name: "mark",
    tokenize: function (effects, ok, nok) {
      const start = function (code) {
        effects.enter("mark");
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
        effects.exit("mark");
        return ok;
      };
      return start;
    },
  };

  return {
    text: {
      [codes.equalsTo]: mark,
    },
  };
}

function fromMarkdownExt() {
  const enterMark = function (token) {
    this.enter(
      {
        type: "mark",
        children: [],
      },
      token
    );
  };
  const exitMark = function (token) {
    const node = this.exit(token);
    node.data = {
      ...node.data,
      hName: "mark",
      hProperties: {
        className: "m-mark",
      },
    };
  };
  return {
    enter: {
      mark: enterMark,
    },
    exit: {
      mark: exitMark,
    },
  };
}

export default function remarkMark() {
  const self = /** @type {Processor<Root>} */ (this);
  const data = self.data();
  function add(key, value) {
    if (Array.isArray(data[key])) {
      data[key].push(value);
    } else {
      data[key] = [value];
    }
  }

  add("micromarkExtensions", micromarkExt());
  add("fromMarkdownExtensions", fromMarkdownExt());
}
