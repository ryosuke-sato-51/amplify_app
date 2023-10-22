import { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLQuery } from "@aws-amplify/api";

import { listTodos } from "@/graphql/queries";
import { createTodo, updateTodo, deleteTodo } from "@/graphql/mutations";
import {
  ListTodosQuery,
  CreateTodoMutation,
  UpdateTodoMutation,
  DeleteTodoMutation,
} from "@/API";
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

  // TODOリストをQueryで取得してセットする。
  useEffect(() => {
    const queryTodos = async () => {
      const todoData = await API.graphql<GraphQLQuery<ListTodosQuery>>(
        graphqlOperation(listTodos)
      );

      const todoList = todoData.data?.listTodos?.items;
      if (!todoList) return;

      // データの整形
      const transformedTodos = todoList.map((item) => ({
        id: item?.id || "",
        name: item?.name || "",
        description: item?.description || "",
      }));
      setList(transformedTodos);
    };

    queryTodos();
  }, []);

  // 編集するTODOのIDの状態管理
  const [currentId, setCurrentId] = useState<string>();

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
  const onOpenAndSetValueEditModal = (id: string) => {
    if (!list) return;
    const currentItem = list.find((item) => item.id === id);
    setValueEdit("name", currentItem ? currentItem.name : "");
    setValueEdit("description", currentItem ? currentItem.description : "");
    setCurrentId(id);
    onOpenEditModal();
  };

  // TODO追加処理
  const onSubmitAdd: SubmitHandler<FormType> = async (data) => {
    // 入力された項目で、TODOリストを作成
    const responce = await API.graphql<GraphQLQuery<CreateTodoMutation>>(
      graphqlOperation(createTodo, {
        input: { name: data.name, description: data.description },
      })
    );

    // レスポンスのデータを整形
    const createdItem = responce.data?.createTodo;
    if (!createdItem) return;

    const newItem = {
      id: createdItem.id,
      name: createdItem.name,
      description: createdItem.description || "",
    };

    // UIを更新する
    setList((prev) => {
      if (prev) {
        return [...prev, newItem];
      } else {
        return [newItem];
      }
    });

    // フォームの値を空に戻してモーダルを閉じる
    setValueAdd("name", "");
    setValueAdd("description", "");
    onCloseAddModal();
  };

  // TODO更新処理
  const onSubmitEdit: SubmitHandler<FormType> = async (data) => {
    if (!list) return;
    // 現在編集しているTODOのIDと、入力された項目で更新する
    const responce = await API.graphql<GraphQLQuery<UpdateTodoMutation>>(
      graphqlOperation(updateTodo, {
        input: {
          id: currentId,
          name: data.name,
          description: data.description,
        },
      })
    );

    // レスポンスのデータを整形
    const updatedItem = responce.data?.updateTodo;
    if (!updatedItem) return;

    // UIを更新してモーダルを閉じる
    const newList = list.map((item) =>
      item.id === currentId
        ? {
            id: updatedItem.id,
            name: updatedItem.name,
            description: updatedItem.description || "",
          }
        : item
    );

    setList(newList);
    onCloseEditModal();
  };

  // TODOの削除処理
  const onDeleteItem = async () => {
    if (!list) return;

    // 現在編集しているTODOのIDを渡して削除する
    const responce = await API.graphql<GraphQLQuery<DeleteTodoMutation>>(
      graphqlOperation(deleteTodo, { input: { id: currentId } })
    );

    // UIを更新してモーダルを閉じる
    const deletedId = responce.data?.deleteTodo?.id;
    if (!deletedId) return;

    const newList = list.filter((item) => item.id !== deletedId);
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
