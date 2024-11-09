'use client'
import Link from 'next/link'
import style from '@/styles/about.module.css'
import NavBar from '@/app/components/navbar'
import ProfileImg from '@/public/images/profile.jpg'
import Image from 'next/image'
import Skills from '@/app/components/skill'
import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { useState } from 'react'

interface navbarprops {
  theme: string
  language: string
}
const about: React.FC<navbarprops> = (props) => {
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
            {props.language === 'En' ? (
              <p
                className={
                  props.theme === 'Light' ? style.pstyle : style.pstyleDark
                }
                style={{
                  marginTop: '0px',
                }}>
                Hi, this is Richard – welcome to my homepage! I'm in my final
                year at McMaster University, where I focus my study on computing
                systems, high-performance computing, computer architecture,
                operating systems, machine learning, and modern web
                technologies. As an aspiring engineer, I am driven to apply my
                skills and knowledge to develop innovative solutions that can
                improve people's daily lives. My passion for creating positive
                change keeps me engaged with the latest technologies, with the
                goal of making a meaning impact to the society.
              </p>
            ) : (
              <p
                className={
                  props.theme === 'Light' ? style.pstyle : style.pstyleDark
                }
                style={{
                  marginTop: '0px',
                }}>
                你好，我是邱瑞——欢迎来到我的个人主页！我现在是麦克马斯特大学的最后一年，我的研究重点是计算系统、高性能计算、计算机体系结构、操作系统、机器学习和现代网络技术。作为一名有抱负的工程师，我致力于运用我的技能和知识来开发创新的解决方案，以改善人们的日常生活。我对创造积极变革的热情使我不断接触最新技术，目标是对社会产生有意义的影响。
              </p>
            )}

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
