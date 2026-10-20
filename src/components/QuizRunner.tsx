import { useMemo, useState } from 'react';
import type { Question } from '@/data/content';
import { Check, X, Lightbulb, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import { classifyScore } from '@/lib/recommendations';

type Props = {
  title: string;
  subtitle: string;
  questions: Question[];
  topic: string;
  variant: 'practice' | 'assessment';
  timed?: boolean;
  onExit: () => void;
  onSubmit: (result: {
    correct: number;
    total: number;
    answers: (number | null)[];
  }) => void;
};

export function QuizRunner({
  title,
  subtitle,
  questions,
  topic,
  variant,
  timed,
  onExit,
  onSubmit,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  const q = questions[idx];

  const select = (optionIdx: number) => {
    if (variant === 'assessment' && submitted) return;
    const next = [...answers];
    next[idx] = optionIdx;
    setAnswers(next);
    setHintShown(false);
  };

  const next = () => {
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setHintShown(false);
    }
  };
  const prev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setHintShown(false);
    }
  };

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = questions.reduce(
    (acc, question, i) => acc + (answers[i] === question.answer ? 1 : 0),
    0,
  );

  const submit = () => {
    setSubmitted(true);
    const now = Date.now();
    setElapsed(Math.round((now - startTime) / 1000));
    onSubmit({
      correct: correctCount,
      total: questions.length,
      answers,
    });
  };

  const status = classifyScore(Math.round((correctCount / questions.length) * 100));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={onExit}
        className="text-sm text-[var(--muted)] mb-4 inline-flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" /> Exit
      </button>

      <div className="flex items-center justify-between mb-1">
        <p className="label">{subtitle}</p>
        {timed && (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.7} />
            {submitted ? `${elapsed}s` : 'untimed'}
          </span>
        )}
      </div>
      <h1 className="text-xl">{title}</h1>
      <p className="text-sm text-[var(--muted)] mt-1">
        {topic} · Question {idx + 1} of {questions.length}
      </p>

      {/* progress bar */}
      <div className="h-1 bg-[var(--line)] rounded mt-4 overflow-hidden">
        <div
          className="h-1 bg-[var(--ink)] transition-all"
          style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="card mt-5">
        <p className="text-[15px] font-medium">{q.prompt}</p>

        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            const selected = answers[idx] === i;
            const isCorrect = q.answer === i;
            const reveal = variant === 'practice' && selected;
            let cls = 'border-[var(--line)] bg-white';
            if (selected) cls = 'border-[var(--ink)] bg-white';
            if (reveal && isCorrect) cls = 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]';
            if (reveal && !isCorrect) cls = 'border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] line-through';
            return (
              <button
                key={i}
                onClick={() => select(i)}
                disabled={variant === 'practice' && selected !== null && selected !== undefined}
                className={`w-full text-left rounded-md border px-3 py-3 text-sm transition-colors ${cls}`}
              >
                <span className="mr-2 text-[var(--muted)]">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
                {reveal && isCorrect && (
                  <Check className="inline-block w-4 h-4 ml-2" strokeWidth={2.2} />
                )}
                {reveal && !isCorrect && (
                  <X className="inline-block w-4 h-4 ml-2" strokeWidth={2.2} />
                )}
              </button>
            );
          })}
        </div>

        {variant === 'practice' && (
          <div className="mt-4">
            {!hintShown ? (
              <button
                className="btn-ghost btn-sm"
                onClick={() => setHintShown(true)}
              >
                <Lightbulb className="w-3.5 h-3.5" strokeWidth={1.7} />
                Show hint
              </button>
            ) : (
              <div className="text-sm border border-[var(--line)] rounded-md p-3 bg-[var(--bg)]">
                <p className="label mb-1">Hint</p>
                <p>{q.hint}</p>
              </div>
            )}
            {answers[idx] !== null && (
              <div className="text-sm mt-3 border border-[var(--line)] rounded-md p-3 bg-white">
                <p className="label mb-1">Explanation</p>
                <p>{q.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-5">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="btn-ghost btn-sm disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        {idx < questions.length - 1 ? (
          <button onClick={next} className="btn-primary btn-sm">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : variant === 'assessment' ? (
          <button
            onClick={submit}
            disabled={!allAnswered}
            className="btn-primary btn-sm disabled:opacity-40"
          >
            Submit quiz
          </button>
        ) : (
          <button onClick={() => onSubmit({ correct: correctCount, total: questions.length, answers })} className="btn-primary btn-sm">
            Finish
          </button>
        )}
      </div>

      {variant === 'assessment' && submitted && (
        <ResultSummary
          correct={correctCount}
          total={questions.length}
          statusLabel={status.statusLabel}
          questions={questions}
          answers={answers}
        />
      )}
    </div>
  );
}

export function ResultSummary({
  correct,
  total,
  statusLabel,
  questions,
  answers,
}: {
  correct: number;
  total: number;
  statusLabel: string;
  questions: Question[];
  answers: (number | null)[];
}) {
  const pct = Math.round((correct / total) * 100);
  return (
    <div className="mt-6 space-y-4">
      <div className="card text-center">
        <p className="label">Result</p>
        <p className="text-4xl mt-1">{pct}%</p>
        <p className="text-sm text-[var(--muted)] mt-1">
          {correct} of {total} correct
        </p>
        <p className="inline-block mt-3 text-sm border border-[var(--line)] rounded-full px-3 py-1">
          Status: {statusLabel}
        </p>
      </div>

      <div>
        <p className="label mb-2">Review</p>
        <div className="space-y-2">
          {questions.map((q, i) => {
            const ans = answers[i];
            const ok = ans === q.answer;
            return (
              <div key={q.id} className="card">
                <div className="flex items-start gap-2">
                  {ok ? (
                    <Check className="w-4 h-4 mt-0.5" strokeWidth={2.2} />
                  ) : (
                    <X className="w-4 h-4 mt-0.5" strokeWidth={2.2} />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{q.prompt}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Correct answer: {q.options[q.answer]}
                    </p>
                    {!ok && ans !== null && (
                      <p className="text-xs text-[var(--muted)]">
                        Your answer: {q.options[ans]}
                      </p>
                    )}
                    <p className="text-xs mt-1 text-[var(--muted)]">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function useQuizMeta() {
  return useMemo(() => ({ version: 1 }), []);
}
