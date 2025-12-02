import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import '../../styles/routes/veterinaryRegistration.scss'
import {
  VeterinaryPracticeCreateSchema,
  type VeterinaryPracticesCreateType,
} from '../../../../shared/schemas/ZodSchemas'
import { useMutation } from '@tanstack/react-query'
import { createVeterinaryPractice } from '../../api/VeterinaryPracticeAPI'
import { Form, FormGroup } from 'react-bootstrap'

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const navigate = useNavigate()

  const validateField = (name: string, value: string) => {
    let error = ''

    if (name === 'name') {
      if (!value.trim()) {
        error = 'Praxisname ist erforderlich'
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(value)) {
        error = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
      } else if (value.length < 3) {
        error = 'Praxisname muss mindestens aus 3 Zeichen bestehen'
      }
    }

    if (name === 'strasse') {
      if (!value.trim()) {
        error = 'Straße ist erforderlich'
      } else if (
        !/^(?=.*[a-zA-ZäöüÄÖÜß0-9])[a-zA-ZäöüÄÖÜß0-9 '`.-]+$/.test(value)
      ) {
        error =
          'Straße muss mindestens einen Buchstaben oder eine Zahl enthalten'
      } else if (value.length < 3) {
        error = 'Straße muss mindestens aus 3 Zeichen bestehen'
      }
    }

    if (name === 'hausnr') {
      if (!value.trim()) {
        error = 'Hausnummer ist erforderlich'
      } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(value)) {
        error = 'Hausnummer muss mindestens eine Zahl enthalten'
      }
    }

    if (name === 'plz') {
      if (!value.trim()) {
        error = 'Postleitzahl ist erforderlich'
      } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(value)) {
        error = 'Postleitzahl muss mindestens eine Zahl enthalten'
      }
    }

    if (name === 'stadt') {
      if (!value.trim()) {
        error = 'Stadt ist erforderlich'
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(value)) {
        error = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
      } else if (value.length < 3) {
        error = 'Stadt muss mindestens aus 3 Zeichen bestehen'
      }
    }

    if (name === 'land') {
      if (!value.trim()) {
        error = 'Land ist erforderlich'
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(value)) {
        error = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
      } else if (value.length < 3) {
        error = 'Land muss mindestens aus 3 Zeichen bestehen'
      }
    }

    if (name === 'email') {
      if (!value.trim()) {
        error = 'E-Mail ist erforderlich'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        error = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
      } else if ((value.match(/@/g) || []).length !== 1) {
        error = 'E-Mail darf nur ein @ enthalten'
      } else {
        const beforeAt = value.split('@')[0]
        if (!/[a-zA-Z]/.test(beforeAt)) {
          error = 'E-Mail muss vor dem @ mindestens einen Buchstaben enthalten'
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        ) {
          error = 'E-Mail enthält ungültige Zeichen'
        }
      }
    }

    if (name === 'password') {
      if (!value.trim()) {
        error = 'Passwort ist erforderlich'
      } else if (value.length < 6) {
        error = 'Passwort muss mindestens aus 6 Zeichen bestehen'
      } else if (!/[A-Z]/.test(value)) {
        error = 'Passwort muss mindestens einen Großbuchstaben enthalten'
      } else if (!/[0-9]/.test(value)) {
        error = 'Passwort muss mindestens eine Zahl enthalten'
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        error = 'Passwort muss mindestens ein Sonderzeichen enthalten'
      }
    }

    if (name === 'phone') {
      if (!value.trim()) {
        error = 'Telefon ist erforderlich'
      } else if (!/^[+]?[0-9]+$/.test(value)) {
        error = 'Telefon darf nur Zahlen und optional ein + am Anfang enthalten'
      } else {
        const numbers = value.replace('+', '')
        if (numbers.length < 6) {
          error = 'Telefon muss mindestens aus 6 Zahlen bestehen'
        }
      }
    }

    if (name === 'infoemail') {
      if (value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          error = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
        } else if ((value.match(/@/g) || []).length !== 1) {
          error = 'E-Mail darf nur ein @ enthalten'
        } else {
          const beforeAt = value.split('@')[0]
          if (!/[a-zA-Z]/.test(beforeAt)) {
            error =
              'E-Mail muss vor dem @ mindestens einen Buchstaben enthalten'
          } else if (
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ) {
            error = 'E-Mail enthält ungültige Zeichen'
          }
        }
      }
    }

    if (name === 'website') {
      if (value.trim()) {
        if (!/^https?:\/\/.+\..+/.test(value)) {
          error =
            'Bitte geben Sie eine gültige URL ein (z.B. https://beispiel.de)'
        }
      }
    }

    return error
  }

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const name = e.target.name
    const value = e.target.value

    const error = validateField(name, value)

    if (error) {
      setErrors({ ...errors, [name]: error })
    } else {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Praxisname ist erforderlich'
    } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(name)) {
      newErrors.name =
        'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
    } else if (name.length < 3) {
      newErrors.name = 'Praxisname muss mindestens aus 3 Zeichen bestehen'
    }

    if (!strasse.trim()) {
      newErrors.strasse = 'Straße ist erforderlich'
    } else if (
      !/^(?=.*[a-zA-ZäöüÄÖÜß0-9])[a-zA-ZäöüÄÖÜß0-9 '`.-]+$/.test(strasse)
    ) {
      newErrors.strasse =
        'Straße muss mindestens einen Buchstaben oder eine Zahl enthalten'
    } else if (strasse.length < 3) {
      newErrors.strasse = 'Straße muss mindestens aus 3 Zeichen bestehen'
    }

    if (!hausnr.trim()) {
      newErrors.hausnr = 'Hausnummer ist erforderlich'
    } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(hausnr)) {
      newErrors.hausnr = 'Hausnummer muss mindestens eine Zahl enthalten'
    }

    if (!plz.trim()) {
      newErrors.plz = 'Postleitzahl ist erforderlich'
    } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(plz)) {
      newErrors.plz = 'Postleitzahl muss mindestens eine Zahl enthalten'
    }

    if (!stadt.trim()) {
      newErrors.stadt = 'Stadt ist erforderlich'
    } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(stadt)) {
      newErrors.stadt =
        'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
    } else if (stadt.length < 3) {
      newErrors.stadt = 'Stadt muss mindestens aus 3 Zeichen bestehen'
    }

    if (!land.trim()) {
      newErrors.land = 'Land ist erforderlich'
    } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(land)) {
      newErrors.land =
        'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
    } else if (land.length < 3) {
      newErrors.land = 'Land muss mindestens aus 3 Zeichen bestehen'
    }

    if (!email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    } else if ((email.match(/@/g) || []).length !== 1) {
      newErrors.email = 'E-Mail darf nur ein @ enthalten'
    } else {
      const beforeAt = email.split('@')[0]
      if (!/[a-zA-Z]/.test(beforeAt)) {
        newErrors.email =
          'E-Mail muss vor dem @ mindestens einen Buchstaben enthalten'
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
      ) {
        newErrors.email = 'E-Mail enthält ungültige Zeichen'
      }
    }

    if (!password.trim()) {
      newErrors.password = 'Passwort ist erforderlich'
    } else if (password.length < 6) {
      newErrors.password = 'Passwort muss mindestens aus 6 Zeichen bestehen'
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        'Passwort muss mindestens einen Großbuchstaben enthalten'
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Passwort muss mindestens eine Zahl enthalten'
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      newErrors.password =
        'Passwort muss mindestens ein Sonderzeichen enthalten'
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefon ist erforderlich'
    } else if (!/^[+]?[0-9]+$/.test(phone)) {
      newErrors.phone =
        'Telefon darf nur Zahlen und optional ein + am Anfang enthalten'
    } else {
      const numbers = phone.replace('+', '')
      if (numbers.length < 6) {
        newErrors.phone = 'Telefon muss mindestens aus 6 Zahlen bestehen'
      }
    }

    if (infoemail.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(infoemail)) {
        newErrors.infoemail = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
      } else if ((infoemail.match(/@/g) || []).length !== 1) {
        newErrors.infoemail = 'E-Mail darf nur ein @ enthalten'
      } else {
        const beforeAt = infoemail.split('@')[0]
        if (!/[a-zA-Z]/.test(beforeAt)) {
          newErrors.infoemail =
            'E-Mail muss vor dem @ mindestens einen Buchstaben enthalten'
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(infoemail)
        ) {
          newErrors.infoemail = 'E-Mail enthält ungültige Zeichen'
        }
      }
    }

    if (website.trim()) {
      if (!/^https?:\/\/.+\..+/.test(website)) {
        newErrors.website =
          'Bitte geben Sie eine gültige URL ein (z.B. https://beispiel.de)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const { mutate: mutateCreatePractice } = useMutation({
    mutationFn: (practice: VeterinaryPracticesCreateType) =>
      createVeterinaryPractice(practice),
    onError: (e) => {
      console.log(e)
    },
    onSuccess: () => {
      console.log('success')
      navigate({ to: '/' })
    },
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const t = e.target
    const name = t.name
    const value = t.value

    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }

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
        console.log(
          'Error: Fehler beim Aendern von veterinaryRegistration State in handleChange',
        )
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      console.log('Formular enthält Fehler')
      return
    }

    const practice: VeterinaryPracticesCreateType = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      infoEmail: infoemail,
      website: website,
      info: info,
      address: {
        street: strasse + hausnr,
        cityCode: plz,
        city: stadt,
        country: land,
        longitude: 0,
        latitude: 0,
      },
    }
    try {
      VeterinaryPracticeCreateSchema.parse(practice)
      mutateCreatePractice(practice)
      console.log('mutate')
    } catch (e) {
      console.log('Zod Error: veterinaryRegistration ' + e)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Praxis registrieren</h1>

          <Form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="form-section-title">Praxisdaten</h2>

              <FormGroup className="form-group">
                <Form.Label htmlFor="name" className="form-label">
                  Praxisname *
                </Form.Label>
                <Form.Control
                  id="name"
                  type="text"
                  placeholder="Tierarztpraxis Mustertier"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={name}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </FormGroup>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="email" className="form-label">
                    E-Mail *
                  </Form.Label>
                  <Form.Control
                    id="email"
                    type="email"
                    placeholder="praxis@beispiel.de"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={email}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="phone" className="form-label">
                    Telefon *
                  </Form.Label>
                  <Form.Control
                    id="phone"
                    type="tel"
                    placeholder="+49 123 456789"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={phone}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              <FormGroup className="form-group">
                <Form.Label htmlFor="password" className="form-label">
                  Passwort *
                </Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={password}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </FormGroup>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Adresse</h2>

              <div className="form-row two-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="strasse" className="form-label">
                    Straße *
                  </Form.Label>
                  <Form.Control
                    id="strasse"
                    type="text"
                    placeholder="Musterstraße"
                    name="strasse"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={strasse}
                    isInvalid={!!errors.strasse}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.strasse}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="hausnr" className="form-label">
                    Nr. *
                  </Form.Label>
                  <Form.Control
                    id="hausnr"
                    type="text"
                    placeholder="1"
                    name="hausnr"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={hausnr}
                    isInvalid={!!errors.hausnr}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hausnr}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="plz" className="form-label">
                    PLZ *
                  </Form.Label>
                  <Form.Control
                    id="plz"
                    type="text"
                    placeholder="12345"
                    name="plz"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={plz}
                    isInvalid={!!errors.plz}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.plz}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="stadt" className="form-label">
                    Stadt *
                  </Form.Label>
                  <Form.Control
                    id="stadt"
                    type="text"
                    placeholder="Musterstadt"
                    name="stadt"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={stadt}
                    isInvalid={!!errors.stadt}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stadt}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              <FormGroup className="form-group">
                <Form.Label htmlFor="land" className="form-label">
                  Land *
                </Form.Label>
                <Form.Control
                  id="land"
                  type="text"
                  placeholder="Deutschland"
                  name="land"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={land}
                  isInvalid={!!errors.land}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.land}
                </Form.Control.Feedback>
              </FormGroup>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Zusätzliche Informationen</h2>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="infoemail" className="form-label">
                    Info E-Mail
                  </Form.Label>
                  <Form.Control
                    id="infoemail"
                    type="email"
                    placeholder="info@beispiel.de"
                    name="infoemail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={infoemail}
                    isInvalid={!!errors.infoemail}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.infoemail}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="website" className="form-label">
                    Webseite
                  </Form.Label>
                  <Form.Control
                    id="website"
                    type="url"
                    placeholder="https://beispiel.de"
                    name="website"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={website}
                    isInvalid={!!errors.website}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.website}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              <FormGroup className="form-group">
                <Form.Label htmlFor="info" className="form-label">
                  Praxisbeschreibung
                </Form.Label>
                <Form.Control
                  as="textarea"
                  id="info"
                  className="form-textarea"
                  placeholder="Beschreibung Ihrer Praxis..."
                  name="info"
                  onChange={handleChange}
                  value={info}
                />
              </FormGroup>
            </div>

            <button type="submit" className="auth-button">
              Praxis registrieren
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}
