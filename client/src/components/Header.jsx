import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Typist from 'react-typist'
import CustomButton from "./Button"
import React from 'react'
import Footer from "./HeaderFooter"

function TextLinkExample () {
  return (
    <section id="header">
      <Navbar id="navbar" className='transparent' variant="dark" expand="lg" >
        <Container style={{ marginLeft: "70px", marginRight: "70px" }}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="nav-item" href="/about">About</Nav.Link>
              <Nav.Link className='nav-item' href="#projects">Projects</Nav.Link>
              <Nav.Link className='nav-item' href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>

      </Navbar>
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