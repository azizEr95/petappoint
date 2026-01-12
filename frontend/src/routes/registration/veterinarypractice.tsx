import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import '../../styles/routes/veterinaryRegistration.scss';
import { useMutation } from '@tanstack/react-query';
import { Alert, Form, FormGroup } from 'react-bootstrap';
import { VeterinaryPracticeCreateSchema } from 'vetilib-shared/schemas/ZodSchemas';
import { PasswordInput } from '../../components/common/PasswordInput';
import { scrollToFirstError } from '../../utils/Registration';
import type { ChangeEvent, FormEvent } from 'react';
import type { VeterinaryPracticesCreateType } from 'vetilib-shared/schemas/ZodSchemas';
import { veterinaryPracticeRegistration } from '@/api/LoginAPI';
import { useLoginContext } from '@/LoginContext';

export const Route = createFileRoute('/registration/veterinarypractice')({
  component: VeterinaryRegistration,
});

function VeterinaryRegistration() {
  const [name, setName] = useState('');
  const [strasse, setStrasse] = useState('');
  const [hausnr, setHausnr] = useState('');
  const [plz, setPlz] = useState('');
  const [stadt, setStadt] = useState('');
  const [land, setLand] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [infoemail, setInfoemail] = useState('');
  const [website, setWebsite] = useState('');
  const [info, setInfo] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { setLogin } = useLoginContext()

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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const nameBlur = e.target.name;
    validateForm(nameBlur);
  }

  const validateForm = (nameFormField: string | null) => {
    const newErrors: { [key: string]: string } = { ...errors }

    if (nameFormField === "name" || nameFormField === null) {
      if (!name.trim()) {
        newErrors.name = 'Praxisname ist erforderlich'
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(name)) {
        newErrors.name =
          'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
      } else if (name.length < 3) {
        newErrors.name = 'Praxisname muss mindestens aus 3 Zeichen bestehen'
      }
    }

    if (nameFormField === "strasse" || nameFormField === null) {
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
    }

    if (nameFormField === "hausnr" || nameFormField === null) {
      if (!hausnr.trim()) {
        newErrors.hausnr = 'Hausnummer ist erforderlich'
      } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(hausnr)) {
        newErrors.hausnr = 'Hausnummer muss mindestens eine Zahl enthalten'
      }
    }

    if (nameFormField === "plz" || nameFormField === null) {
      if (!plz.trim()) {
        newErrors.plz = 'Postleitzahl ist erforderlich'
      } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(plz)) {
        newErrors.plz = 'Postleitzahl muss mindestens eine Zahl enthalten'
      }
    }

    if (nameFormField === "stadt" || nameFormField === null) {
      if (!stadt.trim()) {
        newErrors.stadt = 'Stadt ist erforderlich'
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(stadt)) {
        newErrors.stadt =
          'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
      } else if (stadt.length < 3) {
        newErrors.stadt = 'Stadt muss mindestens aus 3 Zeichen bestehen'
      }
    }

    if (nameFormField === "land" || nameFormField === null) {
      if (!land.trim()) {
        newErrors.land = 'Land ist erforderlich'
      } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(land)) {
        newErrors.land =
          'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)'
      } else if (land.length < 3) {
        newErrors.land = 'Land muss mindestens aus 3 Zeichen bestehen'
      }
    }

    if (nameFormField === "email" || nameFormField === null) {
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
    }

    if (nameFormField === "password" || nameFormField === null) {
      if (!password.trim()) {
        newErrors.password = 'Passwort ist erforderlich'
      } else if (password.length < 6) {
        newErrors.password = 'Passwort muss mindestens aus 6 Zeichen bestehen'
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password =
          'Passwort muss mindestens einen Großbuchstaben enthalten'
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = 'Passwort muss mindestens eine Zahl enthalten'
      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        newErrors.password =
          'Passwort muss mindestens ein Sonderzeichen enthalten'
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
    }

    if (nameFormField === "infoemail" || nameFormField === null) {
      if (!infoemail.trim()) {
        newErrors.infoemail = 'E-Mail ist erforderlich'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(infoemail)) {
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

    if (nameFormField === "website" || nameFormField === null) {
      if (website.trim()) {
        if (!/^https?:\/\/.+\..+/.test(website)) {
          newErrors.website =
            'Bitte geben Sie eine gültige URL ein (z.B. https://beispiel.de)'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const { mutate: mutateCreatePractice } = useMutation({
    mutationFn: (practice: VeterinaryPracticesCreateType) =>
      veterinaryPracticeRegistration(practice),
    onError: (error: any) => {
      setErrors({
        ...errors,
        [error.field || 'general']: error.message,
      });
    },
    onSuccess: (data) => {
      setLogin(data);
      navigate({
        to: '/registration/verify-email',
      })
    },
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const t = e.target
    const nameChange = t.name
    const value = t.value

    if (errors[nameChange]) {
      const newErrors = { ...errors }
      delete newErrors[nameChange]
      setErrors(newErrors)
    }

    switch (nameChange) {
      case 'name':
        setName(value);
        break;
      case 'strasse':
        setStrasse(value);
        break;
      case 'hausnr':
        setHausnr(value);
        break;
      case 'plz':
        setPlz(value);
        break;
      case 'stadt':
        setStadt(value);
        break;
      case 'land':
        setLand(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        checkPasswordRequirements(value)
        // Check confirmPassword when password changes
        if (confirmPassword && value !== confirmPassword) {
          setErrors({ ...errors, confirmPassword: 'Passwörter stimmen nicht überein' })
        } else if (confirmPassword && value === confirmPassword) {
          const newErrors = { ...errors }
          delete newErrors.confirmPassword
          setErrors(newErrors)
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'phone':
        setPhone(value)
        break
      case 'infoemail':
        setInfoemail(value);
        break;
      case 'website':
        setWebsite(value);
        break;
      case 'info':
        setInfo(value);
        break;
      default:
        console.log('Error: Fehler beim Aendern von veterinaryRegistration State in handleChange');
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm(null)) {
      setTimeout(() => {
        scrollToFirstError(errors);
      }, 100);
      return;
    }

    const practice: VeterinaryPracticesCreateType = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      infoEmail: infoemail,
      website: website || null,
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
    } catch (err) {
      console.log('Zod Error: personRegistration' + err)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Praxis registrieren</h1>

          {errors.general && (
            <Alert variant="danger" className="mb-3">
              {errors.general}
            </Alert>
          )}

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
                <PasswordInput
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  isInvalid={!!errors.password}
                  error={errors.password}
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
                id="CreateVeterinayrPracticeConfirmPassword"
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
                    Info E-Mail *
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
