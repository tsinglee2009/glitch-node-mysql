CREATE TABLE IF NOT EXISTS `ev_articles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `cover_img` varchar(255) NOT NULL,
  `pub_date` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `cate_id` int NOT NULL,
  `author_id` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='文章表';
