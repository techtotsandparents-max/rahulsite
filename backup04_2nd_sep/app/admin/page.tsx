'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, Terminal } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem('admin-token', password);
        router.push('/admin/dashboard');
      } else {
        setError('Incorrect password. Try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-page">
      {/* Animated background */}
      <div className="al-bg" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        className="al-card"
      >
        {/* Logo */}
        <div className="al-logo">
          <Terminal size={22} />
        </div>

        <h1 className="al-title">Admin Access</h1>
        <p className="al-subtitle">RahulTripathi.dev — Content Studio</p>

        <form onSubmit={handleLogin} className="al-form">
          <div className="al-field">
            <label htmlFor="admin-password" className="al-label">
              <Lock size={13} /> Password
            </label>
            <div className="al-input-wrap">
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                className="al-input"
              />
              <button
                type="button"
                className="al-eye-btn"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="al-error"
            >
              ⚠ {error}
            </motion.p>
          )}

          <button type="submit" disabled={loading} className="al-btn">
            {loading ? (
              <><Loader2 size={16} className="al-spinner" /> Authenticating…</>
            ) : (
              'Enter Studio'
            )}
          </button>
        </form>

        <p className="al-hint">This area is restricted to site administrators only.</p>
      </motion.div>

      <style jsx>{`
        .al-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #060d1f;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        .al-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(105,88,255,0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 30%, rgba(255,138,61,0.10) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, rgba(6,182,212,0.08) 0%, transparent 50%);
          animation: bg-shift 8s ease-in-out infinite alternate;
        }

        @keyframes bg-shift {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }

        .al-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(13, 27, 62, 0.80);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(105, 88, 255, 0.25);
          border-radius: 24px;
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          box-shadow: 0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(105,88,255,0.12);
        }

        .al-logo {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, #6958FF, #8B7AFF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(105,88,255,0.45);
        }

        .al-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.7rem;
          font-weight: 700;
          color: #F0F0F5;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
          text-align: center;
        }

        .al-subtitle {
          font-size: 0.84rem;
          color: rgba(160,168,192,0.75);
          margin-bottom: 32px;
          text-align: center;
        }

        .al-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .al-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .al-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(160,168,192,0.80);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .al-input-wrap {
          position: relative;
        }

        .al-input {
          width: 100%;
          padding: 13px 46px 13px 16px;
          border-radius: 12px;
          background: rgba(8, 18, 41, 0.70);
          border: 1px solid rgba(105,88,255,0.22);
          color: #F0F0F5;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
        }

        .al-input:focus {
          border-color: #6958FF;
          box-shadow: 0 0 0 3px rgba(105,88,255,0.18);
        }

        .al-input::placeholder { color: rgba(160,168,192,0.35); }

        .al-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(160,168,192,0.55);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .al-eye-btn:hover { color: #F0F0F5; }

        .al-error {
          font-size: 0.82rem;
          color: #F87171;
          background: rgba(248,113,113,0.10);
          border: 1px solid rgba(248,113,113,0.25);
          border-radius: 8px;
          padding: 9px 14px;
        }

        .al-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6958FF, #8B7AFF);
          color: white;
          font-size: 0.92rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 6px 24px rgba(105,88,255,0.35);
          margin-top: 6px;
        }

        .al-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 32px rgba(105,88,255,0.50);
        }

        .al-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .al-spinner {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .al-hint {
          font-size: 0.73rem;
          color: rgba(160,168,192,0.35);
          text-align: center;
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}
