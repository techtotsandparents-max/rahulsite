import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Mail, Lock, Eye, Database, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import SunsetFooter from '@/components/footer/SunsetFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy — Rahul Tripathi',
  description: 'Privacy Policy for Rahul Tripathi (rahul.tripathies.com). Learn how we protect and handle your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ paddingTop: '110px', minHeight: '100vh', paddingBottom: '80px' }}>
        <div className="container-site" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: 'var(--accent-tech)',
              marginBottom: '24px',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(105, 88, 255, 0.12)',
                border: '1px solid rgba(105, 88, 255, 0.3)',
                color: 'var(--accent-tech)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <Shield size={14} /> Legal &amp; Data Protection
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: '12px',
              }}
            >
              Privacy Policy
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Last Updated: April 2026 • Effective immediately
            </p>
          </div>

          {/* Main Card */}
          <div
            className="glass-card"
            style={{
              padding: 'clamp(24px, 5vw, 44px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              lineHeight: 1.7,
            }}
          >
            <section>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                At <strong>Rahul Tripathi</strong> (operating <em>rahul.tripathies.com</em>, collectively referred to as &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we are committed to protecting your personal information and respecting your privacy. This policy outlines how your data is handled when you visit our site, read our articles, or interact with our services.
              </p>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Eye size={20} color="#6958FF" /> 1. Information We Collect
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                We collect information strictly necessary to provide a smooth, secure, and personalized experience:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Contact Inquiries:</strong> When you subscribe to our newsletter or reach out via our contact form, we collect your name and email address.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Authentication:</strong> If you sign in via GitHub or Azure Active Directory, we receive basic public profile information authorized by your account.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Preferences:</strong> We store your chosen Day (Light) / Night (Dark) visual theme in your browser local storage.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Technical Logs:</strong> Standard web server logs collect non-sensitive browser type, operating system, and timestamp information. We respect Do Not Track signals.</li>
              </ul>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#00C9A7" /> 2. How We Use Information
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                The information we collect is used solely to:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                <li>Deliver technical articles, tutorials, open-source projects, and travel journals.</li>
                <li>Send occasional email newsletters and announcements you have opted into.</li>
                <li>Respond directly to your questions, feedback, and technical collaboration requests.</li>
                <li>Protect against security vulnerabilities, spam, and platform abuse.</li>
              </ul>
              <p style={{ color: 'var(--text-primary)', marginTop: '12px', fontWeight: 500 }}>
                We never sell, rent, or trade your personal information to third parties.
              </p>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={20} color="#FF8A3D" /> 3. Third-Party Services
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                We utilize reliable cloud platforms to host and operate this site:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', marginTop: '10px' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Microsoft Azure:</strong> Cloud infrastructure, web hosting, and identity management.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>GitHub:</strong> Open-source project repositories and OAuth authentication.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Embedded Content:</strong> YouTube video embeds and social feeds operate under their respective privacy policies.</li>
              </ul>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={20} color="#FFD93D" /> 4. Data Security &amp; Retention
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                All traffic is strictly encrypted using modern HTTPS/TLS with high-security headers. Data is retained only as long as necessary to provide requested services or respond to communications.
              </p>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={20} color="#6958FF" /> 5. Contacting Us
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                If you have any questions, concerns, or requests regarding your personal information, please email us directly:
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(105, 88, 255, 0.08)',
                  border: '1px solid rgba(105, 88, 255, 0.25)',
                  width: 'fit-content',
                }}
              >
                <Mail size={18} color="var(--accent-tech)" />
                <a
                  href="mailto:support@tripathies.com"
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                  }}
                >
                  support@tripathies.com
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
      <SunsetFooter />
    </>
  );
}
