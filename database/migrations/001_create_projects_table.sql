CREATE TABLE `projects` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `slug` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
    `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
    `short_description` TEXT COLLATE utf8_unicode_ci DEFAULT NULL,
    `description` TEXT COLLATE utf8_unicode_ci DEFAULT NULL,
    `ownerId` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `slug_IDX` (`slug`) USING BTREE,
    KEY `ownerId_IDX` (`ownerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;