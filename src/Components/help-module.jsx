import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"


export default function HelpModal({ onClose, darkMode }) {
  const [activeTab, setActiveTab] = useState("basics")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  if (!mounted) return null

  // Define colors based on dark mode
  const purpleColor = darkMode ? "#a78bfa" : "#8b5cf6"
  const borderColor = darkMode ? "#1f2937" : "#e5e7eb"
  const textColor = darkMode ? "#9ca3af" : "#6b7280"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        className={`${darkMode ? "bg-gray-900 text-white" : "bg-white"} rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-4 flex justify-between items-center" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div>
            <h2 className="text-2xl font-bold">How to Play Blink Tac Toe</h2>
            <p style={{ color: textColor }}>A twist on the classic Tic Tac Toe with emojis and vanishing pieces!</p>
          </div>
          <button
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-colors`}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <button
            className="px-4 py-2 font-medium"
            style={{
              borderBottom: activeTab === "basics" ? `2px solid ${purpleColor}` : "none",
              color: activeTab === "basics" ? purpleColor : textColor,
            }}
            onClick={() => setActiveTab("basics")}
          >
            Basics
          </button>
          <button
            className="px-4 py-2 font-medium"
            style={{
              borderBottom: activeTab === "rules" ? `2px solid ${purpleColor}` : "none",
              color: activeTab === "rules" ? purpleColor : textColor,
            }}
            onClick={() => setActiveTab("rules")}
          >
            Rules
          </button>
          <button
            className="px-4 py-2 font-medium"
            style={{
              borderBottom: activeTab === "strategy" ? `2px solid ${purpleColor}` : "none",
              color: activeTab === "strategy" ? purpleColor : textColor,
            }}
            onClick={() => setActiveTab("strategy")}
          >
            Strategy
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {activeTab === "basics" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">Game Setup</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Each player selects an emoji category (animals, food, sports, etc.)</li>
                  <li>The game is played on a 3x3 grid</li>
                  <li>Player 1 goes first, followed by Player 2, alternating turns</li>
                  <li>On each turn, you'll be assigned a random emoji from your category</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg">Winning the Game</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Form a line of 3 of your emojis horizontally, vertically, or diagonally</li>
                  <li>The game continues until one player wins</li>
                  <li>Draws are not possible due to the vanishing emoji rule</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">The Vanishing Rule</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Each player can have a maximum of 3 emojis on the board at any time</li>
                  <li>When you place your 4th emoji, your oldest emoji disappears (FIFO logic)</li>
                  <li>You cannot place your 4th emoji where your 1st emoji was</li>
                  <li>This creates a dynamic game where the board is constantly changing</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg">Turn Structure</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>On your turn, you'll see which random emoji you'll be placing</li>
                  <li>Click on any empty cell to place your emoji</li>
                  <li>If you already have 3 emojis on the board, your oldest one will vanish</li>
                  <li>The turn then passes to the other player</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "strategy" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">Strategic Tips</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Keep track of which of your emojis will vanish next</li>
                  <li>Try to anticipate your opponent's moves considering their vanishing emojis</li>
                  <li>Sometimes it's advantageous to place an emoji that will soon vanish in a blocking position</li>
                  <li>Look for opportunities to create multiple winning threats</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg">Advanced Play</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>The game is more complex than regular Tic Tac Toe due to the vanishing mechanic</li>
                  <li>Plan your moves several steps ahead, considering which emojis will vanish</li>
                  <li>Sometimes forcing your opponent to place in a certain position can be beneficial</li>
                  <li>Remember that draws are impossible - someone will eventually win!</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-4" style={{ borderTop: `1px solid ${borderColor}` }}>
          <button
            className="w-full py-2 px-4 text-white rounded-md font-medium transition-colors"
            style={{
              background: `linear-gradient(to right, ${darkMode ? "#7c3aed" : "#8b5cf6"}, ${darkMode ? "#be185d" : "#ec4899"})`,
            }}
            onClick={onClose}
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </div>
  )
}

