'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { data: session } = useSession();
  const authUser = session?.user;

  const handleLogin = async () => {
    if (loading || !providerAvailability.azureAd) return;

    setLoading(true);
    setLoginError(null);
    try {
      await signIn('azure-ad', { callbackUrl });
    } catch {
      setLoginError('Unable to start Microsoft sign-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const authStatus = authUser
    ? `Signed in as ${authUser.email || authUser.name || 'authenticated user'}`
    : 'Not signed in';

  return (
    <div className="admin-login-page">
      {/* Background glow */}
      <div className="admin-login-bg" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="admin-login-card"
      >
        {/* Entra ID Protected Badge */}
        <div className="admin-login-badge">
          <ShieldCheck size={13} />
          <span>Entra ID Protected</span>
        </div>

        {/* Title */}
        <h1 className="admin-login-title">
          Sign in to manage your site
        </h1>

        {/* Description */}
        <p className="admin-login-desc">
          Sign in to manage blogs, travel journals, YouTube videos, projects, and site settings.
          Access is enforced by Microsoft Entra ID.
        </p>

        {/* Access denied error */}
        {hasAccessError && (
          <div className="admin-login-error">
            Access denied — your account is not in the admin whitelist.
          </div>
        )}

        {(!providerAvailability.azureAd || loginError) && (
          <div className="admin-login-error" role="alert">
            {!providerAvailability.azureAd
              ? 'Microsoft Entra ID sign-in is not configured. Please check the server authentication settings.'
              : loginError}
          </div>
        )}

        {/* Actions row: Sign In button + status */}
        <div className="admin-login-actions">
          <button
            id="btn-entra-login"
            className="admin-login-btn"
            onClick={handleLogin}
            disabled={loading || !providerAvailability.azureAd}
            aria-label="Sign in with Microsoft Entra ID"
          >
            {loading ? (
              <Loader2 size={16} className="admin-login-spinner" />
            ) : (
              <MicrosoftIcon />
            )}
            <span>{loading ? 'Redirecting…' : 'Sign in with Microsoft Entra ID'}</span>
          </button>

          <span className="admin-login-status">
            {authUser ? (
              <span className="admin-login-status--active">{authStatus}</span>
            ) : (
              authStatus
            )}
          </span>
        </div>
      </motion.div>

      <style jsx>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary, #060d1f);
          position: relative;
          overflow: hidden;
          padding: 24px;
          font-family: 'Inter', 'Space Grotesk', -apple-system, sans-serif;
        }

        .admin-login-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 50%, rgba(105, 88, 255, 0.1) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 30%, rgba(6, 182, 212, 0.06) 0%, transparent 50%);
        }

        .admin-login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 540px;
          background: rgba(10, 18, 42, 0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 32px 36px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
        }

        /* ── Badge ── */
        .admin-login-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 100px;
          border: 1px solid rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.08);
          color: #34d399;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        /* ── Title ── */
        .admin-login-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 1.55rem;
          font-weight: 700;
          color: #f0f0f8;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }

        /* ── Description ── */
        .admin-login-desc {
          color: rgba(160, 168, 200, 0.7);
          font-size: 0.88rem;
          line-height: 1.6;
          margin: 0 0 22px;
          max-width: 440px;
        }

        /* ── Error ── */
        .admin-login-error {
          width: 100%;
          color: #fca5a5;
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.82rem;
          line-height: 1.5;
          margin-bottom: 18px;
        }

        /* ── Actions row ── */
        .admin-login-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* ── Sign in button ── */
        .admin-login-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 11px 22px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #0078d4 0%, #00a4ef 100%);
          color: white;
          font-size: 0.88rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 2px 12px rgba(0, 120, 212, 0.3);
        }

        .admin-login-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #0068bd 0%, #0094db 100%);
          box-shadow: 0 4px 20px rgba(0, 120, 212, 0.45);
          transform: translateY(-1px);
        }

        .admin-login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .admin-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* ── Spinner ── */
        .admin-login-spinner {
          animation: adminSpin 0.8s linear infinite;
        }

        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }

        /* ── Status text ── */
        .admin-login-status {
          font-size: 0.82rem;
          color: rgba(160, 168, 200, 0.5);
        }

        .admin-login-status--active {
          color: #34d399;
        }

        /* ── Mobile responsive ── */
        @media (max-width: 520px) {
          .admin-login-card {
            padding: 24px 22px;
            border-radius: 14px;
          }

          .admin-login-title {
            font-size: 1.3rem;
          }

          .admin-login-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .admin-login-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Microsoft icon ── */
function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
      <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
    </svg>
  );
}
