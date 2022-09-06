import React, { useEffect, useState } from "react"

function Footer () {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch("https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-CA")
      .then((resp) => resp.json())
      .then((apiData) => {
        setData(apiData.copyright)
      })
  }, [])

  return (<div className='footer'>
    <p className="HeaderFooter">{data}</p>
    <p className="Description">This is a daily generated background image fetched from BingWallpaper</p>
  </div>
  )
}

export default Footer