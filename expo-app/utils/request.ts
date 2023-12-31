export function getFormData(object: any): FormData {
  const formData = new FormData()

  for (let key in object) {
    formData.append(key, object[key])
  }

  return formData
}

export function getSearchParams(object: any): URLSearchParams {
  const searchParams = new URLSearchParams()

  for (let key in object) {
    if (object[key] === undefined) continue

    searchParams.append(key, object[key])
  }

  return searchParams
}
