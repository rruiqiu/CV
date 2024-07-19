'use client'
import style from '@/styles/about.module.css'
import NavBar from '@/components/navbar'
import Skills from '@/components/skill'
import { useState } from 'react'
import About from '@/components/about'
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

        <div>
          <Skills theme={theme} language={language} />
        </div>
      </div>
    </div>
  )
}
export default AboutPage
