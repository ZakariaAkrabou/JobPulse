-- CreateTable
CREATE TABLE `user_job_matches` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `job_id` BIGINT UNSIGNED NOT NULL,
    `match_score` FLOAT NOT NULL,
    `is_notified` BOOLEAN NOT NULL DEFAULT false,
    `is_saved` BOOLEAN NOT NULL DEFAULT false,
    `is_dismissed` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_job_matches_user_id_match_score_idx`(`user_id`, `match_score`),
    INDEX `user_job_matches_user_id_is_notified_idx`(`user_id`, `is_notified`),
    UNIQUE INDEX `user_job_matches_user_id_job_id_key`(`user_id`, `job_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_job_matches` ADD CONSTRAINT `user_job_matches_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_job_matches` ADD CONSTRAINT `user_job_matches_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
