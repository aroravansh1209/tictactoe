/**
 * Checks if there is a winner on the board
 * @param {Array} board - The game board state
 * @returns {Object} - Object containing winner and winning combination
 */
export function checkWinner(board) {
  // Winning combinations (rows, columns, diagonals)
  const winningLines = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6], // diagonal top-right to bottom-left
  ]

  for (const line of winningLines) {
    const [a, b, c] = line
    if (
      board[a] &&
      board[b] &&
      board[c] &&
      board[a].player === board[b].player &&
      board[a].player === board[c].player
    ) {
      return { winner: board[a].player, combination: line }
    }
  }
  return { winner: null, combination: null }
}
