export default function getFormData(object: any): FormData {
  const formData = new FormData()

  for (let key in object) {
    formData.append(key, object[key])
  }

  return formData
}
