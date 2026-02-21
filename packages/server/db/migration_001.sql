-- Migration 001: Add status to conversations and create chat_goals table
-- Run this against your local and Railway MySQL databases

-- 1. Add status column to conversations table
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS status ENUM('active', 'completed') NOT NULL DEFAULT 'active';

-- 2. Create chat_goals table to persist completed SMART goals
CREATE TABLE IF NOT EXISTS chat_goals (
  id                       VARCHAR(36)  NOT NULL PRIMARY KEY,
  conversation_id          VARCHAR(36)  NOT NULL,
  user_id                  VARCHAR(36)  NOT NULL,
  goal_summary             TEXT         NOT NULL,
  goal_category            ENUM('mobility','upper_limb','balance','adl','strength','communication','other') NOT NULL,
  target_activity          TEXT         NOT NULL,
  current_ability          TEXT         NOT NULL,
  measurement_metric       VARCHAR(100) NOT NULL,
  measurement_current_val  FLOAT        NULL,
  measurement_target_val   FLOAT        NULL,
  measurement_unit         VARCHAR(50)  NOT NULL,
  frequency                VARCHAR(200) NOT NULL DEFAULT '',
  timeline_weeks           INT          NOT NULL DEFAULT 0,
  assistance_level         TINYINT      NOT NULL DEFAULT 1,
  is_specific              BOOLEAN      NOT NULL DEFAULT FALSE,
  is_measurable            BOOLEAN      NOT NULL DEFAULT FALSE,
  is_achievable            BOOLEAN      NOT NULL DEFAULT FALSE,
  is_relevant              BOOLEAN      NOT NULL DEFAULT FALSE,
  is_time_bound            BOOLEAN      NOT NULL DEFAULT FALSE,
  risk_score               FLOAT        NOT NULL DEFAULT 0,
  risk_level               ENUM('LOW', 'MODERATE', 'HIGH') NOT NULL DEFAULT 'LOW',
  requires_approval        BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at               TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)         REFERENCES user(id)          ON DELETE CASCADE
);
