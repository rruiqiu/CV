'use client'
import Link from 'next/link'
import style from '@/styles/about.module.css'
import NavBar from '@/components/navbar'
import ProfileImg from '@/public/images/profile.jpg'
import Image from 'next/image'
import Skills from '@/components/skill'
import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { useState } from 'react'
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
        <div className={style.Introcontainer}>
          <div>
            <Image
              src={ProfileImg}
              className={style.Profilepicture}
              sizes="100vw"
              alt="Profile image"
              priority={true}></Image>
            {/* <img src="/images/profile.jpg" alt="" /> */}
          </div>
          <div>
            {language === 'En' ? (
              <h1 className={theme === 'Light' ? style.name : style.nameDark}>
                Richard Qiu
              </h1>
            ) : (
              <h1 className={theme === 'Light' ? style.name : style.nameDark}>
                邱瑞
              </h1>
            )}

            <Link
              style={{ textDecoration: 'none', color: 'initial' }}
              href={'https://github.com/rruiqiu'}
              target="_blank"
              rel="noopener noreferrer">
              <FaGithub
                style={
                  theme === 'Light'
                    ? {
                        fontSize: '32px',
                        color: 'black',
                        marginRight: '15px',
                      }
                    : {
                        fontSize: '32px',
                        color: 'white',
                        marginRight: '15px',
                      }
                }
              />
            </Link>
            <Link
              style={{ textDecoration: 'none', color: 'initial' }}
              href={'https://www.linkedin.com/in/rruiqiu/'}
              target="_blank"
              rel="noopener noreferrer">
              <FaLinkedin
                style={
                  theme === 'Light'
                    ? {
                        fontSize: '32px',
                        color: 'rgb(0, 114, 177)',
                        marginRight: '15px',
                      }
                    : {
                        fontSize: '32px',
                        color: 'white',
                        marginRight: '15px',
                      }
                }
              />
            </Link>
            {language === 'En' ? (
              <p
                className={theme === 'Light' ? style.pstyle : style.pstyleDark}
                style={{
                  marginTop: '0px',
                }}>
                Hi, this is Richard. Welcome to my Homepage! I am currently in
                my final year at McMaster University. My academic interests lie
                in the fields of microelectronics, modern web technologies,
                embedded systems, and IoT devices. I am particularly keen on
                exploring the integration of AI with IoT devices. As a future
                engineer, I am driven to use my skills and knowledge to create
                innovative and intelligent solutions that can improve people's
                daily lives. My passion for technology and its potential to
                bring positive change fuels my desire to stay updated on the
                latest advancements in IoT, AI, and magic phenomena, with the
                goal of making a meaningful impact through technology.
              </p>
            ) : (
              <p
                className={theme === 'Light' ? style.pstyle : style.pstyleDark}
                style={{
                  marginTop: '0px',
                }}>
                你好，我是理查德。欢迎访问我的主页！我目前在麦克马斯特大学攻读最后一年的课程。我的学术兴趣在于微电子学、现代网络技术、嵌入式系统和物联网设备领域。我尤其热衷于探索人工智能与物联网设备的整合。作为一名未来的工程师，我有动力利用自己的技能和知识创造出创新的智能解决方案，改善人们的日常生活。我对技术及其带来积极变化的潜力充满热情，这激发了我不断了解物联网、人工智能和魔法现象最新进展的愿望，目的是通过技术产生有意义的影响。
              </p>
            )}

            {language === 'En' ? (
              <p
                className={theme === 'Light' ? style.pstyle : style.pstyleDark}>
                Education: McMaster Electrical Engineering (2020-2025)
              </p>
            ) : (
              <p
                className={theme === 'Light' ? style.pstyle : style.pstyleDark}>
                教育经历: 麦克马斯特大学 电子信息技术工程 (2020-2025)
              </p>
            )}

            {language === 'En' ? (
              <p
                className={theme === 'Light' ? style.pstyle : style.pstyleDark}>
                Experience: Veoneer Software Engineer Intern (2023-2024)
              </p>
            ) : (
              <p
                className={theme === 'Light' ? style.pstyle : style.pstyleDark}>
                工作经历: 维宁尔 软件工程实习生 (2023-2024)
              </p>
            )}
          </div>
        </div>
        <div>
          <Skills darkmode={theme} language={language} />
        </div>
      </div>
    </div>
  )
}
export default AboutPage
