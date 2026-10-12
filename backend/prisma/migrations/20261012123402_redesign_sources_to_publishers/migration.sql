/*
  Warnings:

  - You are about to drop the `job_sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_selected_sources` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_selected_sources` DROP FOREIGN KEY `user_selected_sources_source_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_selected_sources` DROP FOREIGN KEY `user_selected_sources_user_id_fkey`;

-- DropTable
DROP TABLE `job_sources`;

-- DropTable
DROP TABLE `user_selected_sources`;

-- CreateTable
CREATE TABLE `jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `external_id` VARCHAR(255) NOT NULL,
    `job_api_id` BIGINT UNSIGNED NOT NULL,
    `job_publisher_id` BIGINT UNSIGNED NULL,
    `title` VARCHAR(255) NOT NULL,
    `company` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,
    `url` VARCHAR(500) NOT NULL,
    `salary_min` INTEGER NULL,
    `salary_max` INTEGER NULL,
    `currency` VARCHAR(3) NULL,
    `job_type` VARCHAR(50) NULL,
    `work_mode` VARCHAR(50) NULL,
    `posted_at` DATETIME(3) NULL,
    `fetched_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `jobs_posted_at_idx`(`posted_at`),
    INDEX `jobs_job_api_id_idx`(`job_api_id`),
    INDEX `jobs_job_publisher_id_idx`(`job_publisher_id`),
    UNIQUE INDEX `jobs_external_id_job_api_id_key`(`external_id`, `job_api_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_apis` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `api_endpoint` VARCHAR(500) NOT NULL,
    `api_key_env` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `job_apis_code_key`(`code`),
    UNIQUE INDEX `job_apis_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_publishers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `discovered_via` BIGINT UNSIGNED NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `job_publishers_name_key`(`name`),
    UNIQUE INDEX `job_publishers_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_selected_publishers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `publisher_id` BIGINT UNSIGNED NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_selected_publishers_user_id_publisher_id_key`(`user_id`, `publisher_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_job_api_id_fkey` FOREIGN KEY (`job_api_id`) REFERENCES `job_apis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_job_publisher_id_fkey` FOREIGN KEY (`job_publisher_id`) REFERENCES `job_publishers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_publishers` ADD CONSTRAINT `job_publishers_discovered_via_fkey` FOREIGN KEY (`discovered_via`) REFERENCES `job_apis`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_selected_publishers` ADD CONSTRAINT `user_selected_publishers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_selected_publishers` ADD CONSTRAINT `user_selected_publishers_publisher_id_fkey` FOREIGN KEY (`publisher_id`) REFERENCES `job_publishers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
