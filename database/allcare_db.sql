-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: allcare_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrators`
--

DROP TABLE IF EXISTS `administrators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrators`
--

LOCK TABLES `administrators` WRITE;
/*!40000 ALTER TABLE `administrators` DISABLE KEYS */;
INSERT INTO `administrators` VALUES (1,'System Administrator','admin','admin@allcare.org','0552611205','$2b$10$2z3/V7k01Z0s8eI6KFcXIe2yUiIjnnhbf3.hWrj6kGPdkg.EdBNki','2026-07-30 12:50:34');
/*!40000 ALTER TABLE `administrators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beneficiaries`
--

DROP TABLE IF EXISTS `beneficiaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficiaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) DEFAULT NULL,
  `employment_status` varchar(100) DEFAULT NULL,
  `previous_income` decimal(10,2) DEFAULT NULL,
  `current_income` decimal(10,2) DEFAULT NULL,
  `business_started` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiaries`
--

LOCK TABLES `beneficiaries` WRITE;
/*!40000 ALTER TABLE `beneficiaries` DISABLE KEYS */;
INSERT INTO `beneficiaries` VALUES (1,'Micheal Mills','Employed',500.00,3500.00,'Yes','2026-09-10 13:12:01'),(2,'James Adams','Employed',100.00,1000.00,'Yes','2026-09-10 13:12:35'),(3,'Mike Kims','Employed',300.00,2500.00,'Yes','2026-09-10 13:12:54'),(4,'Micheal Mills','Employed',1300.00,1500.00,'yes','2026-09-18 14:21:41'),(5,'Cynthia','Employed',1300.00,5000.00,'yes','2026-09-18 14:24:55'),(6,'Philip Mills','Employed',1500.00,5000.00,'yes','2026-09-19 17:54:06');
/*!40000 ALTER TABLE `beneficiaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reference_no` varchar(30) NOT NULL,
  `donor_name` varchar(100) DEFAULT NULL,
  `donor_email` varchar(100) NOT NULL,
  `donation_type` enum('One-time','Monthly','Annual') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `anonymous` tinyint(1) DEFAULT '0',
  `donated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_no` (`reference_no`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES (1,'DON-1789731247650-63866','Sheriff Sarpong','iamsheriff@gmail.com','One-time',50.00,'Mobile Money',0,'2026-09-18 11:34:07');
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reference_no` varchar(30) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `reason` text,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_no` (`reference_no`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
INSERT INTO `loans` VALUES (1,NULL,NULL,'Sheriff Sarpong','iamsheriff@outlook.com','0552611205','Business Loan',12000.00,'I need a loan to start a pharmacy business in my village','Approved','2026-09-10 13:32:17'),(3,NULL,NULL,'Philip Mills','philip.mills@outlook.com','0552611205','Business Loan',12000.00,'My name is Philip, a young farmer from Obuasi (Kumasi). I am humbly seeking a loan to start a snail farming business in my village.Currently, there is no reliable snail supplier in our entire local market. Demand is very high, but supply is very low, especially in the dry season. I have identified this gap and plan to fill it by rearing giant African snails on a small farm.This project will make me the sole provider of fresh, healthy snails for the whole market. Because of this, the business is guaranteed to generate good income and grow fast. Snail farming requires low feed cost, little space, and has a very high market value locally and for export.With your financial support, I can buy breeding stock, build pens, and start production. This loan will not only help me become self-employed but will also create jobs and supply affordable protein to my community.I am hardworking and committed to repaying the loan from my profits. I kindly ask for your support to make this dream a reality.','Pending','2026-09-19 17:57:31');
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `message` text,
  `notification_type` enum('Info','Success','Warning','Error') DEFAULT 'Info',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(150) NOT NULL,
  `description` text,
  `progress` int DEFAULT '0',
  `status` enum('Planning','In Progress','Completed','Cancelled') DEFAULT 'Planning',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Fish Farming (Catfish)','Concrete pond system raising 1,000 catfish. Low space, high protein demand, profitable within 6 months.',12,'Planning','2026-09-10 14:09:40'),(2,'Maize Cultivation Project','5-acre mechanized maize farm using improved seeds and fertilizer. Focused on food security and sales to poultry feed producers.',2,'Completed','2026-09-10 14:10:15'),(6,'Crab Farming','5-acre mechanized maize farm using improved seeds and fertilizer. Focused on food security and sales to poultry feed producers.',20,'Planning','2026-09-18 13:41:29'),(7,'Crab Farming','5-acre mechanized maize farm using improved seeds and fertilizer. Focused on food security and sales to poultry feed producers.',12,'Completed','2026-09-18 14:01:47'),(8,'Snail Farming','5-acre mechanized maize farm using improved seeds and fertilizer. Focused on food security and sales to poultry feed producers.',35,'Planning','2026-09-19 17:55:00');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `report_type` varchar(100) DEFAULT NULL,
  `generated_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,'Employment Report','employment','NATAN NGO','2026-09-10 15:04:52'),(2,'Income Growth Report','income','NATAN NGO','2026-09-10 15:05:06'),(3,'Donor Accountability Report','donor','NATAN NGO','2026-09-10 15:05:33'),(4,'Employment Report','employment','NATAN NGO','2026-09-10 15:08:23'),(5,'Income Growth Report','income','NATAN NGO','2026-09-10 15:08:25'),(6,'Donor Accountability Report','donor','NATAN NGO','2026-09-10 15:08:26');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainings`
--

DROP TABLE IF EXISTS `trainings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(150) NOT NULL,
  `description` text,
  `status` enum('Open','Closed','Enrolled') DEFAULT 'Open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings`
--

LOCK TABLES `trainings` WRITE;
/*!40000 ALTER TABLE `trainings` DISABLE KEYS */;
INSERT INTO `trainings` VALUES (1,'Web Development','','Enrolled','2026-09-10 14:26:29'),(2,'Fashion & Tailoring','','Enrolled','2026-09-10 14:26:32'),(3,'Hair & Beauty','','Enrolled','2026-09-10 14:26:33'),(5,'Fashion & Tailoring','','Enrolled','2026-09-18 13:50:59'),(6,'Fashion & Tailoring','','Enrolled','2026-09-18 13:51:37'),(7,'Web Development','','Enrolled','2026-09-18 13:51:39'),(8,'Hair & Beauty','','Enrolled','2026-09-18 13:51:40'),(9,'Fashion & Tailoring','','Enrolled','2026-09-18 14:26:53'),(10,'Web Development','','Enrolled','2026-09-18 14:26:54'),(11,'Hair & Beauty','','Enrolled','2026-09-18 14:26:57'),(12,'Web Development','','Enrolled','2026-09-18 14:30:04'),(13,'Fashion & Tailoring','','Enrolled','2026-09-18 15:47:10'),(14,'Web Development','','Enrolled','2026-09-19 17:53:40');
/*!40000 ALTER TABLE `trainings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('Administrator','Manager','Volunteer','Staff') NOT NULL,
  `status` enum('Active','Inactive','Disabled') DEFAULT 'Active',
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Sheriff Sarpong','iam_sarpong','iam_sarpong@gmail.com','233552611205','Volunteer','Active','$2b$10$uBbm2YDuC9I9HAkPLfaYJOwmoQOxxLig.Jx5N9Ez2ZGUWqsdhM1Ie','2026-07-30 12:46:53'),(2,'Sarah Adams','sarah.adams','sarah.adams@gmail.com','0552611205','Volunteer','Active','$2b$10$ibpPpMW113kdpmET7isHYO6eZxebGjV.ksphF9tLkNU1HmPyKYx4S','2026-07-30 12:50:34'),(3,'Micheal','micheal.adams','micheal@gmail.com','0552611205','Volunteer','Active','abcd123','2026-07-30 01:00:00'),(4,'Mills Adams','123','123@gmail.com','78566','Volunteer','Active','$2b$10$BYZgVZJGyweP5iWgxjKHmeI/aAAJ13Lzfx40hcKSgVU2.GDkQ2pIS','2026-08-19 10:17:25'),(5,'Professor','iamprofessor','iamprofessor@proton.me','0274896842','Volunteer','Active','$2b$10$VaES/e1ylamK4W06aZbmLu/8HfRkzssbgwPcNp7mN3KAseUhoEwji','2026-08-25 10:14:19'),(10,'Cindy','cindy','cindy@gmail.com','0557211205','Volunteer','Active','$2b$10$.uOgJdMRWpevunTZfSjZYOqA44Id.RiH4BGlXVZdt7pPAv1MTq3eC','2026-09-01 12:55:33'),(11,'Abraham','abraham','abraham@gmail.com','0552611205','Volunteer','Active','$2b$10$oOLi5e6vkeBbmp6S0WOhCe1S5F8aSNti2NbIiBhdP5PetOrdRjIC2','2026-09-01 12:56:09'),(12,'Kofi','kofi','kofi@gmail.com','0552611205','Staff','Active','$2b$10$pQyv0a9wzAwTH9e5tz0i2O829TmTzJPQ3UDMgbexA.nCYBvAdipvG','2026-09-10 14:50:00'),(13,'Mr Solo256mn','solo','solo@gmail.com','020256ab79','Volunteer','Active','$2b$10$hO4.sBPgPMwhKPqE9N3rcO1w5fSaAPgdDGfL4.T80ITo03aJrVPsK','2026-09-14 14:57:22'),(14,'Jeffery Mills','iamjeffery','iamjeffery@gmail.com','0552611205','Volunteer','Active','$2b$10$Fhzj2V0DScvpHZWjvkwdRuFRhd1P8Lg0WzQmiZEfYnwr44nPm.Nuq','2026-09-18 08:21:27'),(15,'kingsley','1234','1234@gmail.com','0098767456452','Volunteer','Active','$2b$10$I0Trwz19Z5DHh/DGZASt2.8Rb6mVOtpiwkkdCvgNCk27vTJTxUUC2','2026-09-18 13:50:09'),(16,'solomon anim','solomon','solomon@yahoo.com','05593581','Volunteer','Active','$2b$10$7wCHJEFnXbxcR0k9RBV7ueqVntTxFNIEJyF.qfWOp82WHN1C96t2m','2026-09-18 16:09:25'),(20,'Philip Mills','philip.mills','philip.mills@gmail.com','0273296842','Volunteer','Active','$2b$10$yd4VsVKHhSKcAggDoaIlTelARz4tctW/m6abrUVcTVZqvhf9BJpEq','2026-09-19 17:52:11'),(21,'Kwame Agyapong','kwame.agyapong','kwame.agyapong@outlook.com','233202325043','Volunteer','Active','$2b$10$Xwk70Pv5/AgBujh7sK2.R.hvYcdC0APBCC6KRskV5R0aQ9bR93SoW','2026-09-19 17:59:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-20  6:43:13
