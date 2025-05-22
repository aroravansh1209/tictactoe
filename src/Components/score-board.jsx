import { motion, AnimatePresence } from "framer-motion"
export default function ScoreBoard({
  scores,
  currentPlayer,
  playerCategories,
  emojiCategories,
  currentEmoji,
  nextEmojis,
  darkMode,
}) {
  return (
    <div className="flex gap-4 w-full md:w-auto">
      {[1, 2].map((player) => {
        // Determine player colors
        const playerColor =
          player === 1
            ? darkMode
              ? "#a78bfa"
              : "#8b5cf6" // Purple
            : darkMode
              ? "#f472b6"
              : "#ec4899" // Pink

        // Determine border and shadow styles
        let borderStyle = {}
        if (currentPlayer === player) {
          borderStyle = {
            borderWidth: "2px",
            borderColor: playerColor,
            boxShadow: `0 4px 6px -1px ${darkMode ? "rgba(0, 0, 0, 0.1)" : "rgba(139, 92, 246, 0.1)"}`,
          }
        } else {
          borderStyle = {
            borderWidth: "1px",
            borderColor: darkMode ? "#374151" : "#e5e7eb",
          }
        }

        return (
          <div
            key={player}
            className={`flex-1 p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-lg shadow-md`}
            style={borderStyle}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold" style={{ color: playerColor }}>
                  Player {player}
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} capitalize`}>
                  {playerCategories[player - 1]}
                </p>
              </div>
              <motion.div
                className="text-2xl font-bold"
                key={scores[player - 1]}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, times: [0, 0.5, 1] }}
              >
                {scores[player - 1]}
              </motion.div>
            </div>

            {currentPlayer === player && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Your turn:
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentEmoji}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                        y: [0, -5, 0],
                      }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        duration: 0.5,
                        y: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1.5,
                          ease: "easeInOut",
                        },
                      }}
                      className="text-2xl"
                    >
                      {currentEmoji}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {nextEmojis && (
                  <div
                    className="mt-2 pt-2"
                    style={{
                      borderTopWidth: "1px",
                      borderTopStyle: "dashed",
                      borderTopColor: darkMode ? "#374151" : "#e5e7eb",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Coming up:
                      </div>
                      <div className="flex gap-1">
                        {nextEmojis.map((emoji, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="text-lg opacity-70"
                          >
                            {emoji}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

