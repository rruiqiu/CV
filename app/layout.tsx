import '@/styles/global.css'
export const metadata = {
  title: 'Richard Qiu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="only light" />
      </head>
      <body style={{ margin: '0px' }}>{children}</body>
    </html>
  )
}
