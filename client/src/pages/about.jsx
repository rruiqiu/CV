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
      <Container maxWidth="lg">
        <Intro />

        <section id="projects">Project</section>
        <Projects />
        <section id="contacts">Contact Me</section>
        <ContactMe />
      </Container>
    </div>

  )

}
export default About