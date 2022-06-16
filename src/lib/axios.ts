import axios from "axios";
import { buildFormData } from "./buildFormData";

interface ResponseError {
  error: string;
}

const $api_url = "/api"

export const instance = axios.create({ baseURL: $api_url, })

export async function listEntries(skip=0, take=10) {
  try {
    const res = await instance.get(`/entries?skip=${skip}&take=${take}`)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err && err.response) {
        return { error: err.response.data.error };
      } else {
        return { error: "Something went wrong" };
      }
    }
    return { error: "Something went wrong" };
  }
}

// TODO GET ITEM by id does not request SIGNEDURL until needed
export async function getFileSignedUrl(id: string): Promise<string> {
  const res = await instance.get(`/entries/${id}`)
  return res.data.url
}

export async function postEntry(form: any) {
  try {
    const formData = buildFormData(form);
    const res = await instance.post("/entries", formData, { headers: { "Content-Type": "multipart/form-data" } })
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err && err.response) {
        return { error: err.response.data.error };
      } else {
        return { error: "Something went wrong" };
      }
    }
    return { error: "Something went wrong" };
  }
}

export async function deleteEntry(id: string) {
  try {
    const res = await instance.delete(`/entries/${id}`)
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err && err.response) {
        return { error: err.response.data.error };
      } else {
        return { error: "Something went wrong" };
      }
    }
    return { error: "Something went wrong" };
  }
}
