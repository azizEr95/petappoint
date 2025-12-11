import { createFileRoute } from '@tanstack/react-router'
import { useLoginContext } from '../LoginContext'
import Hero from '../components/landing/Hero'
import FeaturesOverview from '../components/landing/FeaturesOverview'
import BenefitsOwners from '../components/landing/BenefitsOwners'
import AppPromo from '../components/landing/AppPromo'
import BenefitsVets from '../components/landing/BenefitsVets'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'
import CTABanner from '../components/landing/CTABanner'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { login } = useLoginContext()

  return (
    <div>
      <Hero />
      {!login && <FeaturesOverview />}
      <BenefitsOwners />
      <AppPromo />
      <BenefitsVets />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </div>
  )
}
