CREATE TABLE IF NOT EXISTS `faceting` (
  `faceting_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `faceting_name` TEXT,
  `faceting_uom` TEXT,
  `faceting_pricePerUom` REAL,
  `faceting_cashRegisterNumber` INTEGER,
  `faceting_isActive` INTEGER
);
INSERT INTO `faceting` VALUES (1,'Fazetiranje do 10mm','m',250.000,125,1),(2,'Fazetiranje do 15mm','m',300.000,126,1),(3,'Fazetiranje do 20mm','m',360.000,127,1),(4,'Fazetiranje do 25mm','m',430.000,128,1),(5,'Fazetiranje do 30mm','m',520.000,129,1);
CREATE TABLE IF NOT EXISTS `frame` (
  `frame_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `frame_name` TEXT,
  `frame_uom` TEXT,
  `frame_pricePerUom` REAL,
  `frame_cashRegisterNumber` INTEGER,
  `frame_code` TEXT,
  `frame_frameWidthMM` INTEGER,
  `frame_isActive` INTEGER
);
INSERT INTO `frame` VALUES (1,'RAM','m',590.000,143,'01',13,1),(2,'RAM','m',590.000,144,'02',13,1),(3,'RAM','m',690.000,145,'03',30,1),(4,'RAM','m',690.000,146,'04',0,1),(5,'RAM','m',690.000,147,'05',23,1),(6,'RAM','m',690.000,148,'06',20,1),(7,'RAM','m',820.000,149,'07',0,1),(8,'RAM','m',790.000,150,'08',30,1),(9,'RAM','m',690.000,151,'09',20,1),(10,'RAM','m',790.000,152,'10',40,1),(11,'RAM','m',690.000,153,'11',25,1),(12,'RAM','m',590.000,154,'12',20,1),(13,'RAM','m',790.000,155,'13',40,1),(14,'RAM','m',790.000,156,'14',40,1),(15,'RAM','m',2190.000,157,'15',65,1),(16,'RAM','m',990.000,158,'16',50,1),(17,'RAM','m',990.000,159,'17',55,1),(18,'RAM','m',1190.000,160,'18',55,1),(19,'RAM','m',1990.000,161,'19',80,1),(20,'RAM','m',1.000,162,'20',0,1),(21,'Č. GOBLEN 8cm','m',2190.000,163,'21',80,1),(22,'Č. GOBLEN 10cm','m',2190.000,163,'22',100,1),(23,'OVAL GOBLEN 8cm','m',2190.000,163,'23',80,1),(24,'OVAL GOBLEN 10cm','m',2190.000,163,'24',100,1),(25,'BLIND RAM','m',250.000,164,'25',0,1),(26,'MEDIJAPAN OVAL','m',1690.000,165,'26',0,1),(27,'RAM','m',1790.000,166,'27',55,1),(28,'RAM','m',1790.000,167,'28',50,1),(29,'RAM','m',1990.000,168,'29',60,1),(30,'RAM','m',2190.000,169,'30',60,1),(31,'RAM','m',2290.000,170,'31',75,1),(32,'RAM','m',3890.000,171,'32',80,1),(33,'RAM','m',4390.000,172,'33',80,1),(34,'RAM','m',2490.000,173,'34',80,1),(35,'RAM','m',3190.000,174,'35',80,1),(36,'RAM','m',2190.000,175,'36',60,1),(37,'RAM','m',1.000,176,'37',0,1),(38,'RAM','m',1.000,177,'38',0,1),(39,'RAM','m',1.000,178,'39',0,1),(40,'RAM','m',1.000,179,'10',0,1);
CREATE TABLE IF NOT EXISTS `glass` (
  `glass_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `glass_name` TEXT,
  `glass_uom` TEXT,
  `glass_pricePerUom` REAL,
  `glass_cashRegisterNumber` INTEGER,
  `glass_isActive` INTEGER
);
INSERT INTO `glass` VALUES (1,'STAKLO 2 mm','m2',1716.000,40,1),(2,'ANTIREFLEKS','m2',3926.000,39,1),(3,'KUPČEVO','m2',0.000,NULL,1);
CREATE TABLE IF NOT EXISTS `invoice` (
  `invoice_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `invoice_createDate` TEXT,
  `invoice_amount` REAL,
  `invoice_advancePayment` REAL,
  `invoice_buyerName` TEXT,
  `user_user_oid` INTEGER NOT NULL,
  FOREIGN KEY (`user_user_oid`) REFERENCES `user` (`user_oid`)
);
CREATE TABLE IF NOT EXISTS `invoiceitem` (
  `invoiceitem_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `invoiceitem_title` TEXT,
  `invoiceitem_serviceType` TEXT,
  `invoiceitem_amount` REAL,
  `invoiceitem_dimensionsWidth` REAL,
  `invoiceitem_dimensionsHeight` REAL,
  `invoiceitem_dimensionsUom` TEXT,
  `invoiceitem_outterWidth` REAL,
  `invoiceitem_outterHeight` REAL,
  `invoice_invoice_oid` INTEGER NOT NULL,
  `glass_glass_oid` INTEGER,
  `mirror_mirror_oid` INTEGER,
  `faceting_faceting_oid` INTEGER,
  `sanding_sanding_oid` INTEGER,
  `invoiceitem_passpartuWidth` REAL,
  `invoiceitem_passpartuWidthUom` TEXT,
  `passpartucolor_passpartuColor_oid` INTEGER,
  FOREIGN KEY (`faceting_faceting_oid`) REFERENCES `faceting` (`faceting_oid`),
  FOREIGN KEY (`glass_glass_oid`) REFERENCES `glass` (`glass_oid`),
  FOREIGN KEY (`invoice_invoice_oid`) REFERENCES `invoice` (`invoice_oid`),
  FOREIGN KEY (`mirror_mirror_oid`) REFERENCES `mirror` (`mirror_oid`),
  FOREIGN KEY (`passpartucolor_passpartuColor_oid`) REFERENCES `passpartucolor` (`passpartuColor_oid`),
  FOREIGN KEY (`sanding_sanding_oid`) REFERENCES `sanding` (`sanding_oid`)
);
CREATE TABLE IF NOT EXISTS `invoiceitem_has_frame` (
  `invoiceitem_has_frame_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `invoiceItem_invoiceItem_oid` INTEGER NOT NULL,
  `frame_frame_oid` INTEGER NOT NULL,
  `colorCode` TEXT,
  FOREIGN KEY (`frame_frame_oid`) REFERENCES `frame` (`frame_oid`),
  FOREIGN KEY (`invoiceItem_invoiceItem_oid`) REFERENCES `invoiceitem` (`invoiceitem_oid`)
);
CREATE TABLE IF NOT EXISTS `mirror` (
  `mirror_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `mirror_name` TEXT,
  `mirror_uom` TEXT,
  `mirror_pricePerUom` REAL,
  `mirror_cashRegisterNumber` INTEGER,
  `mirror_isActive` INTEGER
);
INSERT INTO `mirror` VALUES (1,'OGLEDALO 3 mm','m2',3367.000,52,1),(2,'OGLEDALO 4 mm','m2',4212.000,53,1),(3,'KUPČEVO','m2',0.000,NULL,1);
CREATE TABLE IF NOT EXISTS `passpartu` (
  `passpartu_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `passpartu_name` TEXT,
  `passpartu_uom` TEXT,
  `passpartu_pricePerUom` REAL,
  `passpartu_cashRegisterNumber` INTEGER,
  `passpartu_isActive` INTEGER
);
INSERT INTO `passpartu` VALUES (1,'Paspartu','m2',1890.000,182,1);
CREATE TABLE IF NOT EXISTS `passpartucolor` (
  `passpartuColor_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `passpartuColor_name` TEXT,
  `passpartu_passpartu_oid` INTEGER NOT NULL,
  `passpartucolor_isActive` INTEGER
);
INSERT INTO `passpartucolor` VALUES (1,'P1',1,1),(2,'P2',1,1),(3,'P3',1,1),(4,'P4',1,1),(5,'P5',1,1),(6,'P6',1,1),(7,'P7',1,1),(8,'P8',1,1),(9,'P9',1,1),(10,'P10',1,1),(11,'P11',1,1),(12,'P12',1,1),(13,'P13',1,1),(14,'P14',1,1),(15,'P15',1,1),(16,'P16',1,1),(17,'P17',1,1),(18,'P18',1,1),(19,'P19',1,1),(20,'P20',1,1),(21,'P21',1,1),(22,'P22',1,1),(23,'P23',1,1),(24,'P24',1,1),(25,'P25',1,1),(26,'P26',1,1),(27,'P27',1,1),(28,'P28',1,1),(29,'P29',1,1),(30,'P30',1,1);
CREATE TABLE IF NOT EXISTS `sanding` (
  `sanding_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `sanding_name` TEXT,
  `sanding_uom` TEXT,
  `sanding_pricePerUom` REAL,
  `sanding_cashRegisterNumber` INTEGER,
  `sanding_isActive` INTEGER
);
INSERT INTO `sanding` VALUES (1,'PESKARENJE SA MOTIVOM','m2',2880.000,124,1);
CREATE TABLE IF NOT EXISTS `user` (
  `user_oid` INTEGER PRIMARY KEY AUTOINCREMENT,
  `user_name` TEXT,
  `user_isActive` INTEGER
);
INSERT INTO `user` VALUES (1,'Milan',1),(2,'Igor',1);
INSERT INTO sqlite_sequence (name, seq) VALUES ('invoice', 999999);
