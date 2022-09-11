CREATE TABLE `projects` (
    `id` int NOT NULL AUTO_INCREMENT,
    `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `content` mediumtext NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `created` timestamp DEFAULT CURRENT_TIMESTAMP,
    `description` mediumtext DEFAULT NULL,
    `categories` text DEFAULT NULL,
    `position` POINT NOT NULL SRID 4326, 
    PRIMARY KEY (`id`),
    KEY `slug_IDX` (`slug`) USING BTREE,
    FULLTEXT (description),
    FULLTEXT (categories),
    SPATIAL INDEX(`position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;