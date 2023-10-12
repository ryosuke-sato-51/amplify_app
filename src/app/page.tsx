'use client';

import { Amplify } from 'aws-amplify';
import awsconfig from "../aws-exports"
Amplify.configure(awsconfig);

import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';

import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
    </main>
  )
}
