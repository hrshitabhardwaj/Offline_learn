/*
# OfflineLearn — relevance feedback table

1. New Tables
- `relevance`: user feedback on whether a recommendation was relevant.
  - id (uuid, PK)
  - user_id (uuid, NOT NULL, default auth.uid(), references auth.users)
  - topic (text)
  - recommendation (text)
  - relevant (integer, 0 or 1)
  - created_at (timestamptz, default now())

2. Security
- RLS enabled.
- Owner-scoped CRUD for authenticated users.
*/

CREATE TABLE IF NOT EXISTS relevance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  recommendation text NOT NULL,
  relevant integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS relevance_user_idx ON relevance(user_id);

ALTER TABLE relevance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_relevance" ON relevance;
CREATE POLICY "select_own_relevance" ON relevance
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_relevance" ON relevance;
CREATE POLICY "insert_own_relevance" ON relevance
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_relevance" ON relevance;
CREATE POLICY "update_own_relevance" ON relevance
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_relevance" ON relevance;
CREATE POLICY "delete_own_relevance" ON relevance
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
