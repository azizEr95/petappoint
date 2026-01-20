import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import Select from 'react-select';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Form, FormGroup } from 'react-bootstrap';
import { PersonsCreateSchema } from 'vetilib-shared/schemas/ZodSchemas';
import { PasswordInput } from '../../components/common/PasswordInput';
import '../../styles/routes/personRegistration.scss';
import { personRegistration } from '../../api/LoginAPI';
import { useLoginContext } from '../../LoginContext';
import { getPersonCreateType, scrollToFirstError, validatePersonFormular } from '../../utils/ValidateForm';
import type { SingleValue } from 'react-select';
import type { CountryType, PersonsCreateType } from 'vetilib-shared/schemas/ZodSchemas';
import type { FormEvent } from 'react';
import type { PersonsValidateType } from '@/types/validation';
import { useTitle } from '@/utils/useTitle';
import { getAllCountries } from '@/api/CountriesAPI';

export const Route = createFileRoute('/registration/person')({
  component: PersonRegistration,
})

function PersonRegistration() {
  useTitle("Registrierung Person");
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state.appointment;
  const { setLogin } = useLoginContext();
  const [personData, setPersonData] = useState<PersonsValidateType>({
    sex: undefined,
    dateOfBirth: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      country: undefined as any,
      street: '',
      streetNumber: '',
      cityCode: '',
      city: '',
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Password validation state
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const { data: dataCountries, isSuccess: isSuccessCountries } = useQuery({
    queryKey: ['allCountries'],
    queryFn: () => getAllCountries(),
  });

  // Function to check password requirements
  const checkPasswordRequirements = (pwd: string) => {
    setPasswordRequirements({
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    });
  };

  // Get max date (today) in YYYY-MM-DD format
  const getMaxDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const { mutate: mutateRegistration } = useMutation({
    mutationFn: (person: PersonsCreateType) => personRegistration(person),
    onSuccess: (data) => {
      setLogin(data);
      if (appointment !== undefined) {
        navigate({
          to: '/registration/verify-email',
          state: {
            appointment: appointment
          }
        });

      } else {
        navigate({
          to: '/registration/verify-email',
        });
      }
    },
    onError: (error: any) => {
      setErrors({
        ...errors,
        [error.field || 'general']: error.message,
      });
    },
  });

  const handleBlur = (e: any) => {
    const name = e.target.name;
    const newErrors = validatePersonFormular(personData, errors, name);
    setErrors(newErrors);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setPersonData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password' && value) {
      checkPasswordRequirements(value);
      if (personData.confirmPassword && value !== personData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwörter stimmen nicht überein' }));
      } else if (personData.confirmPassword && value === personData.confirmPassword) {
        setErrors((prev) => {
          const newErr = { ...prev };
          delete newErr.confirmPassword;
          return newErr;
        });
      }
    }
  };

  const handleAddressChange = (e: any) => {
    const { name, value } = e.target;

    setPersonData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));

    const newErrors = validatePersonFormular(personData, errors, name);
    setErrors(newErrors);
  };

  const handleCountryChange = (selectedOption: SingleValue<{ value: CountryType; label: string }>) => {
    const updatedPerson = {
      ...personData,
      address: {
        ...personData.address,
        country: selectedOption?.value,
      },
    };
    setPersonData(updatedPerson);
    const newErrors = validatePersonFormular(updatedPerson, errors, 'country');
    setErrors(newErrors);
  };

  const countryOptions = useMemo(() => {
    if (!isSuccessCountries) {
      return [];
    }
    return dataCountries.map((country: CountryType) => ({
      value: country,
      label: country.name,
    }));
  }, [isSuccessCountries, dataCountries]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validatePersonFormular(personData, errors);
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setTimeout(() => {
        scrollToFirstError(newErrors);
      }, 100);
      return;
    }

    const person = getPersonCreateType(personData);
    try {
      PersonsCreateSchema.parse({
        ...person,
        dateOfBirth: person!.dateOfBirth.toISOString(),
      });
    } catch (err) {
      console.log('Zod Error: personRegistration' + err);
    }
    mutateRegistration(person!);
  }

  if (personData.password === undefined || personData.confirmPassword === undefined) {
    return null;
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
                    value={personData.firstName}
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
                    value={personData.lastName}
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
                    value={personData.dateOfBirth}
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
                    value={personData.sex ?? ''}
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
                  value={personData.email}
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
                  value={personData.phone}
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
                  value={personData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  isInvalid={!!errors.password}
                  className="form-group"
                  label="Passwort"
                  required
                />

                {/* Passwort-Anforderungen Anzeige */}
                <div className="password-requirements">
                  <div className={`password-requirement ${passwordRequirements.minLength
                    ? 'valid'
                    : personData.password.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.minLength ? '✓' : '○'} Mindestens 8 Zeichen
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasUpperCase
                    ? 'valid'
                    : personData.password.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.hasUpperCase ? '✓' : '○'} Mindestens ein Großbuchstabe
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasNumber
                    ? 'valid'
                    : personData.password.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.hasNumber ? '✓' : '○'} Mindestens eine Zahl
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasSpecialChar
                    ? 'valid'
                    : personData.password.length > 0
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
                value={personData.confirmPassword}
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
                  <Form.Label htmlFor="street" className="form-label">
                    Straße *
                  </Form.Label>
                  <Form.Control
                    id="CreatePersonStrasse"
                    data-testid="person-strasse-input"
                    type="text"
                    placeholder="Musterstraße"
                    name="street"
                    onChange={handleAddressChange}
                    onBlur={handleBlur}
                    value={personData.address.street}
                    isInvalid={!!errors.street}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.street}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="streetNumber" className="form-label">
                    Nr. *
                  </Form.Label>
                  <Form.Control
                    id="CreatePersonHausnr"
                    data-testid="person-hausnr-input"
                    type="text"
                    placeholder="1"
                    name="streetNumber"
                    onChange={handleAddressChange}
                    onBlur={handleBlur}
                    value={personData.address.streetNumber}
                    isInvalid={!!errors.streetNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.streetNumber}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="cityCode" className="form-label">
                    PLZ *
                  </Form.Label>
                  <Form.Control
                    id="CreatePersonPlz"
                    data-testid="person-plz-input"
                    type="text"
                    placeholder="12345"
                    name="cityCode"
                    onChange={handleAddressChange}
                    onBlur={handleBlur}
                    value={personData.address.cityCode}
                    isInvalid={!!errors.cityCode}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cityCode}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="city" className="form-label">
                    Stadt *
                  </Form.Label>
                  <Form.Control
                    id="CreatePersonStadt"
                    data-testid="person-stadt-input"
                    type="text"
                    placeholder="Musterstadt"
                    name="city"
                    onChange={handleAddressChange}
                    onBlur={handleBlur}
                    value={personData.address.city}
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              {isSuccessCountries && <FormGroup className="form-group">
                <Form.Label htmlFor="land" className="form-label">
                  Land *
                </Form.Label>
                <Select
                  inputId="country"
                  name="country"
                  options={countryOptions}
                  value={personData.address.country ? countryOptions.find((opt) => opt.value.id === personData.address.country!.id) : null}
                  onChange={handleCountryChange}
                  placeholder="Land auswählen..."
                  isClearable
                  isSearchable
                  noOptionsMessage={() => "Keine Länder gefunden"}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: errors.country ? '#dc3545' : base.borderColor,
                    })
                  }}
                />
                {errors.country && (
                  <div className="invalid-feedback d-block">
                    {errors.country}
                  </div>
                )}
              </FormGroup>}
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