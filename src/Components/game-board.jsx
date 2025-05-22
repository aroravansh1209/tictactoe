"use client"

import { motion, AnimatePresence } from "framer-motion"


export default function GameBoard({ board, onCellClick, winningCombination, blockedCells = [], darkMode }) {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto">
      {board.map((cell, index) => {
        // Determine cell styling based on state
        let cellStyle = {}
        const cellClasses = `aspect-square flex items-center justify-center text-4xl md:text-5xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all`

        if (winningCombination?.includes(index)) {
          cellStyle = {
            background: darkMode
              ? "linear-gradient(to right, #4c1d95, #831843)"
              : "linear-gradient(to right, #ddd6fe, #fbcfe8)",
            borderWidth: "2px",
            borderColor: darkMode ? "#a78bfa" : "#8b5cf6",
          }
        } else if (blockedCells.includes(index)) {
          cellStyle = {
            background: darkMode ? "#7f1d1d" : "#fee2e2",
            borderWidth: "2px",
            borderColor: darkMode ? "#ef4444" : "#ef4444",
          }
        }

        return (
          <motion.div
            key={index}
            className={cellClasses}
            style={cellStyle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCellClick(index)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <AnimatePresence mode="wait">
              {cell ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [-180, 0],
                    y: [0, -10, 0],
                  }}
                  exit={{ scale: 0, rotate: 180 }}
                  key={cell.timestamp}
                  className="w-full h-full flex items-center justify-center"
                  transition={{
                    duration: 0.5,
                    times: [0, 0.6, 1],
                    ease: "easeOut",
                  }}
                >
                  {cell.emoji}
                </motion.div>
              ) : blockedCells.includes(index) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0.5, 1],
                    scale: [1, 1.1, 0.9, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  style={{ color: darkMode ? "#f87171" : "#ef4444" }}
                >
                  🚫
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}