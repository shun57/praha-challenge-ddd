'use client'

import React, { useEffect } from 'react'
import StyledFirebaseAuth from '@/lib/firebase/StyledFirebaseAuth'
import { firebaseApp } from '@/lib/firebase/config'
import { redirect } from 'next/navigation'
import { uiConfig } from '@/lib/firebase/uiConfig'

function SignInScreen() {
  useEffect(() => {
    const unregisterAuthObserver = firebaseApp.onAuthStateChanged((user) => {
      if (user) {
        redirect('/mypage')
      }
    })
    return () => unregisterAuthObserver()
  }, [])

  return (
    <div>
      <h1>My App</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp} />
    </div>
  )
}

export default SignInScreen
