-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: libreriapos
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `detalleventa`
--

DROP TABLE IF EXISTS `detalleventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalleventa` (
  `DetalleID` int NOT NULL AUTO_INCREMENT,
  `VentaID` int DEFAULT NULL,
  `ProductoID` int DEFAULT NULL,
  `Cantidad` int DEFAULT NULL,
  `PrecioUnitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`DetalleID`),
  KEY `VentaID` (`VentaID`),
  KEY `ProductoID` (`ProductoID`),
  CONSTRAINT `detalleventa_ibfk_1` FOREIGN KEY (`VentaID`) REFERENCES `ventas` (`VentaID`),
  CONSTRAINT `detalleventa_ibfk_2` FOREIGN KEY (`ProductoID`) REFERENCES `productos` (`Clave`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleventa`
--

LOCK TABLES `detalleventa` WRITE;
/*!40000 ALTER TABLE `detalleventa` DISABLE KEYS */;
INSERT INTO `detalleventa` VALUES (1,1,1,1,250.00),(2,2,1,1,250.00),(3,3,1,1,250.00),(4,3,2,2,500.00);
/*!40000 ALTER TABLE `detalleventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `EmpleadoID` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Puesto` varchar(50) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `FechaIngreso` date DEFAULT NULL,
  PRIMARY KEY (`EmpleadoID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (5,'Jorge perezdfgh','vendedor','4451234567','2025-11-27'),(6,'Leopoldo Leonel Espino González','Cajero','4171088060','2025-11-27'),(7,'Juan','vendedor','','2025-11-27');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productoaudit`
--

DROP TABLE IF EXISTS `productoaudit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productoaudit` (
  `AuditID` int NOT NULL AUTO_INCREMENT,
  `ProductoID` int DEFAULT NULL,
  `Accion` varchar(10) DEFAULT NULL,
  `ValorAnterior` text,
  `ValorNuevo` text,
  `Usuario` varchar(50) DEFAULT NULL,
  `FechaHora` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`AuditID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productoaudit`
--

LOCK TABLES `productoaudit` WRITE;
/*!40000 ALTER TABLE `productoaudit` DISABLE KEYS */;
INSERT INTO `productoaudit` VALUES (1,1,'INSERT','N/A','Nombre: Cien Años de Soledad, Precio: 250.00','root@localhost','2025-11-26 00:31:34'),(2,2,'INSERT','N/A','Nombre: Clean Code, Precio: 500.00','root@localhost','2025-11-26 00:31:34'),(3,1,'UPDATE','Precio: 250.00, Stock: 10','Precio: 250.00, Stock: 9','root@localhost','2025-11-27 02:29:29'),(4,3,'INSERT','N/A','Nombre: El conde de montecristo, Precio: 455.00','root@localhost','2025-11-27 03:46:30'),(5,4,'INSERT','N/A','Nombre: prueba, Precio: 123.00','root@localhost','2025-11-27 04:39:46'),(6,3,'UPDATE','Precio: 455.00, Stock: 45','Precio: 145.00, Stock: 45','root@localhost','2025-11-27 04:40:06'),(7,6,'INSERT','N/A','Nombre: Crimen y castigo, Precio: 245.00','root@localhost','2025-11-27 04:44:57'),(8,1,'UPDATE','Precio: 250.00, Stock: 9','Precio: 250.00, Stock: 8','root@localhost','2025-11-27 16:21:07'),(9,1,'UPDATE','Precio: 250.00, Stock: 8','Precio: 250.00, Stock: 7','root@localhost','2025-11-27 16:22:03'),(10,2,'UPDATE','Precio: 500.00, Stock: 5','Precio: 500.00, Stock: 3','root@localhost','2025-11-27 16:22:03');
/*!40000 ALTER TABLE `productoaudit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `Clave` int NOT NULL AUTO_INCREMENT,
  `ISBN` varchar(20) DEFAULT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` text,
  `Precio` decimal(10,2) NOT NULL,
  `Stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Clave`),
  UNIQUE KEY `ISBN` (`ISBN`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'111-222','Cien Años de Soledad','Gabriel Garcia Marquez',250.00,7),(2,'333-444','Clean Code','Robert C. Martin',500.00,3),(3,'123-453','El conde de montecristo','Dumas',145.00,45),(4,'123-444','prueba','prueba',123.00,2),(6,'123-445','Crimen y castigo','prueba',245.00,33);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `UsuarioID` int NOT NULL AUTO_INCREMENT,
  `NombreUsuario` varchar(50) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Rol` enum('Admin','Vendedor') NOT NULL,
  `Estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`UsuarioID`),
  UNIQUE KEY `NombreUsuario` (`NombreUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Admin',1),(7,'jorgecajero','1ed4353e845e2e537e017c0fac3a0d402d231809b7989e90da15191c1148a93f','Vendedor',1),(8,'leovendedor','56976bf24998ca63e35fe4f1e2469b5751d1856003e8d16fef0aafef496ed044','Vendedor',1),(9,'juan','03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4','Vendedor',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `VentaID` int NOT NULL AUTO_INCREMENT,
  `Fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `UsuarioID` int DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`VentaID`),
  KEY `UsuarioID` (`UsuarioID`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`UsuarioID`) REFERENCES `usuarios` (`UsuarioID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,'2025-11-27 02:29:29',1,250.00),(2,'2025-11-27 16:21:07',7,250.00),(3,'2025-11-27 16:22:03',7,1250.00);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-27 17:55:39
