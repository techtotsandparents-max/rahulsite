'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Coffee, Mail, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/icons/SocialIcons';
import Navbar from '@/components/navigation/Navbar';
import SunsetFooter from '@/components/footer/SunsetFooter';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container-site">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}
          >
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--accent-tech)', marginBottom: '24px' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>

            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--accent-signature), #FF9F5A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(255, 138, 61, 0.3)',
              }}>
                <Coffee size={36} color="white" />
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '12px' }}>
                Let&apos;s Grab a Coffee
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Want to chat about cloud architecture, collaborate on a project, or just say hi? I&apos;d love to hear from you.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    style={{
                      padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      background: 'rgba(13, 27, 62, 0.5)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    style={{
                      padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      background: 'rgba(13, 27, 62, 0.5)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell me what's on your mind..."
                    style={{
                      padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      background: 'rgba(13, 27, 62, 0.5)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
                      resize: 'vertical', minHeight: '120px',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', padding: '16px', fontSize: '0.95rem' }}
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
              <a
                href="mailto:hello@rahultripathi.dev"
                className="glass-card glass-card-hover"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '48px', height: '48px', textDecoration: 'none', color: 'var(--text-secondary)',
                }}
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://github.com/rahultripathi"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card glass-card-hover"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '48px', height: '48px', textDecoration: 'none', color: 'var(--text-secondary)',
                }}
                aria-label="GitHub"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href="https://linkedin.com/in/rahultripathi"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card glass-card-hover"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '48px', height: '48px', textDecoration: 'none', color: 'var(--text-secondary)',
                }}
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href="https://x.com/rahultripathi"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card glass-card-hover"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '48px', height: '48px', textDecoration: 'none', color: 'var(--text-secondary)',
                }}
                aria-label="X"
              >
                <TwitterIcon size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <SunsetFooter />
    </>
  );
}
