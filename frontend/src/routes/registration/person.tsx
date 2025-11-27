import { createFileRoute } from '@tanstack/react-router'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { PersonsCreateSchema } from '../../../../shared/schemas/ZodSchemas'
import '../../styles/routes/personRegistration.scss'

export const Route = createFileRoute('/registration/person')({
  component: PersonRegistration,
})

function PersonRegistration() {

  const [firstName, setFirstName]=useState('')
  const [lastName, setLastName]=useState('')
  const [strasse, setStrasse]=useState('')
  const [hausnr, setHausnr]= useState('')
  const [plz, setPlz]= useState('')
  const [stadt, setStadt]= useState('')
  const [land, setLand]= useState('')
  const [email, setEmail]= useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone]= useState('')
  const [dateOfBirth, setDateOfBirth]= useState('')
  const [sex, setSex]= useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    switch(name) {
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
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
      case 'dateOfBirth':
        setDateOfBirth(value)
        break
      case 'sex':
        setSex(value)
        break
      default:
        console.log('Error: Fehler beim Aendern von personRegistration State in handleChange')
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const person={
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      phone: phone,
      dateOfBirth: dateOfBirth,
      sex:sex,
      addresses: {
        street: strasse + hausnr,
        citycode: plz,
        city: stadt,
      },


    }
    try{
      console.log(person)
      PersonsCreateSchema.parse(person)
    }catch(e){
      console.log('Zod Error: personRegistration'+ e)
    }

  } 
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Registrierung</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="form-section-title">Persönliche Daten</h2>

              <div className="form-row equal-col">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">Vorname *</label>
                  <input
                    id="firstName"
                    type="text"
                    className="form-input"
                    placeholder="Max"
                    name="firstName"
                    onChange={handleChange}
                    value={firstName}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Nachname *</label>
                  <input
                    id="lastName"
                    type="text"
                    className="form-input"
                    placeholder="Mustermann"
                    name="lastName"
                    onChange={handleChange}
                    value={lastName}
                    required
                  />
                </div>
              </div>

              <div className="form-row equal-col">
                <div className="form-group">
                  <label htmlFor="dateOfBirth" className="form-label">Geburtsdatum *</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className="form-input"
                    name="dateOfBirth"
                    onChange={handleChange}
                    value={dateOfBirth}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sex" className="form-label">Geschlecht *</label>
                  <select
                    id="sex"
                    className="form-input"
                    name="sex"
                    onChange={handleChange}
                    value={sex}
                    required
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Male">Männlich</option>
                    <option value="Female">Weiblich</option>
                    <option value="Diverse">Divers</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Kontaktdaten</h2>

              <div className="form-group">
                <label htmlFor="email" className="form-label">E-Mail *</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="ihre@email.de"
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

            <button type="submit" className="auth-button">
              Registrieren
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
