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

  const handleChange= (e: ChangeEvent<HTMLInputElement>)=>{
    const t= e.target
    const name = t.name
    const value = t.value
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
            value={firstName}
          />
        </Form.Group>
            <div className="text-CreatePerson">Nachname:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonLastName"
            type="text"
            placeholder="Nachname"
            name="lasttName"
            onChange={handleChange}
            value={lastName}
          />
        </Form.Group>
        <div className="text-CreatePerson">Straße:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonStrasse"
            type="text"
            placeholder="Musterstraße"
            name="strasse"
            onChange={handleChange}
            value={strasse}
          />
        </Form.Group>
        <div className="text-CreatePerson">Hausnr.:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonHausnr"
            type="text"
            placeholder="1"
            name="hausnr"
            onChange={handleChange}
            value={hausnr}
          />
        </Form.Group>
        <div className="text-CreatePerson">Postleizahl:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonPlz"
            type="text"
            placeholder="12345"
            name="plz"
            onChange={handleChange}
            value={plz}
          />
        </Form.Group>
        <div className="text-CreatePerson">Stadt:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonStadt"
            type="text"
            placeholder="Musterstadt"
            name="stadt"
            onChange={handleChange}
            value={stadt}
          />
        </Form.Group>
        <div className="text-CreatePerson">Land:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonLand"
            type="text"
            placeholder="Deutschland"
            name="land"
            onChange={handleChange}
            value={land}
          />
        </Form.Group>
        <div className="text-CreatePerson">E-Mail:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonEmail"
            type="text"
            placeholder="mustertier@tier.de"
            name="email"
            onChange={handleChange}
            value={email}
          />
        </Form.Group>
        <div className="text-CreatePerson">Password:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonPassword"
            type="password"
            placeholder="*******"
            name="password"
            onChange={handleChange}
            value={password}
          />
        </Form.Group>
        <div className="text-CreatePerson">Telefon:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonPhone"
            type="text"
            placeholder="+49 123456789999"
            name="phone"
            onChange={handleChange}
            value={phone}
          />
        </Form.Group>
        <div className="text-CreatePerson">Geburtsdatum:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonDateOfBirth"
            type="text"
            placeholder="xx.xx.xxxx"
            name="DateOfBirth"
            onChange={handleChange}
            value={dateOfBirth}
          />
        </Form.Group>
        <div className="text-CreatePerson">Sex:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePersonSex"
            type="text"
            placeholder="Male/Female"
            name="sex"
            onChange={handleChange}
            value={sex}
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
