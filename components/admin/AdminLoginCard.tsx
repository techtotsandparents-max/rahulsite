'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, Briefcase, Key } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface AdminLoginCardProps {
  callbackUrl: string;
  hasAccessError: boolean;
  providerAvailability: {
    google: boolean;
    azureAd: boolean;
    credentials?: boolean;
  };
}

export default function AdminLoginCard({
  callbackUrl,
  hasAccessError,
  providerAvailability,
}: AdminLoginCardProps) {
  const hasAnyProvider = providerAvailability.google || providerAvailability.azureAd || providerAvailability.credentials;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signIn('credentials', {
      redirect: true,
      email,
      password,
      callbackUrl,
    });
    
    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="al-page">
      <div className="al-bg" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        className="al-card"
      >
        <div className="al-logo">
          <ShieldCheck size={22} />
        </div>

        <h1 className="al-title">Admin Access</h1>
        <p className="al-subtitle">Sign in to manage the platform.</p>

        <div className="al-actions">
          {providerAvailability.google && (
            <button
              type="button"
              className="al-btn al-btn--google"
              onClick={() => signIn('google', { callbackUrl })}
            >
              <Mail size={16} /> Continue with Google
            </button>
          )}
          {providerAvailability.azureAd && (
            <button
              type="button"
              className="al-btn al-btn--microsoft"
              onClick={() => signIn('azure-ad', { callbackUrl })}
            >
              <Briefcase size={16} /> Continue with Outlook
            </button>
          )}
          
          {providerAvailability.credentials && (
            <form onSubmit={handleCredentialsLogin} className="credentials-form">
              <div className="divider"><span>OR USE EMAIL</span></div>
              <input 
                type="email" 
                placeholder="Admin Email" 
                className="al-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="al-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="al-btn al-btn--credentials"
                disabled={loading}
              >
                <Key size={16} /> {loading ? 'Signing in...' : 'Sign In'}
              </button>
              {error && <p className="al-error">{error}</p>}
            </form>
          )}
        </div>

        {!hasAnyProvider && (
          <p className="al-error">Admin sign-in is not configured yet. Add OAuth or Credentials app settings to enable access.</p>
        )}

        {hasAccessError && (
          <p className="al-error">This account is not whitelisted in ADMIN_EMAILS.</p>
        )}

        <p className="al-hint">Access restricted to authorized personnel.</p>
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
            radial-gradient(ellipse at 20% 50%, rgba(105, 88, 255, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 30%, rgba(255, 138, 61, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
        }

        .al-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 450px;
          background: rgba(13, 27, 62, 0.8);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(105, 88, 255, 0.25);
          border-radius: 24px;
          padding: 42px 38px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .al-logo {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: linear-gradient(135deg, #6958ff, #8b7aff);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 18px;
        }

        .al-title {
          font-family: 'Space Grotesk', sans-serif;
          color: #f0f0f5;
          font-size: 1.7rem;
          margin: 0 0 8px;
        }

        .al-subtitle {
          color: rgba(160, 168, 192, 0.85);
          text-align: center;
          margin-bottom: 24px;
        }

        .al-actions {
          width: 100%;
          display: grid;
          gap: 10px;
        }

        .al-btn {
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 12px 14px;
          background: rgba(6, 13, 31, 0.75);
          color: white;
          font-weight: 600;
          display: inline-flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .al-btn:hover {
          border-color: rgba(105, 88, 255, 0.5);
        }

        .al-error {
          margin-top: 14px;
          font-size: 0.82rem;
          color: #f87171;
          background: rgba(248, 113, 113, 0.12);
          border: 1px solid rgba(248, 113, 113, 0.28);
          border-radius: 9px;
          padding: 8px 12px;
        }

        .al-hint {
          margin-top: 18px;
          font-size: 0.72rem;
          color: rgba(160, 168, 192, 0.6);
          text-align: center;
        }

        .credentials-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          margin-top: 10px;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: rgba(160, 168, 192, 0.5);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1px;
          margin: 10px 0;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .divider span {
          padding: 0 10px;
        }

        .al-input {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 12px 14px;
          color: white;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .al-input:focus {
          border-color: rgba(105, 88, 255, 0.8);
        }

        .al-btn--credentials {
          background: linear-gradient(135deg, #6958ff, #8b7aff);
          border: none;
          margin-top: 4px;
        }

        .al-btn--credentials:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
