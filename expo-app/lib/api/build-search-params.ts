export function buildSearchParams(object: any): URLSearchParams {
  const searchParams = new URLSearchParams()

  for (let key in object) {
    if (object[key] === undefined) continue

    searchParams.append(key, object[key])
  }

  return searchParams
}
