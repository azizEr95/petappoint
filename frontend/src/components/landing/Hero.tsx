import { useState } from 'react'
import { SearchField } from '../common/SearchField'
import heroBg from '../../assets/hero-bg.png'
import '../../styles/components/landing/Hero.scss'
import { SearchFilter } from '../common/SearchFilter'
import type { AppointmentFilterType, VeterinaryPracticeSearchQueryType } from '../../../../shared/schemas/ZodSchemas'

export default function Hero() {
  const [filterServiceType, setFilterServiceType] = useState<Array<number>>([]);
  const [filterAnimalType, setFilterAnimalType] = useState<Array<number>>([]);
  const [filterAnimal, setFilterAnimal] = useState<number | undefined>(undefined);

  const filterOptions: AppointmentFilterType = {
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
    animal: filterAnimal
  }

  const searchFilter: VeterinaryPracticeSearchQueryType = {
    name: "",
    address: "",
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
    page: 1,
    pageSize: 10
  }

  const handleChangeNameAddress = (newName: string | undefined, newAddress: string | undefined) => {
    console.log(filterAnimalType)
    if (newName !== undefined) {
      searchFilter.name = newName;
    } if (newAddress !== undefined) {
      searchFilter.address = newAddress
    }
  }

  return (
    <section
      id="hero"
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
          <SearchField searchFilter={searchFilter} filterAnimal={filterOptions.animal} handleChangeNameAddress={handleChangeNameAddress} />
          <SearchFilter searchFilter={searchFilter} filterOptions={filterOptions} setFilterServiceType={setFilterServiceType} setFilterAnimalType={setFilterAnimalType} setFilterAnimal={setFilterAnimal} practicePage={null} landingPage={true} />
        </div>
      </div>
    </section>
  )
}
