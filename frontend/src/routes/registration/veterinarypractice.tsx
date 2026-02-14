import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Select from 'react-select';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Form, FormGroup } from 'react-bootstrap';
import { VeterinaryPracticeCreateSchema } from 'petappoint-shared/schemas/ZodSchemas';
import { PasswordInput } from '../../components/common/PasswordInput';
import {  getPracticeCreateType, scrollToFirstError, validatePracticeFormular } from '../../utils/ValidateForm';
import type {PracticeValidateType} from '../../types/validation';
import type {SingleValue} from 'react-select';
import type { ChangeEvent, FormEvent } from 'react';
import type { CountryType, VeterinaryPracticesCreateType } from 'petappoint-shared/schemas/ZodSchemas';
import { veterinaryPracticeRegistration } from '@/api/LoginAPI';
import { useLoginContext } from '@/LoginContext';
import { useTitle } from '@/utils/useTitle';
import { getAllCountries } from '@/api/CountriesAPI';
import '../../styles/routes/veterinaryRegistration.scss';

export const Route = createFileRoute('/registration/veterinarypractice')({
  component: VeterinaryRegistration,
});

function VeterinaryRegistration() {
  useTitle("Registrierung Praxis");
  const [practiceData, setPracticeData] = useState<PracticeValidateType>({
    name: '',
    phone: '',
    email: '',
    address: {
      country: undefined,
      street: '',
      streetNumber: '',
      cityCode: '',
      city: '',
    },
    password: '',
    confirmPassword: '',
    infoEmail: '',
    website: '',
    info: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { setLogin } = useLoginContext();

  // Password validation state
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const addressFields = ['street', 'streetNumber', 'cityCode', 'city'];
    const nextData = addressFields.includes(name)
      ? { ...practiceData, address: { ...practiceData.address, [name]: value } }
      : { ...practiceData, [name]: value };

    const newErrors = validatePracticeFormular(nextData, errors, name);
    setErrors(newErrors);
  };

  const { data: dataCountries, isSuccess: isSuccessCountries } = useQuery({
    queryKey: ['allCountries'],
    queryFn: () => getAllCountries(),
  });

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
      });
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    const addressFields = ['street', 'streetNumber', 'cityCode', 'city'];
    if (addressFields.includes(name)) {
      setPracticeData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setPracticeData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name === 'password') {
      checkPasswordRequirements(value);
      if (practiceData.confirmPassword && value === practiceData.confirmPassword && errors.confirmPassword) {
        const next = { ...errors };
        delete next.confirmPassword;
        setErrors(next);
      }
    }
    if (name === 'confirmPassword') {
      if (value === practiceData.password && errors.confirmPassword) {
        const next = { ...errors };
        delete next.confirmPassword;
        setErrors(next);
      }
    }
  };

  const handleCountryChange = (selectedOption: SingleValue<{ value: CountryType; label: string }>) => {
    setPracticeData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        country: selectedOption?.value,
      },
    }));
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

    const newErrors = validatePracticeFormular(practiceData, errors);
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setTimeout(() => {
        scrollToFirstError(newErrors);
      }, 100);
      return;
    }

    const practice = getPracticeCreateType(practiceData);
    if (!practice) {
      setErrors({ ...errors, country: 'Land ist erforderlich' });
      return;
    }

    try {
      VeterinaryPracticeCreateSchema.parse(practice);
      mutateCreatePractice(practice);
    } catch (err) {
      console.log('Zod Error: veterinaryRegistration' + err);
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
                  value={practiceData.name}
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
                    value={practiceData.email}
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
                    value={practiceData.phone}
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
                  value={practiceData.password!}
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
                    : practiceData.password!.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.minLength ? '✓' : '○'} Mindestens 8 Zeichen
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasUpperCase
                    ? 'valid'
                    : practiceData.password!.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.hasUpperCase ? '✓' : '○'} Mindestens ein Großbuchstabe
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasNumber
                    ? 'valid'
                    : practiceData.password!.length > 0
                      ? 'invalid'
                      : 'neutral'
                    }`}>
                    {passwordRequirements.hasNumber ? '✓' : '○'} Mindestens eine Zahl
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasSpecialChar
                    ? 'valid'
                    : practiceData.password!.length > 0
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
                value={practiceData.confirmPassword!}
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
                    id="street"
                    type="text"
                    placeholder="Musterstraße"
                    name="street"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={practiceData.address.street}
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
                    id="streetNumber"
                    type="text"
                    placeholder="1"
                    name="streetNumber"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={practiceData.address.streetNumber}
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
                    id="cityCode"
                    type="text"
                    placeholder="12345"
                    name="cityCode"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={practiceData.address.cityCode}
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
                    id="city"
                    type="text"
                    placeholder="Musterstadt"
                    name="city"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={practiceData.address.city}
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              <FormGroup className="form-group">
                <Form.Label htmlFor="country" className="form-label">
                  Land *
                </Form.Label>
                {isSuccessCountries && (
                  <Select
                    inputId="country"
                    name="country"
                    options={countryOptions}
                    value={practiceData.address.country ? countryOptions.find((opt) => opt.value.id === practiceData.address.country!.id) : null}
                    onChange={handleCountryChange}
                    onBlur={() => {
                      const newErrors = validatePracticeFormular(practiceData, errors, 'country');
                      setErrors(newErrors);
                    }}
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
                )}
                {errors.country && (
                  <div className="invalid-feedback d-block">
                    {errors.country}
                  </div>
                )}
              </FormGroup>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Zusätzliche Informationen</h2>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="infoEmail" className="form-label">
                    Info E-Mail *
                  </Form.Label>
                  <Form.Control
                    id="infoEmail"
                    type="email"
                    placeholder="info@beispiel.de"
                    name="infoEmail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={practiceData.infoEmail}
                    isInvalid={!!errors.infoEmail}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.infoEmail}
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
                    value={practiceData.website}
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
                  value={practiceData.info}
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
