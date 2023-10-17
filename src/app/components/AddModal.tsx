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

type AddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: UseFormHandleSubmit<FormType>;
  onSubmit: SubmitHandler<FormType>;
  register: UseFormRegister<FormType>;
};

export const AddModal = ({
  isOpen,
  onClose,
  handleSubmit,
  onSubmit,
  register,
}: AddModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>TODO追加</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="add" onSubmit={handleSubmit(onSubmit)}>
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
          <Button type="submit" form="add">
            追加
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
