'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Coffee, Sun, Moon, Search, Volume2, Rss, ShieldCheck, LogOut, User } from 'lucide-react';
import { navLinks } from '@/lib/fixtures';

export function TopNavToolbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [muted, setMuted] = useState(false);
  const { data: session } = useSession();
  const isAdminSession = Boolean(session?.user?.isAdmin);
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/.auth/me');
        if (res.ok) {
          const data = await res.json();
          const user = Array.isArray(data) ? data[0] : data?.clientPrincipal;
          if (user) {
            setAuthUser(user);
          }
        }
      } catch (err) {
        console.error('Failed to fetch auth user', err);
      }
    }
    fetchUser();
  }, []);

  const handleUserLogin = () => {
    const redirect = window.location.pathname;
    window.location.href = '/.auth/login/aad?post_login_redirect_uri=' + encodeURIComponent(redirect);
  };

  const handleUserLogout = () => {
    window.location.href = '/.auth/logout?post_logout_redirect_uri=' + encodeURIComponent(window.location.origin);
  };

  useEffect(() => {
    const savedTheme = (localStorage.getItem('site-theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('site-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="nav-toolbar-row">
      <Link href="/blog" className="nav-icon-btn" aria-label="Search">
        <Search size={16} />
      </Link>

      <button
        onClick={() => setMuted(!muted)}
        className="nav-icon-btn"
        aria-label="Toggle Sound"
        title="Toggle Ambient Sound"
      >
        <Volume2 size={16} className={muted ? 'opacity-40' : 'opacity-100'} />
      </button>

      {/* Day / Night View Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`nav-icon-btn nav-icon-btn--theme ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
        aria-label={`Switch to ${theme === 'dark' ? 'Day (Light)' : 'Night (Dark)'} View`}
        title={`Switch to ${theme === 'dark' ? 'Day (Light)' : 'Night (Dark)'} View`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <a href="/rss.xml" className="nav-icon-btn" aria-label="RSS Feed" title="RSS Feed">
        <Rss size={16} />
      </a>

      {authUser ? (
        <button
          onClick={handleUserLogout}
          className="nav-icon-btn nav-icon-btn--user"
          aria-label="Sign out User"
          title={`Sign out ${authUser.userDetails || 'User'}`}
        >
          <LogOut size={16} />
        </button>
      ) : (
        <button
          onClick={handleUserLogin}
          className="nav-icon-btn nav-icon-btn--user"
          aria-label="User login"
          title="User Login"
        >
          <User size={16} />
        </button>
      )}

      {isAdminSession ? (
        <button
          onClick={() => signOut({
            callbackUrl: session?.authProvider === 'easy-auth'
              ? '/.auth/logout?post_logout_redirect_uri=%2F'
              : '/',
          })}
          className="nav-icon-btn nav-icon-btn--admin"
          aria-label="Sign out admin"
          title="Sign out admin"
        >
          <LogOut size={16} />
        </button>
      ) : (
        <a
          href="/.auth/login/aad?post_login_redirect_uri=%2Fblog"
          className="nav-icon-btn nav-icon-btn--admin"
          aria-label="Admin login"
          title="Admin Login"
        >
          <ShieldCheck size={16} />
        </a>
      )}

      <style jsx>{`
        .nav-toolbar-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-icon-btn:hover {
          color: var(--text-primary);
          background: rgba(105, 88, 255, 0.2);
          border-color: #6958FF;
          transform: translateY(-1px);
        }

        .nav-icon-btn--theme.is-dark {
          color: #FBBF24;
          border-color: rgba(251, 191, 36, 0.4);
        }

        .nav-icon-btn--theme.is-light {
          color: #6958FF;
          border-color: rgba(105, 88, 255, 0.4);
        }

        .nav-icon-btn--admin {
          border-color: rgba(16, 185, 129, 0.36);
          color: #34d399;
        }

        .nav-icon-btn--user {
          border-color: rgba(59, 130, 246, 0.36);
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      id="site-header"
      className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
    >
      <nav className="navbar__inner container-site" aria-label="Main navigation">
        {/* Brand Logo */}
        <Link href="/" className="navbar__brand" aria-label="Rahul Tripathi — Balance by Design">
          <div className="navbar__logo-wrapper">
            <Image
              src="/sun-symbol.png"
              alt="Rahul Tripathi Golden Sun Emblem"
              width={48}
              height={48}
              className="navbar__sun-emblem"
              priority
            />
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__title">Rahul Tripathi</span>
            <span className="navbar__tagline">Balance by design</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar__links" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`navbar__link ${pathname === link.href ? 'navbar__link--active' : ''}`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    className="navbar__link-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Top Control Toolbar & CTA */}
        <div className="navbar__actions">
          <TopNavToolbar />
          <Link href="/contact" className="navbar__cta" id="nav-coffee-cta">
            <Coffee size={16} />
            <span>Let&apos;s Grab a Coffee</span>
          </Link>
          <button
            className="navbar__toggle"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-nav"
            className="navbar__mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <ul className="navbar__mobile-links" role="list">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`navbar__mobile-link ${pathname === link.href ? 'navbar__mobile-link--active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Link href="/contact" className="navbar__cta navbar__cta--mobile" id="mobile-coffee-cta">
              <Coffee size={16} />
              <span>Let&apos;s Grab a Coffee</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 16px 0;
          transition: all var(--duration-normal) var(--ease-smooth);
          background: transparent;
        }

        .navbar--scrolled {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 10px 0;
        }

        .navbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .navbar__brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          color: var(--text-primary);
          text-decoration: none;
          flex-shrink: 0;
          transition: opacity var(--duration-fast);
        }

        .navbar__logo-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2px;
        }

        .navbar__sun-emblem {
          width: 46px;
          height: 46px;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5));
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .navbar__brand:hover .navbar__sun-emblem {
          transform: scale(1.08) rotate(6deg);
          filter: drop-shadow(0 0 16px rgba(245, 158, 11, 0.8));
        }

        .navbar__brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }

        .navbar__title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .navbar__tagline {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 500;
          color: var(--accent-signature);
          letter-spacing: 0.03em;
          opacity: 0.9;
        }

        .navbar__links {
          display: none;
          list-style: none;
          gap: 8px;
        }

        @media (min-width: 1024px) {
          .navbar__links {
            display: flex;
          }
        }

        .navbar__link {
          position: relative;
          padding: 8px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: 8px;
          transition: color var(--duration-fast);
        }

        .navbar__link:hover {
          color: var(--text-primary);
        }

        .navbar__link--active {
          color: var(--text-primary);
        }

        .navbar__actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .navbar__cta {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--accent-signature), #FF9F5A);
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all var(--duration-normal) var(--ease-smooth);
          box-shadow: 0 4px 16px rgba(255, 138, 61, 0.25);
          white-space: nowrap;
        }

        @media (min-width: 768px) {
          .navbar__cta {
            display: flex;
          }
        }

        .navbar__cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255, 138, 61, 0.4);
        }

        .navbar__cta--mobile {
          display: flex;
          width: 100%;
          justify-content: center;
          margin-top: 16px;
        }

        .navbar__toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: none;
          background: transparent;
          color: var(--text-primary);
          cursor: pointer;
          border-radius: 8px;
          transition: background var(--duration-fast);
        }

        @media (min-width: 1024px) {
          .navbar__toggle {
            display: none;
          }
        }

        .navbar__toggle:hover {
          background: var(--accent-tech-dim);
        }

        .navbar__mobile {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          padding: 24px;
          background: var(--bg-card-solid);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border-subtle);
        }

        .navbar__mobile-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .navbar__mobile-link {
          display: block;
          padding: 14px 16px;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: 10px;
          transition: all var(--duration-fast);
        }

        .navbar__mobile-link:hover,
        .navbar__mobile-link--active {
          color: var(--text-primary);
          background: var(--accent-tech-dim);
        }
      `}</style>
    </header>
  );
}
