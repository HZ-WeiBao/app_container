/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80003
Source Host           : localhost:3306
Source Database       : tiny_frame

Target Server Type    : MYSQL
Target Server Version : 80003
File Encoding         : 65001

Date: 2018-01-05 21:19:18
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for char_sayings
-- ----------------------------
DROP TABLE IF EXISTS `char_sayings`;
CREATE TABLE `char_sayings` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `category` varchar(20) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `likeNum` varchar(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1177 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for edu_cet
-- ----------------------------
DROP TABLE IF EXISTS `edu_cet`;
CREATE TABLE `edu_cet` (
  `id` varchar(20) NOT NULL COMMENT '准考证',
  `sid` varchar(20) DEFAULT NULL COMMENT '学号',
  `name` varchar(15) NOT NULL,
  `school` varchar(25) DEFAULT NULL,
  `examType` varchar(20) DEFAULT NULL,
  `total` varchar(5) DEFAULT NULL,
  `listening` varchar(5) DEFAULT NULL,
  `reading` varchar(5) DEFAULT NULL,
  `writing` varchar(5) DEFAULT NULL,
  `oral` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for edu_cet_backup
-- ----------------------------
DROP TABLE IF EXISTS `edu_cet_backup`;
CREATE TABLE `edu_cet_backup` (
  `openid` varchar(32) NOT NULL,
  `id` varchar(40) NOT NULL,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for edu_classroom_activity
-- ----------------------------
DROP TABLE IF EXISTS `edu_classroom_activity`;
CREATE TABLE `edu_classroom_activity` (
  `name` varchar(30) CHARACTER SET utf8 NOT NULL,
  `room` varchar(25) CHARACTER SET utf8 NOT NULL,
  `building` varchar(20) CHARACTER SET utf8 NOT NULL,
  `organization` varchar(50) CHARACTER SET utf8 NOT NULL,
  `weekHaveClass` varchar(100) CHARACTER SET utf8 NOT NULL,
  `weekly` varchar(2) CHARACTER SET utf8 NOT NULL,
  `weekDay` varchar(10) CHARACTER SET utf8 NOT NULL,
  `sectionStart` varchar(2) CHARACTER SET utf8 NOT NULL,
  `sectionEnd` varchar(2) CHARACTER SET utf8 NOT NULL,
  KEY `room` (`room`),
  KEY `weekly` (`weekly`),
  KEY `weekHaveClass` (`weekHaveClass`),
  KEY `building` (`building`),
  KEY `weekDay` (`weekDay`),
  KEY `sectionStart` (`sectionStart`),
  KEY `sectionEnd` (`sectionEnd`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for edu_classroom_course
-- ----------------------------
DROP TABLE IF EXISTS `edu_classroom_course`;
CREATE TABLE `edu_classroom_course` (
  `id` varchar(10) CHARACTER SET utf8 NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `teacher` varchar(50) CHARACTER SET utf8 NOT NULL,
  `weekHaveClass` varchar(100) CHARACTER SET utf8 NOT NULL,
  `weekly` varchar(2) CHARACTER SET utf8 NOT NULL,
  `weekDay` varchar(10) CHARACTER SET utf8 NOT NULL,
  `sectionStart` varchar(2) CHARACTER SET utf8 NOT NULL,
  `sectionEnd` varchar(2) CHARACTER SET utf8 NOT NULL,
  `room` varchar(25) CHARACTER SET utf8 NOT NULL,
  `building` varchar(25) CHARACTER SET utf8 NOT NULL,
  `class` varchar(6000) CHARACTER SET utf8 NOT NULL,
  KEY `name` (`name`),
  KEY `weekHaveClass` (`weekHaveClass`),
  KEY `weekDay` (`weekDay`),
  KEY `sectionStart` (`sectionStart`),
  KEY `sectionEnd` (`sectionEnd`),
  KEY `room` (`room`),
  KEY `building` (`building`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for edu_classroom_list
-- ----------------------------
DROP TABLE IF EXISTS `edu_classroom_list`;
CREATE TABLE `edu_classroom_list` (
  `campus` varchar(15) CHARACTER SET utf8 NOT NULL,
  `building` varchar(10) CHARACTER SET utf8 NOT NULL,
  `room` varchar(25) CHARACTER SET utf8 NOT NULL,
  KEY `campus` (`campus`),
  KEY `room` (`room`),
  KEY `building` (`building`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for edu_classroom_list_available
-- ----------------------------
DROP TABLE IF EXISTS `edu_classroom_list_available`;
CREATE TABLE `edu_classroom_list_available` (
  `room` varchar(100) NOT NULL,
  `building` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for edu_class_list
-- ----------------------------
DROP TABLE IF EXISTS `edu_class_list`;
CREATE TABLE `edu_class_list` (
  `value` varchar(20) CHARACTER SET utf8 NOT NULL,
  `text` varchar(50) CHARACTER SET utf8 NOT NULL,
  UNIQUE KEY `text` (`text`),
  UNIQUE KEY `value` (`value`),
  KEY `value_2` (`value`),
  KEY `value_3` (`value`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for edu_courses
-- ----------------------------
DROP TABLE IF EXISTS `edu_courses`;
CREATE TABLE `edu_courses` (
  `cid` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `tid` int(11) NOT NULL,
  `class` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for edu_homework_receive
-- ----------------------------
DROP TABLE IF EXISTS `edu_homework_receive`;
CREATE TABLE `edu_homework_receive` (
  `hid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `sendTime` int(11) NOT NULL,
  `attachment` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for edu_homework_send
-- ----------------------------
DROP TABLE IF EXISTS `edu_homework_send`;
CREATE TABLE `edu_homework_send` (
  `hid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  `content` varchar(2000) NOT NULL,
  `start` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `whichTime` int(11) NOT NULL COMMENT '第几次作业'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for edu_major_info
-- ----------------------------
DROP TABLE IF EXISTS `edu_major_info`;
CREATE TABLE `edu_major_info` (
  `id` varchar(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `teacher` varchar(60) NOT NULL COMMENT '教师',
  `classType` varchar(100) NOT NULL COMMENT '课程类别',
  `class` varchar(20000) NOT NULL COMMENT '上课班级构成',
  `weekly` varchar(2) NOT NULL COMMENT '0每周/1单周/2双周',
  `weekDay` varchar(10) NOT NULL COMMENT '星期几',
  `sectionStart` varchar(5) NOT NULL COMMENT '第几节开始',
  `sectionEnd` varchar(5) NOT NULL COMMENT '第几节结束',
  `weekHaveClass` varchar(50) NOT NULL COMMENT '开课的周',
  `room` varchar(100) NOT NULL COMMENT '哪里上课',
  KEY `major_name` (`name`),
  KEY `major_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for edu_major_list
-- ----------------------------
DROP TABLE IF EXISTS `edu_major_list`;
CREATE TABLE `edu_major_list` (
  `id` varchar(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `major_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for edu_mandarin
-- ----------------------------
DROP TABLE IF EXISTS `edu_mandarin`;
CREATE TABLE `edu_mandarin` (
  `id` varchar(20) DEFAULT NULL,
  `cardId` varchar(30) DEFAULT NULL,
  `name` varchar(10) DEFAULT NULL,
  `examTime` varchar(20) DEFAULT NULL,
  `score` varchar(15) DEFAULT NULL,
  `grade` varchar(15) DEFAULT NULL,
  `certificateId` varchar(20) DEFAULT NULL,
  `province` varchar(25) DEFAULT NULL,
  `examLocation` varchar(50) DEFAULT NULL,
  `selfieUrl` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for edu_mandarin_backup
-- ----------------------------
DROP TABLE IF EXISTS `edu_mandarin_backup`;
CREATE TABLE `edu_mandarin_backup` (
  `openid` varchar(32) NOT NULL,
  `id` varchar(30) DEFAULT NULL,
  `cardId` varchar(30) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for edu_nerc
-- ----------------------------
DROP TABLE IF EXISTS `edu_nerc`;
CREATE TABLE `edu_nerc` (
  `name` varchar(20) NOT NULL,
  `cardId` varchar(20) NOT NULL,
  `examTime` varchar(20) NOT NULL,
  `examLevel` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for edu_students
-- ----------------------------
DROP TABLE IF EXISTS `edu_students`;
CREATE TABLE `edu_students` (
  `sid` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `class` varchar(20) NOT NULL,
  `openid` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for edu_teachers
-- ----------------------------
DROP TABLE IF EXISTS `edu_teachers`;
CREATE TABLE `edu_teachers` (
  `tid` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for module_comment
-- ----------------------------
DROP TABLE IF EXISTS `module_comment`;
CREATE TABLE `module_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `moduleName` varchar(50) NOT NULL,
  `sid` varchar(20) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `content` varchar(1000) NOT NULL,
  `reply` varchar(1000) DEFAULT NULL,
  `markStar` varchar(1) DEFAULT NULL COMMENT '精选留言',
  `likeNum` varchar(11) NOT NULL DEFAULT '0',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isRead` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module_statistics
-- ----------------------------
DROP TABLE IF EXISTS `module_statistics`;
CREATE TABLE `module_statistics` (
  `moduleName` varchar(20) CHARACTER SET utf8 NOT NULL,
  `useNum` int(11) NOT NULL DEFAULT '0',
  `likeNum` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`moduleName`),
  UNIQUE KEY `moduleName` (`moduleName`),
  KEY `moduleName_2` (`moduleName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `sid` varchar(20) NOT NULL,
  `openid` varchar(32) DEFAULT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
