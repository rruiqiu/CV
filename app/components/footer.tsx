import styles from '@/styles/footer.module.css'
import { IoMdHome } from 'react-icons/io'
import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { IoDocumentTextOutline } from 'react-icons/io5'
import Link from 'next/link'
interface navbarprops {
  theme: string
  language: string
}
const footer: React.FC<navbarprops> = (props) => {
  return (
    <>
      <div className={styles.footer}>
        <div style={{ marginRight: 'auto' }}>
          <Link href={'/'} target="_blank" rel="noopener noreferrer">
            <IoMdHome
              className={
                props.theme === 'Light' ? styles.lighttheme : styles.darktheme
              }
            />
          </Link>
          <Link
            href={'https://github.com/rruiqiu'}
            target="_blank"
            rel="noopener noreferrer">
            <FaGithub
              className={
                props.theme === 'Light' ? styles.lighttheme : styles.darktheme
              }
            />
          </Link>
          <Link
            href={'https://www.linkedin.com/in/rruiqiu/'}
            target="_blank"
            rel="noopener noreferrer">
            <FaLinkedin
              className={
                props.theme === 'Light' ? styles.lighttheme : styles.darktheme
              }
            />
          </Link>
          {/* <Link
            href={'https://leetcode.com/u/richardddddddd/'}
            target="_blank"
            rel="noopener noreferrer">
            <SiLeetcode
              className={
                props.theme === 'Light' ? styles.lighttheme : styles.darktheme
              }
            />
          </Link> */}
          <Link
            href={
              'https://drive.google.com/file/d/1Lb9H5k3H7RmzQhuHzXHhKdEGrurhTkdE/view?usp=drive_link'
            }
            target="_blank"
            rel="noopener noreferrer">
            <IoDocumentTextOutline
              className={
                props.theme === 'Light' ? styles.lighttheme : styles.darktheme
              }
            />
          </Link>
        </div>
        <div>
          <p
            className={
              styles.footerText +
              ' ' +
              (props.theme === 'Light'
                ? styles.footerTextLight
                : styles.footerTextDark)
            }>
            Made by Richard@2024
          </p>
        </div>
      </div>
    </>
  )
}
export default footer
