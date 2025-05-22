import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

export default function PowerUpModal({ powerUp, onClose, onUse, board, currentPlayer, darkMode }) {
  const [mounted, setMounted] = useState(false)
  const [selectedCells, setSelectedCells] = useState([])
  const opponentPlayer = currentPlayer === 1 ? 2 : 1

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const handleUse = () => {
    switch (powerUp.effect) {
      case "extraTurn":
        onUse("extraTurn")
        onClose()
        break

      case "swapEmoji":
        if (selectedCells.length === 2) {
          onUse("swapEmoji", { from: selectedCells[0], to: selectedCells[1] })
          onClose()
        }
        break

      case "blockCell":
        if (selectedCells.length === 1) {
          onUse("blockCell", { cell: selectedCells[0] })
          onClose()
        }
        break

      case "peekNext":
        onUse("peekNext")
        onClose()
        break
    }
  }

  const handleCellClick = (index) => {
    if (powerUp.effect === "swapEmoji") {
      // Can only select opponent's emojis
      if (board[index] && board[index].player === opponentPlayer) {
        if (selectedCells.includes(index)) {
          setSelectedCells(selectedCells.filter((cell) => cell !== index))
        } else if (selectedCells.length < 2) {
          setSelectedCells([...selectedCells, index])
        }
      }
    } else if (powerUp.effect === "blockCell") {
      // Can only select empty cells
      if (!board[index]) {
        setSelectedCells([index])
      }
    }
  }

  if (!mounted) return null

  // Define colors based on dark mode
  const purpleColor = darkMode ? "#a78bfa" : "#8b5cf6"
  const borderColor = darkMode ? "#1f2937" : "#e5e7eb"
  const textColor = darkMode ? "#9ca3af" : "#6b7280"
  const bgGradient = darkMode
    ? "linear-gradient(to right, #7c3aed, #be185d)"
    : "linear-gradient(to right, #8b5cf6, #ec4899)"
  const disabledBg = darkMode ? "#374151" : "#d1d5db"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        className={`${darkMode ? "bg-gray-900 text-white" : "bg-white"} rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-4 flex justify-between items-center" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{powerUp.emoji}</span>
            <div>
              <h2 className="text-xl font-bold">{powerUp.name} Power-Up</h2>
              <p style={{ color: textColor }}>{powerUp.description}</p>
            </div>
          </div>
          <button
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-colors`}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {(powerUp.effect === "swapEmoji" || powerUp.effect === "blockCell") && (
            <div className="mb-4">
              <p className="text-sm mb-2" style={{ color: darkMode ? "#d1d5db" : "#4b5563" }}>
                {powerUp.effect === "swapEmoji"
                  ? `Select two of your opponent's emojis to swap (${selectedCells.length}/2)`
                  : "Select an empty cell to block"}
              </p>

              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {Array(9)
                  .fill(null)
                  .map((_, index) => {
                    // Determine cell styling
                    const cellStyle = {
                      backgroundColor: darkMode ? "#1f2937" : "#f3f4f6",
                    }

                    if (selectedCells.includes(index)) {
                      cellStyle.border = `2px solid ${purpleColor}`
                    }

                    // Determine if cell is selectable
                    let isSelectable = false
                    if (powerUp.effect === "swapEmoji") {
                      isSelectable = board[index] && board[index].player === opponentPlayer
                    } else if (powerUp.effect === "blockCell") {
                      isSelectable = !board[index]
                    }

                    if (!isSelectable) {
                      cellStyle.opacity = 0.3
                      cellStyle.cursor = "not-allowed"
                    } else {
                      cellStyle.cursor = "pointer"
                    }

                    return (
                      <motion.div
                        key={index}
                        className="aspect-square flex items-center justify-center text-2xl rounded-md"
                        style={cellStyle}
                        whileHover={isSelectable ? { scale: 1.05 } : {}}
                        whileTap={isSelectable ? { scale: 0.95 } : {}}
                        onClick={() => isSelectable && handleCellClick(index)}
                      >
                        {board[index]?.emoji || ""}
                      </motion.div>
                    )
                  })}
              </div>
            </div>
          )}

          {powerUp.effect === "extraTurn" && (
            <div className="mb-4 text-center">
              <p style={{ color: darkMode ? "#d1d5db" : "#4b5563" }}>
                This power-up will give you an extra turn after your current move.
              </p>
              <motion.div
                className="text-5xl mt-4 mb-2"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                ⏱️
              </motion.div>
            </div>
          )}

          {powerUp.effect === "peekNext" && (
            <div className="mb-4 text-center">
              <p style={{ color: darkMode ? "#d1d5db" : "#4b5563" }}>
                This power-up will show you your next 3 emojis in advance.
              </p>
              <motion.div
                className="text-5xl mt-4 mb-2"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                👁️
              </motion.div>
            </div>
          )}
        </div>

        <div className="p-4" style={{ borderTop: `1px solid ${borderColor}` }}>
          <button
            className="w-full py-2 px-4 text-white rounded-md font-medium transition-colors"
            style={{
              background:
                (powerUp.effect === "swapEmoji" && selectedCells.length !== 2) ||
                (powerUp.effect === "blockCell" && selectedCells && selectedCells.length !== 2) ||
                (powerUp.effect === "blockCell" && selectedCells.length !== 1)
                  ? disabledBg
                  : bgGradient,
              cursor:
                (powerUp.effect === "swapEmoji" && selectedCells.length !== 2) ||
                (powerUp.effect === "blockCell" && selectedCells.length !== 1)
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={handleUse}
            disabled={
              (powerUp.effect === "swapEmoji" && selectedCells.length !== 2) ||
              (powerUp.effect === "blockCell" && selectedCells.length !== 1)
            }
          >
            Use Power-Up
          </button>
        </div>
      </motion.div>
    </div>
  )
}