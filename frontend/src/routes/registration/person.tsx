import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Form, FormGroup } from 'react-bootstrap'
import { PersonsCreateSchema } from '../../../../shared/schemas/ZodSchemas'
import '../../styles/routes/personRegistration.scss'
import { personRegistration } from '../../api/LoginAPI'
import { useLoginContext } from '../../LoginContext'
import type {PersonsCreateType, sexesType} from '../../../../shared/schemas/ZodSchemas';
import type {FormEvent} from 'react';

export const Route = createFileRoute('/registration/person')({
  component: PersonRegistration,
})

function PersonRegistration() {
  const navigate = useNavigate()
  const location = useLocation()
  const appointment = location.state.appointment
  // const selectedService = location.state.selectedService
  const { setLogin } = useLoginContext()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [strasse, setStrasse] = useState('')
  const [hausnr, setHausnr] = useState('')
  const [plz, setPlz] = useState('')
  const [stadt, setStadt] = useState('')
  const [land, setLand] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [sex, setSex] = useState<sexesType | undefined>(undefined)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Password validation state
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  // Function to check password requirements
  const checkPasswordRequirements = (pwd: string) => {
    setPasswordRequirements({
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    })
  }

  // Helper function to calculate age
  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  // Get max date (today) in YYYY-MM-DD format
  const getMaxDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const { mutate: mutateRegistration } = useMutation({
    mutationFn: (person: PersonsCreateType) => personRegistration(person),
    onSuccess: (data) => {
      setLogin(data)
      if(appointment !== undefined){
        navigate({ 
          to: '/registration/verify-email',
          state: {
            appointment: appointment
          }
        })

      } else {
        navigate({ 
          to: '/registration/verify-email',
        })
      }
    },
  })

  const validateField = (name: string, value: string) => {
    let error = ''

    if (name === 'firstName') {
      if (!value.trim()) {
        error = 'Vorname ist erforderlich'
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(value)) {
        error = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
      } else if (value.length < 3) {
        error = 'Vorname muss mindestens aus 3 Zeichen bestehen'
      }
    }

    if (name === 'lastName') {
      if (!value.trim()) {
        error = 'Nachname ist erforderlich'
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(value)) {
        error = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
      } else if (value.length < 3) {
        error = 'Nachname muss mindestens aus 3 Zeichen bestehen'
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
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(stadt)) {
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
      } else if (value.length < 8) {
        error = 'Passwort muss mindestens aus 8 Zeichen bestehen'
      } else if (!/[A-Z]/.test(value)) {
        error = 'Passwort muss mindestens einen Großbuchstaben enthalten'
      } else if (!/[0-9]/.test(value)) {
        error = 'Passwort muss mindestens eine Zahl enthalten'
      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
        error = 'Passwort muss mindestens ein Sonderzeichen enthalten'
      }
    }
    
    if (name === 'confirmPassword') {
      if (!value.trim()) {
        error = 'Passwort-Wiederholung ist erforderlich'
      } else if (value !== password) {
        error = 'Passwörter stimmen nicht überein'
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
    
    if (name === 'dateOfBirth') {
      if (!value.trim()) {
        error = 'Geburtsdatum ist erforderlich'
      } else {
        const birthDate = new Date(value)
        const today = new Date()
        
        // Check if date is in the future
        if (birthDate > today) {
          error = 'Geburtsdatum darf nicht in der Zukunft liegen'
        } else {
          const age = calculateAge(birthDate)
          if (age < 14) {
            error = 'Sie müssen mindestens 14 Jahre alt sein'
          }
        }
      }
    }
    
    if (name === 'sex') {
      if (!value) error = 'Geschlecht ist erforderlich'
    }

    return error
  }

  const handleBlur = (e: any) => {
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

    if (!firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich'
    } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(firstName)) {
      newErrors.firstName =
        'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
    } else if (firstName.length < 3) {
      newErrors.firstName = 'Vorname muss mindestens aus 3 Zeichen bestehen'
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich'
    } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(lastName)) {
      newErrors.lastName =
        'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
    } else if (lastName.length < 3) {
      newErrors.lastName = 'Nachname muss mindestens aus 3 Zeichen bestehen'
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
    } else if (password.length < 8) {
      newErrors.password = 'Passwort muss mindestens aus 8 Zeichen bestehen'
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        'Passwort muss mindestens einen Großbuchstaben enthalten'
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Passwort muss mindestens eine Zahl enthalten'
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      newErrors.password =
        'Passwort muss mindestens ein Sonderzeichen enthalten'
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Passwort-Wiederholung ist erforderlich'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein'
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
    
    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Geburtsdatum ist erforderlich'
    } else {
      const birthDate = new Date(dateOfBirth)
      const today = new Date()
      
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Geburtsdatum darf nicht in der Zukunft liegen'
      } else {
        const age = calculateAge(birthDate)
        if (age < 14) {
          newErrors.dateOfBirth = 'Sie müssen mindestens 14 Jahre alt sein'
        }
      }
    }
    
    if (!sex) newErrors.sex = 'Geschlecht ist erforderlich'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const scrollToFirstError = (errors: { [key: string]: string }) => {
    const firstErrorKey = Object.keys(errors)[0]
    if (firstErrorKey) {
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Optional: Fokus auf das Feld setzen
        ;(errorElement as HTMLElement).focus()
      }
    }
  }

  const handleChange = (e: any) => {
    const t = e.target
    const name = t.name
    const value = t.value

    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }

    switch (name) {
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
        checkPasswordRequirements(value)
        // Check confirmPassword when password changes
        if (confirmPassword && value !== confirmPassword) {
          setErrors({ ...errors, confirmPassword: 'Passwörter stimmen nicht überein' })
        } else if (confirmPassword && value === confirmPassword) {
          const newErrors = { ...errors }
          delete newErrors.confirmPassword
          setErrors(newErrors)
        }
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
      case 'phone':
        setPhone(value)
        break
      case 'dateOfBirth':
        setDateOfBirth(value)
        break
      case 'sex':
        if (value === '') {
          setSex('not_known')
        } else if (value === 'male') {
          setSex('male')
        } else if (value === 'female') {
          setSex(value)
        } else if (value === 'not_applicable') {
          setSex(value)
        }
        break
      default:
        console.log(
          'Error: Fehler beim Aendern von personRegistration State in handleChange',
        )
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      console.log('Formular enthält Fehler')
      // Zum ersten Fehler scrollen
      setTimeout(() => {
        scrollToFirstError(errors)
      }, 100)
      return
    }

    const person: PersonsCreateType = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      phone: phone,
      dateOfBirth: new Date(dateOfBirth),
      sex: sex ?? 'not_known',
      address: {
        street: strasse + hausnr,
        cityCode: plz,
        city: stadt,
        country: land,
        latitude: 0,
        longitude: 0,
      },
    }

    try {
      PersonsCreateSchema.parse({
        ...person,
        dateOfBirth: person.dateOfBirth.toISOString(),
      })
    } catch (err) {
      console.log('Zod Error: personRegistration' + err)
    }
    mutateRegistration(person)
  }
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Registrierung</h1>

          <Form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="form-section-title">Persönliche Daten</h2>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="firstName" className="form-label">
                    Vorname *
                  </Form.Label>
                  <Form.Control
                    id="CreatePersonFirstName"
                    type="text"
                    placeholder="Vorname"
                    name="firstName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={firstName}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="lastName" className="form-label">
                    Nachname *
                  </Form.Label>
                  <Form.Control
                    id="CreatePersonLastName"
                    type="text"
                    placeholder="Nachname"
                    name="lastName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={lastName}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="dateOfBirth" className="form-label">
                    Geburtsdatum *
                  </Form.Label>
                  <Form.Control
                    id="CreatePersonDateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={dateOfBirth}
                    max={getMaxDate()}
                    isInvalid={!!errors.dateOfBirth}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dateOfBirth}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="sex" className="form-label">
                    Geschlecht *
                  </Form.Label>
                  <Form.Select
                    id="CreatePersonSex"
                    name="sex"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={sex}
                    isInvalid={!!errors.sex}
                  >
                    <option value="">Bitte wählen</option>
                    <option value={'male'}>Männlich</option>
                    <option value={'female'}>Weiblich</option>
                    <option value={'not_applicable'}>Divers</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.sex}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Kontaktdaten</h2>

              <FormGroup className="form-group">
                <Form.Label htmlFor="email" className="form-label">
                  E-Mail *
                </Form.Label>
                <Form.Control
                  id="CreatePersonEmail"
                  type="email"
                  placeholder="ihre@email.de"
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
                  id="CreatePersonPhone"
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

              <FormGroup className="form-group">
                <Form.Label htmlFor="password" className="form-label">
                  Passwort *
                </Form.Label>
                <Form.Control
                  id="CreatePersonPassword"
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={password}
                  isInvalid={!!errors.password}
                />
                
                {/* Passwort-Anforderungen Anzeige */}
                <div style={{ marginTop: '8px', fontSize: '14px' }}>
                  <div style={{ 
                    color: passwordRequirements.minLength 
                      ? '#28a745' 
                      : password.length > 0 
                      ? '#dc3545' 
                      : '#6c757d',
                    marginBottom: '4px'
                  }}>
                    {passwordRequirements.minLength ? '✓' : '○'} Mindestens 8 Zeichen
                  </div>
                  <div style={{ 
                    color: passwordRequirements.hasUpperCase 
                      ? '#28a745' 
                      : password.length > 0 
                      ? '#dc3545' 
                      : '#6c757d',
                    marginBottom: '4px'
                  }}>
                    {passwordRequirements.hasUpperCase ? '✓' : '○'} Mindestens ein Großbuchstabe
                  </div>
                  <div style={{ 
                    color: passwordRequirements.hasNumber 
                      ? '#28a745' 
                      : password.length > 0 
                      ? '#dc3545' 
                      : '#6c757d',
                    marginBottom: '4px'
                  }}>
                    {passwordRequirements.hasNumber ? '✓' : '○'} Mindestens eine Zahl
                  </div>
                  <div style={{ 
                    color: passwordRequirements.hasSpecialChar 
                      ? '#28a745' 
                      : password.length > 0 
                      ? '#dc3545' 
                      : '#6c757d',
                    marginBottom: '4px'
                  }}>
                    {passwordRequirements.hasSpecialChar ? '✓' : '○'} Mindestens ein Sonderzeichen (!@#$%...)
                  </div>
                </div>
              </FormGroup>

              <FormGroup className="form-group">
                <Form.Label htmlFor="confirmPassword" className="form-label">
                  Passwort wiederholen *
                </Form.Label>
                <Form.Control
                  id="CreatePersonConfirmPassword"
                  type="password"
                  placeholder="••••••••"
                  name="confirmPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={confirmPassword}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
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
                    id="CreatePersonStrasse"
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
                    id="CreatePersonHausnr"
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
                    id="CreatePersonPlz"
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
                    id="CreatePersonStadt"
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
                  id="CreatePersonLand"
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

            <button type="submit" className="auth-button">
              Registrieren
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}