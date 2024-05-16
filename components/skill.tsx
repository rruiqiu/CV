interface navbarprops {
  darkmode: string
  language: string
}
const skills: React.FC<navbarprops> = (props) => {
  return (
    <>
      <h1
        style={
          props.darkmode === 'Light' ? { color: 'black' } : { color: 'white' }
        }>
        My Skills
      </h1>
    </>
  )
}
export default skills
