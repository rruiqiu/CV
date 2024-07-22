interface navbarprops {
  theme: string
  language: string
}
const skills: React.FC<navbarprops> = (props) => {
  return (
    <>
      <h1
        style={
          props.theme === 'Light' ? { color: 'black' } : { color: 'white' }
        }>
        My Skills
      </h1>
    </>
  )
}
export default skills
