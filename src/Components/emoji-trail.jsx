"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"


export default function EmojiTrail({ emojis, currentPlayer }) {
  const [trail, setTrail] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Add new emoji to trail
      const newEmoji = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }

      setTrail((prev) => [...prev, newEmoji].slice(-15)) // Keep only the last 15 emojis
    }

    // Throttle the event to avoid too many updates
    let lastUpdate = 0
    const throttledUpdateMousePosition = (e) => {
      const now = Date.now()
      if (now - lastUpdate > 50) {
        // Update every 50ms
        lastUpdate = now
        updateMousePosition(e)
      }
    }

    window.addEventListener("mousemove", throttledUpdateMousePosition)

    return () => {
      window.removeEventListener("mousemove", throttledUpdateMousePosition)
    }
  }, [emojis])

  // Define player color
  const playerColor = currentPlayer === 1 ? "#9333ea" : "#db2777" // Purple or pink

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trail.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-xl"
            initial={{
              opacity: 0.8,
              scale: 0.5,
              x: item.x,
              y: item.y,
            }}
            animate={{
              opacity: 0,
              scale: 0,
              x: item.x,
              y: item.y + 20,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            style={{
              color: playerColor,
              textShadow: "0 0 5px rgba(255,255,255,0.5)",
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
