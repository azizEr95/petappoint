import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
} from 'react-bootstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Select from 'react-select';
import { PasswordInput } from '../common/PasswordInput';
import {
  getPictureURLForPersonId,
  updatePerson,
  uploadPictureForPersonId,
} from '../../api/PersonsAPI';
import { getDateStringFromDate } from '../../utils/DateToStringFormat';
import type {SingleValue} from 'react-select';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type {
  CountryType,
  PersonsType,
  PersonsUpdateType,
} from 'vetilib-shared/schemas/ZodSchemas';
import '../../styles/components/ProfileDialog.scss';
import { getAllCountries } from '@/api/CountriesAPI';

type ProfileEditDialogProps = {
  hideDialog: () => void
  person: PersonsType
}

export function ProfileEditDialog({
  hideDialog,
  person,
}: ProfileEditDialogProps) {
  const queryClient = useQueryClient()

  const [firstName, setFirstName] = useState(person.firstName)
  const [lastName, setLastName] = useState(person.lastName)
  const [sex, setSex] = useState(person.sex)
  const [dateOfBirth, setDateOfBirth] = useState(
    getDateStringFromDate(person.dateOfBirth),
  )
  const [phone, setPhone] = useState(person.phone)
  const [email, setEmail] = useState(person.email)

  const [street, setStreet] = useState(person.address.street)
  const [cityCode, setCityCode] = useState(person.address.cityCode)
  const [city, setCity] = useState(person.address.city)
  const [country, setCountry] = useState<number | undefined>(person.address.country)

  const [changePassword, setChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profilePictureURL, setProfilePictureURL] = useState<string>(
    getPictureURLForPersonId(person.id, Date.now()),
  )
  const [selectedPictureFile, setSelectedPictureFile] = useState<File>()

  const [errorText, setErrorText] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    firstName: string | undefined
    lastName: string | undefined
    email: string | undefined
    phone: string | undefined
    dateOfBirth: string | undefined
    street: string | undefined
    cityCode: string | undefined
    city: string | undefined
    country: string | undefined
    newPassword: string | undefined
    confirmPassword: string | undefined
  }>({
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    phone: undefined,
    dateOfBirth: undefined,
    street: undefined,
    cityCode: undefined,
    city: undefined,
    country: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  })

  const { data: dataAllCountries, isSuccess: isSuccessAllCountries } = useQuery({
    queryKey: ['allCountries'],
    queryFn: () => getAllCountries(),
  })

  useEffect(() => {
    if (selectedPictureFile) {
      const url = URL.createObjectURL(selectedPictureFile)
      setProfilePictureURL(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [selectedPictureFile])

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        setErrorText('Nur Bilder erlaubt.')
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrorText('Datei darf maximal 2MB groß sein.')
        return
      }

      setSelectedPictureFile(file)
      setErrorText('')
    }
  }

  const validate = (): PersonsUpdateType | null => {
    const errors: typeof validationErrors = {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      phone: undefined,
      dateOfBirth: undefined,
      street: undefined,
      cityCode: undefined,
      city: undefined,
      country: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    }

    if (firstName.length < 2 || firstName.length > 60) {
      errors.firstName = 'Vorname muss zwischen 2 und 60 Zeichen lang sein.'
    }

    if (lastName.length < 2 || lastName.length > 60) {
      errors.lastName = 'Nachname muss zwischen 2 und 60 Zeichen lang sein.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > 100) {
      errors.email = 'Ungültige E-Mail-Adresse.'
    }

    if (phone.length < 5 || phone.length > 20) {
      errors.phone = 'Telefonnummer muss zwischen 5 und 20 Zeichen lang sein.'
    }

    if (!dateOfBirth) {
      errors.dateOfBirth = 'Geburtsdatum ist erforderlich.'
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

    if (!country) {
      errors.country = 'Land ist erforderlich.'
    }

    if (changePassword) {
      if (newPassword.length < 8 || newPassword.length > 255) {
        errors.newPassword = 'Passwort muss mindestens 8 Zeichen lang sein.'
      }
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Passwörter stimmen nicht überein.'
      }
    }

    setValidationErrors(errors)
    if (!Object.values(errors).every((error) => error === undefined)) {
      return null;
    }

    console.log(country)
    return {
      id: person.id,
      firstName,
      lastName,
      sex,
      dateOfBirth: new Date(dateOfBirth),
      phone,
      email,
      address: {
        id: person.address.id,
        street,
        cityCode,
        city,
        country: country!,
        latitude: person.address.latitude,
        longitude: person.address.longitude,
      },
    }
  }

  const updatePersonMutation = useMutation({
    mutationFn: (updatedPerson: PersonsUpdateType) =>
      updatePerson(person.id, updatedPerson),
    onSuccess: async () => {
      if (selectedPictureFile) {
        await uploadPictureForPersonId(person.id, selectedPictureFile)
      }
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
      hideDialog()
    },
    onError: (error) => {
      setErrorText('Fehler beim Aktualisieren: ' + error.message)
    },
  })

  const handleCountryChange = (selectedOption: SingleValue<{ value: CountryType; label: string }>) => {
      if (selectedOption) {
        setCountry(selectedOption.value.id);
        if (validationErrors.country) {
          const newErrors = { ...validationErrors };
          delete newErrors.country;
          setValidationErrors(newErrors);
        }
      } else {
        setCountry(undefined);
      }
    }
  
    const countryOptions = useMemo(() => {
      if (!isSuccessAllCountries) {
        return [];
      }
      return dataAllCountries.map((countryMap: CountryType) => ({
        value: countryMap,
        label: countryMap.name,
      }));
    }, [isSuccessAllCountries, dataAllCountries]);

  const handleSubmit = () => {
    const updatedPerson = validate();
    if (!updatedPerson) {
      setErrorText('Bitte korrigieren Sie die Fehler.')
      return
    }

    if (changePassword && newPassword) {
      updatedPerson.password = newPassword
    }

    updatePersonMutation.mutate(updatedPerson)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !updatePersonMutation.isPending) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Modal show={true} onHide={hideDialog} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Profil bearbeiten</Modal.Title>
      </Modal.Header>

      <Modal.Body onKeyDown={handleKeyDown}>
        <Container>
          <Row className="justify-content-center mb-4">
            <Col xs="auto" className="text-center">
              <Image
                src={profilePictureURL}
                roundedCircle
                width={200}
                height={200}
                alt="Profilbild"
                className="mb-3"
              />
              <Form.Group>
                <Form.Label>Profilbild ändern</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </Form.Group>
            </Col>
          </Row>

          {errorText && (
            <Row>
              <Col>
                <div className="alert alert-danger">{errorText}</div>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Vorname*</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  isInvalid={!!validationErrors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nachname*</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  isInvalid={!!validationErrors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Geschlecht*</Form.Label>
                <Form.Control
                  as="select"
                  value={sex}
                  onChange={(e) => setSex(e.target.value as any)}
                >
                  <option value="male">männlich</option>
                  <option value="female">weiblich</option>
                  <option value="not_known">unbekannt</option>
                  <option value="not_applicable">nicht zutreffend</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Geburtsdatum*</Form.Label>
                <Form.Control
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  isInvalid={!!validationErrors.dateOfBirth}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.dateOfBirth}
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
                <Select
                  inputId="land"
                  options={countryOptions}
                  value={country ? countryOptions.find((opt) => opt.value.id === country) : null}
                  onChange={handleCountryChange}
                  placeholder="Land auswählen..."
                  isClearable
                  isSearchable
                  noOptionsMessage={() => "Keine Länder gefunden"}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: validationErrors.country ? '#dc3545' : base.borderColor,
                    })
                  }}
                />
                {validationErrors.country && (
                  <div className="invalid-feedback d-block">
                    {validationErrors.country}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <h5 className="mt-3 mb-3">Passwort ändern</h5>
              <Form.Check
                type="checkbox"
                label="Passwort ändern"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
                className="mb-3"
              />
            </Col>
          </Row>

          {changePassword && (
            <>
              <Row>
                <Col md={6}>
                  <PasswordInput
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    isInvalid={!!validationErrors.newPassword}
                    error={validationErrors.newPassword}
                    className="mb-3"
                    label="Neues Passwort*"
                    required
                  />
                </Col>
                <Col md={6}>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    isInvalid={!!validationErrors.confirmPassword}
                    error={validationErrors.confirmPassword}
                    className="mb-3"
                    label="Passwort bestätigen*"
                    required
                  />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={hideDialog}>
          Abbrechen
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={updatePersonMutation.isPending}
        >
          {updatePersonMutation.isPending ? 'Speichern...' : 'Speichern'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
