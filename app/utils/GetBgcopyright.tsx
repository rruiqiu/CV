export async function getCopyRight() {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  }
  try {
    const response = await fetch(
      'https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-CA',
      requestOptions
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const result = await response.json()
    return result
  } catch (error) {
    console.error(error)
  }
}
