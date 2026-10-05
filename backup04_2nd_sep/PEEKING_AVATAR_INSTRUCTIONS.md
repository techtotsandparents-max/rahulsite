# Technical Specification & Implementation Guide: Upside-Down Peeking 3D Avatar & Rolling Cloud Footer

## Overview
This document provides step-by-step instructions for implementing the **Josh Comeau Style Upside-Down Peeking 3D Avatar & Rolling Cloud Footer** feature for `rahultech`.

---

## 📋 Feature Specification: Upside-Down Peeking 3D Avatar

### 1. The Rolling Cloud Boundary (SVG Path)
- **Position**: Fixed at the top edge of the footer container (`.footer-cloud-divider`).
- **Wave Path**: Organic, multi-arch rolling cloud SVG path (`<path d="...">`).
- **Fill & Seamless Transition**: Filled with `var(--footer-bg)`:
  - **Day View**: Sky Blue (`#82C2E5`)
  - **Night View**: Dark Navy (`#090F24`)
  - Creates a seamless transition from the page content into the footer section.

### 2. Dedicated 3D Peeking Avatar Asset
- **Asset**: Cropped 3D avatar image `public/assets/avatar-3d-head-only.png` (head, glasses, beard, hoodie shoulders; excluding laptop & lower stage).
- **Orientation**: Flipped 180° upside-down using `transform: rotate(180deg)` so the character appears to hang top-down from behind the cloud boundary.

### 3. Real-Time Scroll-Synced Motion (`Framer Motion`)
- **Scroll Detection**: Uses Framer Motion's `useScroll()` tied to the footer element or viewport scroll target.
- **Transform Mapping**: `useTransform(scrollYProgress, [0, 1], [-95, 0])`
- **Behavior**:
  - **Hidden Initial State**: Before reaching the footer trigger zone, vertical offset is `y: -95px` (hidden behind cloud curve).
  - **Scroll Down**: As user scrolls into the footer region, character slides down from behind the cloud wave (`y: -95px` → `y: 0px`).
  - **Scroll Up**: Scrolling back up retracts character into cloud boundary (`y: 0px` → `y: -95px`).

### 4. Layering, Masking & Clipping (`z-index`)
- **Cloud Wave SVG**: `z-index: 2` (acts as the masking curtain in front of the avatar).
- **Peeking Avatar**: `z-index: 1` (positioned behind the SVG cloud wave curtain).
- **Clipping Container**: `overflow: hidden` on `.footer-cloud-divider` wrapper to prevent overflow outside the cloud curve bounds.

---

## 🛠️ Step-by-Step Implementation Instructions

### Step 1: Add Avatar Asset
Place the transparent 3D avatar head asset into the public directory:
`public/assets/avatar-3d-head-only.png`

### Step 2: Implement Component (`components/PeekingAvatarFooter.tsx`)

```tsx
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export const PeekingAvatarFooter: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress relative to footer entry
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });

  // Map scroll progress (0 to 1) to vertical translate Y (-95px to 0px)
  const avatarY = useTransform(scrollYProgress, [0, 0.6], [-95, 0]);

  return (
    <footer ref={footerRef} className="relative w-full bg-[var(--footer-bg)] text-white pt-12 pb-8 transition-colors duration-300">
      {/* Top Rolling Cloud Divider & Peeking Avatar Container */}
      <div className="relative w-full overflow-hidden top-[-1px] leading-none pointer-events-none">
        
        {/* 180-degree Upside-Down Peeking 3D Avatar (z-index: 1) */}
        <motion.div
          style={{ y: avatarY }}
          className="absolute left-1/2 -translate-x-1/2 top-0 z-[1] w-24 h-24 md:w-32 md:h-32"
        >
          <Image
            src="/assets/avatar-3d-head-only.png"
            alt="Upside Down Peeking Avatar"
            width={128}
            height={128}
            className="w-full h-full object-contain transform rotate-180 drop-shadow-md"
          />
        </motion.div>

        {/* Rolling Cloud SVG Wave Curtain (z-index: 2) */}
        <svg
          className="relative block w-full h-16 md:h-24 z-[2] fill-[var(--footer-bg)]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Rahul Tripathi. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
```

---

## 🎨 Theme Tokens (`CSS Variables`)

Add or update CSS theme variables in `app/globals.css`:

```css
:root {
  --footer-bg: #82C2E5; /* Day View Sky Blue */
}

[data-theme='dark'],
.dark {
  --footer-bg: #090F24; /* Night View Dark Navy */
}
```

---

## ✅ Verification & Testing Checklist

1. **Scroll Motion**: Scroll down to the footer. Verify avatar smoothly drops down into view (`y: -95px` to `0px`).
2. **Reverse Scroll**: Scroll back up. Verify avatar smoothly retracts behind the cloud curtain.
3. **Theme Switch**: Switch between Light/Day Mode (`#82C2E5`) and Dark/Night Mode (`#090F24`). Ensure cloud SVG fill seamlessly blends with the footer background.
4. **Layering & Clipping**: Ensure avatar is clipped when retreating up inside `.footer-cloud-divider` and doesn't bleed out of bounds.
