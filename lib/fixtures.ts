/**
 * Development Fixtures — RahulTripathi.dev
 *
 * All fixture data is marked with isPlaceholder: true.
 * Production data MUST come from live APIs (YouTube Data API v3, PostgreSQL).
 * Never display fake production numbers.
 */

export interface BlogFixture {
  slug: string;
  title: string;
  excerpt: string;
  category: 'CLOUD_ARCHITECTURE' | 'AI_LESSONS' | 'TRAVEL_JOURNAL' | 'CAREER';
  readTime: number;
  publishedAt: string;
  externalUrl?: string;
  isPlaceholder: true;
}

export interface TravelFixture {
  slug: string;
  destination: string;
  country: string;
  excerpt: string;
  visitedAt: string;
  isPlaceholder: true;
}

export interface VideoFixture {
  youtubeId: string;
  title: string;
  topic: string;
  duration: string;
  publishedAt: string;
  isPlaceholder: true;
}

export interface ProjectFixture {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  isPlaceholder: true;
}

// ============================================================
// Blog Fixtures (Including Curated Front-End & System Design Articles)
// ============================================================

export const blogFixtures: BlogFixture[] = [
  {
    slug: 'designing-event-driven-microservices-on-azure',
    title: 'Designing Event-Driven Microservices on Azure',
    excerpt: 'A deep dive into building scalable event-driven architectures using Azure Service Bus, Event Grid, and Functions.',
    category: 'CLOUD_ARCHITECTURE',
    readTime: 12,
    publishedAt: '2026-08-15',
    isPlaceholder: true,
  },
  {
    slug: 'getting-started-with-anchor-positioning',
    title: 'Getting Started with Anchor Positioning',
    excerpt: 'For decades, sticking one element to another for tooltips and nested menus was challenging. Discover CSS Anchor Positioning.',
    category: 'AI_LESSONS',
    readTime: 8,
    publishedAt: '2026-07-06',
    externalUrl: 'https://www.joshwcomeau.com/css/anchor-positioning/',
    isPlaceholder: true,
  },
  {
    slug: 'css-vs-javascript-animation-performance',
    title: 'CSS vs. JavaScript: Performance Nuances',
    excerpt: 'Comparing JS animation libraries against native CSS transitions and keyframe animations to evaluate frame-budget costs.',
    category: 'AI_LESSONS',
    readTime: 10,
    publishedAt: '2026-05-26',
    externalUrl: 'https://www.joshwcomeau.com/animation/css-vs-javascript/',
    isPlaceholder: true,
  },
  {
    slug: 'scroll-driven-animations-without-javascript',
    title: 'Scroll-Driven Animations in Native CSS',
    excerpt: 'Using the Animation Timeline API to craft dynamic scroll-driven micro-interactions without single lines of JavaScript.',
    category: 'AI_LESSONS',
    readTime: 9,
    publishedAt: '2026-04-28',
    externalUrl: 'https://www.joshwcomeau.com/animation/scroll-driven-animations/',
    isPlaceholder: true,
  },
  {
    slug: 'terraform-azure-landing-zones',
    title: 'Terraform Azure Landing Zones: From Zero to Production',
    excerpt: 'Step-by-step guide to implementing Azure Cloud Adoption Framework landing zones with Terraform modules.',
    category: 'CLOUD_ARCHITECTURE',
    readTime: 15,
    publishedAt: '2026-04-01',
    isPlaceholder: true,
  },
  {
    slug: 'understanding-transformer-architectures',
    title: 'Understanding Transformer Architectures for Engineers',
    excerpt: 'Breaking down attention mechanisms, tokenization, and positional encoding for software engineers.',
    category: 'AI_LESSONS',
    readTime: 18,
    publishedAt: '2026-03-20',
    isPlaceholder: true,
  },
  {
    slug: 'the-post-developer-era-and-ai',
    title: 'The Post-Developer Era: AI & Software Engineering',
    excerpt: 'Revisiting predictions on AI eliminating engineering jobs and examining where software craftsmanship is headed.',
    category: 'CAREER',
    readTime: 11,
    publishedAt: '2025-04-14',
    externalUrl: 'https://www.joshwcomeau.com/blog/the-post-developer-era/',
    isPlaceholder: true,
  },
  {
    slug: 'remote-work-from-bali',
    title: 'Remote Work from Bali: An Engineer\'s Guide',
    excerpt: 'Lessons learned from three months of engineering leadership while working remotely from Bali.',
    category: 'TRAVEL_JOURNAL',
    readTime: 8,
    publishedAt: '2025-02-10',
    isPlaceholder: true,
  },
];

// ============================================================
// Travel Fixtures
// ============================================================

export const travelFixtures: TravelFixture[] = [
  {
    slug: 'japan-tokyo-osaka',
    destination: 'Tokyo & Osaka',
    country: 'Japan',
    excerpt: 'Cherry blossoms, bullet trains, and the intersection of tradition and technology.',
    visitedAt: '2026-04-15',
    isPlaceholder: true,
  },
  {
    slug: 'iceland-ring-road',
    destination: 'Ring Road Adventure',
    country: 'Iceland',
    excerpt: 'Driving the entire Ring Road — glaciers, waterfalls, and volcanic landscapes.',
    visitedAt: '2026-03-01',
    isPlaceholder: true,
  },
  {
    slug: 'swiss-alps-retreat',
    destination: 'Swiss Alps',
    country: 'Switzerland',
    excerpt: 'Mountain retreats, scenic trains, and the best chocolate in the world.',
    visitedAt: '2025-12-20',
    isPlaceholder: true,
  },
];

// ============================================================
// Video Lecture Fixtures
// ============================================================

export const videoFixtures: VideoFixture[] = [
  {
    youtubeId: 'placeholder-1',
    title: 'Building LLM Applications from Scratch',
    topic: 'LLMs',
    duration: '1:45:30',
    publishedAt: '2026-07-15',
    isPlaceholder: true,
  },
  {
    youtubeId: 'placeholder-2',
    title: 'System Design: Distributed Caching at Scale',
    topic: 'System Design',
    duration: '52:10',
    publishedAt: '2026-06-28',
    isPlaceholder: true,
  },
  {
    youtubeId: 'placeholder-3',
    title: 'Deep Dive: Azure Kubernetes Service Architecture',
    topic: 'Cloud Architecture',
    duration: '1:12:45',
    publishedAt: '2026-06-10',
    isPlaceholder: true,
  },
  {
    youtubeId: 'placeholder-4',
    title: 'Attention Is All You Need — Paper Walkthrough',
    topic: 'Deep Learning',
    duration: '2:05:20',
    publishedAt: '2026-05-22',
    isPlaceholder: true,
  },
];

// ============================================================
// Project Fixtures
// ============================================================

export const projectFixtures: ProjectFixture[] = [
  {
    slug: 'cloud-architecture-patterns',
    title: 'Cloud Architecture Patterns',
    description: 'A collection of production-ready cloud architecture patterns implemented with Terraform and Azure.',
    tech: ['Terraform', 'Azure', 'Kubernetes', 'Bicep'],
    githubUrl: 'https://github.com/rahultripathi',
    isPlaceholder: true,
  },
  {
    slug: 'ai-teaching-platform',
    title: 'AI Teaching Platform',
    description: 'Open-source Karpathy-style video lecture platform with search, transcripts, and bookmarks.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Azure AI'],
    githubUrl: 'https://github.com/rahultripathi',
    isPlaceholder: true,
  },
  {
    slug: 'travel-journal-engine',
    title: 'Travel Journal Engine',
    description: 'A serverless travel journaling platform with photo galleries and interactive maps.',
    tech: ['React', 'Azure Blob Storage', 'Mapbox', 'Prisma'],
    githubUrl: 'https://github.com/rahultripathi',
    isPlaceholder: true,
  },
];

// ============================================================
// Quick Card Data (Non-placeholder — Authored Content)
// ============================================================

export const quickCards = [
  {
    title: 'Blog',
    description: 'In-depth tutorials on cloud, architecture, and engineering.',
    icon: '📝',
    href: '/blog',
  },
  {
    title: 'Travel',
    description: 'Stories, guides, and tips from around the world.',
    icon: '🧳',
    href: '/travel',
  },
  {
    title: 'YouTube',
    description: 'Videos on cloud, tech, and real-world learnings.',
    icon: '▶️',
    href: '/youtube',
  },
  {
    title: 'Projects',
    description: 'Open-source projects and architecture samples.',
    icon: '🚀',
    href: '/projects',
  },
  {
    title: 'About',
    description: 'More about me, my journey, and what drives me.',
    icon: '👤',
    href: '/about',
  },
];

// ============================================================
// Social Links (Verified — Non-placeholder)
// ============================================================

export const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/rahultripathi', icon: 'github' },
  { name: 'YouTube', url: 'https://youtube.com/@rahultripathi', icon: 'youtube' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/rahultripathi', icon: 'linkedin' },
  { name: 'X / Twitter', url: 'https://x.com/rahultripathi', icon: 'twitter' },
  { name: 'Instagram', url: 'https://instagram.com/rahultripathi', icon: 'instagram' },
];

// ============================================================
// Navigation Links
// ============================================================

export const navLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Travel', href: '/travel' },
  { label: 'YouTube', href: '/youtube' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
];
