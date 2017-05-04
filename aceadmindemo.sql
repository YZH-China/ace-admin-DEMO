-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: aceadmindemo
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actor`
--

DROP TABLE IF EXISTS `actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actor` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actor`
--

LOCK TABLES `actor` WRITE;
/*!40000 ALTER TABLE `actor` DISABLE KEYS */;
INSERT INTO `actor` VALUES (1,'角色1'),(2,'角色2'),(3,'角色3'),(4,'角色4'),(5,'角色5');
/*!40000 ALTER TABLE `actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commodity`
--

DROP TABLE IF EXISTS `commodity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commodity` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `beingsold` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commodity`
--

LOCK TABLES `commodity` WRITE;
/*!40000 ALTER TABLE `commodity` DISABLE KEYS */;
INSERT INTO `commodity` VALUES (1,'商品1',123.00,1),(2,'商品2',45.00,0),(3,'商品3',67.50,0),(4,'商品4',89.00,1),(5,'商品5',110.50,0),(6,'商品6',12.00,0),(7,'商品7',23.00,1),(8,'商品8',31.00,1),(9,'商品9',104.00,0),(10,'商品10',103.00,0),(11,'商品11',29.00,0),(12,'商品12',222.00,1),(13,'商品13',15.00,1),(14,'商品14',44.00,0),(15,'商品15',256.00,0),(16,'商品16',54.00,0),(17,'商品17',161.00,1),(18,'商品18',152.00,1),(19,'商品19',191.00,0),(20,'商品20',276.00,1),(21,'商品21',1.00,1),(22,'商品22',122.00,1),(23,'商品23',161.00,0),(24,'商品24',257.00,1),(25,'商品25',256.00,1),(26,'商品26',28.00,0),(27,'商品27',102.00,0),(28,'商品28',123.00,0),(29,'商品29',222.00,0),(30,'商品30',21.00,1),(33,'篮球',88.00,1);
/*!40000 ALTER TABLE `commodity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mapping`
--

DROP TABLE IF EXISTS `mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mapping` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `staff_id` int(8) NOT NULL,
  `actor_id` int(8) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Staff_Mapping` (`staff_id`),
  KEY `FK_Actor_Mapping` (`actor_id`),
  CONSTRAINT `FK_Actor_Mapping` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mapping`
--

LOCK TABLES `mapping` WRITE;
/*!40000 ALTER TABLE `mapping` DISABLE KEYS */;
INSERT INTO `mapping` VALUES (1,1,1),(2,1,2),(3,2,2),(4,2,3),(5,3,3),(6,3,4),(7,4,4),(8,4,5),(9,5,1),(10,5,2),(11,6,3),(12,6,4),(13,6,5),(14,7,1),(15,7,3),(16,7,5);
/*!40000 ALTER TABLE `mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitem`
--

DROP TABLE IF EXISTS `orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderitem` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `bill_id` int(8) NOT NULL,
  `staff_id` int(8) NOT NULL,
  `commodity_id` int(8) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Orders_OrderItem` (`bill_id`),
  KEY `FK_Staff_OrderItem` (`staff_id`),
  KEY `FK_Commodity_OrderItem` (`commodity_id`),
  CONSTRAINT `FK_Commodity_OrderItem` FOREIGN KEY (`commodity_id`) REFERENCES `commodity` (`id`),
  CONSTRAINT `FK_Orders_OrderItem` FOREIGN KEY (`bill_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitem`
--

LOCK TABLES `orderitem` WRITE;
/*!40000 ALTER TABLE `orderitem` DISABLE KEYS */;
INSERT INTO `orderitem` VALUES (1,6,4,6),(2,6,7,5),(3,2,3,3),(4,5,4,4),(5,1,1,7),(6,3,7,1),(7,2,1,7),(8,4,3,2),(9,2,4,7),(10,1,4,5),(11,1,4,7),(12,4,7,3),(13,1,5,2),(14,1,3,6),(15,2,6,5),(16,7,3,1),(17,6,4,4),(18,1,3,2),(19,4,1,5),(20,7,6,2);
/*!40000 ALTER TABLE `orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(30) DEFAULT NULL,
  `cost` int(10) unsigned NOT NULL,
  `type` tinyint(3) unsigned NOT NULL,
  `createdate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'20171157848',199,1,'2017-11-05 06:27:06'),(2,'20171024384',828,3,'2017-10-02 04:28:17'),(3,'201610276419',442,2,'2016-10-27 02:58:56'),(4,'201611232585',988,3,'2016-11-23 21:40:41'),(5,'20161142749',1694,1,'2016-11-04 15:29:32'),(6,'201711284294',694,3,'2017-11-28 14:39:08'),(7,'201611289119',862,2,'2016-11-28 12:03:47'),(8,'201710282545',813,3,'2017-10-28 09:11:33'),(9,'201610107869',359,1,'2016-10-10 21:02:46'),(10,'20171098011',1658,3,'2017-10-09 23:40:28'),(11,'20161117433',1598,2,'2016-11-01 11:05:48'),(12,'201711296519',1631,1,'2017-11-29 21:53:01'),(13,'20161253352',821,2,'2016-12-05 23:50:35'),(14,'201711187386',593,2,'2017-11-18 09:16:02'),(15,'201612121837',349,2,'2016-12-12 10:58:05'),(16,'201711197395',1399,3,'2017-11-19 16:17:55'),(17,'201610198854',1190,2,'2016-10-19 22:37:03'),(18,'201610145256',476,3,'2016-10-14 08:16:00'),(19,'201610104052',824,1,'2016-10-10 00:30:07'),(20,'201710239164',1044,2,'2017-10-23 00:09:05'),(21,'20161045232',683,1,'2016-10-04 08:48:27'),(22,'20171082054',829,3,'2017-10-08 13:02:33'),(23,'20161083926',1096,2,'2016-10-08 12:01:19'),(24,'201612106966',990,1,'2016-12-10 17:36:05'),(25,'201611179329',427,1,'2016-11-17 17:57:16'),(26,'201710161565',1444,1,'2017-10-16 01:07:42'),(27,'201611104903',671,1,'2016-11-10 20:05:45'),(28,'201612152709',973,2,'2016-12-15 03:13:07'),(29,'20161246099',166,1,'2016-12-04 19:44:27');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (2,'李四王'),(3,'王五'),(4,'小红'),(5,'小明'),(6,'小刚'),(7,'大毛'),(8,'张一'),(9,'张二'),(10,'张四'),(11,'张五'),(12,'张六'),(13,'张七'),(14,'张八'),(15,'张九'),(16,'张十'),(17,'王一'),(18,'王二'),(19,'王三'),(20,'王四'),(21,'王五'),(22,'王六'),(23,'王七'),(24,'王八'),(25,'王九'),(26,'王十'),(27,'李一'),(28,'李二'),(29,'李三'),(30,'李五'),(31,'李六'),(32,'李七'),(33,'李八'),(34,'李九'),(35,'李十'),(36,'赵一'),(37,'赵二'),(38,'赵三'),(39,'赵四'),(40,'赵五'),(41,'赵六'),(42,'赵七'),(43,'赵八'),(44,'赵九'),(45,'赵十'),(46,'钱一'),(47,'钱二'),(48,'钱三'),(49,'钱四'),(50,'钱五'),(51,'钱六'),(52,'钱七'),(53,'钱八'),(54,'钱九'),(55,'钱十'),(56,'孙一'),(57,'孙二'),(58,'孙三'),(59,'孙四'),(60,'孙五'),(61,'孙六'),(62,'孙七'),(63,'孙八'),(64,'孙九'),(65,'孙十'),(66,'李一'),(67,'李二'),(68,'李三'),(69,'李四'),(70,'李五'),(71,'李六'),(72,'李七'),(73,'李八'),(74,'李九'),(75,'李十'),(76,'周一'),(77,'周二'),(78,'周三'),(79,'周四'),(80,'周五'),(81,'周六'),(82,'周七'),(83,'周八'),(84,'周九'),(85,'周十'),(86,'武一'),(87,'武二'),(88,'武三'),(89,'武四'),(90,'武五'),(91,'武六'),(92,'武七'),(93,'武八'),(94,'武九'),(95,'武十'),(96,'郑一'),(97,'郑二'),(98,'郑三'),(99,'郑四'),(100,'郑五'),(101,'郑六'),(102,'郑七'),(103,'郑八'),(104,'郑九'),(105,'郑十'),(106,'王一'),(107,'王二'),(108,'王三'),(109,'王四'),(110,'王六'),(111,'王七'),(112,'王八'),(113,'王九'),(114,'王十'),(115,'袁梓航'),(116,'关林'),(117,'张三丰'),(118,'好人'),(119,'张三丰'),(120,'张五丰'),(121,'小红毛'),(122,'大白'),(124,'哈哈'),(125,'可以的'),(126,'袁梓航'),(127,'袁梓航'),(128,'李四哈');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `niconame` varchar(20) DEFAULT '',
  `birthday` varchar(50) DEFAULT '',
  `reg_date` datetime NOT NULL,
  `gender` int(11) DEFAULT NULL,
  `comment` text,
  `website` varchar(50) DEFAULT '',
  `phone` varchar(20) DEFAULT '',
  `facebook` varchar(50) DEFAULT '',
  `twitter` varchar(50) DEFAULT '',
  `google` varchar(50) DEFAULT '',
  `province` varchar(50) NOT NULL DEFAULT '',
  `city` varchar(50) NOT NULL DEFAULT '',
  `county` varchar(50) NOT NULL DEFAULT '',
  `address` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'cszihang789','kkyuan234','289081808@qq.com','niconiconi','2017-02-15','2017-02-14 16:54:00',1,'','www.baidu.com','18488888888','facebook.niconiconi','twitter.niconiconi','google.niconiconi','','','','');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-04 14:10:32
