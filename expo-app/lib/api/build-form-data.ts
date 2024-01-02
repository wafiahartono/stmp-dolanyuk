export function buildFormData(object: any): FormData {
  const formData = new FormData()

  for (let key in object) {
    formData.append(key, object[key])
  }

  return formData
}
