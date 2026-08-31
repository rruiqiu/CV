'use client'
import Link from 'next/link'
import style from '@/styles/about.module.css'
import ProfileImg from '@/public/images/profile.jpg'
import Image from 'next/image'
import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'

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
              <>
                <p
                  className={
                    props.theme === 'Light' ? style.pstyle : style.pstyleDark
                  }
                  style={{
                    marginTop: '0px',
                  }}>
                  Hi, I'm Richard — a software engineer based in Toronto.
                </p>
                <p
                  className={
                    props.theme === 'Light' ? style.pstyle : style.pstyleDark
                  }
                  style={{
                    marginTop: '0px',
                  }}>
                  I build infrastructure and applications that make software
                  delivery and real-world operations more reliable. At ArcTrade,
                  I work on CI/CD and platform tooling for 300+ AWS-hosted
                  microservices. Previously at Veoneer, I built manufacturing and
                  warehouse software, including a system that reduced order cycle
                  time by 70%. I graduated from McMaster University with a B.Eng.
                  in Electrical Engineering and will begin Georgia Tech's
                  part-time OMSCS in 2027, focusing on computing systems and
                  machine learning.
                </p>
              </>
            ) : (
              <p
                className={
                  props.theme === 'Light' ? style.pstyle : style.pstyleDark
                }
                style={{
                  marginTop: '0px',
                }}>
                你好，我是邱瑞，一名在多伦多工作的软件工程师。我专注于构建让软件交付和实际运营更加可靠的基础设施与应用。目前在 ArcTrade，我负责支持 300+ 个 AWS 微服务的 CI/CD 与平台工具；此前在 Veoneer，我开发过制造业和仓储软件，其中一套系统将订单周期缩短了 70%。我毕业于麦克马斯特大学电气工程专业，并将在 2027 年开始佐治亚理工学院的非全日制 OMSCS，计划专注于计算系统与机器学习。
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
