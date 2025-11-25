import { SearchField } from '../common/SearchField'
import heroBg from '../../assets/hero-bg.png'
import '../../styles/components/landing/Hero.scss'
import type { VeterinaryPracticeSearchQueryType } from '../../../../shared/schemas/ZodSchemas'

const searchFilter: VeterinaryPracticeSearchQueryType = {
  name: "",
  address: "",
  animalTypeIds: [],
  serviceTypeIds: []
}

export default function Hero() {
  return (
    <section
      className="hero-clean"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="container">
        <div className="hero-content">
          <h1>Tierarzttermine einfach online buchen</h1>
          <p className="hero-subtitle-clean">
            Finden Sie den passenden Tierarzt in Ihrer Nähe und vereinbaren Sie
            direkt einen Termin
          </p>
          <SearchField searchFilter={searchFilter} />
        </div>
      </div>
    </section>
  )
}
