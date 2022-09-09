import Navbar from "../components/Navbar"
import ContactMe from "./contact"
import { Container } from '@mui/material';
import Intro from "./aboutIntro"
import Projects from "./projects"


function About () {
  return (

    <div className="aboutBackground">
      <Navbar variant="light"
        navbarcolor="aboutnabvar"
      />
      <Container maxWidth="xl">
        <Intro />

        <section id="projects">Project</section>

        <section id="contacts">Contact Me</section>
        <ContactMe />
      </Container>
    </div>

  )

}
export default About