-- Add these tables to your Supabase database for trivia tracking

-- Track each individual trivia question attempt
CREATE TABLE public.trivia_attempts (
  id bigserial NOT NULL,
  session_id text NOT NULL,
  question_number integer NOT NULL,
  attempt_number integer NOT NULL,
  answer_given text NOT NULL,
  is_correct boolean NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT trivia_attempts_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Track trivia completion and summary stats
CREATE TABLE public.trivia_completions (
  id bigserial NOT NULL,
  session_id text NOT NULL,
  q1_attempts integer NOT NULL,
  q2_attempts integer NOT NULL,
  q3_attempts integer NOT NULL,
  q3_guesses text[] NOT NULL, -- Array of all Pokemon guesses
  total_time_seconds integer NULL,
  completed_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT trivia_completions_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX idx_trivia_attempts_session_id ON public.trivia_attempts(session_id);
CREATE INDEX idx_trivia_attempts_question ON public.trivia_attempts(question_number);
CREATE INDEX idx_trivia_completions_session_id ON public.trivia_completions(session_id);