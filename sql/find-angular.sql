-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Apr 13, 2016 at 06:07 AM
-- Server version: 5.5.42
-- PHP Version: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `find-angular`
--

-- --------------------------------------------------------

--
-- Table structure for table `t_comment`
--

CREATE TABLE `t_comment` (
  `cid` int(11) NOT NULL COMMENT '评论编号',
  `pid` int(11) NOT NULL COMMENT '发布信息的编号',
  `uid` int(11) NOT NULL COMMENT '评论者编号',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  `cdetails` text NOT NULL COMMENT '评论内容',
  `cdel` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户评论表';

--
-- Dumping data for table `t_comment`
--

INSERT INTO `t_comment` (`cid`, `pid`, `uid`, `ctime`, `cdetails`, `cdel`) VALUES
(1, 2, 1, '2016-04-13 03:40:19', 'ä¸¢äº†å¥½å¼€å¿ƒï¼Œ666', 0);

-- --------------------------------------------------------

--
-- Table structure for table `t_publish`
--

CREATE TABLE `t_publish` (
  `pid` int(11) NOT NULL COMMENT '信息编号',
  `uid` int(11) NOT NULL COMMENT '用户编号',
  `pitem` varchar(12) NOT NULL COMMENT '物品类型',
  `pname` varchar(20) NOT NULL COMMENT '物品名称',
  `plocation` varchar(50) NOT NULL COMMENT '物品捡到&丢失地点',
  `ptime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '物品捡到&丢失时间',
  `pimage` varchar(32) NOT NULL COMMENT '物品图片',
  `pdetails` text NOT NULL COMMENT '详情描述',
  `ptype` int(1) NOT NULL COMMENT '发布信息类别',
  `pdate` varchar(30) NOT NULL COMMENT '捡到&丢失时间*',
  `psucceed` int(11) NOT NULL DEFAULT '0' COMMENT '是否成功找回',
  `pdel` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COMMENT='发布信息表';

--
-- Dumping data for table `t_publish`
--

INSERT INTO `t_publish` (`pid`, `uid`, `pitem`, `pname`, `plocation`, `ptime`, `pimage`, `pdetails`, `ptype`, `pdate`, `psucceed`, `pdel`) VALUES
(1, 1, 'ç”µå­æ•°ç ', 'PCç”µè„‘', 'ä¸€é£Ÿå ‚', '2016-04-13 03:38:18', '/upload/lostfind/1.png', 'æˆ‘çš„ç”µè„‘ä¸¢äº†ï¼Œå¥½ä¸§å¿ƒï¼Œæˆ‘çš„ç”µè„‘ä¸¢äº†ï¼Œå¥½ä¸§å¿ƒé˜¿', 0, '4æœˆ12å·ä¸‹åˆ3ç‚¹', 0, 0),
(2, 1, 'ä¹¦ç±æ–‡å…·', 'é«˜çº§æ•™ç¨‹', 'å›¾ä¹¦é¦†ä¸‰æ¥¼', '2016-04-13 03:39:59', '/upload/lostfind/2.jpg', 'æˆ‘çš„ä¹¦ä¸¢äº†ï¼Œå¥½å¼€å¿ƒï¼Œæˆ‘çš„ä¹¦ä¸¢äº†ï¼Œå¥½å¼€å¿ƒå‘€å‘€å‘€', 1, 'äº”ä¸€', 1, 0),
(3, 1, 'ä¹¦ç±æ–‡å…·', 'test', 'test', '2016-04-13 03:51:34', '', 'testtesttesttesttest', 0, 'test', 0, 0),
(4, 1, 'éšèº«ç‰©å“', 'testtest', 'test', '2016-04-13 03:52:02', '', 'testtesttesttesttest', 0, 'testtest', 0, 0),
(5, 1, 'ä¹¦ç±æ–‡å…·', 'test4433', 'test33', '2016-04-13 03:52:21', '', 'testtesttesttest', 1, 'test', 0, 0),
(6, 1, 'ä¹¦ç±æ–‡å…·', 'æ‰‹æœº', 'dfddf', '2016-04-13 03:53:09', '', 'fdfefå¯¹å‘åŠ¨æœºå‘åŠ¨æœº', 0, 'dfdfdd', 0, 0),
(7, 1, 'ä¹¦ç±æ–‡å…·', 'çš„å¥‹æ–—', 'çŸ­å‘çŸ­å‘', '2016-04-13 03:53:22', '', 'æ–¹æ³•é”…é¥­æ³•å›½è„šç—›åŒ»è„š', 0, 'æ˜¯çš„æ…°é—®s', 0, 0),
(8, 1, 'å…¶ä»–ç‰©å“', 'æ„Ÿäººè‚ºè…‘', 'ä¸Žè¯­è¨€', '2016-04-13 03:53:37', '', 'å‘¼å iuiu æ ¹æ®è´´ä¹³è´´ç‘ž u', 0, 'u äºˆä»¥UI', 0, 0),
(9, 1, 'ä¹¦ç±æ–‡å…·', 'ä¸°å¯Œçš„', 'uiiuiu', '2016-04-13 03:53:51', '', 'å°æ¹¾äººçªç„¶æŒºèˆ’æœçš„é«˜å¸…å¯Œçš„é«˜å¸…å¯Œçš„å˜Žè¯´', 0, 'å¿«ä¹å¿«ä¹å¿«ä¹ï¼Œ', 0, 0),
(10, 1, 'ç”µå­æ•°ç ', 'æ˜¯é¢ ä¸‰å€’å››', 'é€Ÿåº¦é€Ÿåº¦', '2016-04-13 03:54:09', '', 'æ˜¯é¢ ä¸‰å€’å››çš„', 0, 'æ˜¯é¢ ä¸‰å€’å››', 0, 0),
(11, 1, 'ä¹¦ç±æ–‡å…·', 'äºŒäºŒ', 'äºŒäºŒäºŒå“¦', '2016-04-13 03:54:33', '', 'ä¸Žç©ºé—´å¤§ä¼¤è„‘ç­‹å•Šæ˜¯å§èˆä¸å¾—æ”¾æ‰‹', 1, 'äºŒäºŒäºŒäºŒ', 0, 0),
(12, 1, 'ç”µå­æ•°ç ', 'å¥‹æ–—', 'çŸ­å‘çŸ­å‘çš„', '2016-04-13 03:54:43', '', 'çŸ­å‘çŸ­å‘çŸ­å‘çŸ­å‘çŸ­å‘', 1, 'çŸ­å‘çŸ­å‘', 0, 0),
(13, 1, 'éšèº«ç‰©å“', '2222', '2222', '2016-04-13 03:54:53', '', '22222testtesttesttesttesttest', 1, '22222', 0, 0),
(14, 1, 'ç”µå­æ•°ç ', 'testtest', 'testtesttest', '2016-04-13 03:55:04', '', 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttest', 1, 'testtesttesttesttest', 0, 0),
(16, 1, 'å¡ç±»è¯ä»¶', '66666', '6666', '2016-04-13 03:58:16', '', '6666666', 1, '6666', 0, 0),
(17, 1, 'ä¹¦ç±æ–‡å…·', 'è§‰å¾—å¥½çƒ¦', 'æ‰“', '2016-04-13 03:58:33', '', 'testtestå°†å›žåˆ°å®¶testtesttest', 1, 'æ˜¯çš„', 0, 0),
(18, 1, 'éšèº«ç‰©å“', 'new', 'æ•°æ®æ²¡æœ‰å¯¹åº”', '2016-04-13 04:06:58', '', 'jsdahdhjdv è®¡åˆ’ v è§‰å¾—å¥½çƒ¦çš„æœºä¼š', 0, 'test', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `t_user`
--

CREATE TABLE `t_user` (
  `uid` int(11) NOT NULL COMMENT '用户编号',
  `uname` varchar(12) NOT NULL COMMENT '昵称',
  `uemail` varchar(30) NOT NULL COMMENT '邮箱',
  `upwd` varchar(32) NOT NULL COMMENT '密码',
  `utel` char(11) NOT NULL COMMENT '手机',
  `uqq` varchar(13) NOT NULL COMMENT 'QQ',
  `upower` int(1) NOT NULL COMMENT '权限',
  `uheader` varchar(100) NOT NULL DEFAULT 'upload/header/default.jpg' COMMENT '头像路径',
  `token` varchar(50) NOT NULL COMMENT '帐号激活码',
  `token_exptime` int(10) NOT NULL COMMENT '激活码有效期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态,0-未激活,1-已激活',
  `regtime` int(10) NOT NULL COMMENT '注册时间',
  `getpasstime` int(10) NOT NULL COMMENT '重置密码时间'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户表';

--
-- Dumping data for table `t_user`
--

INSERT INTO `t_user` (`uid`, `uname`, `uemail`, `upwd`, `utel`, `uqq`, `upower`, `uheader`, `token`, `token_exptime`, `status`, `regtime`, `getpasstime`) VALUES
(1, 'zhujun24', '2425350546@qq.com', 'e10adc3949ba59abbe56e057f20f883e', '15255158778', '2425350546', 0, 'upload/header/default.jpg', '', 0, 0, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `t_comment`
--
ALTER TABLE `t_comment`
  ADD PRIMARY KEY (`cid`);

--
-- Indexes for table `t_publish`
--
ALTER TABLE `t_publish`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `t_user`
--
ALTER TABLE `t_user`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `t_comment`
--
ALTER TABLE `t_comment`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论编号',AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `t_publish`
--
ALTER TABLE `t_publish`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '信息编号',AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `t_user`
--
ALTER TABLE `t_user`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户编号',AUTO_INCREMENT=2;