'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Camera } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import SunsetFooter from '@/components/footer/SunsetFooter';
import { travelFixtures } from '@/lib/fixtures';

export default function TravelSlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const trip = travelFixtures.find((t) => t.slug === slug) || {
    slug,
    destination: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Destination',
    country: 'Global Destination',
    excerpt: 'Exploring culture, scenic landscapes, and remote work spots.',
    visitedAt: '2026-04-15',
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
            <Link href="/travel" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--accent-tech)', marginBottom: '24px' }}>
              <ArrowLeft size={16} /> Back to Travel Journal
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--accent-signature)', fontWeight: 600 }}>
                <MapPin size={15} /> {trip.country}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Calendar size={13} /> {new Date(trip.visitedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '20px' }}>
              {trip.destination}
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '40px' }}>
              {trip.excerpt}
            </p>

            {/* Travel Photo Gallery Header */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--accent-signature)" /> Photo Highlights &amp; Journal Notes
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <p>
                  Traveling while maintaining peak engineering output requires finding the optimal balance between immersion and focused work sprints.
                </p>
                <p>
                  Key takeaways from this journey: choosing accommodations with high-speed reliable wifi, structuring work around local timezone overlaps, and capturing stories along the way.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <SunsetFooter />
    </>
  );
}
