import React from "react"
import Header from "./Header"
import { Route, Routes } from "react-router-dom"
import About from "../pages/about"

function App () {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}
export default App