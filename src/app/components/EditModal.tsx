"use client";

import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  UseFormHandleSubmit,
  SubmitHandler,
  UseFormRegister,
} from "react-hook-form";

import { FormType } from "../types";

type EditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: UseFormHandleSubmit<FormType>;
  onSubmit: SubmitHandler<FormType>;
  register: UseFormRegister<FormType>;
  onDeleteItem: () => void;
};

export const EditModal = ({
  isOpen,
  onClose,
  handleSubmit,
  onSubmit,
  register,
  onDeleteItem,
}: EditModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>TODO編集</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="edit" onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <FormControl>
                <FormLabel>タイトル</FormLabel>
                <Input {...register("name", { required: true })} />
              </FormControl>
              <FormControl>
                <FormLabel>説明文</FormLabel>
                <Textarea {...register("description", { required: true })} />
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
  );
};
