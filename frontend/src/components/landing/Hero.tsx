import { SearchField } from '../common/SearchField'
import heroBg from '../../assets/hero-bg.png'
import '../../styles/components/landing/Hero.scss'
import type { AppointmentFilterType, VeterinaryPracticeSearchQueryType } from '../../../../shared/schemas/ZodSchemas'
import { SearchFilter } from '../common/SearchFilter'
import { useState } from 'react'

export default function Hero() {
  const [filterServiceType, setFilterServiceType] = useState<number[]>([]);
  const [filterAnimalType, setFilterAnimalType] = useState<number[]>([]);
  
  const filterOptions: AppointmentFilterType = {
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
  }

  let searchFilter: VeterinaryPracticeSearchQueryType = {
    name: "",
    address: "",
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
    page: 1,
    pageSize: 10
  }

  const handleChangeNameAddress = (newName: string | undefined, newAddress: string | undefined) => {
    if(newName !== undefined){
      searchFilter.name = newName;
    } if(newAddress !== undefined){
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
          <SearchField searchFilter={searchFilter} handleChangeNameAddress={handleChangeNameAddress}/>
          <SearchFilter searchFilter={searchFilter} filterOptions={filterOptions} setFilterServiceType={setFilterServiceType} setFilterAnimalType={setFilterAnimalType} practicePage={null} landingPage={true} />
        </div>
      </div>
    </section>
  )
}
