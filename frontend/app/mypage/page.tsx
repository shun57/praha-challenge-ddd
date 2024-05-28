'use client'

import React, { useEffect, useState } from 'react'
import { firebaseApp } from '@/lib/firebase/config'
import { redirect } from 'next/navigation'

function Mypage() {
  const [idToken, setIdToken] = useState<string | undefined>(undefined)

  useEffect(() => {
    const unregisterAuthObserver = firebaseApp.onAuthStateChanged((user) => {
      if (!user) {
        redirect('/signin')
      } else {
        user
          .getIdToken()
          .then((token) => setIdToken(token))
          .catch((error) => console.error('Error getting ID token:', error))
      }
    })
    return () => unregisterAuthObserver()
  }, [])

  const handleSignOut = () => {
    firebaseApp
      .signOut()
      .then(() => {
        window.location.href = '/signin'
      })
      .catch((error) => {
        console.error('Error signing out:', error)
      })
  }

  const handleFetchWithAuth = async () => {
    if (!idToken) {
      console.error('No ID token available')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/pairs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      })

      console.log(response)

      const data = await response.json()
      console.log('Data fetched with auth:', data)
    } catch (error) {
      console.error('Error fetching with auth:', error)
    }
  }

  const handleFetchWithNoAuth = async () => {
    try {
      const response = await fetch('http://localhost:3001/pairs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtp`,
        },
      })

      const data = await response.json()
      console.log('Data fetched with auth:', data)
    } catch (error) {
      console.error('Error fetching with auth:', error)
    }
  }

  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {firebaseApp.currentUser?.email}! You are now signed-in!</p>
      {/* <p>ID Token: {idToken}</p> */}
      <button onClick={handleFetchWithAuth}>認証あり</button>
      <button onClick={handleFetchWithNoAuth}>認証なし</button>
      <button onClick={handleSignOut}>Sign-out</button>
    </div>
  )
}

export default Mypage
