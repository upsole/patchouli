import axios from "axios";
import { buildFormData } from "./buildFormData";
import type { Entry, Tag } from "~/types/entities";

interface ResponseError {
  error: string;
}

interface PostResponse {
  entry: Entry;
}

interface DeleteResponse {
  message: string;
}

const $api_url = "/api";

export const instance = axios.create({ baseURL: $api_url });

export async function listEntries(skip = 0, take = 9): Promise<Entry[]> {
  const res = await instance.get(`/entries?skip=${skip}&take=${take}`);
  return res.data;
}

export async function listTags(): Promise<string[]> {
  const res = await instance.get('/tags')
  return res.data;
}

export async function queryEntriesByTag(tag: string): Promise<Entry[]> {
  const res = await instance.get(`/entries?tag=${tag}`);
  return res.data;
}

export async function getFileSignedUrl(id: string): Promise<string> {
  const res = await instance.get(`/entries/${id}?url=true`);
  return res.data.url;
}

export async function getEntry(id: string): Promise<Entry> {
  const res = await instance.get(`/entries/${id}`);
  return res.data;
}


export async function postEntry(form: any): Promise<PostResponse> {
  const formData = buildFormData(form);
  const res = await instance.post("/entries", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
  // try {
  //   const formData = buildFormData(form);
  //   const res = await instance.post("/entries", formData, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  //   return res.data;
  // } catch (err) {
  //   if (axios.isAxiosError(err) && err.response) {
  //     return { error: err.response.statusText };
  //   } else {
  //     return { error: "Server Error" };
  //   }
  // }
}

export async function deleteEntry(
  id: string
): Promise<DeleteResponse | ResponseError | undefined> {
  const res = await instance.delete(`/entries/${id}`);
  return res.data;
  // try {
  //   const res = await instance.delete(`/entries/${id}`);
  //   return res.data;
  // } catch (err) {
  //   if (axios.isAxiosError(err)) {
  //     if (err && err.response) {
  //       return { error: err.response.statusText };
  //     } else {
  //       return { error: "Something went wrong" };
  //     }
  //   }
  // }
}
