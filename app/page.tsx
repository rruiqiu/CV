import BG from '@/app/components/IntroBgServer'
import { Suspense } from 'react'
const Home = () => {
  return (
    <main>
      <Suspense fallback={<p>Loading ...</p>}>
        <BG />
      </Suspense>
    </main>
  )
}

export default Home
