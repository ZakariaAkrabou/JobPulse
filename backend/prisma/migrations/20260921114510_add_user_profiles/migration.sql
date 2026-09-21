-- CreateTable
CREATE TABLE `user_profiles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `phone` VARCHAR(30) NULL,
    `location` VARCHAR(150) NULL,
    `current_title` VARCHAR(150) NULL,
    `experience_years` TINYINT UNSIGNED NULL,
    `summary` TEXT NULL,
    `resume_url` VARCHAR(500) NULL,
    `resume_parsed_text` LONGTEXT NULL,
    `resume_parsed_json` JSON NULL,

    UNIQUE INDEX `user_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
