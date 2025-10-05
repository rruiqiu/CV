export async function GET(request: Request) {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-store',
  }
  const response = await fetch(
    'https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-CA',
    requestOptions
  )

  if (!response.ok) {
    throw new Error('Failed')
  }

  const data = await response.json()
  // console.log(data)
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}
