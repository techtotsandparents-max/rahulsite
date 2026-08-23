'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Coffee } from 'lucide-react';
import { navLinks } from '@/lib/fixtures';

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
        {/* Brand */}
        <Link href="/" className="navbar__brand" aria-label="RahulTripathi.dev Home">
          <span className="navbar__logo" aria-hidden="true">&lt;/&gt;</span>
          <span className="navbar__title">RahulTripathi<span className="navbar__title-dot">.dev</span></span>
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

        {/* CTA & Mobile Toggle */}
        <div className="navbar__actions">
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
          background: rgba(8, 18, 41, 0.85);
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
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-primary);
          text-decoration: none;
          flex-shrink: 0;
          transition: opacity var(--duration-fast);
        }

        .navbar__brand:hover {
          opacity: 0.85;
        }

        .navbar__logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-tech), #8B7AFF);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: var(--font-mono);
        }

        .navbar__title-dot {
          color: var(--accent-tech);
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
          background: rgba(8, 18, 41, 0.97);
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
