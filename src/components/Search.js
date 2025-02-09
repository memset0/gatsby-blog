import React, { useState, useCallback } from "react";
import { navigate, useStaticQuery, graphql } from "gatsby";
import FlexSearch from "flexsearch";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { checkNegIndent } from "../utils/frontend";

const Search = () => {
  const [searchIndex, setSearchIndex] = useState(null);
  const [query, setQuery] = useState("");
  const [dialogQuery, setDialogQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { Document } = FlexSearch;

  const data = useStaticQuery(graphql`
    query SearchIndexQuery {
      allMarkdownRemark(filter: { fields: { isPublished: { eq: true } } }) {
        nodes {
          id
          fields {
            slug
            plainText
            publishedTitle
          }
        }
      }
    }
  `);

  // 添加一个用于获取匹配内容的辅助函数
  const getMatchedContent = useCallback((content, query) => {
    if (!query.trim()) return "";

    const words = query.trim().toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();

    // 找到第一个匹配的位置
    let matchIndex = -1;
    for (const word of words) {
      const index = contentLower.indexOf(word);
      if (index !== -1) {
        matchIndex = index;
        break;
      }
    }

    if (matchIndex === -1) return "";

    // 截取匹配位置前后的文本
    const start = Math.max(0, matchIndex - 50);
    const end = Math.min(content.length, matchIndex + 100);
    let excerpt = content.slice(start, end);

    // 添加省略号
    if (start > 0) excerpt = "..." + excerpt;
    if (end < content.length) excerpt += "...";

    // 高亮所有匹配的词
    let highlightedExcerpt = excerpt;
    // 按照长度从长到短排序关键词，避免短词先匹配导致长词无法匹配
    const sortedWords = words.sort((a, b) => b.length - a.length);

    for (const word of sortedWords) {
      // 使用正则表达式进行全局匹配，i 标志使其大小写不敏感
      const regex = new RegExp(`(${word})`, "gi");
      highlightedExcerpt = highlightedExcerpt.replace(regex, "<strong>$1</strong>");
    }

    return highlightedExcerpt;
  }, []);

  const handleSearch = useCallback(
    value => {
      if (!value.trim() || !searchIndex) {
        setResults([]);
        return;
      }

      const searchResults = searchIndex.search(value, {
        limit: 10,
        enrich: true,
      });

      const uniqueResults = Array.from(
        new Map(
          searchResults.flatMap(result =>
            result.result.map(doc => [
              doc.doc.slug,
              {
                title: doc.doc.title,
                slug: doc.doc.slug,
                content: doc.doc.content, // 添加内容字段
                matchedContent: getMatchedContent(doc.doc.content, value),
              },
            ])
          )
        ).values()
      );

      setResults(uniqueResults);
    },
    [searchIndex, getMatchedContent]
  );

  const initSearchIndex = useCallback(() => {
    if (searchIndex) return;

    try {
      const searchData = data.allMarkdownRemark.nodes.map(node => ({
        id: node.id,
        title: node.fields.publishedTitle,
        content: node.fields.plainText,
        slug: node.fields.slug,
      }));

      const index = new Document({
        document: {
          id: "id",
          index: ["title", "content"],
          store: ["title", "slug", "content"], // 添加 content 到存储字段
        },
        tokenize: "forward",
        context: true,
      });

      for (const doc of searchData) {
        console.log("[search]", "添加文档到索引:", doc);
        index.add(doc);
      }

      setSearchIndex(index);
    } catch (error) {
      console.error("Failed to initialize search:", error);
    } finally {
      setIsLoading(false);
    }
  }, [data, searchIndex]);

  const handleInputChange = e => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleDialogInputChange = e => {
    const value = e.target.value;
    setDialogQuery(value);
    handleSearch(value);
  };

  const handleInputClick = () => {
    setIsDialogOpen(true);
    setDialogQuery(query);
    if (!searchIndex) {
      initSearchIndex();
    }
    handleSearch(query);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleResultClick = result => {
    navigate(result.slug);
    setIsDialogOpen(false);
    setQuery("");
    setDialogQuery("");
    setResults([]);
  };

  return (
    <>
      <TextField
        fullWidth
        placeholder="搜索..."
        value={query}
        onChange={handleInputChange}
        onClick={handleInputClick}
        disabled={isLoading && isDialogOpen}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            minHeight: "60vh",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              fullWidth
              autoFocus
              placeholder="搜索文章..."
              value={dialogQuery}
              onChange={handleDialogInputChange}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 1 }}
            />
            <IconButton edge="end" onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 1, pt: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : results.length > 0 ? (
            <List>
              {results.map((result, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleResultClick(result)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemText
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: "1rem",
                        textIndent: checkNegIndent(result.title) ? "-0.5em" : 0,
                      },
                    }}
                    primary={result.title}
                    secondary={
                      result.matchedContent && (
                        <Typography
                          component="div"
                          variant="body2"
                          color="text.secondary"
                          dangerouslySetInnerHTML={{
                            __html: result.matchedContent,
                          }}
                          sx={{
                            mt: 0.5,
                            fontSize: "0.875rem",
                            lineHeight: 1.4,
                            "& strong": {
                              backgroundColor: "rgba(255, 213, 79, 0.3)",
                              fontWeight: 600,
                            },
                          }}
                        />
                      )
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              {dialogQuery ? "没有找到相关文章" : "请输入搜索关键词"}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Search;
