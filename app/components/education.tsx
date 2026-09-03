import Image, { type StaticImageData } from 'next/image'
import McMasterLogo from '@/public/images/mcmaster-logo-light.png'
import McMasterLogoDark from '@/public/images/mcmaster-logo-dark.png'
import {
  education as educationContent,
  type PortfolioEducationEntry,
} from '@/app/data/projects'
import style from '@/styles/project.module.css'

const GeorgiaTechLogo = '/images/georgia-tech-seal.png'
const GeorgiaTechLogoDark = GeorgiaTechLogo

interface EducationProps {
  theme: string
  language: string
}

interface EducationEntry extends PortfolioEducationEntry {
  logo: StaticImageData | string
  logoWidth: number
  logoHeight: number
  logoClass?: string
  logoFrameClass?: string
  logoAlt: string
}

const Education = ({ theme, language }: EducationProps) => {
  const isEnglish = language === 'En'
  const logoConfigs = [
    {
      logo: theme === 'Light' ? McMasterLogo : McMasterLogoDark,
      logoWidth: 316,
      logoHeight: 168,
      logoClass: style.educationLogoMcMaster,
      logoAlt: isEnglish ? 'McMaster University logo' : '麦克马斯特大学 logo',
    },
    {
      logo: theme === 'Light' ? GeorgiaTechLogo : GeorgiaTechLogoDark,
      logoWidth: 1152,
      logoHeight: 1152,
      logoClass: style.educationLogoGeorgiaTech,
      logoFrameClass: style.educationLogoFrameGeorgiaTech,
      logoAlt: isEnglish ? 'Georgia Tech logo' : '佐治亚理工学院 logo',
    },
  ]
  const entries: EducationEntry[] = educationContent[
    isEnglish ? 'en' : 'zh'
  ].map((entry, index) => ({
    ...entry,
    ...logoConfigs[index],
  }))

  return (
    <section className={style.educationSection} aria-labelledby="education-heading">
      <h1
        id="education-heading"
        className={
          theme === 'Light'
            ? `${style.projectname} ${style.educationHeading}`
            : `${style.projectnameDark} ${style.educationHeading}`
        }>
        {isEnglish ? 'Education' : '教育经历'}
      </h1>

      <div className={style.educationTimeline}>
        {entries.map((entry, index) => (
          <div key={entry.school}>
            <article
              className={
                theme === 'Light'
                  ? style.educationEntry
                  : style.educationEntryDark
              }>
              <div className={style.educationEntryContent}>
                <div className={style.educationEntryHeading}>
                  <div>
                    <h2>{entry.school}</h2>
                    <p className={style.educationDegree}>{entry.degree}</p>
                  </div>
                  <div
                    className={`${style.educationLogoFrame} ${entry.logoFrameClass ?? ''}`}>
                    <Image
                      className={`${style.educationLogo} ${entry.logoClass ?? ''}`}
                      src={entry.logo}
                      alt={entry.logoAlt}
                      width={entry.logoWidth}
                      height={entry.logoHeight}
                      sizes="(max-width: 700px) 112px, 190px"
                    />
                  </div>
                </div>
                <p className={style.educationPeriod}>{entry.period}</p>
                <p className={style.educationFocus}>
                  {isEnglish ? 'Focus: ' : '方向：'}{entry.focus}
                </p>
                <ul className={style.educationBullets}>
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </article>
            {index < entries.length - 1 ? (
              <hr className={style.educationDivider} />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Education
