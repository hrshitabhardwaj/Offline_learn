import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { BookOpen, Loader2 } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { t } = useI18n();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        if (name.trim().length < 1) throw new Error('NEED_NAME');
        await signUp(email.trim(), password, name.trim());
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'UNKNOWN';
      setError(humanizeError(msg, t));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" strokeWidth={1.6} />
            <span className="text-lg font-semibold tracking-tight">{t('appName')}</span>
          </div>
          <LanguageSelector compact />
        </div>

        <h1 className="text-2xl mb-1">
          {mode === 'signin' ? t('welcomeBack') : t('createAccount')}
        </h1>
        <p className="text-sm text-[var(--muted)] mb-6">{t('class8Math')}</p>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="label" htmlFor="name">{t('name')}</label>
              <input
                id="name"
                className="field mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('enterName')}
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              className="field mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              className="field mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('atLeast6Chars')}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--ink)] border border-[var(--line)] bg-white rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {mode === 'signin' ? t('signIn') : t('signUp')}
          </button>
        </form>

        <button
          type="button"
          className="text-sm text-[var(--muted)] mt-4 underline underline-offset-4"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError(null);
          }}
        >
          {mode === 'signin' ? t('dontHaveAccount') : t('alreadyHaveAccount')}
        </button>
      </div>
    </div>
  );
}

function humanizeError(msg: string, t: (k: 'emailOrPasswordIncorrect' | 'accountExists' | 'tooManyTries') => string): string {
  if (msg === 'NEED_NAME') return 'Please enter your name.';
  if (msg.includes('Invalid login credentials')) return t('emailOrPasswordIncorrect');
  if (msg.includes('already registered')) return t('accountExists');
  if (msg.includes('rate limit')) return t('tooManyTries');
  return msg;
}
