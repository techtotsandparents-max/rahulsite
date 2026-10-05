'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Plane, Camera, Coffee } from 'lucide-react';
import { GithubIcon, YoutubeIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/icons/SocialIcons';
import Navbar from '@/components/navigation/Navbar';
import SunsetFooter from '@/components/footer/SunsetFooter';

const timeline = [
  { icon: Briefcase, title: 'Cloud Architect', desc: 'Designing scalable cloud-native solutions on Azure', color: '#6958FF' },
  { icon: Camera, title: 'Content Creator', desc: 'Sharing knowledge through blogs, videos, and talks', color: '#FF8A3D' },
  { icon: Plane, title: 'Traveller', desc: 'Exploring the world while working remotely', color: '#00C9A7' },
];

const socialIcons = [
  { name: 'GitHub', Icon: GithubIcon, url: 'https://github.com/rahultripathi' },
  { name: 'YouTube', Icon: YoutubeIcon, url: 'https://youtube.com/@rahultripathi' },
  { name: 'LinkedIn', Icon: LinkedinIcon, url: 'https://linkedin.com/in/rahultripathi' },
  { name: 'X', Icon: TwitterIcon, url: 'https://x.com/rahultripathi' },
  { name: 'Instagram', Icon: InstagramIcon, url: 'https://instagram.com/rahultripathi' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container-site">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}
          >
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--accent-tech)', marginBottom: '24px' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '8px' }}>
              About
            </h1>

            {/* Bio */}
            <div className="glass-card" style={{ padding: '32px', marginTop: '32px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '20px',
                  background: 'linear-gradient(135deg, var(--accent-tech), #8B7AFF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', flexShrink: 0,
                }}>
                  👨‍💻
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>
                    Rahul Tripathi
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> Cloud Architect • Builder • Traveller • Creator
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <p>
                  I build technology, explore the world, and share what I learn. As a Cloud Architect, I design and implement scalable cloud-native solutions on Azure, working with Terraform, Kubernetes, and modern distributed systems.
                </p>
                <p>
                  Through my blog and YouTube channel, I share in-depth tutorials on cloud architecture, AI/ML concepts, and system design patterns — inspired by the teaching style of Andrej Karpathy.
                </p>
                <p>
                  When I&apos;m not architecting cloud solutions, I&apos;m exploring new destinations, documenting my travels, and finding the best remote work spots around the globe.
                </p>
              </div>
            </div>

            {/* What I Do */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
              What I Do
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
              {timeline.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="glass-card glass-card-hover"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `${item.color}15`, border: `1px solid ${item.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, flexShrink: 0,
                  }}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '2px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Connect */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
              Let&apos;s Connect
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card glass-card-hover"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 20px', textDecoration: 'none', color: 'var(--text-secondary)',
                  }}
                >
                  <social.Icon size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{social.name}</span>
                </a>
              ))}
            </div>

            <Link
              href="/contact"
              className="btn btn-signature"
              id="about-coffee-link"
              style={{ display: 'inline-flex' }}
            >
              <Coffee size={18} />
              Let&apos;s Grab a Coffee
            </Link>
          </motion.div>
        </div>
      </main>
      <SunsetFooter />
    </>
  );
}
