import axios from "axios";
import { buildFormData } from "./buildFormData";

const $api_url = "http://localhost:3000/api"

const instance = axios.create({ baseURL: $api_url, headers: { "Content-Type": "multipart/form-data" } })

export async function postForm(form: any) {
  const formData = buildFormData(form);

  const res = await instance.post("/images", formData)
  return res.data
}
