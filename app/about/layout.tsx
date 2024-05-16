import '@/styles/global.css'
export const metadata = {
  title: 'Richard Qiu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
