import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Code2, AlertTriangle, ShieldCheck, Mail, Scale } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import SunsetFooter from '@/components/footer/SunsetFooter';

export const metadata: Metadata = {
  title: 'Terms of Use — Rahul Tripathi',
  description: 'Terms of Use for Rahul Tripathi (rahul.tripathies.com). Permitted use, code licensing, and educational disclaimers.',
};

export default function TermsOfUsePage() {
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
                background: 'rgba(255, 138, 61, 0.12)',
                border: '1px solid rgba(255, 138, 61, 0.3)',
                color: 'var(--accent-signature)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <FileText size={14} /> Terms of Service
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
              Terms of Use
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
                Welcome to <strong>Rahul Tripathi</strong> (operating <em>rahul.tripathies.com</em>, &quot;the Site&quot;, &quot;we&quot;, or &quot;our&quot;). By accessing, viewing, or interacting with this website, you agree to comply with and be legally bound by these Terms of Use and our <Link href="/privacy" style={{ color: 'var(--accent-tech)', textDecoration: 'underline' }}>Privacy Policy</Link>.
              </p>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Scale size={20} color="#FF8A3D" /> 1. Scope of the Platform
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                This site provides technical tutorials, cloud architecture patterns, software engineering guides, travel writings, and open-source project documentation for educational, personal, and professional reference.
              </p>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Code2 size={20} color="#6958FF" /> 2. Content &amp; Code Usage
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                We believe in open learning and knowledge sharing:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Code Snippets:</strong> Architecture patterns and code snippets are provided for your learning. You may adapt them into your own projects subject to individual open-source repository licenses.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Proprietary Content:</strong> Original articles, branding, logos (&quot;Rahul Tripathi&quot;, &quot;Balance by Design&quot;), and photographs are protected by copyright. They may not be republished or sold without prior written permission.</li>
              </ul>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#00C9A7" /> 3. Acceptable Use
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                You agree not to use the Site to:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                <li>Engage in illegal, harmful, harassing, or fraudulent behavior.</li>
                <li>Attempt unauthorized access to our servers, database, or cloud infrastructure.</li>
                <li>Launch automated denial-of-service (DoS) attacks or aggressive scraping routines.</li>
                <li>Impersonate Rahul Tripathi or associated projects.</li>
              </ul>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={20} color="#FFD93D" /> 4. Disclaimer of Warranties
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                ALL INFORMATION, TUTORIALS, TERRAFORM SCRIPTS, AND ARCHITECTURAL SAMPLES ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. Cloud platforms and SDKs change frequently. You are responsible for independently validating, testing, and securing any architecture or script before deploying to production environments.
              </p>
            </section>

            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={20} color="#FF8A3D" /> 5. Questions &amp; Inquiries
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                For permissions, questions, or comments regarding these Terms of Use, please reach out directly:
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 138, 61, 0.08)',
                  border: '1px solid rgba(255, 138, 61, 0.25)',
                  width: 'fit-content',
                }}
              >
                <Mail size={18} color="var(--accent-signature)" />
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
