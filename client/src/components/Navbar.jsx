import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'


function navbar () {
  return (
    <Navbar id="navbar" className='transparent' variant="dark" expand="lg" >
      <Container style={{ marginLeft: "70px", marginRight: "70px" }}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="nav-item" href="/about">About</Nav.Link>
            <Nav.Link className='nav-item' href="/about#projects">Projects</Nav.Link>
            <Nav.Link className='nav-item' href="/about#contacts">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

    </Navbar>
  )
}
export default navbar