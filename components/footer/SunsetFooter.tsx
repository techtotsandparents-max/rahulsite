'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, Volume2, Rss, Sun, Moon } from 'lucide-react';
import { GithubIcon, LinkedinIcon, YoutubeIcon, TwitterIcon } from '@/components/icons/SocialIcons';

// ─────────────────────────────────────────────
// The galaxy-divider is a fixed-height container (420px).
// The avatar anchor sits at the BOTTOM-CENTER of that container.
// overflow:hidden on galaxy-divider clips the avatar below the curtain line.
// avatarY drives the avatar from y=+200 (hidden below) → y=−80 (head+shoulders peeking above horizon).
// The foreground horizon SVG (z-index:4) acts as the solid curtain so the avatar appears to rise from behind it.
// ─────────────────────────────────────────────

export default function SunsetFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const footerRef = useRef<HTMLDivElement>(null);

  // scrollYProgress: 0 = footer just entered viewport bottom, 1 = footer bottom at viewport bottom
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });

  // Smooth spring for natural deceleration on the avatar movement
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // y=180: avatar completely hidden below curtain
  // y=-90: avatar has risen — head, shoulders, laptop all visible above horizon
  const avatarY = useTransform(smoothProgress, [0, 0.15, 0.9], [180, 180, -90]);

  // Subtle opacity: avatar fades in as it rises
  const avatarOpacity = useTransform(smoothProgress, [0, 0.2, 0.35], [0, 0, 1]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('site-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <footer
      ref={footerRef}
      id="site-footer"
      className="gf-footer"
      role="contentinfo"
    >
      {/* ═══════════════════════════════════════════════════════
          GALAXY SCENE — 420px tall cinematic space vista
          Stars → Nebula → Galaxy disc → Avatar → Curtain
         ═══════════════════════════════════════════════════════ */}
      <div className="gf-galaxy" aria-hidden="true">

        {/* ── Layer 0: Page-to-space transition gradient (z:6) ── */}
        <div className="gf-fade-top" />

        {/* ── Layer 1: Deep-space backdrop + rich star field (z:1) ── */}
        <svg
          className="gf-stars-svg"
          viewBox="0 0 1440 420"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* ── Deep space background ── */}
            <radialGradient id="gf-space-bg" cx="50%" cy="40%" r="70%">
              <stop offset="0%"   stopColor="#0F0A2E" />
              <stop offset="45%"  stopColor="#070518" />
              <stop offset="100%" stopColor="#020108" />
            </radialGradient>

            {/* ── Nebula layers ── */}
            <radialGradient id="gf-neb-violet" cx="35%" cy="55%" r="48%">
              <stop offset="0%"   stopColor="#6D28D9" stopOpacity="0.65" />
              <stop offset="35%"  stopColor="#4C1D95" stopOpacity="0.40" />
              <stop offset="75%"  stopColor="#1E0A3C" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#020108" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="gf-neb-cyan" cx="68%" cy="38%" r="42%">
              <stop offset="0%"   stopColor="#0891B2" stopOpacity="0.45" />
              <stop offset="40%"  stopColor="#0E7490" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#020108" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="gf-neb-pink" cx="52%" cy="60%" r="30%">
              <stop offset="0%"   stopColor="#DB2777" stopOpacity="0.30" />
              <stop offset="55%"  stopColor="#831843" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#020108" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="gf-neb-blue" cx="20%" cy="70%" r="35%">
              <stop offset="0%"   stopColor="#1D4ED8" stopOpacity="0.35" />
              <stop offset="60%"  stopColor="#1E40AF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#020108" stopOpacity="0" />
            </radialGradient>

            {/* ── Galaxy disc gradients ── */}
            <radialGradient id="gf-disc-outer" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#8B5CF6" stopOpacity="1.0" />
              <stop offset="25%"  stopColor="#7C3AED" stopOpacity="0.85" />
              <stop offset="55%"  stopColor="#5B21B6" stopOpacity="0.55" />
              <stop offset="80%"  stopColor="#2E1065" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#020108" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="gf-disc-mid" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#A78BFA" stopOpacity="1.0" />
              <stop offset="30%"  stopColor="#7C3AED" stopOpacity="0.80" />
              <stop offset="70%"  stopColor="#4C1D95" stopOpacity="0.40" />
              <stop offset="100%" stopColor="#020108" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="gf-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#FFFFFF"  stopOpacity="1.0" />
              <stop offset="12%"  stopColor="#F5F3FF"  stopOpacity="0.98" />
              <stop offset="30%"  stopColor="#DDD6FE"  stopOpacity="0.90" />
              <stop offset="55%"  stopColor="#A78BFA"  stopOpacity="0.65" />
              <stop offset="80%"  stopColor="#7C3AED"  stopOpacity="0.20" />
              <stop offset="100%" stopColor="#4C1D95"  stopOpacity="0" />
            </radialGradient>

            {/* ── Ground horizon blend (footer bg) ── */}
            <linearGradient id="gf-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0D0B1E" stopOpacity="0" />
              <stop offset="100%" stopColor="#0D0B1E" stopOpacity="1" />
            </linearGradient>

            {/* ── Blur filter for soft glows ── */}
            <filter id="gf-blur-sm" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="gf-blur-md" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
            <filter id="gf-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>

          {/* Deep space bg */}
          <rect width="1440" height="420" fill="url(#gf-space-bg)" />

          {/* Nebula colour washes */}
          <ellipse cx="500"  cy="210" rx="560" ry="260" fill="url(#gf-neb-violet)" />
          <ellipse cx="980"  cy="160" rx="460" ry="220" fill="url(#gf-neb-cyan)" />
          <ellipse cx="750"  cy="230" rx="380" ry="180" fill="url(#gf-neb-pink)" />
          <ellipse cx="200"  cy="290" rx="300" ry="150" fill="url(#gf-neb-blue)" />

          {/* ── Twinkling star field — 5 depth layers ── */}

          {/* Layer A: tiny distant stars */}
          <circle cx="28"   cy="18"  r="0.5" fill="#E9D5FF" opacity="0.4" />
          <circle cx="67"   cy="42"  r="0.6" fill="white"   opacity="0.5" />
          <circle cx="112"  cy="11"  r="0.5" fill="white"   opacity="0.45" />
          <circle cx="158"  cy="58"  r="0.6" fill="#BAE6FD" opacity="0.5" />
          <circle cx="204"  cy="22"  r="0.5" fill="white"   opacity="0.4" />
          <circle cx="248"  cy="74"  r="0.6" fill="white"   opacity="0.55" />
          <circle cx="293"  cy="36"  r="0.5" fill="white"   opacity="0.42" />
          <circle cx="341"  cy="9"   r="0.6" fill="#E9D5FF" opacity="0.48" />
          <circle cx="389"  cy="51"  r="0.5" fill="white"   opacity="0.44" />
          <circle cx="436"  cy="28"  r="0.6" fill="white"   opacity="0.52" />
          <circle cx="481"  cy="67"  r="0.5" fill="#BAE6FD" opacity="0.46" />
          <circle cx="527"  cy="14"  r="0.6" fill="white"   opacity="0.50" />
          <circle cx="574"  cy="43"  r="0.5" fill="white"   opacity="0.38" />
          <circle cx="619"  cy="79"  r="0.6" fill="#FDE68A" opacity="0.44" />
          <circle cx="665"  cy="24"  r="0.5" fill="white"   opacity="0.48" />
          <circle cx="712"  cy="58"  r="0.6" fill="white"   opacity="0.42" />
          <circle cx="758"  cy="17"  r="0.5" fill="#E9D5FF" opacity="0.50" />
          <circle cx="803"  cy="46"  r="0.6" fill="white"   opacity="0.46" />
          <circle cx="851"  cy="82"  r="0.5" fill="white"   opacity="0.40" />
          <circle cx="896"  cy="31"  r="0.6" fill="#BAE6FD" opacity="0.52" />
          <circle cx="942"  cy="13"  r="0.5" fill="white"   opacity="0.44" />
          <circle cx="989"  cy="57"  r="0.6" fill="white"   opacity="0.48" />
          <circle cx="1034" cy="22"  r="0.5" fill="#E9D5FF" opacity="0.42" />
          <circle cx="1080" cy="68"  r="0.6" fill="white"   opacity="0.50" />
          <circle cx="1127" cy="38"  r="0.5" fill="white"   opacity="0.44" />
          <circle cx="1173" cy="75"  r="0.6" fill="#FDE68A" opacity="0.46" />
          <circle cx="1219" cy="19"  r="0.5" fill="white"   opacity="0.52" />
          <circle cx="1264" cy="55"  r="0.6" fill="#BAE6FD" opacity="0.40" />
          <circle cx="1311" cy="29"  r="0.5" fill="white"   opacity="0.48" />
          <circle cx="1357" cy="72"  r="0.6" fill="white"   opacity="0.44" />
          <circle cx="1402" cy="41"  r="0.5" fill="#E9D5FF" opacity="0.50" />
          <circle cx="1432" cy="16"  r="0.6" fill="white"   opacity="0.42" />

          {/* Layer B: medium stars */}
          <circle cx="52"   cy="98"  r="0.9" fill="white"   opacity="0.70" />
          <circle cx="139"  cy="115" r="1.0" fill="#E9D5FF" opacity="0.78" />
          <circle cx="226"  cy="88"  r="0.8" fill="white"   opacity="0.65" />
          <circle cx="314"  cy="122" r="1.1" fill="#BAE6FD" opacity="0.80" />
          <circle cx="401"  cy="94"  r="0.9" fill="white"   opacity="0.72" />
          <circle cx="488"  cy="118" r="1.0" fill="#E9D5FF" opacity="0.68" />
          <circle cx="575"  cy="91"  r="0.8" fill="white"   opacity="0.75" />
          <circle cx="663"  cy="127" r="1.1" fill="#FDE68A" opacity="0.72" />
          <circle cx="750"  cy="100" r="0.9" fill="white"   opacity="0.78" />
          <circle cx="837"  cy="113" r="1.0" fill="#BAE6FD" opacity="0.65" />
          <circle cx="924"  cy="87"  r="0.8" fill="white"   opacity="0.70" />
          <circle cx="1012" cy="119" r="1.1" fill="#E9D5FF" opacity="0.80" />
          <circle cx="1099" cy="96"  r="0.9" fill="white"   opacity="0.68" />
          <circle cx="1186" cy="124" r="1.0" fill="#FDE68A" opacity="0.74" />
          <circle cx="1273" cy="89"  r="0.8" fill="white"   opacity="0.72" />
          <circle cx="1361" cy="116" r="1.1" fill="#BAE6FD" opacity="0.76" />
          <circle cx="1420" cy="102" r="0.9" fill="white"   opacity="0.66" />

          {/* Layer C: bright accent stars */}
          <circle cx="80"   cy="148" r="1.3" fill="#E9D5FF" opacity="0.88" />
          <circle cx="240"  cy="135" r="1.4" fill="white"   opacity="0.92" />
          <circle cx="400"  cy="158" r="1.2" fill="#BAE6FD" opacity="0.86" />
          <circle cx="560"  cy="140" r="1.5" fill="#FDE68A" opacity="0.85" />
          <circle cx="720"  cy="152" r="1.3" fill="white"   opacity="0.90" />
          <circle cx="880"  cy="138" r="1.4" fill="#E9D5FF" opacity="0.88" />
          <circle cx="1040" cy="155" r="1.2" fill="#BAE6FD" opacity="0.84" />
          <circle cx="1200" cy="143" r="1.5" fill="white"   opacity="0.92" />
          <circle cx="1360" cy="150" r="1.3" fill="#FDE68A" opacity="0.86" />

          {/* Layer D: large bright foreground stars with cross-glow */}
          <circle cx="160"  cy="62"  r="1.8" fill="white"   opacity="0.95" />
          <circle cx="160"  cy="62"  r="4.5" fill="white"   opacity="0.10" filter="url(#gf-blur-sm)" />
          <circle cx="490"  cy="44"  r="1.6" fill="#E9D5FF" opacity="0.92" />
          <circle cx="490"  cy="44"  r="4.0" fill="#E9D5FF" opacity="0.10" filter="url(#gf-blur-sm)" />
          <circle cx="820"  cy="30"  r="2.0" fill="#FDE68A" opacity="0.90" />
          <circle cx="820"  cy="30"  r="5.0" fill="#FDE68A" opacity="0.12" filter="url(#gf-blur-sm)" />
          <circle cx="1150" cy="55"  r="1.7" fill="#BAE6FD" opacity="0.94" />
          <circle cx="1150" cy="55"  r="4.2" fill="#BAE6FD" opacity="0.10" filter="url(#gf-blur-sm)" />
          <circle cx="1380" cy="38"  r="1.9" fill="white"   opacity="0.88" />
          <circle cx="1380" cy="38"  r="4.8" fill="white"   opacity="0.10" filter="url(#gf-blur-sm)" />

          {/* Layer E: deep mid-field stars */}
          <circle cx="75"   cy="178" r="0.8" fill="white" opacity="0.50" />
          <circle cx="188"  cy="165" r="0.7" fill="white" opacity="0.45" />
          <circle cx="302"  cy="182" r="0.9" fill="white" opacity="0.55" />
          <circle cx="415"  cy="168" r="0.7" fill="white" opacity="0.42" />
          <circle cx="529"  cy="185" r="0.8" fill="white" opacity="0.48" />
          <circle cx="642"  cy="170" r="0.9" fill="white" opacity="0.52" />
          <circle cx="756"  cy="180" r="0.8" fill="white" opacity="0.46" />
          <circle cx="869"  cy="166" r="0.7" fill="white" opacity="0.44" />
          <circle cx="983"  cy="184" r="0.9" fill="white" opacity="0.50" />
          <circle cx="1096" cy="172" r="0.8" fill="white" opacity="0.48" />
          <circle cx="1210" cy="181" r="0.7" fill="white" opacity="0.44" />
          <circle cx="1323" cy="169" r="0.9" fill="white" opacity="0.52" />
          <circle cx="1410" cy="178" r="0.8" fill="white" opacity="0.46" />

          {/* ── Galaxy disc system — centred at (720, 330) ── */}

          {/* Outermost wide disc halo */}
          <ellipse
            cx="720" cy="332" rx="740" ry="58"
            fill="url(#gf-disc-outer)" opacity="0.30"
            transform="rotate(-3 720 332)"
          />
          {/* Wide disc glow */}
          <ellipse
            cx="720" cy="330" rx="620" ry="46"
            fill="url(#gf-disc-outer)" opacity="0.45"
            transform="rotate(-3 720 330)"
            filter="url(#gf-blur-sm)"
          />
          {/* Mid disc */}
          <ellipse
            cx="720" cy="328" rx="460" ry="34"
            fill="url(#gf-disc-mid)" opacity="0.70"
            transform="rotate(-3 720 328)"
          />
          {/* Inner arm */}
          <ellipse
            cx="720" cy="326" rx="260" ry="20"
            fill="#7C3AED" opacity="0.60"
            transform="rotate(-3 720 326)"
          />
          {/* Core glow — large diffuse */}
          <ellipse
            cx="720" cy="324" rx="110" ry="16"
            fill="url(#gf-core-glow)" opacity="0.90"
            transform="rotate(-3 720 324)"
            filter="url(#gf-blur-sm)"
          />
          {/* Core white-hot pinpoint */}
          <ellipse
            cx="720" cy="324" rx="28" ry="8"
            fill="white" opacity="1.0"
          />
          {/* Core super-bright bloom */}
          <ellipse
            cx="720" cy="324" rx="55" ry="14"
            fill="white" opacity="0.55"
            filter="url(#gf-blur-md)"
          />
          {/* Core outer bloom */}
          <ellipse
            cx="720" cy="324" rx="120" ry="25"
            fill="#C4B5FD" opacity="0.30"
            filter="url(#gf-blur-md)"
          />

          {/* ── Spiral arm dust streaks — 3 pairs ── */}
          {/* Left arms */}
          <path d="M 60 348 Q 220 290, 480 310 Q 600 316, 660 320" stroke="#A78BFA" strokeWidth="2.5" strokeOpacity="0.40" fill="none" />
          <path d="M 40 362 Q 190 300, 450 318 Q 580 323, 650 322" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.28" fill="none" />
          <path d="M 100 340 Q 280 292, 520 312 Q 625 317, 672 320" stroke="#C4B5FD" strokeWidth="1.0" strokeOpacity="0.20" fill="none" />
          {/* Right arms */}
          <path d="M 1380 348 Q 1220 290, 960 310 Q 840 316, 780 320" stroke="#A78BFA" strokeWidth="2.5" strokeOpacity="0.40" fill="none" />
          <path d="M 1400 362 Q 1250 300, 990 318 Q 860 323, 790 322" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.28" fill="none" />
          <path d="M 1340 340 Q 1160 292, 920 312 Q 815 317, 768 320" stroke="#C4B5FD" strokeWidth="1.0" strokeOpacity="0.20" fill="none" />

          {/* Cosmic dust particles near core */}
          <circle cx="600" cy="320" r="2.5" fill="#C4B5FD" opacity="0.65" />
          <circle cx="635" cy="325" r="1.8" fill="#DDD6FE" opacity="0.60" />
          <circle cx="668" cy="318" r="2.2" fill="#EDE9FE" opacity="0.75" />
          <circle cx="700" cy="323" r="1.5" fill="white"   opacity="0.55" />
          <circle cx="740" cy="323" r="1.5" fill="white"   opacity="0.55" />
          <circle cx="772" cy="318" r="2.2" fill="#EDE9FE" opacity="0.75" />
          <circle cx="805" cy="325" r="1.8" fill="#DDD6FE" opacity="0.60" />
          <circle cx="840" cy="320" r="2.5" fill="#C4B5FD" opacity="0.65" />

          {/* ── Ground fill — seamless merge into footer ── */}
          <rect x="0" y="370" width="1440" height="50" fill="#0D0B1E" />
          <path d="M 0 355 Q 360 375, 720 372 Q 1080 369, 1440 355 L 1440 420 L 0 420 Z" fill="#0D0B1E" opacity="0.95" />

          {/* Shooting star */}
          <line x1="300" y1="55" x2="360" y2="85" stroke="white" strokeWidth="0.8" strokeOpacity="0.6">
            <animate attributeName="stroke-opacity" values="0;0.6;0" dur="4s" begin="2s" repeatCount="indefinite" />
            <animate attributeName="x1" values="300;290;300" dur="4s" begin="2s" repeatCount="indefinite" />
          </line>
          <line x1="1100" y1="30" x2="1170" y2="68" stroke="#BAE6FD" strokeWidth="0.7" strokeOpacity="0.5">
            <animate attributeName="stroke-opacity" values="0;0.5;0" dur="5.5s" begin="6s" repeatCount="indefinite" />
          </line>
        </svg>

        {/* ── Layer 2: Peeking 3D Avatar (z:3) ── */}
        {/*
            The anchor sits at bottom-center of .gf-galaxy.
            overflow:hidden on .gf-galaxy clips anything below the galaxy floor.
            The foreground curtain (z:4) sits on top so avatar peeks BEHIND it.
            y=180 → fully hidden; y=-90 → head+shoulders visible above curtain top.
        */}
        <div className="gf-peeker-anchor">
          <motion.div
            style={{ y: avatarY, opacity: avatarOpacity }}
            className="gf-peeker-motion"
          >
            {/* Purple glow ring beneath avatar — simulates galaxy core light */}
            <div className="gf-peeker-glow" />
            <Image
              src="/avatar-3d-head-only.png"
              alt="Rahul peeking from the galaxy horizon"
              width={220}
              height={220}
              className="gf-peeker-img"
              style={{ width: '200px', height: '200px' }}
              priority
            />
          </motion.div>
        </div>

        {/* ── Layer 3: Foreground horizon curtain (z:4) — the "ground" the avatar hides behind ── */}
        <svg
          className="gf-horizon-curtain"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Slightly curved horizon edge so it looks like a planet surface */}
          <path
            d="M -10 30 Q 360 52, 720 46 Q 1080 40, 1450 30 L 1450 90 L -10 90 Z"
            fill="#0D0B1E"
          />
          {/* Subtle horizon rim glow in purple */}
          <path
            d="M -10 30 Q 360 52, 720 46 Q 1080 40, 1450 30"
            stroke="#6D28D9"
            strokeWidth="1.5"
            strokeOpacity="0.55"
            fill="none"
          />
          <path
            d="M -10 31 Q 360 53, 720 47 Q 1080 41, 1450 31"
            stroke="#A78BFA"
            strokeWidth="0.6"
            strokeOpacity="0.30"
            fill="none"
          />
        </svg>

        {/* ── Layer 4: top fade transition (z:6) ── */}
        {/* already rendered as gf-fade-top div above */}
      </div>
      {/* END GALAXY SCENE */}

      {/* ═══════════════════════════════════════════════
          MAIN FOOTER CONTENT
         ═══════════════════════════════════════════════ */}
      <div className="gf-main">
        <div className="gf-container">

          <div className="gf-grid">

            {/* Column 1: Brand & Newsletter */}
            <div className="gf-col-brand">
              <Link href="/" className="gf-logo">
                Rahul Tripathi
              </Link>
              <p className="gf-tagline">
                Balance by design. Architecting in the cloud, exploring the world, and sharing what I learn.
              </p>

              <div className="gf-newsletter">
                <p className="gf-newsletter-label">Want to know when I publish new content?</p>
                {subscribed ? (
                  <p className="gf-subscribed">✓ Thanks for joining the newsletter!</p>
                ) : (
                  <form onSubmit={handleSubscribe} className="gf-newsletter-form">
                    <input
                      type="email"
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="gf-newsletter-input"
                    />
                    <button type="submit" className="gf-newsletter-btn" aria-label="Subscribe">
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Column 2: Category Links */}
            <div className="gf-col-links">
              <h4 className="gf-col-heading">Browse Category</h4>
              <ul className="gf-nav-list">
                <li><Link href="/blog">Cloud Architecture</Link></li>
                <li><Link href="/blog">Kubernetes &amp; DevOps</Link></li>
                <li><Link href="/travel">Travel Guides &amp; Stories</Link></li>
                <li><Link href="/youtube">Video Tutorials</Link></li>
              </ul>
            </div>

            {/* Column 3: General Links */}
            <div className="gf-col-links">
              <h4 className="gf-col-heading">General</h4>
              <ul className="gf-nav-list">
                <li><Link href="/about">About Me</Link></li>
                <li><Link href="/projects">Open Source Projects</Link></li>
                <li><Link href="/contact">Get in Touch</Link></li>
                <li><Link href="/rss.xml">RSS Feed</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="gf-bottom-bar">
            <div className="gf-legal">
              <p>© {new Date().getFullYear()} Rahul Tripathi. All rights reserved.</p>
              <div className="gf-legal-links">
                <Link href="/contact">Terms</Link>
                <span>•</span>
                <Link href="/contact">Privacy</Link>
              </div>
            </div>

            {/* Toolbar Icons */}
            <div className="gf-toolbar">
              <Link href="/blog" className="gf-tool-icon" aria-label="Search">
                <Search size={16} />
              </Link>
              <button className="gf-tool-icon" aria-label="Toggle Sound" onClick={() => {}}>
                <Volume2 size={16} />
              </button>
              <button
                onClick={toggleTheme}
                className={`gf-tool-icon gf-tool-icon--theme ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
                aria-label="Toggle Day / Night View"
                title="Toggle Day / Night View"
              >
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <a href="/rss.xml" className="gf-tool-icon" aria-label="RSS Feed">
                <Rss size={16} />
              </a>
              <a
                href="https://github.com/rahultripathi"
                target="_blank" rel="noopener noreferrer"
                className="gf-tool-icon" aria-label="GitHub"
              >
                <GithubIcon size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/rahul-tripathi-a05a1693"
                target="_blank" rel="noopener noreferrer"
                className="gf-tool-icon" aria-label="LinkedIn"
              >
                <LinkedinIcon size={16} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      <style jsx>{`

        /* ─── Footer wrapper ─── */
        .gf-footer {
          position: relative;
          margin-top: 80px;
          background: #0D0B1E;
          overflow: visible;
          color: white;
        }

        /* ─── Galaxy scene container ─── */
        /* overflow:hidden is the KEY — it clips the avatar below the curtain line */
        .gf-galaxy {
          position: relative;
          width: 100%;
          height: 420px;
          overflow: hidden;
          margin: 0;
          background: #020108;
        }

        /* ─── Star field SVG fills the full scene ─── */
        .gf-stars-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 1;
        }

        /* ─── Star twinkle animation ─── */
        .gf-stars-svg circle {
          animation: gf-twinkle 3.5s ease-in-out infinite alternate;
          transform-origin: center;
        }
        /* stagger each star with nth-child delays */
        .gf-stars-svg circle:nth-child(3n)   { animation-duration: 2.8s; animation-delay: -1.2s; }
        .gf-stars-svg circle:nth-child(3n+1) { animation-duration: 4.1s; animation-delay: -2.5s; }
        .gf-stars-svg circle:nth-child(3n+2) { animation-duration: 3.3s; animation-delay: -0.8s; }
        .gf-stars-svg circle:nth-child(5n)   { animation-duration: 2.1s; animation-delay: -3.0s; }
        .gf-stars-svg circle:nth-child(7n)   { animation-duration: 5.0s; animation-delay: -1.7s; }

        @keyframes gf-twinkle {
          0%   { opacity: 0.85; }
          50%  { opacity: 0.20; }
          100% { opacity: 0.90; }
        }

        /* ─── Top gradient: page → space (z:6 so it renders above nebula) ─── */
        .gf-fade-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 160px;
          background: linear-gradient(
            to bottom,
            var(--bg-base, #081229) 0%,
            rgba(2, 1, 8, 0.60) 60%,
            transparent 100%
          );
          z-index: 6;
          pointer-events: none;
        }

        /* ─── Peeking avatar ─── */
        /* Anchor at bottom-center. The y motion drives the avatar up/down.
           z-index:3 puts it ABOVE the star SVG (z:1) but BELOW the curtain (z:4). */
        .gf-peeker-anchor {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          pointer-events: none;
        }

        .gf-peeker-motion {
          display: flex;
          flex-direction: column;
          align-items: center;
          will-change: transform, opacity;
        }

        /* Glow ring sits underneath the avatar — glows with galaxy core colours */
        .gf-peeker-glow {
          width: 180px;
          height: 30px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at center,
            rgba(167, 139, 250, 0.95) 0%,
            rgba(124, 58, 237, 0.65) 35%,
            rgba(109, 40, 217, 0.25) 65%,
            transparent 80%
          );
          filter: blur(10px);
          margin-bottom: -16px;
          position: relative;
          z-index: 1;
          animation: gf-glow-pulse 2.6s ease-in-out infinite;
        }

        @keyframes gf-glow-pulse {
          0%, 100% { transform: scaleX(1.00); opacity: 0.85; }
          50%       { transform: scaleX(1.15); opacity: 1.00; }
        }

        .gf-peeker-img {
          width: 200px;
          height: 200px;
          object-fit: contain;
          position: relative;
          z-index: 2;
          /* Multi-layer galaxy glow on the avatar */
          filter:
            drop-shadow(0 0 12px rgba(167, 139, 250, 0.90))
            drop-shadow(0 0 32px rgba(124, 58, 237, 0.60))
            drop-shadow(0 0 64px rgba(109, 40, 217, 0.35))
            drop-shadow(0 24px 48px rgba(0, 0, 0, 0.70));
          transition: filter 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .gf-peeker-anchor:hover .gf-peeker-img {
          filter:
            drop-shadow(0 0 18px rgba(167, 139, 250, 1.00))
            drop-shadow(0 0 48px rgba(124, 58, 237, 0.80))
            drop-shadow(0 0 80px rgba(109, 40, 217, 0.50))
            drop-shadow(0 24px 48px rgba(0, 0, 0, 0.70));
          transform: translateY(-6px) scale(1.04);
        }

        /* ─── Foreground horizon curtain ─── */
        /* z:4 so it sits ABOVE the avatar (z:3) — avatar peeks from behind it */
        .gf-horizon-curtain {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 90px;
          z-index: 4;
          pointer-events: none;
          display: block;
        }

        /* ─── Main footer body ─── */
        .gf-main {
          background: #0D0B1E;
          padding: 44px 0 36px;
          position: relative;
          z-index: 0;
        }

        .gf-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .gf-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(109, 40, 217, 0.18);
        }

        @media (min-width: 768px) {
          .gf-grid {
            grid-template-columns: 2fr 1fr 1fr;
            gap: 52px;
          }
        }

        .gf-col-brand {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .gf-logo {
          font-family: var(--font-display, 'Inter', sans-serif);
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--text-primary, #F1F5F9);
          text-decoration: none;
          letter-spacing: -0.02em;
        }

        .gf-logo-dot { color: #7C3AED; }

        .gf-tagline {
          font-size: 0.88rem;
          color: var(--text-secondary, #94A3B8);
          max-width: 360px;
          line-height: 1.65;
        }

        /* Newsletter */
        .gf-newsletter {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .gf-newsletter-label {
          font-size: 0.80rem;
          color: var(--text-muted, #64748B);
        }

        .gf-newsletter-form {
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 360px;
        }

        .gf-newsletter-input {
          flex: 1;
          padding: 11px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(109, 40, 217, 0.28);
          color: var(--text-primary, #F1F5F9);
          font-size: 0.84rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .gf-newsletter-input:focus { border-color: #7C3AED; }

        .gf-newsletter-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #FF8A3D;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          flex-shrink: 0;
        }

        .gf-newsletter-btn:hover {
          background: #FF9F5A;
          transform: translateX(2px);
        }

        .gf-subscribed {
          font-size: 0.85rem;
          color: #4ADE80;
          font-weight: 600;
        }

        /* Nav columns */
        .gf-col-heading {
          font-family: var(--font-display, 'Inter', sans-serif);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-primary, #F1F5F9);
          margin-bottom: 16px;
        }

        .gf-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 11px;
          padding: 0;
          margin: 0;
        }

        .gf-nav-list a {
          font-size: 0.86rem;
          color: var(--text-secondary, #94A3B8);
          text-decoration: none;
          transition: color 0.2s;
        }

        .gf-nav-list a:hover { color: #A78BFA; }

        /* Bottom bar */
        .gf-bottom-bar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-top: 28px;
          align-items: center;
        }

        @media (min-width: 768px) {
          .gf-bottom-bar {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .gf-legal {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 0.78rem;
          color: var(--text-muted, #64748B);
        }

        .gf-legal-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gf-legal-links a {
          color: var(--text-muted, #64748B);
          text-decoration: none;
          transition: color 0.2s;
        }

        .gf-legal-links a:hover { color: var(--text-primary, #F1F5F9); }

        /* Toolbar */
        .gf-toolbar {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gf-tool-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(109, 40, 217, 0.22);
          color: var(--text-secondary, #94A3B8);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .gf-tool-icon:hover {
          color: var(--text-primary, #F1F5F9);
          border-color: #7C3AED;
          background: rgba(124, 58, 237, 0.18);
          transform: translateY(-2px);
        }

        .gf-tool-icon--theme.is-dark {
          color: #A78BFA;
          border-color: rgba(167, 139, 250, 0.40);
        }

        .gf-tool-icon--theme.is-light {
          color: #FBBF24;
          border-color: rgba(251, 191, 36, 0.40);
        }

        /* ─── Mobile ─── */
        @media (max-width: 680px) {
          .gf-galaxy { height: 300px; }
          .gf-peeker-img {
            width: 150px;
            height: 150px;
          }
          .gf-peeker-glow { width: 130px; }
        }
      `}</style>
    </footer>
  );
}
