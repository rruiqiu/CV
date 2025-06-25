import style from '@/styles/navbar.module.css'
import Link from 'next/link'
import { RiTranslate } from 'react-icons/ri'
import { CgDarkMode } from 'react-icons/cg'

interface navbarprops {
  darkmode: string
  language: string
  onUpdateTheme: (newTheme: string) => void
  onUpdateLanguage: (newLanguage: string) => void
}

const navbar: React.FC<navbarprops> = (props) => {
  const handleThemeChange = () => {
    const newTheme = props.darkmode === 'Light' ? 'Dark' : 'Light'
    props.onUpdateTheme(newTheme)
  }

  const handleLanguageChange = () => {
    const newLanguage = props.language === 'En' ? 'CN' : 'En'
    props.onUpdateLanguage(newLanguage)
  }

  return (
    <>
      <nav
        className={
          props.darkmode === 'Light' ? style.navbar : style.navbarDark
        }>
        <div className={style.navbarContainer}>
          <div className={style.functionIcon}>
            {/* <button
              onClick={handleLanguageChange}
              style={{ border: 'none', backgroundColor: 'transparent' }}>
              <Link
                style={
                  props.darkmode === 'Light'
                    ? { color: 'initial' }
                    : { color: 'white' }
                }
                href={''}
                className={style.translatepos}>
                <RiTranslate className={style.translate} />
              </Link>
            </button> */}
            <button
              onClick={handleThemeChange}
              style={{ border: 'none', backgroundColor: 'transparent' }}>
              <Link
                style={
                  props.darkmode === 'Light'
                    ? { color: 'initial' }
                    : { color: 'white' }
                }
                href={''}
                className={style.translatepos}>
                <CgDarkMode className={style.translate} />
              </Link>
            </button>
          </div>

          <ul className={style.ul}>
            <li className={style.liclass}>
              <Link
                className={
                  props.darkmode === 'Light'
                    ? style.linkStyle
                    : style.linkStyleDark
                }
                href={'#about'}>
                About
              </Link>
            </li>
            <li className={style.liclass}>
              <Link
                className={
                  props.darkmode === 'Light'
                    ? style.linkStyle
                    : style.linkStyleDark
                }
                href={'#projects'}>
                Projects
              </Link>
            </li>
            <li className={style.liclass}>
              <Link
                className={
                  props.darkmode === 'Light'
                    ? style.linkStyle
                    : style.linkStyleDark
                }
                href={
                  'https://docs.google.com/document/d/1j9nNT3wDHvmpR8fNpB-89K5S535YI3g3ALRqTHoLcu8/edit?usp=sharing'
                }
                target="_blank"
                rel="noopener noreferrer">
                CV
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default navbar
