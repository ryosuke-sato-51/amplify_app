"use client";

import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);

import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import {
  Button,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  UnorderedList,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./page.module.css";

type ItemType = {
  id: number;
  name: string;
  description: string;
};

type ListType = ItemType[];

type FormType = Pick<ItemType, "name" | "description">;

export default function Home() {
  const {
    isOpen: isOpenAddModal,
    onOpen: onOpenAddModal,
    onClose: onCloseAddModal,
  } = useDisclosure();
  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();
  const [list, setList] = useState<ListType>();
  const [currentId, setCurrentId] = useState<number>();

  const {
    register: addRegister,
    handleSubmit: handleSubmitAdd,
    setValue: setValueAdd,
  } = useForm<FormType>();
  const {
    register: editRegister,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm<FormType>();

  const onOpenAndSetValueEditModal = (id: number) => {
    if (!list) return;
    const currentItem = list.find((item) => item.id === id);
    setValueEdit("name", currentItem ? currentItem.name : "");
    setValueEdit("description", currentItem ? currentItem.description : "");
    setCurrentId(id);
    onOpenEditModal();
  };

  const onSubmitAdd: SubmitHandler<FormType> = (data) => {
    const newItem = {
      id: Math.floor(Math.random() * 1000000000) + 1,
      name: data.name,
      description: data.description,
    };
    setList((prev) => {
      if (prev) {
        return [...prev, newItem];
      } else {
        return [newItem];
      }
    });
    setValueAdd("name", "");
    setValueAdd("description", "");
    onCloseAddModal();
  };

  const onSubmitEdit: SubmitHandler<FormType> = (data) => {
    if (!list) return;
    const newList = list.map((item) =>
      item.id === currentId
        ? {
            id: item.id,
            name: data.name,
            description: data.description,
          }
        : item
    );
    setList(newList);
    onCloseEditModal();
  };

  const onDeleteItem = () => {
    if (!list) return;
    const newList = list.filter((item) => item.id !== currentId);
    setList(newList);
    onCloseEditModal();
  };

  return (
    <main className={styles.main}>
      <Authenticator>
        {({ signOut }) => (
          <>
            <Heading>TODOアプリ</Heading>
            <Stack minWidth={"800px"} alignItems={"flex-start"}>
              <Button onClick={onOpenAddModal}>追加</Button>
              {list && (
                <UnorderedList>
                  {list.map((item) => (
                    <ListItem key={item.id}>
                      <button
                        onClick={() => onOpenAndSetValueEditModal(item.id)}
                      >
                        {item.name}
                      </button>
                    </ListItem>
                  ))}
                </UnorderedList>
              )}
              <Button onClick={signOut}>サインアウト</Button>
            </Stack>
            <Modal isOpen={isOpenAddModal} onClose={onCloseAddModal}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>TODO追加</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form id="add" onSubmit={handleSubmitAdd(onSubmitAdd)}>
                    <Stack>
                      <FormControl>
                        <FormLabel>タイトル</FormLabel>
                        <Input {...addRegister("name", { required: true })} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>説明文</FormLabel>
                        <Textarea
                          {...addRegister("description", { required: true })}
                        />
                      </FormControl>
                    </Stack>
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" form="add">
                    追加
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Modal isOpen={isOpenEditModal} onClose={onCloseEditModal}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>TODO編集</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form id="edit" onSubmit={handleSubmitEdit(onSubmitEdit)}>
                    <Stack>
                      <FormControl>
                        <FormLabel>タイトル</FormLabel>
                        <Input {...editRegister("name", { required: true })} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>説明文</FormLabel>
                        <Textarea
                          {...editRegister("description", { required: true })}
                        />
                      </FormControl>
                    </Stack>
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Stack direction={"row"}>
                    <Button type="button" onClick={onDeleteItem}>
                      削除
                    </Button>
                    <Button type="submit" form="edit">
                      保存
                    </Button>
                  </Stack>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )}
      </Authenticator>
    </main>
  );
}
