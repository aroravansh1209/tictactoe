"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, CheckCircle } from "lucide-react"

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  // Define styles based on toast type
  const bgColor = type === "error" ? "#fef2f2" : "#f0fdf4"
  const borderColor = type === "error" ? "#fecaca" : "#bbf7d0"
  const textColor = type === "error" ? "#b91c1c" : "#15803d"
  const iconColor = type === "error" ? "#ef4444" : "#22c55e"

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div
          className="p-4 rounded-lg shadow-lg flex items-center gap-3"
          style={{
            backgroundColor: bgColor,
            borderWidth: "1px",
            borderColor: borderColor,
          }}
        >
          {type === "error" ? (
            <AlertCircle className="h-5 w-5" style={{ color: iconColor }} />
          ) : (
            <CheckCircle className="h-5 w-5" style={{ color: iconColor }} />
          )}
          <p style={{ color: textColor }}>{message}</p>
          <button className="p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}