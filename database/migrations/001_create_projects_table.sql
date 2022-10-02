CREATE TABLE `projects` (
    `id` int NOT NULL AUTO_INCREMENT,
    `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `content` mediumtext NOT NULL,
    `email_hash` char(32) COLLATE ascii_general_ci DEFAULT NULL,
    `created` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `description` mediumtext DEFAULT NULL,
    `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `position` POINT NOT NULL, 
    `import_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `slug_IDX` (`slug`) USING BTREE,
    KEY `category_IDX` (`category`) USING BTREE,
    FULLTEXT (description),
    SPATIAL INDEX(`position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;