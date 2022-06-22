export interface Entry {
  [index: string]: string | Date | Tag[];
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  text: string;
  tags: Tag[];
  img_url: string;
  img_id: string;
  file_key: string;
  userId: string;
}
  

export type Tag = {
  id: number;
  name: string;
  color?: string;
}
