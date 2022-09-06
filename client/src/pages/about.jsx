import Navbar from "../components/Navbar"
import ContactMe from "./contact"
function About () {
  return (
    <div className="aboutBackground">
      <Navbar />
      <section id="about">
        <h1>About me</h1>
        <p>Hi, my name is Rui Qiu. I am an electrical engineer and a self-learned web developer. I am enthusiastic about studying magic phenomena surrounding our daily life as well as exploring the newest modern web-developed technologies in the current world. As an engineer, I believe that the advancement of technology will bring us convenience in any aspects.</p>

        <div className="Skills">
          <h2>My Skills</h2>
          <ul>
            <li></li>
          </ul>
        </div>
      </section>
      <section id="projects">Project</section>

      <section id="contacts">Contact Me</section>
      <ContactMe />

    </div>
  )

}
export default About