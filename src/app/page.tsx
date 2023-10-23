"use client";

import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);

import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { Button, Heading, Stack } from "@chakra-ui/react";

import styles from "./page.module.css";
import { List, AddModal, EditModal } from "./components";
import { useTodo } from "./hooks/useTodo";

export default function Home() {
  const {
    isOpenAddModal,
    onOpenAddModal,
    onCloseAddModal,
    isOpenEditModal,
    onCloseEditModal,
    list,
    addRegister,
    handleSubmitAdd,
    editRegister,
    handleSubmitEdit,
    onOpenAndSetValueEditModal,
    onSubmitAdd,
    onSubmitEdit,
    onDeleteItem,
  } = useTodo();

  return (
    <main className={styles.main}>
      <Authenticator>
        {({ signOut }) => (
          <>
            <Heading>TODOアプリ</Heading>
            <Stack
              width={"100%"}
              maxWidth={"800px"}
              alignItems={"flex-start"}
              mt={"32px"}
              spacing={"16px"}
            >
              <Button onClick={onOpenAddModal}>追加</Button>
              {list && (
                <List list={list} onOpenModal={onOpenAndSetValueEditModal} />
              )}
              <Button onClick={signOut}>サインアウト</Button>
            </Stack>
            <AddModal
              isOpen={isOpenAddModal}
              onClose={onCloseAddModal}
              handleSubmit={handleSubmitAdd}
              onSubmit={onSubmitAdd}
              register={addRegister}
            />
            <EditModal
              isOpen={isOpenEditModal}
              onClose={onCloseEditModal}
              handleSubmit={handleSubmitEdit}
              onSubmit={onSubmitEdit}
              register={editRegister}
              onDeleteItem={onDeleteItem}
            />
          </>
        )}
      </Authenticator>
    </main>
  );
}
