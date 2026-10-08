-- CreateTable
CREATE TABLE `user_selected_sources` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `source_id` BIGINT UNSIGNED NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_selected_sources_user_id_source_id_key`(`user_id`, `source_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_selected_sources` ADD CONSTRAINT `user_selected_sources_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_selected_sources` ADD CONSTRAINT `user_selected_sources_source_id_fkey` FOREIGN KEY (`source_id`) REFERENCES `job_sources`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
