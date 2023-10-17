"use client";

import { UnorderedList, ListItem } from "@chakra-ui/react";

import { ListType } from "../types";

type ListProps = {
  list: ListType;
  onOpenModal: (id: number) => void;
};

export const List = ({ list, onOpenModal }: ListProps) => {
  return (
    <UnorderedList>
      {list.map((item) => (
        <ListItem key={item.id}>
          <button onClick={() => onOpenModal(item.id)}>{item.name}</button>
        </ListItem>
      ))}
    </UnorderedList>
  );
};
