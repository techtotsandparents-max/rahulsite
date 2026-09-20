'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, Calendar, User } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import SunsetFooter from '@/components/footer/SunsetFooter';
import { blogFixtures } from '@/lib/fixtures';

const categoryColors: Record<string, string> = {
  CLOUD_ARCHITECTURE: '#6958FF',
  AI_LESSONS: '#00C9A7',
  TRAVEL_JOURNAL: '#FF8A3D',
  CAREER: '#FFD93D',
};

const categoryLabels: Record<string, string> = {
  CLOUD_ARCHITECTURE: 'Cloud Architecture',
  AI_LESSONS: 'AI Lessons',
  TRAVEL_JOURNAL: 'Travel Journal',
  CAREER: 'Career',
};

export default function BlogSlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const post = blogFixtures.find((p) => p.slug === slug) || {
    slug,
    title: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Article',
    excerpt: 'Detailed article content, architectural patterns, and production engineering practices.',
    category: 'CLOUD_ARCHITECTURE' as const,
    readTime: 10,
    publishedAt: '2026-08-15',
    isPlaceholder: true as const,
  };

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container-site" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--accent-tech)', marginBottom: '24px' }}>
              <ArrowLeft size={16} /> Back to Articles
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px',
                borderRadius: '6px', border: `1px solid ${categoryColors[post.category]}40`,
                color: categoryColors[post.category], textTransform: 'uppercase', letterSpacing: '0.03em',
              }}>
                <Tag size={12} /> {categoryLabels[post.category]}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Clock size={12} /> {post.readTime} min read
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '20px' }}>
              {post.title}
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
              {post.excerpt}
            </p>

            {/* Author Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-tech), #8B7AFF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              }}>
                👨‍💻
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Rahul Tripathi</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Cloud Architect &amp; Author</div>
              </div>
            </div>

            {/* Article Content */}
            <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '8px' }}>
                Overview &amp; Architectural Objectives
              </h2>
              <p>
                In high-throughput cloud environments, designing resilient system topologies requires decoupled components, idempotent messaging pipelines, and strict observability contracts.
              </p>
              
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '16px' }}>
                Key Technical Patterns
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Event Sourcing &amp; CQRS</strong>: Separating read and write state stores to achieve sub-millisecond query performance.</li>
                <li><strong>Dead Letter Queueing &amp; Retry Policies</strong>: Handling transient failures with exponential backoff and automated alerting.</li>
                <li><strong>Azure Infrastructure as Code</strong>: Modular Terraform templates enforcing zero-trust networking and Azure Key Vault secret management.</li>
              </ul>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '16px' }}>
                Conclusion
              </h2>
              <p>
                Building production systems on Azure demands zero reliance on magic or hardcoded values. By leveraging declarative IaC modules and robust telemetry, cloud architectures maintain reliability at scale.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <SunsetFooter />
    </>
  );
}
