'use client'
import Link from 'next/link'
import style from '@/styles/about.module.css'
import ProfileImg from '@/public/images/profile.jpg'
import Image from 'next/image'
import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { introduction } from '@/app/data/projects'

interface navbarprops {
  theme: string
  language: string
}
const about: React.FC<navbarprops> = (props) => {
  const introductionCopy = props.language === 'En' ? introduction.en : introduction.zh

  return (
    <>
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
            {props.language === 'En' ? (
              <h1
                className={
                  props.theme === 'Light' ? style.name : style.nameDark
                }>
                Richard Qiu
              </h1>
            ) : (
              <h1
                className={
                  props.theme === 'Light' ? style.name : style.nameDark
                }>
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
                  props.theme === 'Light'
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
                  props.theme === 'Light'
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
            <>
              <p
                lang={props.language === 'En' ? 'en' : 'zh-CN'}
                className={
                  props.theme === 'Light' ? style.pstyle : style.pstyleDark
                }
                  style={{
                    marginTop: '0px',
                  }}>
                {introductionCopy.headline}
              </p>
              <p
                lang={props.language === 'En' ? 'en' : 'zh-CN'}
                className={
                  props.theme === 'Light' ? style.pstyle : style.pstyleDark
                }
                style={{
                  marginTop: '0px',
                }}>
                {introductionCopy.body}
              </p>
            </>

            {/* {props.language === 'En' ? (
              <p
                className={
                  props.theme === 'Light' ? style.pstyle : style.pstyleDark
                }>
                Education: McMaster Electrical Engineering (2020-2025)
              </p>
            ) : (
              <p
                className={
                  props.theme === 'Light' ? style.pstyle : style.pstyleDark
                }>
                教育经历: 麦克马斯特大学 电子信息技术工程 (2020-2025)
              </p>
            )} */}

            {/* {props.language === 'En' ? (
              <p
                className={
                  props.theme === 'Light' ? style.pstyle : style.pstyleDark
                }>
                Experience: Veoneer Software Engineer Intern (2023-2024)
              </p>
            ) : (
              <p
                className={
                  props.theme === 'Light' ? style.pstyle : style.pstyleDark
                }>
                工作经历: 维宁尔 软件工程实习生 (2023-2024)
              </p>
            )} */}
          </div>
        </div>
      </div>
    </>
  )
}

export default about
