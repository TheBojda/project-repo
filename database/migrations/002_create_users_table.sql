CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `email_IDX` (`email`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;