-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Apr 13, 2016 at 05:34 AM
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户评论表';

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='发布信息表';

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

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
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论编号';
--
-- AUTO_INCREMENT for table `t_publish`
--
ALTER TABLE `t_publish`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '信息编号';
--
-- AUTO_INCREMENT for table `t_user`
--
ALTER TABLE `t_user`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户编号';