import axios from "axios";
import { buildFormData } from "./buildFormData";

interface ResponseError{
  error: string;
}

const $api_url = "/api"

const instance = axios.create({ baseURL: $api_url, })

export async function postForm(form: any) {
  try {
    const formData = buildFormData(form);
    const res = await instance.post("/images", formData, { headers: { "Content-Type": "multipart/form-data" } })
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
