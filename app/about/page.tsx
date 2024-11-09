'use client'
import style from '@/styles/about.module.css'
import NavBar from '@/app/components/navbar'
import Skills from '@/app/components/skill'
import { useState } from 'react'
import About from '@/app/components/about'
import Project from '@/app/components/project'
import CurrentProject from '@/app/components/currentproject'
import Footer from '@/app/components/footer'
const AboutPage = () => {
  const [theme, setTheme] = useState<string>('Light')
  const [language, setLanguage] = useState<string>('En')
  // Callback function to update theme
  const updateTheme = (newTheme: string) => {
    setTheme(newTheme)
    console.log(theme)
  }

  // Callback function to update language
  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage)
    console.log(language)
  }

  return (
    <div className={theme === 'Light' ? style.Bg : style.darkBg}>
      <NavBar
        darkmode={theme}
        language={language}
        onUpdateTheme={updateTheme}
        onUpdateLanguage={updateLanguage}></NavBar>
      <div id={style.container}>
        <section id="about">
          <About theme={theme} language={language} />
        </section>
        <hr
          style={
            theme === 'Light'
              ? {}
              : { border: '1px solid rgb(251 251 251 / 58%)' }
          }
        />
        <section id="projects">
          <Project theme={theme} language={language} />
        </section>
        {/* <div>
          <Skills theme={theme} language={language} />
        </div> */}
        <hr
          style={
            theme === 'Light'
              ? {}
              : { border: '1px solid rgb(251 251 251 / 58%)' }
          }
        />
        <section id="Currentprojects">
          <CurrentProject theme={theme} language={language} />
        </section>
      </div>
      <section id={theme === 'Light' ? 'footer' : 'footerdark'}>
        <Footer theme={theme} language={language} />
      </section>
    </div>
  )
}
export default AboutPage
