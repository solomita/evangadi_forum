-- Migration 001 — DOWN
-- Slice 1: Community Trust + AI Growth Features — Data Foundation
-- Removes all tables added by 001_slice1_community_trust_up.sql
--
-- WARNING: This drops data permanently. Only run in development or staging.

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `learning_hint_cache`;
DROP TABLE IF EXISTS `user_badges`;
DROP TABLE IF EXISTS `user_moderation_status`;
DROP TABLE IF EXISTS `moderation_flags`;
DROP TABLE IF EXISTS `answer_votes`;

-- Reverse the column added to the existing `users` table by the UP migration.
ALTER TABLE `users` DROP COLUMN IF EXISTS `trust_score`;

SET FOREIGN_KEY_CHECKS = 1;
