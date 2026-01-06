import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Alert, Form, FormGroup } from 'react-bootstrap'
import { PersonsCreateSchema } from 'vetilib-shared/schemas/ZodSchemas'
import { PasswordInput } from '../../components/common/PasswordInput'
import '../../styles/routes/personRegistration.scss'
import { personRegistration } from '../../api/LoginAPI'
import { useLoginContext } from '../../LoginContext'
import { scrollToFirstError } from '../../utils/Registration'
import type { PersonsCreateType, sexesType } from 'vetilib-shared/schemas/ZodSchemas';
import type { FormEvent } from 'react';

export const Route = createFileRoute('/registration/person')({
  component: PersonRegistration,
})

function PersonRegistration() {
  const navigate = useNavigate()
  const location = useLocation()
  const appointment = location.state.appointment
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
      if (appointment !== undefined) {
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
    onError: (error: any) => {
      setErrors({
        ...errors,
        [error.field || 'general']: error.message,
      })
    },
  })

  const handleBlur = (e: any) => {
    const name = e.target.name;
    validateForm(name);
  }

  const validateForm = (nameFormField: string | null) => {
    const newErrors: { [key: string]: string } = { ...errors };

    if (nameFormField === "firstName" || nameFormField === null) {
      if (!firstName.trim()) {
        newErrors.firstName = 'Vorname ist erforderlich';
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(firstName)) {
        newErrors.firstName =
          'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)';
      } else if (firstName.length < 2) {
        newErrors.firstName = 'Vorname muss mindestens aus 2 Zeichen bestehen';
      } else if (firstName.length > 60) {
        newErrors.firstName = 'Vorname darf maximal 60 Zeichen lang sein';
      }
    }

    if (nameFormField === "lastName" || nameFormField === null) {
      if (!lastName.trim()) {
        newErrors.lastName = 'Nachname ist erforderlich';
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(lastName)) {
        newErrors.lastName =
          'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)';
      } else if (lastName.length < 2) {
        newErrors.lastName = 'Nachname muss mindestens aus 2 Zeichen bestehen';
      } else if (lastName.length > 60) {
        newErrors.lastName = 'Nachname darf maximal 60 Zeichen lang sein';
      }
    }

    if (nameFormField === "strasse" || nameFormField === null) {
      if (!strasse.trim()) {
        newErrors.strasse = 'Straße ist erforderlich';
      } else if (!/^(?=.*[a-zA-ZäöüÄÖÜß0-9])[a-zA-ZäöüÄÖÜß0-9 '`.-]+$/.test(strasse)) {
        newErrors.strasse =
          'Straße muss mindestens einen Buchstaben oder eine Zahl enthalten';
      } else if (strasse.length < 3) {
        newErrors.strasse = 'Straße muss mindestens aus 3 Zeichen bestehen';
      } else if (strasse.length > 80) {
        newErrors.strasse = 'Straße darf maximal 80 Zeichen lang sein';
      }
    }

    if (nameFormField === "hausnr" || nameFormField === null) {
      if (!hausnr.trim()) {
        newErrors.hausnr = 'Hausnummer ist erforderlich';
      } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(hausnr)) {
        newErrors.hausnr = 'Hausnummer muss mindestens eine Zahl enthalten';
      } else if (hausnr.length > 10) {
        newErrors.hausnr = 'Hausnummer darf maximal 10 Zeichen lang sein';
      }
    }

    if (nameFormField === "plz" || nameFormField === null) {
      if (!plz.trim()) {
        newErrors.plz = 'Postleitzahl ist erforderlich';
      } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(plz)) {
        newErrors.plz = 'Postleitzahl muss mindestens eine Zahl enthalten';
      } else if (plz.length < 3) {
        newErrors.plz = 'Postleitzahl muss mindestens aus 3 Zeichen bestehen';
      } else if (plz.length > 12) {
        newErrors.plz = 'Postleitzahl darf maximal 12 Zeichen lang sein';
      }
    }

    if (nameFormField === "stadt" || nameFormField === null) {
      if (!stadt.trim()) {
        newErrors.stadt = 'Stadt ist erforderlich';
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(stadt)) {
        newErrors.stadt =
          'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)';
      } else if (stadt.length < 3) {
        newErrors.stadt = 'Stadt muss mindestens aus 3 Zeichen bestehen';
      } else if (stadt.length > 60) {
        newErrors.stadt = 'Stadt darf maximal 60 Zeichen lang sein';
      }
    }

    if (nameFormField === "land" || nameFormField === null) {
      if (!land.trim()) {
        newErrors.land = 'Land ist erforderlich';
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(land)) {
        newErrors.land =
          'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)';
      } else if (land.length < 3) {
        newErrors.land = 'Land muss mindestens aus 3 Zeichen bestehen';
      } else if (land.length > 150) {
        newErrors.land = 'Land darf maximal 150 Zeichen lang sein';
      }
    }

    if (nameFormField === "email" || nameFormField === null) {
      if (!email.trim()) {
        newErrors.email = 'E-Mail ist erforderlich';
      } else if (email.length > 100) {
        newErrors.email = 'E-Mail darf maximal 100 Zeichen lang sein';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
      } else if ((email.match(/@/g) || []).length !== 1) {
        newErrors.email = 'E-Mail darf nur ein @ enthalten';
      } else {
        const beforeAt = email.split('@')[0];
        if (!/[a-zA-Z]/.test(beforeAt)) {
          newErrors.email =
            'E-Mail muss vor dem @ mindestens einen Buchstaben enthalten';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
          newErrors.email = 'E-Mail enthält ungültige Zeichen';
        }
      }
    }

    if (nameFormField === "password" || nameFormField === null) {
      if (!password.trim()) {
        newErrors.password = 'Passwort ist erforderlich';
      } else if (password.length < 8) {
        newErrors.password = 'Passwort muss mindestens aus 8 Zeichen bestehen';
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password =
          'Passwort muss mindestens einen Großbuchstaben enthalten';
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = 'Passwort muss mindestens eine Zahl enthalten';
      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        newErrors.password =
          'Passwort muss mindestens ein Sonderzeichen enthalten';
      }
    }

    if (nameFormField === "confirmPassword" || nameFormField === null) {
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = 'Passwort-Wiederholung ist erforderlich';
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
      }
    }

    if (nameFormField === "phone" || nameFormField === null) {
      if (!phone.trim()) {
        newErrors.phone = 'Telefon ist erforderlich';
      } else if (!/^[+]?[0-9]+$/.test(phone)) {
        newErrors.phone =
          'Telefon darf nur Zahlen und optional ein + am Anfang enthalten';
      } else {
        const numbers = phone.replace('+', '')
        if (numbers.length < 5) {
          newErrors.phone = 'Telefon muss mindestens aus 5 Zahlen bestehen';
        } else if (numbers.length > 20) {
          newErrors.phone = 'Telefon darf maximal 20 Zeichen lang sein';
        }
      }
    }

    if (nameFormField === "dateOfBirth" || nameFormField === null) {
      if (!dateOfBirth.trim()) {
        newErrors.dateOfBirth = 'Geburtsdatum ist erforderlich';
      } else {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        if (birthDate > today) {
          newErrors.dateOfBirth = 'Geburtsdatum darf nicht in der Zukunft liegen';
        } else {
          const age = calculateAge(birthDate);
          if (age < 14) {
            newErrors.dateOfBirth = 'Sie müssen mindestens 14 Jahre alt sein';
          } else if (age > 120) {
            newErrors.dateOfBirth = 'Das Alter darf nicht mehr als 120 Jahre betragen';
          }
        }
      }
    }

    if (nameFormField === "sex" || nameFormField === null) {
      if (!sex) newErrors.sex = 'Geschlecht ist erforderlich';
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
    e.preventDefault();

    if (!validateForm(null)) {
      console.log('Formular enthält Fehler');
      // Zum ersten Fehler scrollen
      setTimeout(() => {
        scrollToFirstError(errors);
      }, 100);
      return;
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

          {errors.general && (
            <Alert variant="danger" className="mb-3">
              {errors.general}
            </Alert>
          )}

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
                    data-testid="person-firstName-input"
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
                    data-testid="person-lastName-input"
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
                    data-testid="person-dateOfBirth-input"
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
                    data-testid="person-sex-select"
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
                  data-testid="person-email-input"
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
                  data-testid="person-phone-input"
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
                <PasswordInput
                  id="CreatePersonPassword"
                  testid="person-password-input"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  isInvalid={!!errors.confirmPassword}
                  className="form-group"
                  label="Passwort"
                  required
                />

                {/* Passwort-Anforderungen Anzeige */}
                <div className="password-requirements">
                  <div className={`password-requirement ${passwordRequirements.minLength
                    ? 'valid'
                    : password.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.minLength ? '✓' : '○'} Mindestens 8 Zeichen
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasUpperCase
                    ? 'valid'
                    : password.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.hasUpperCase ? '✓' : '○'} Mindestens ein Großbuchstabe
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasNumber
                    ? 'valid'
                    : password.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.hasNumber ? '✓' : '○'} Mindestens eine Zahl
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasSpecialChar
                    ? 'valid'
                    : password.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.hasSpecialChar ? '✓' : '○'} Mindestens ein Sonderzeichen (!@#$%...)
                  </div>
                </div>
              </FormGroup>

              <PasswordInput
                id="CreatePersonConfirmPassword"
                testid="person-confirmPassword-input"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                isInvalid={!!errors.confirmPassword}
                error={errors.confirmPassword}
                className="form-group"
                label="Passwort wiederholen"
                required
              />
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
                    data-testid="person-strasse-input"
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
                    data-testid="person-hausnr-input"
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
                    data-testid="person-plz-input"
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
                    data-testid="person-stadt-input"
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
                  data-testid="person-land-input"
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

            <button type="submit" className="auth-button" data-testid="person-submit-button">
              Registrieren
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}