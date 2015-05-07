-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2015-05-07 13:59:39
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `find-angular`
--

-- --------------------------------------------------------

--
-- 表的结构 `t_comment`
--

CREATE TABLE IF NOT EXISTS `t_comment` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论编号',
  `pid` int(11) NOT NULL COMMENT '发布信息的编号',
  `uid` int(11) NOT NULL COMMENT '评论者编号',
  `ctime` datetime NOT NULL COMMENT '评论时间',
  `cdetails` text NOT NULL COMMENT '评论内容',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户评论表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `t_publish`
--

CREATE TABLE IF NOT EXISTS `t_publish` (
  `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '信息编号',
  `uid` int(11) NOT NULL COMMENT '用户编号',
  `pitem` varchar(12) NOT NULL COMMENT '物品类型',
  `pname` varchar(20) NOT NULL COMMENT '物品名称',
  `plocation` varchar(50) NOT NULL COMMENT '物品捡到&丢失地点',
  `ptime` datetime NOT NULL COMMENT '物品捡到&丢失时间',
  `pimage` varchar(20) NOT NULL COMMENT '物品图片',
  `pdetails` text NOT NULL COMMENT '详情描述',
  `ptype` int(1) NOT NULL COMMENT '发布信息类别',
  `pdate` varchar(30) NOT NULL COMMENT '捡到&丢失时间*',
  `psucceed` int(11) NOT NULL DEFAULT '0' COMMENT '是否成功找回',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='发布信息表' AUTO_INCREMENT=26 ;

--
-- 转存表中的数据 `t_publish`
--

INSERT INTO `t_publish` (`pid`, `uid`, `pitem`, `pname`, `plocation`, `ptime`, `pimage`, `pdetails`, `ptype`, `pdate`, `psucceed`) VALUES
(1, 1, '随身物品', 'Surface3', '学校里面', '2015-05-05 16:45:09', '1.jpg', '在学校里丢了我的Surface3平板电脑，黑色的，希望看到的能联系我，不胜感激', 0, '2015-05-05', 0),
(2, 1, '卡类证件', '计算机等级证书', '图书馆', '2015-05-05 17:24:02', '2.jpg', '在图书馆的书里发现的，还望失主能看到', 0, '2015-02-11', 0),
(3, 1, '卡类证件', 'sfs d', 'sdfsdf', '2015-05-05 18:01:07', '', 'adsaasd', 0, '2015-05-05', 0),
(4, 1, '卡类证件', 'sfs d', 'sdfsdf', '2015-05-05 18:01:15', '', 'adsaasd', 1, '2015-05-05', 0),
(5, 1, '卡类证件', 'ssdf', 'sfdfsd', '2015-05-05 18:01:53', '', 'dasdasa', 1, '2015-05-05', 0),
(6, 1, '卡类证件', 'zxczx', 'xzczx', '2015-05-05 18:02:17', '', 'czzxcz', 1, '2015-05-05', 0),
(7, 1, '电子数码', '笔记本', '宿舍', '2015-05-05 18:16:44', '7.jpg', '电脑', 0, '2015-05-05', 0),
(8, 1, '卡类证件', '电脑', '宿舍', '2015-05-05 18:17:43', '8.jpg', 'bootstrap', 0, '2015-05-05', 0),
(9, 1, '卡类证件', '电脑', '宿舍', '2015-05-05 18:19:13', '9.jpg', '我的', 0, '2015-05-05', 0),
(10, 1, '卡类证件', '电脑', '教学楼', '2015-05-05 18:21:15', '10.jpg', '四大四大', 1, '2015-05-05', 0),
(11, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:22:34', '11.jpg', '我的电脑', 1, '2015-05-05', 0),
(12, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:22:38', '12.jpg', '我的电脑', 1, '2015-05-05', 0),
(13, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:22:39', '13.jpg', '我的电脑', 1, '2015-05-05', 0),
(14, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:22:40', '14.jpg', '我的电脑', 1, '2015-05-05', 0),
(15, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:22:40', '15.jpg', '我的电脑', 1, '2015-05-05', 0),
(16, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:22:41', '16.jpg', '我的电脑', 1, '2015-05-05', 1),
(17, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:22:42', '17.jpg', '我的电脑', 1, '2015-05-05', 1),
(18, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:24:04', '18.jpg', '我的', 0, '2015-05-05', 0),
(19, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:24:06', '19.jpg', '我的', 0, '2015-05-05', 0),
(20, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:24:06', '20.jpg', '我的', 0, '2015-05-05', 0),
(21, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:24:07', '21.jpg', '我的', 0, '2015-05-05', 0),
(22, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:24:08', '22.jpg', '我的', 0, '2015-05-05', 0),
(23, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:24:08', '23.jpg', '我的', 0, '2015-05-05', 0),
(24, 1, '卡类证件', '电脑', '食堂', '2015-05-05 18:24:10', '24.jpg', '我的', 0, '2015-05-05', 0),
(25, 1, '随身物品', '手机', '食堂', '2015-05-05 20:14:23', '25.jpg', '我今天丢看水杯', 0, '2015-05-05', 0);

-- --------------------------------------------------------

--
-- 表的结构 `t_user`
--

CREATE TABLE IF NOT EXISTS `t_user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `uname` varchar(12) NOT NULL COMMENT '昵称',
  `uemail` varchar(30) NOT NULL COMMENT '邮箱',
  `upwd` varchar(12) NOT NULL COMMENT '密码',
  `utel` char(11) NOT NULL COMMENT '手机',
  `uqq` varchar(13) NOT NULL COMMENT 'QQ',
  `upower` int(1) NOT NULL COMMENT '权限',
  `uheader` varchar(20) NOT NULL DEFAULT 'head_photo.png' COMMENT '头像路径',
  `token` varchar(50) NOT NULL COMMENT '帐号激活码',
  `token_exptime` int(10) NOT NULL COMMENT '激活码有效期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态,0-未激活,1-已激活',
  `regtime` int(10) NOT NULL COMMENT '注册时间',
  `getpasstime` int(10) NOT NULL COMMENT '重置密码时间',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='用户表' AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `t_user`
--

INSERT INTO `t_user` (`uid`, `uname`, `uemail`, `upwd`, `utel`, `uqq`, `upower`, `uheader`, `token`, `token_exptime`, `status`, `regtime`, `getpasstime`) VALUES
(1, 'zhujun24', '2425350546@qq.com', 'e10adc3949ba', '15255158778', '2425350546', 1, '1.jpg', 'ae8b17b4f76bc36cdc32f993761bbac6', 1430901226, 0, 0, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
