import style from '@/styles/navbar.module.css'
import Link from 'next/link'
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
              type="button"
              onClick={handleThemeChange}
              className={`${style.themeButton} ${
                props.darkmode === 'Light'
                  ? style.themeButtonLight
                  : style.themeButtonDark
              }`}
              aria-label={
                props.darkmode === 'Light'
                  ? 'Switch to dark theme'
                  : 'Switch to light theme'
              }
              aria-pressed={props.darkmode === 'Dark'}>
              <CgDarkMode className={style.translate} aria-hidden="true" />
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
                href={'#education'}>
                Education
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
                  'https://drive.google.com/file/d/1Lb9H5k3H7RmzQhuHzXHhKdEGrurhTkdE/view?usp=drive_link'
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
