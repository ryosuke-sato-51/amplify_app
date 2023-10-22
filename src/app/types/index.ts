export type ItemType = {
  id: string;
  name: string;
  description: string;
};

export type ListType = ItemType[];

export type FormType = Pick<ItemType, "name" | "description">;
