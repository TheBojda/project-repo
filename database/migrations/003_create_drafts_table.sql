CREATE TABLE `drafts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` mediumtext NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_hash` char(32) COLLATE ascii_general_ci NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;