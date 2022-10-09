CREATE TABLE IF NOT EXISTS `ev_article_cates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) NOT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '数据是否被标记删除\\n0 没有被删除\\n1 已经被删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `alias_UNIQUE` (`alias`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='文章分类表';
