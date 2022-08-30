import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

function CustomButton () {
  const [state, setState] = useState(false)
  setTimeout(() => {
    setState(true)
  }, 3500)
  //route change
  let navigate = useNavigate()
  const routeChange = () => {
    let path = `/about`
    navigate(path)
  }

  return (

    <div>
      {state && <div><button onClick={routeChange} className="button-57">
        <span>Explore</span>
        <span>About</span>
      </button></div>}

    </div>
  )
};




export default CustomButton

