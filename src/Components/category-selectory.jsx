"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"
import HelpModal from "./help-module"


export default function CategorySelector({ onSelectCategories, categories, darkMode }) {
  const [player1Category, setPlayer1Category] = useState(null)
  const [player2Category, setPlayer2Category] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [activeTab, setActiveTab] = useState("player1")

  const categoryNames = Object.keys(categories)

  const handleStartGame = () => {
    if (player1Category && player2Category) {
      onSelectCategories([player1Category, player2Category])
    }
  }

  // Define colors based on dark mode
  const purpleColor = darkMode ? "#a78bfa" : "#8b5cf6"
  const pinkColor = darkMode ? "#f472b6" : "#ec4899"
  const purpleBgColor = darkMode ? "#4c1d95" : "#f5f3ff"
  const pinkBgColor = darkMode ? "#831843" : "#fdf2f8"

  return (
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
        <div
          className="p-4"
          style={{
            borderBottomWidth: "1px",
            borderBottomColor: darkMode ? "#374151" : "#e5e7eb",
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Select Your Emoji Categories</h2>
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                Each player needs to choose a unique emoji category
              </p>
            </div>
            <button
              className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
              onClick={() => setShowHelp(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 mb-4">
            <button
              className="py-2 text-center font-medium"
              style={{
                borderBottomWidth: activeTab === "player1" ? "2px" : "0",
                borderBottomColor: activeTab === "player1" ? purpleColor : "transparent",
                color: activeTab === "player1" ? purpleColor : darkMode ? "#9ca3af" : "#6b7280",
              }}
              onClick={() => setActiveTab("player1")}
            >
              Player 1
            </button>
            <button
              className="py-2 text-center font-medium"
              style={{
                borderBottomWidth: activeTab === "player2" ? "2px" : "0",
                borderBottomColor: activeTab === "player2" ? pinkColor : "transparent",
                color: activeTab === "player2" ? pinkColor : darkMode ? "#9ca3af" : "#6b7280",
              }}
              onClick={() => setActiveTab("player2")}
            >
              Player 2
            </button>
          </div>

          <div className="mt-4">
            {activeTab === "player1" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryNames.map((category) => {
                  // Determine styling for each category card
                  let cardStyle = {
                    borderWidth: "1px",
                    borderColor: darkMode ? "#374151" : "#e5e7eb",
                  }

                  if (player1Category === category) {
                    cardStyle = {
                      borderWidth: "2px",
                      borderColor: purpleColor,
                      backgroundColor: purpleBgColor,
                    }
                  } else if (category === player2Category) {
                    cardStyle = {
                      opacity: 0.5,
                      cursor: "not-allowed",
                      borderWidth: "1px",
                      borderColor: darkMode ? "#374151" : "#e5e7eb",
                    }
                  }

                  return (
                    <motion.div
                      key={category}
                      whileHover={category !== player2Category ? { scale: 1.05 } : {}}
                      whileTap={category !== player2Category ? { scale: 0.95 } : {}}
                      className="p-3 rounded-lg cursor-pointer"
                      style={cardStyle}
                      onClick={() => {
                        if (category !== player2Category) {
                          setPlayer1Category(category)
                        }
                      }}
                    >
                      <p className="font-medium capitalize mb-2">{category}</p>
                      <div className="flex flex-wrap gap-1">
                        {categories[category].slice(0, 5).map((emoji, i) => (
                          <span key={i} className="text-xl">
                            {emoji}
                          </span>
                        ))}
                        <span className="text-xl">...</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {activeTab === "player2" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryNames.map((category) => {
                  // Determine styling for each category card
                  let cardStyle = {
                    borderWidth: "1px",
                    borderColor: darkMode ? "#374151" : "#e5e7eb",
                  }

                  if (player2Category === category) {
                    cardStyle = {
                      borderWidth: "2px",
                      borderColor: pinkColor,
                      backgroundColor: pinkBgColor,
                    }
                  } else if (category === player1Category) {
                    cardStyle = {
                      opacity: 0.5,
                      cursor: "not-allowed",
                      borderWidth: "1px",
                      borderColor: darkMode ? "#374151" : "#e5e7eb",
                    }
                  }

                  return (
                    <motion.div
                      key={category}
                      whileHover={category !== player1Category ? { scale: 1.05 } : {}}
                      whileTap={category !== player1Category ? { scale: 0.95 } : {}}
                      className="p-3 rounded-lg cursor-pointer"
                      style={cardStyle}
                      onClick={() => {
                        if (category !== player1Category) {
                          setPlayer2Category(category)
                        }
                      }}
                    >
                      <p className="font-medium capitalize mb-2">{category}</p>
                      <div className="flex flex-wrap gap-1">
                        {categories[category].slice(0, 5).map((emoji, i) => (
                          <span key={i} className="text-xl">
                            {emoji}
                          </span>
                        ))}
                        <span className="text-xl">...</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div
          className="p-4"
          style={{
            borderTopWidth: "1px",
            borderTopColor: darkMode ? "#374151" : "#e5e7eb",
          }}
        >
          <button
            className="w-full py-2 px-4 rounded-md text-white font-medium transition-colors"
            style={{
              background:
                player1Category && player2Category
                  ? `linear-gradient(to right, ${darkMode ? "#7c3aed" : "#8b5cf6"}, ${darkMode ? "#be185d" : "#ec4899"})`
                  : darkMode
                    ? "#374151"
                    : "#d1d5db",
              cursor: player1Category && player2Category ? "pointer" : "not-allowed",
            }}
            disabled={!player1Category || !player2Category}
            onClick={handleStartGame}
          >
            Start Game
          </button>
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} darkMode={darkMode} />}
    </motion.div>
  )
}
