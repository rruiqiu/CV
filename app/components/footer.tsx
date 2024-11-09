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
          <Link href={'/'}>
            <IoMdHome
              className={
                props.theme === 'Light' ? styles.lighttheme : styles.darktheme
              }
            />
          </Link>
          <Link href={'https://github.com/rruiqiu'}>
            <FaGithub
              className={
                props.theme === 'Light' ? styles.lighttheme : styles.darktheme
              }
            />
          </Link>
          <Link href={'https://www.linkedin.com/in/rruiqiu/'}>
            <FaLinkedin
              className={
                props.theme === 'Light' ? styles.lighttheme : styles.darktheme
              }
            />
          </Link>
          <Link
            href={
              'https://drive.google.com/file/d/1k0nkukyJFc_dywqHLxVVPFd0glEgfqN8/view?usp=sharing'
            }>
            <IoDocumentTextOutline
              className={
                props.theme === 'Light' ? styles.lighttheme : styles.darktheme
              }
            />
          </Link>
        </div>
        <div>
          <p
            style={
              props.theme === 'Light'
                ? { fontSize: '20px', margin: '0px', opacity: '0.8' }
                : {
                    fontSize: '20px',
                    margin: '0px',
                    opacity: '0.8',
                    color: 'white',
                  }
            }>
            Made by Richard@2024
          </p>
        </div>
      </div>
    </>
  )
}
export default footer
