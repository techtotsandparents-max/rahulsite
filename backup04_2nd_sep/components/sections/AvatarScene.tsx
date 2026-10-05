"use client"

import { motion } from "framer-motion"
import { useWorldStore } from "@/stores/world.store"

export function AvatarScene() {
  const { avatarMode } = useWorldStore()

  return (
    <div className="relative w-full max-w-md h-[400px] flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6958FF 0%, transparent 70%)" }}
      />
      <motion.div
        className="relative z-10 text-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-6xl">👨‍💻</span>
        <p className="mt-4 text-sm text-indigo-300 font-mono">
          Mode: <span className="text-orange-400 capitalize">{avatarMode}</span>
        </p>
      </motion.div>
    </div>
  )
}
export default AvatarScene
