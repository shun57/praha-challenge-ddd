import firebase from 'firebase/compat/app'

export const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: '/mypage',
  callbacks: {
    signInSuccessWithAuthResult: () => {
      return true
    },
  },
}