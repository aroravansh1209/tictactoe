
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameBoard from "./game-board"
import CategorySelector from "./category-selectory"
import ScoreBoard from "./score-board"
import HelpModal from "./help-module"
import { HelpCircle, RefreshCw, Trophy, Volume2, VolumeX, Music } from "lucide-react"
import { checkWinner } from "./game-logic"
import confetti from "canvas-confetti"
import useSound from "use-sound"
import Toast from "./toast"
import EmojiTrail from "./emoji-trail"
import PowerUpModal from "./power-up-modal"


// Define emoji categories
const emojiCategories = {
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨"],
  food: ["🍎", "🍕", "🍔", "🍦", "🍩", "🍫", "🍿", "🥑", "🍒"],
  sports: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓"],
  space: ["🚀", "🛸", "🌟", "🌙", "🪐", "☄️", "🌠", "👽", "🌌"],
  faces: ["😀", "😎", "🤩", "😍", "🥳", "😜", "🤪", "😇", "🤓"],
  weather: ["☀️", "🌤️", "⛅", "🌦️", "🌧️", "⛈️", "🌩️", "❄️", "🌈"],
}

// Power-ups
const powerUps = [
  {
    name: "Extra Turn",
    description: "Take an extra turn after this one",
    emoji: "⏱️",
    effect: "extraTurn",
  },
  {
    name: "Swap Emoji",
    description: "Swap positions of two of your opponent's emojis",
    emoji: "🔄",
    effect: "swapEmoji",
  },
  {
    name: "Block Cell",
    description: "Block a cell for 2 turns",
    emoji: "🚫",
    effect: "blockCell",
  },
  {
    name: "Peek Next",
    description: "See your next 3 emojis in advance",
    emoji: "👁️",
    effect: "peekNext",
  },
]

export default function BlinkTacToe() {
  const [gameStarted, setGameStarted] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [playerCategories, setPlayerCategories] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [board, setBoard] = useState(Array(9).fill(null))
  const [playerEmojis, setPlayerEmojis] = useState([[], []])
  const [currentEmoji, setCurrentEmoji] = useState("")
  const [winner, setWinner] = useState(null)
  const [winningCombination, setWinningCombination] = useState(null)
  const [scores, setScores] = useState([0, 0])
  const [toast, setToast] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(false)
  const [powerUp, setPowerUp] = useState(null)
  const [showPowerUpModal, setShowPowerUpModal] = useState(false)
  const [blockedCells, setBlockedCells] = useState([])
  const [nextEmojis, setNextEmojis] = useState([null, null, null])
  const [turnCount, setTurnCount] = useState(0)
  const [extraTurn, setExtraTurn] = useState(false)
  const [showEmojiTrail, setShowEmojiTrail] = useState(true)
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    movesPlayed: 0,
    powerUpsUsed: 0,
  })

  const musicRef = useRef(null)

  // Sound effects
  const [playPlace] = useSound("/sounds/place.mp3", { soundEnabled })
  const [playVanish] = useSound("/sounds/vanish.mp3", { soundEnabled })
  const [playWin] = useSound("/sounds/win.mp3", { soundEnabled })
  const [playPowerUp] = useSound("/sounds/power-up.mp3", { soundEnabled })
  const [playError] = useSound("/sounds/error.mp3", { soundEnabled })
  const [playClick] = useSound("/sounds/click.mp3", { soundEnabled })

  // Generate a random emoji from the player's category
  useEffect(() => {
    if (gameStarted && playerCategories) {
      const category = playerCategories[currentPlayer - 1]
      const randomIndex = Math.floor(Math.random() * emojiCategories[category].length)
      setCurrentEmoji(emojiCategories[category][randomIndex])

      // Generate next emojis for peek power-up
      const nextEmojisArray = []
      for (let i = 0; i < 3; i++) {
        const nextRandomIndex = Math.floor(Math.random() * emojiCategories[category].length)
        nextEmojisArray.push(emojiCategories[category][nextRandomIndex])
      }
      setNextEmojis(nextEmojisArray)
    }
  }, [currentPlayer, gameStarted, playerCategories])

  // Background music
  useEffect(() => {
    if (musicRef.current) {
      if (musicEnabled) {
        musicRef.current.play().catch((e) => console.log("Audio play failed:", e))
        musicRef.current.volume = 0.3
        musicRef.current.loop = true
      } else {
        musicRef.current.pause()
      }
    }

    return () => {
      if (musicRef.current) {
        musicRef.current.pause()
      }
    }
  }, [musicEnabled])

  // Power-up chance
  useEffect(() => {
    if (gameStarted && turnCount > 0 && turnCount % 5 === 0 && !powerUp && Math.random() < 0.7) {
      const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)]
      setPowerUp(randomPowerUp)
      setShowPowerUpModal(true)
      playPowerUp()
    }
  }, [turnCount, gameStarted, powerUp, playPowerUp])

  // Handle cell click
  const handleCellClick = (index) => {
    if (!gameStarted || winner || board[index] || blockedCells.includes(index)) {
      if (blockedCells.includes(index)) {
        setToast({
          visible: true,
          message: "This cell is blocked!",
          type: "error",
        })
        playError()
      }
      return
    }

    playPlace()
    setTurnCount((prev) => prev + 1)
    setGameStats((prev) => ({ ...prev, movesPlayed: prev.movesPlayed + 1 }))

    // Create new emoji placement
    const newPlacement = {
      emoji: currentEmoji,
      player: currentPlayer,
      timestamp: Date.now(),
      position: index,
    }

    // Create a copy of the current player's emojis
    const currentPlayerEmojis = [...playerEmojis[currentPlayer - 1]]

    // Check if player already has 3 emojis on the board
    if (currentPlayerEmojis.length >= 3) {
      // Find the oldest emoji
      const oldestEmoji = currentPlayerEmojis.reduce(
        (oldest, current) => (current.timestamp < oldest.timestamp ? current : oldest),
        currentPlayerEmojis[0],
      )

      // If trying to place on the same position as the oldest emoji, prevent it
      if (oldestEmoji.position === index) {
        setToast({
          visible: true,
          message: "You can't place your new emoji where your oldest emoji was!",
          type: "error",
        })
        playError()
        return
      }

      // Remove the oldest emoji from the board
      const newBoard = [...board]
      newBoard[oldestEmoji.position] = null
      setBoard(newBoard)

      // Remove the oldest emoji from the player's emojis
      const updatedPlayerEmojis = currentPlayerEmojis.filter((emoji) => emoji.position !== oldestEmoji.position)

      // Add the new emoji
      updatedPlayerEmojis.push(newPlacement)

      // Update the player's emojis
      const newPlayerEmojis = [...playerEmojis]
      newPlayerEmojis[currentPlayer - 1] = updatedPlayerEmojis
      setPlayerEmojis(newPlayerEmojis)

      // Update the board with the new emoji
      newBoard[index] = newPlacement
      setBoard(newBoard)

      playVanish()

      // Check for winner
      const { winner: newWinner, combination } = checkWinner(newBoard)
      if (newWinner) {
        setWinner(newWinner)
        setWinningCombination(combination)
        setScores((prev) => {
          const newScores = [...prev]
          newScores[newWinner - 1]++
          return newScores
        })
        playWin()
        triggerWinAnimation(newWinner, playerCategories[newWinner - 1])
        setGameStats((prev) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }))
      } else {
        // Switch player unless extra turn power-up is active
        if (!extraTurn) {
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
        } else {
          setExtraTurn(false)
          setToast({
            visible: true,
            message: "Extra turn used!",
            type: "success",
          })
        }
      }
    } else {
      // Player has less than 3 emojis, just add the new one
      const newBoard = [...board]
      newBoard[index] = newPlacement
      setBoard(newBoard)

      // Add the new emoji to the player's emojis
      const updatedPlayerEmojis = [...currentPlayerEmojis, newPlacement]
      const newPlayerEmojis = [...playerEmojis]
      newPlayerEmojis[currentPlayer - 1] = updatedPlayerEmojis
      setPlayerEmojis(newPlayerEmojis)

      // Check for winner
      const { winner: newWinner, combination } = checkWinner(newBoard)
      if (newWinner) {
        setWinner(newWinner)
        setWinningCombination(combination)
        setScores((prev) => {
          const newScores = [...prev]
          newScores[newWinner - 1]++
          return newScores
        })
        playWin()
        triggerWinAnimation(newWinner, playerCategories[newWinner - 1])
        setGameStats((prev) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }))
      } else {
        // Switch player unless extra turn power-up is active
        if (!extraTurn) {
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
        } else {
          setExtraTurn(false)
          setToast({
            visible: true,
            message: "Extra turn used!",
            type: "success",
          })
        }
      }
    }
  }

  const triggerWinAnimation = (winnerPlayer, category) => {
    // Create confetti with colors based on the winner
    const colors =
      winnerPlayer === 1
        ? ["#8b5cf6", "#a78bfa", "#c4b5fd"] // Purple colors for Player 1
        : ["#ec4899", "#f472b6", "#f9a8d4"] // Pink colors for Player 2

    // First, regular confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    })

    // Then, more confetti with different settings
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      })
    }, 250)

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      })
    }, 400)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setPlayerEmojis([[], []])
    setWinner(null)
    setWinningCombination(null)
    setCurrentPlayer(1)
    setTurnCount(0)
    setBlockedCells([])
    setPowerUp(null)
    setExtraTurn(false)
    // Keep the same categories
  }

  const startNewGame = () => {
    resetGame()
    setPlayerCategories(null)
    setGameStarted(false)
    setScores([0, 0])
  }

  const handleCategorySelection = (categories) => {
    playClick()
    setPlayerCategories(categories)
    setGameStarted(true)
  }

  const handlePowerUpUse = (effect, data) => {
    playPowerUp()
    setGameStats((prev) => ({ ...prev, powerUpsUsed: prev.powerUpsUsed + 1 }))

    switch (effect) {
      case "extraTurn":
        setExtraTurn(true)
        setToast({
          visible: true,
          message: "You'll get an extra turn!",
          type: "success",
        })
        break

      case "swapEmoji":
        if (data && data.from !== undefined && data.to !== undefined) {
          const opponentIndex = currentPlayer === 1 ? 1 : 0
          const newBoard = [...board]

          // Find the emojis at the selected positions
          const fromEmoji = newBoard[data.from]
          const toEmoji = newBoard[data.to]

          // Swap them
          if (fromEmoji && toEmoji) {
            const tempPosition = fromEmoji.position
            fromEmoji.position = toEmoji.position
            toEmoji.position = tempPosition

            newBoard[data.from] = toEmoji
            newBoard[data.to] = fromEmoji

            setBoard(newBoard)

            // Update player emojis
            const newPlayerEmojis = [...playerEmojis]
            const opponentEmojis = newPlayerEmojis[opponentIndex].map((emoji) => {
              if (emoji.position === data.from) {
                return { ...emoji, position: data.to }
              }
              if (emoji.position === data.to) {
                return { ...emoji, position: data.from }
              }
              return emoji
            })

            newPlayerEmojis[opponentIndex] = opponentEmojis
            setPlayerEmojis(newPlayerEmojis)
          }
        }
        break

      case "blockCell":
        if (data && data.cell !== undefined) {
          setBlockedCells((prev) => [...prev, data.cell])

          // Remove block after 2 turns
          setTimeout(() => {
            setBlockedCells((prev) => prev.filter((cell) => cell !== data.cell))
          }, 2 * 5000) // Assuming each turn takes about 5 seconds
        }
        break

      case "peekNext":
        // Already handled by showing the next emojis
        setToast({
          visible: true,
          message: "You can now see your next 3 emojis!",
          type: "success",
        })
        break
    }

    setPowerUp(null)
  }

  return (
    <div
      className="w-full max-w-4xl mx-auto flex flex-col items-center bg-white text-gray-900"
      style={{
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <audio ref={musicRef} src="/sounds/background-music.mp3" />

      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-6 text-center"
        style={{
          background: "linear-gradient(to right, #8b5cf6, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Blink Tac Toe
      </motion.h1>

      {!gameStarted ? (
        <CategorySelector onSelectCategories={handleCategorySelection} categories={emojiCategories} />
      ) : (
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <ScoreBoard
              scores={scores}
              currentPlayer={currentPlayer}
              playerCategories={playerCategories}
              emojiCategories={emojiCategories}
              currentEmoji={currentEmoji}
              nextEmojis={powerUp?.effect === "peekNext" ? nextEmojis : null}
            />

            <div className="flex gap-2 flex-wrap justify-center">
              <button
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                onClick={() => setShowHelp(true)}
              >
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </button>
              <button
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                onClick={resetGame}
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
              <button
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setSoundEnabled(!soundEnabled)
                  playClick()
                }}
              >
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-gray-600" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button
                className={`p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors ${
                  musicEnabled ? "bg-purple-100" : ""
                }`}
                onClick={() => setMusicEnabled(!musicEnabled)}
              >
                <Music className={`h-5 w-5 ${musicEnabled ? "text-purple-600" : "text-gray-600"}`} />
              </button>
              <button
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowEmojiTrail(!showEmojiTrail)
                  playClick()
                }}
              >
                <span className="text-xl">🌈</span>
              </button>
              <button
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                onClick={startNewGame}
              >
                New Game
              </button>
            </div>
          </div>

          {powerUp && (
            <motion.div
              className="mb-4 p-3 rounded-lg bg-purple-100 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{powerUp.emoji}</span>
                <div>
                  <h3 className="font-bold">{powerUp.name} Power-Up!</h3>
                  <p className="text-sm">{powerUp.description}</p>
                </div>
              </div>
              <button
                className="px-3 py-1 rounded-md bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                onClick={() => setShowPowerUpModal(true)}
              >
                Use
              </button>
            </motion.div>
          )}

          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            winningCombination={winningCombination}
            blockedCells={blockedCells}
          />

          <AnimatePresence>
            {winner && (
              <motion.div
                className="mt-6 p-4 rounded-lg text-white text-center"
                style={{
                  background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6" />
                  <h2 className="text-2xl font-bold">Player {winner} Wins!</h2>
                </div>
                <p className="mt-2">{playerCategories && `Using ${playerCategories[winner - 1]} emojis`}</p>
                <div className="mt-3 text-sm">
                  <p>Game Stats:</p>
                  <div className="flex justify-center gap-4 mt-1">
                    <span>Games: {gameStats.gamesPlayed}</span>
                    <span>Moves: {gameStats.movesPlayed}</span>
                    <span>Power-ups: {gameStats.powerUpsUsed}</span>
                  </div>
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-white text-purple-600 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={resetGame}
                >
                  Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showPowerUpModal && powerUp && (
        <PowerUpModal
          powerUp={powerUp}
          onClose={() => setShowPowerUpModal(false)}
          onUse={handlePowerUpUse}
          board={board}
          currentPlayer={currentPlayer}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showEmojiTrail && gameStarted && playerCategories && (
        <EmojiTrail emojis={emojiCategories[playerCategories[currentPlayer - 1]]} currentPlayer={currentPlayer} />
      )}
    </div>
  )
}
