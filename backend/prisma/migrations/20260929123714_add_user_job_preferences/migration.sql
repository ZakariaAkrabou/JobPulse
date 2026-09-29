-- CreateTable
CREATE TABLE `user_job_preferences` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `job_type` ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance') NULL,
    `work_mode` ENUM('remote', 'onsite', 'hybrid') NULL,
    `date_range` ENUM('h24', 'd7', 'd30', 'any') NULL,
    `keywords` VARCHAR(255) NULL,
    `location_filter` VARCHAR(150) NULL,
    `salary_min` INTEGER NULL,
    `currency` VARCHAR(3) NULL,

    UNIQUE INDEX `user_job_preferences_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_job_preferences` ADD CONSTRAINT `user_job_preferences_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
