'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

export function ParallaxStage({ children }: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Map mouse movement to slight offset (-15px to +15px)
  const characterX = useTransform(mouseX, [-500, 500], [-15, 15]);
  const characterY = useTransform(mouseY, [-500, 500], [-10, 10]);

  function handleMouseMove(e: React.MouseEvent) {
    const { clientX, clientY } = e;
    mouseX.set(clientX - window.innerWidth / 2);
    mouseY.set(clientY - window.innerHeight / 2);
  }

  return (
    <div onMouseMove={handleMouseMove} className="hero-stage">
      <motion.div style={{ x: characterX, y: characterY }}>
        {children}
      </motion.div>
    </div>
  );
}
