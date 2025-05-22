import { Suspense } from "react"
import BlinkTacToe from "../src/Components/blink-tac-toe"

export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-purple-50">
      <Suspense fallback={<div>Loading...</div>}>
        <BlinkTacToe />
      </Suspense>
    </main>
  )
}

