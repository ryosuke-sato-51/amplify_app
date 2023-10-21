import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";

import { ListType, FormType } from "../types";

export const useTodo = () => {
  // モーダルの開閉
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

  // TODOリストの状態管理
  const [list, setList] = useState<ListType>();

  // 編集するTODOのIDの状態管理
  const [currentId, setCurrentId] = useState<number>();

  // React Hook Formの呼び出し
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

  // 編集モーダルを開く際の処理
  const onOpenAndSetValueEditModal = (id: number) => {
    if (!list) return;
    const currentItem = list.find((item) => item.id === id);
    setValueEdit("name", currentItem ? currentItem.name : "");
    setValueEdit("description", currentItem ? currentItem.description : "");
    setCurrentId(id);
    onOpenEditModal();
  };

  // TODO追加処理
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

  // TODO更新処理
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

  // TODOの削除処理
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
