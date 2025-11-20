import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import { Button, Form } from 'react-bootstrap'
import '../../styles/routes/veterinaryRegistration.scss'
import { VeterinaryPracticeCreateSchema, type VeterinariansCreateType, type VeterinaryPracticesCreateType } from '../../../../shared/schemas/ZodSchemas'
import { useMutation } from '@tanstack/react-query'
import { creatVeterinaryPractice } from '../../api/VeterinaryPracticeAPI'

export const Route = createFileRoute('/registration/veterinary')({
  component: veterinaryRegistration,
})

function veterinaryRegistration() {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const t = e.target
    const name = t.name
    const value = t.value
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

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
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
    <div className="veterinaryRegistrationSite">
      <div className="text-center">Regristrierung Tierarztpraxis</div>

      <Form className="veterinaryRegistrationFormular">
        <div className="text-CreatePractice">Name:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisName"
            type="text"
            placeholder="Tierarztpraxis Mustertier"
            name="name"
            onChange={handleChange}
            value={name}
          />
        </Form.Group>
        <div className="text-CreatePractice">Straße:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisStrasse"
            type="text"
            placeholder="Musterstraße"
            name="strasse"
            onChange={handleChange}
            value={strasse}
          />
        </Form.Group>
        <div className="text-CreatePractice">Hausnr.:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisHausnr"
            type="text"
            placeholder="1"
            name="hausnr"
            onChange={handleChange}
            value={hausnr}
          />
        </Form.Group>
        <div className="text-CreatePractice">Postleizahl:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisPlz"
            type="text"
            placeholder="12345"
            name="plz"
            onChange={handleChange}
            value={plz}
          />
        </Form.Group>
        <div className="text-CreatePractice">Stadt:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisStadt"
            type="text"
            placeholder="Musterstadt"
            name="stadt"
            onChange={handleChange}
            value={stadt}
          />
        </Form.Group>
        <div className="text-CreatePractice">Land:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisLand"
            type="text"
            placeholder="Deutschland"
            name="land"
            onChange={handleChange}
            value={land}
          />
        </Form.Group>
        <div className="text-CreatePractice">E-Mail:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisEmail"
            type="text"
            placeholder="mustertier@tier.de"
            name="email"
            onChange={handleChange}
            value={email}
          />
        </Form.Group>
        <div className="text-CreatePractice">Password:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisPassword"
            type="password"
            placeholder="*******"
            name="password"
            onChange={handleChange}
            value={password}
          />
        </Form.Group>
        <div className="text-CreatePractice">Telefon:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisPhone"
            type="text"
            placeholder="+49 123456789999"
            name="phone"
            onChange={handleChange}
            value={phone}
          />
        </Form.Group>
        <div className="text-CreatePractice">Info E-Mail:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisInfomail"
            type="text"
            placeholder="infoMustertier@tier.de"
            name="infoemail"
            onChange={handleChange}
            value={infoemail}
          />
        </Form.Group>
        <div className="text-CreatePractice">Webseite:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisWebsite"
            type="text"
            placeholder="https://mustertier.de"
            name="website"
            onChange={handleChange}
            value={website}
          />
        </Form.Group>
        <div className="text-CreatePractice">Praxisinfo:</div>
        <Form.Group className="mb-3">
          <Form.Control
            id="CreatePraxisInfo"
            type="textarea"
            placeholder="Beschreibung zur Praxis"
            name="info"
            onChange={handleChange}
            value={info}
          />
        </Form.Group>
        <Button
          id="PerformVeterinaryRegistration"
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
