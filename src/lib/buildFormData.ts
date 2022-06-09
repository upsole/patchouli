export const buildFormData = (data: Object) => {
  let formData = new FormData()
  if (data && typeof data === 'object') {
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value as string|Blob)
    }
  }
  return formData
}
