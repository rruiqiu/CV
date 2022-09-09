import Typist from 'react-typist'
import CustomButton from "./Button"
import React from 'react'
import Footer from "./HeaderFooter"
import Navbar from "./Navbar"

function TextLinkExample () {
  return (
    <section id="header">
      <Navbar
        variant={"dark"} />
      <div className='content'>
        <Typist
          cursor={{ hideWhenDone: true, element: "" }}
        >
          <h1 id="name">Hi, Welcom to my Personal Website.<br>
          </br>I am Rui</h1>
        </Typist>
        <CustomButton />
      </div>
      <Footer />

    </section >
  )
}

export default TextLinkExample