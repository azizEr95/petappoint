import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { useMutation, useQueryClient } from '@tanstack/react-query'
//import { updateVeterinaryPractice } from '@/api/VeterinaryPracticeAPI'
import type { VeterinaryPracticesType } from 'vetilib-shared/schemas/ZodSchemas'

type PraxisProfileEditDialogProps = {
  hideDialog: () => void
  practice: VeterinaryPracticesType
}

export function PraxisProfileEditDialog({
  hideDialog,
  practice,
}: PraxisProfileEditDialogProps) {
  const queryClient = useQueryClient()

  const [name, setName] = useState(practice.name)
  const [email, setEmail] = useState(practice.email)
  const [phone, setPhone] = useState(practice.phone)
  const [infoEmail, setInfoEmail] = useState(practice.infoEmail)
  const [website, setWebsite] = useState(practice.website || '')
  const [info, setInfo] = useState(practice.info || '')

  const [street, setStreet] = useState(practice.address.street)
  const [cityCode, setCityCode] = useState(practice.address.cityCode)
  const [city, setCity] = useState(practice.address.city)
  const [country, setCountry] = useState(practice.address.country)

  const [errorText, setErrorText] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    name: string | undefined
    email: string | undefined
    phone: string | undefined
    infoEmail: string | undefined
    street: string | undefined
    cityCode: string | undefined
    city: string | undefined
    country: string | undefined
  }>({
    name: undefined,
    email: undefined,
    phone: undefined,
    infoEmail: undefined,
    street: undefined,
    cityCode: undefined,
    city: undefined,
    country: undefined,
  })

  const validate = () => {
    const errors: typeof validationErrors = {
      name: undefined,
      email: undefined,
      phone: undefined,
      infoEmail: undefined,
      street: undefined,
      cityCode: undefined,
      city: undefined,
      country: undefined,
    }

    if (name.length < 2 || name.length > 100) {
      errors.name = 'Praxisname muss zwischen 2 und 100 Zeichen lang sein.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > 100) {
      errors.email = 'Ungültige E-Mail-Adresse.'
    }

    if (!emailRegex.test(infoEmail) || infoEmail.length > 100) {
      errors.infoEmail = 'Ungültige Info E-Mail-Adresse.'
    }

    if (phone.length < 5 || phone.length > 20) {
      errors.phone = 'Telefonnummer muss zwischen 5 und 20 Zeichen lang sein.'
    }

    if (street.length < 1) {
      errors.street = 'Straße ist erforderlich.'
    }

    if (cityCode.length < 1) {
      errors.cityCode = 'PLZ ist erforderlich.'
    }

    if (city.length < 1) {
      errors.city = 'Stadt ist erforderlich.'
    }

    if (country.length < 1) {
      errors.country = 'Land ist erforderlich.'
    }

    setValidationErrors(errors)
    return Object.values(errors).every((error) => error === undefined)
  }

//   const updatePracticeMutation = useMutation({
//     mutationFn: (updatedPractice: VeterinaryPracticesType) =>
//       updateVeterinaryPractice(practice.id, updatedPractice),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['veterinaryPractice', practice.id] })
//       hideDialog()
//     },
//     onError: (error) => {
//       setErrorText('Fehler beim Aktualisieren: ' + error.message)
//     },
//   })

  const handleSubmit = () => {
    if (!validate()) {
      setErrorText('Bitte korrigieren Sie die Fehler.')
      return
    }

    const updatedPractice: VeterinaryPracticesType = {
      id: practice.id,
      name,
      email,
      phone,
      infoEmail,
      website: website || null,
      info: info || null,
      address: {
        id: practice.address.id,
        street,
        cityCode,
        city,
        country,
        latitude: practice.address.latitude,
        longitude: practice.address.longitude,
      },
    }

   // updatePracticeMutation.mutate(updatedPractice)
  }

   const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
     if (e.key === 'Enter' ) {
     e.preventDefault()
       handleSubmit()
     }
  }

  return (
    <Modal show={true} onHide={hideDialog} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Praxisprofil bearbeiten</Modal.Title>
      </Modal.Header>

      <Modal.Body onKeyDown={handleKeyDown}>
        <Container>
          {errorText && (
            <Row>
              <Col>
                <div className="alert alert-danger">{errorText}</div>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Praxisname*</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!validationErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>E-Mail*</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!validationErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Info E-Mail*</Form.Label>
                <Form.Control
                  type="email"
                  value={infoEmail}
                  onChange={(e) => setInfoEmail(e.target.value)}
                  isInvalid={!!validationErrors.infoEmail}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.infoEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefon*</Form.Label>
                <Form.Control
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  isInvalid={!!validationErrors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Zusätzliche Informationen</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  placeholder="Weitere Informationen über Ihre Praxis..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <h5 className="mt-3 mb-3">Adresse</h5>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Straße*</Form.Label>
                <Form.Control
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  isInvalid={!!validationErrors.street}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.street}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>PLZ*</Form.Label>
                <Form.Control
                  type="text"
                  value={cityCode}
                  onChange={(e) => setCityCode(e.target.value)}
                  isInvalid={!!validationErrors.cityCode}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.cityCode}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Stadt*</Form.Label>
                <Form.Control
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  isInvalid={!!validationErrors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Land*</Form.Label>
                <Form.Control
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  isInvalid={!!validationErrors.country}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.country}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={hideDialog}>
          Abbrechen
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
        //  disabled={updatePracticeMutation.isPending}
        >
           Speichern {/* {updatePracticeMutation.isPending ? 'Speichern...' : 'Speichern'} */}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}