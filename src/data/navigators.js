import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import PersonIcon from "@mui/icons-material/Person";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LinkIcon from "@mui/icons-material/Link";

const navigators = [
  {
    to: "/posts/",
    text: "所有文章",
    icon: <HomeIcon />,
    rule: pathname => pathname === "/posts/" || pathname.startsWith("/posts/"),
  },
  {
    to: "/oi/",
    text: "算法竞赛",
    icon: <LeaderboardIcon />,
    rule: pathname => pathname.startsWith("/oi/"),
  },
  {
    to: "/course/",
    text: "课程笔记",
    icon: <LocalLibraryIcon />,
    rule: pathname => pathname.startsWith("/course/"),
  },
  {
    to: "/friends/",
    text: "友情链接",
    icon: <LinkIcon />,
    rule: pathname => pathname === "/friends/",
  },
  {
    to: "/",
    text: "关于博主",
    icon: <PersonIcon />,
    rule: pathname => pathname === "/",
  },
];

export default navigators;
