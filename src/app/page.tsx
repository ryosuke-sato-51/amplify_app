"use client";

import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);

import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { Button } from "@chakra-ui/react";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Authenticator>
        {({ signOut }) => (
          <main>
            <h1>ログイン成功です</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
    </main>
  );
}
