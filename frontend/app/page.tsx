import 'firebase/compat/auth'
import { redirect } from 'next/navigation'
import { firebaseApp } from '@/lib/firebase/config'

function Home() {
  return (
    <div>
      <h1>My App</h1>
    </div>
  )
}

export default Home
