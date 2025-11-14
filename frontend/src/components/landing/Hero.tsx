import { SearchField } from '../SearchField'
import heroBg from '../../assets/hero-bg.png'
import styles from '../../styles/hero.modules.css'

export default function Hero() {
  return (
    <section
      className={styles.heroClean}
      style={{ '--hero-bg': `url(${heroBg})` } as React.CSSProperties}
    >
      <div className="container">
        <div className={styles.heroContent}>
          <h1>Tierarzttermine einfach online buchen</h1>
          <p className={styles.heroSubtitleClean}>
            Finden Sie den passenden Tierarzt in Ihrer Nähe und vereinbaren Sie
            direkt einen Termin
          </p>
          <SearchField searchNameBeginn="" searchOrtBeginn="" />
        </div>
      </div>
    </section>
  )
}
