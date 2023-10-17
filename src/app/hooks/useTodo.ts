import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";

import { ListType, FormType } from "../types";

export const useTodo = () => {
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

  return {
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
  };
};
