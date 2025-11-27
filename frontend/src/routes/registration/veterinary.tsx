import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import '../../styles/routes/veterinaryRegistration.scss'
import { VeterinaryPracticeCreateSchema, type VeterinaryPracticesCreateType } from '../../../../shared/schemas/ZodSchemas'
import { useMutation } from '@tanstack/react-query'
import { creatVeterinaryPractice } from '../../api/VeterinaryPracticeAPI'

export const Route = createFileRoute('/registration/veterinary')({
  component: VeterinaryRegistration,
})

function VeterinaryRegistration() {
  const [name, setName] = useState('')
  const [strasse, setStrasse] = useState('')
  const [hausnr, setHausnr] = useState('')
  const [plz, setPlz] = useState('')
  const [stadt, setStadt] = useState('')
  const [land, setLand] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [infoemail, setInfoemail] = useState('')
  const [website, setWebsite] = useState('')
  const [info, setInfo] = useState('')
  const navigate = useNavigate();
  // TODO: Adresse fehlt noch
  // const navigate = useNavigate();

  
  // edit appoinment, set animalID and serviceID
  const { mutate: mutateCreatePractice } = useMutation({
    mutationFn: (practice: VeterinaryPracticesCreateType) =>
      creatVeterinaryPractice(practice),
    onError: (e) => {
      // appoinment is not available anymore
      console.log(e);
    },
    onSuccess: () => {
      // appointment was successful booked
      console.log("success");
      navigate({to: "/"})
    },
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    switch (name) {
      case 'name':
        setName(value)
        break
      case 'strasse':
        setStrasse(value)
        break
      case 'hausnr':
        setHausnr(value)
        break
      case 'plz':
        setPlz(value)
        break
      case 'stadt':
        setStadt(value)
        break
      case 'land':
        setLand(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'phone':
        setPhone(value)
        break
      case 'infoemail':
        setInfoemail(value)
        break
      case 'website':
        setWebsite(value)
        break
      case 'info':
        setInfo(value)
        break
      default:
        console.log('Error: Fehler beim Aendern von veterinaryRegistration State in handleChange')
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // zuerst Adresse ueberpruefen dann erstellen
    // anschließend Tierarztpraxis erstellen
    // was machen wenn ZOD Error geworfen wurde??

    // wie longitude und latitude uebergeben????
    const practice:VeterinaryPracticesCreateType = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      infoemail: infoemail,
      website: website,
      info: info,
      addresses: {
        street: strasse + hausnr,
        citycode: plz,
        city: stadt,
        country:land,
        longitude: 0,
        latitude: 0,
      },
    }
    try {
     
      VeterinaryPracticeCreateSchema.parse(practice)
      mutateCreatePractice(practice)
      console.log("mutate")
    } catch (e) {
      console.log('Zod Error: veterinaryRegistration ' + e)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Praxis registrieren</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="form-section-title">Praxisdaten</h2>

              <div className="form-group">
                <label htmlFor="name" className="form-label">Praxisname *</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Tierarztpraxis Mustertier"
                  name="name"
                  onChange={handleChange}
                  value={name}
                  required
                />
              </div>

              <div className="form-row equal-col">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">E-Mail *</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="praxis@beispiel.de"
                    name="email"
                    onChange={handleChange}
                    value={email}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Telefon *</label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+49 123 456789"
                    name="phone"
                    onChange={handleChange}
                    value={phone}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Passwort *</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  name="password"
                  onChange={handleChange}
                  value={password}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Adresse</h2>

              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="strasse" className="form-label">Straße *</label>
                  <input
                    id="strasse"
                    type="text"
                    className="form-input"
                    placeholder="Musterstraße"
                    name="strasse"
                    onChange={handleChange}
                    value={strasse}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hausnr" className="form-label">Nr. *</label>
                  <input
                    id="hausnr"
                    type="text"
                    className="form-input"
                    placeholder="1"
                    name="hausnr"
                    onChange={handleChange}
                    value={hausnr}
                    required
                  />
                </div>
              </div>

              <div className="form-row equal-col">
                <div className="form-group">
                  <label htmlFor="plz" className="form-label">PLZ *</label>
                  <input
                    id="plz"
                    type="text"
                    className="form-input"
                    placeholder="12345"
                    name="plz"
                    onChange={handleChange}
                    value={plz}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stadt" className="form-label">Stadt *</label>
                  <input
                    id="stadt"
                    type="text"
                    className="form-input"
                    placeholder="Musterstadt"
                    name="stadt"
                    onChange={handleChange}
                    value={stadt}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="land" className="form-label">Land *</label>
                <input
                  id="land"
                  type="text"
                  className="form-input"
                  placeholder="Deutschland"
                  name="land"
                  onChange={handleChange}
                  value={land}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Zusätzliche Informationen</h2>

              <div className="form-row equal-col">
                <div className="form-group">
                  <label htmlFor="infoemail" className="form-label">Info E-Mail</label>
                  <input
                    id="infoemail"
                    type="email"
                    className="form-input"
                    placeholder="info@beispiel.de"
                    name="infoemail"
                    onChange={handleChange}
                    value={infoemail}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website" className="form-label">Webseite</label>
                  <input
                    id="website"
                    type="url"
                    className="form-input"
                    placeholder="https://beispiel.de"
                    name="website"
                    onChange={handleChange}
                    value={website}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="info" className="form-label">Praxisbeschreibung</label>
                <textarea
                  id="info"
                  className="form-input form-textarea"
                  placeholder="Beschreibung Ihrer Praxis..."
                  name="info"
                  onChange={handleChange}
                  value={info}
                />
              </div>
            </div>

            <button type="submit" className="auth-button">
              Praxis registrieren
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
