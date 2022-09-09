import Grid from '@mui/material/Unstable_Grid2';
import profile from "../img/profile.JPG"

function AboutIntro () {
  return (<section id="about">
    <h1 style={{ textAlign: "center" }}>About me</h1>
    <Grid container spacing={2}>
      <Grid xs={12} md={6}>
        <p>Hi, my name is Rui Qiu. I am an electrical engineer and a self-learned web developer. I am enthusiastic about studying magic phenomena surrounding our daily life as well as exploring the newest modern web-developed technologies in the current world. As an engineer, I believe that the advancement of technology will bring us convenience in any aspects.</p>
      </Grid>
      <Grid xs={12} md={6}>

        <img src={profile} alt="" className='size' />
        {/* height={464} width={348} */}
      </Grid>
    </Grid>

    <div className="Skills">
      <h2>My Skills</h2>
      <ul>
        <li></li>
      </ul>
    </div>
  </section>)
}
export default AboutIntro