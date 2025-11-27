import { createFileRoute } from '@tanstack/react-router'
import { useState, type ChangeEvent } from 'react'
import type { MouseEvent } from 'react'
import { PersonsCreateSchema } from '../../../../shared/schemas/ZodSchemas'
import { Button, Form } from 'react-bootstrap'

export const Route = createFileRoute('/registration/person')({
  component: personRegistration,
})

function personRegistration() {

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
  const [errors, setErrors] = useState<{[key: string]: string}>({})

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
      } else if (!/^(?=.*[a-zA-ZäöüÄÖÜß0-9])[a-zA-ZäöüÄÖÜß0-9 '`.-]+$/.test(value)) {
        error = 'Straße muss mindestens einen Buchstaben oder eine Zahl enthalten'
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
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
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
    if (name === 'dateOfBirth') {
      if (!value.trim()) error = 'Geburtsdatum ist erforderlich'
    }
    if (name === 'sex') {
      if (!value) error = 'Geschlecht ist erforderlich'
    }
    
    return error
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    
    const error = validateField(name, value)
    
    if (error) {
      setErrors({...errors, [name]: error})
    } else {
      const newErrors = {...errors}
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich'
    } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(firstName)) {
      newErrors.firstName = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
    } else if (firstName.length < 3) {
      newErrors.firstName = 'Vorname muss mindestens aus 3 Zeichen bestehen'
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich'
    } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(lastName)) {
      newErrors.lastName = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
    } else if (lastName.length < 3) {
      newErrors.lastName = 'Nachname muss mindestens aus 3 Zeichen bestehen'
    }
    
    if (!strasse.trim()) {
      newErrors.strasse = 'Straße ist erforderlich'
    } else if (!/^(?=.*[a-zA-ZäöüÄÖÜß0-9])[a-zA-ZäöüÄÖÜß0-9 '`.-]+$/.test(strasse)) {
      newErrors.strasse = 'Straße muss mindestens einen Buchstaben oder eine Zahl enthalten'
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
      newErrors.stadt = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
    } else if (stadt.length < 3) {
      newErrors.stadt = 'Stadt muss mindestens aus 3 Zeichen bestehen'
    }
    
    if (!land.trim()) {
      newErrors.land = 'Land ist erforderlich'
    } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(land)) {
      newErrors.land = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
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
        newErrors.email = 'E-Mail muss vor dem @ mindestens einen Buchstaben enthalten'
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        newErrors.email = 'E-Mail enthält ungültige Zeichen'
      }
    }
    if (!password.trim()) {
      newErrors.password = 'Passwort ist erforderlich'
    } else if (password.length < 6) {
      newErrors.password = 'Passwort muss mindestens aus 6 Zeichen bestehen'
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Passwort muss mindestens einen Großbuchstaben enthalten'
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Passwort muss mindestens eine Zahl enthalten'
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      newErrors.password = 'Passwort muss mindestens ein Sonderzeichen enthalten'
    }
    if (!phone.trim()) {
      newErrors.phone = 'Telefon ist erforderlich'
    } else if (!/^[+]?[0-9]+$/.test(phone)) {
      newErrors.phone = 'Telefon darf nur Zahlen und optional ein + am Anfang enthalten'
    } else {
      const numbers = phone.replace('+', '')
      if (numbers.length < 6) {
        newErrors.phone = 'Telefon muss mindestens aus 6 Zahlen bestehen'
      }
    }
    if (!dateOfBirth.trim()) newErrors.dateOfBirth = 'Geburtsdatum ist erforderlich'
    if (!sex) newErrors.sex = 'Geschlecht ist erforderlich'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange= (e: ChangeEvent<HTMLInputElement>)=>{
    const t= e.target
    const name = t.name
    const value = t.value

    if (errors[name]) {
      const newErrors = {...errors}
      delete newErrors[name]
      setErrors(newErrors)
    }

    switch(name){
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
        console.log(
          'Error: Fehler beim Aendern von personRegistration State in handleChange ',
        )
      
    }
  }

  const handleSubmit = (e:  MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()

    if (!validateForm()) {
      console.log('Formular enthält Fehler')
      return
    }

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
    <div className="personRegistrationSite">
      <div className="text-center">Regristrierung von Tierbesitzer</div>

      <Form className="personRegistrationFormular">
        <div className="text-CreatePerson">Vorname:</div>
        <Form.Group className="mb-3">
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
        </Form.Group>
        
        <div className="text-CreatePerson">Nachname:</div>
        <Form.Group className="mb-3">
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
        </Form.Group>
        
        <div className="text-CreatePerson">Straße:</div>
        <Form.Group className="mb-3">
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
        </Form.Group>
        
        <div className="text-CreatePerson">Hausnr.:</div>
        <Form.Group className="mb-3">
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
        </Form.Group>
        
        <div className="text-CreatePerson">Postleizahl:</div>
        <Form.Group className="mb-3">
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
        </Form.Group>
        
        <div className="text-CreatePerson">Stadt:</div>
        <Form.Group className="mb-3">
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
        </Form.Group>
        
        <div className="text-CreatePerson">Land:</div>
        <Form.Group className="mb-3">
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
        </Form.Group>
        
        <div className="text-CreatePerson">E-Mail:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonEmail"
            type="email"
            placeholder="mustertier@tier.de"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={email}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        
        <div className="text-CreatePerson">Password:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonPassword"
            type="password"
            placeholder="*******"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={password}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        
        <div className="text-CreatePerson">Telefon:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonPhone"
            type="tel"
            placeholder="+49 123456789999"
            name="phone"
            onChange={handleChange}
            onBlur={handleBlur}
            value={phone}
            isInvalid={!!errors.phone}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phone}
          </Form.Control.Feedback>
        </Form.Group>
        
        <div className="text-CreatePerson">Geburtsdatum:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonDateOfBirth"
            type="date"
            name="dateOfBirth"
            onChange={handleChange}
            value={dateOfBirth}
          />
        </Form.Group>
        
        <div className="text-CreatePerson">Geschlecht:</div>
        <Form.Group className="mb-3">
          <Form.Check
            type="radio"
            label="Männlich"
            name="sex"
            value="male"
            onChange={handleChange}
            checked={sex === 'male'}
          />
          <Form.Check
            type="radio"
            label="Weiblich"
            name="sex"
            value="female"
            onChange={handleChange}
            checked={sex === 'female'}
          />
        </Form.Group>
        
        <Button
          id="PerformPersonRegistration"
          variant="primary"
          type="submit"
          onClick={handleSubmit}
        >
          Registrieren
        </Button>
      </Form>
    </div>
  )
}