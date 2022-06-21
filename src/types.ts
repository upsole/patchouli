export interface Entry {
  [index: string]: string;
  id: string;
  title: string;
  text: string;
  tags: string;
  img_url: string;
  img_id: string;
  file_key: string;
  userId: string;
}
  
export type FormattedEntry = {
  [index: string]: string | undefined | string[];
  id: string;
  title: string;
  text: string;
  tags: string[];
  img_url?: string;
  img_id?: string;
  file_key?: string;
  userId: string;
}
