export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Blink Tac Toe</title>
        <meta name="description" content="A twist on the classic Tic Tac Toe with emojis and vanishing pieces" />
      </head>
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
