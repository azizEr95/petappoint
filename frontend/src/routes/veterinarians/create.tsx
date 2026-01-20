import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Form, FormGroup } from 'react-bootstrap';
import { getVeterinarianCreateType, scrollToFirstError, validateVeterinarianFormular } from '../../utils/ValidateForm';
import type { VeterinarianValidateType } from '../../utils/ValidateForm';
import { createVeterinarian } from '../../api/VeterinarianAPI';
import { useLoginContext } from '../../LoginContext';
import { useTitle } from '../../utils/useTitle';
import type { CountryType } from 'vetilib-shared/schemas/ZodSchemas';
import { getAllCountries } from '../../api/CountriesAPI';
import Select from 'react-select';
import type { SingleValue } from 'react-select';
import { PasswordInput } from '../../components/common/PasswordInput';
import '../../styles/routes/veterinarianCreate.scss';

export const Route = createFileRoute('/veterinarians/create')({
  component: VeterinarianCreate,
});

function VeterinarianCreate() {
  useTitle('Tierarzt erstellen');
  const navigate = useNavigate();
  const { login } = useLoginContext();

  const [veterinarianData, setVeterinarianData] = useState<VeterinarianValidateType>({
    firstName: '',
    lastName: '',
    infoEmail: '',
    // Person data (used when creating new person)
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    sex: undefined,
    phone: '',
    address: {
      country: undefined,
      street: '',
      streetNumber: '',
      cityCode: '',
      city: '',
    },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

  const checkPasswordRequirements = (pwd: string) => {
    setPasswordRequirements({
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    });
  };

  const getMaxDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const { mutate: mutateCreateVeterinarian, isPending } = useMutation({
    mutationFn: (vet: any) => createVeterinarian(vet),
    onSuccess: () => {
      navigate({ to: '/dashboard' });
    },
    onError: (error: any) => {
      setErrors({
        ...errors,
        [error.field || 'general']: error.message,
      });
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setVeterinarianData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password' && value) {
      checkPasswordRequirements(value);
      if (veterinarianData.confirmPassword && value !== veterinarianData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwörter stimmen nicht überein' }));
      } else if (veterinarianData.confirmPassword && value === veterinarianData.confirmPassword) {
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
    setVeterinarianData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleCountryChange = (selectedOption: SingleValue<{ value: CountryType; label: string }>) => {
    const updatedVet = {
      ...veterinarianData,
      address: {
        ...veterinarianData.address,
        country: selectedOption?.value,
      },
    };
    setVeterinarianData(updatedVet);
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

  const handleBlur = (e: any) => {
    const name = e.target.name;
    const newErrors = validateVeterinarianFormular(veterinarianData, errors, name, 'new');
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateVeterinarianFormular(veterinarianData, errors, undefined, 'new');
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setTimeout(() => {
        scrollToFirstError(newErrors);
      }, 100);
      return;
    }

    const practiceId = login && login.role === 'company' ? (login as any).practiceId : undefined;
    const vet = getVeterinarianCreateType(veterinarianData, 'new', practiceId);
    mutateCreateVeterinarian(vet);
  };

  // Guard: only practice users can create veterinarians
  if (!login || login.role !== 'company') {
    return (
      <div className="container mt-4">
        <Alert variant="danger">Nur Praxen können Tierärzte erstellen.</Alert>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Tierarzt erstellen</h1>

          {errors.general && (
            <Alert variant="danger" className="mb-3">
              {errors.general}
            </Alert>
          )}

          <Alert variant="info" className="mb-4">
            Backend prüft automatisch ob Person mit dieser E-Mail existiert. Falls ja, wird nur Tierarzt-Eintrag erstellt.
          </Alert>

          <Form className="auth-form" onSubmit={handleSubmit}>
            {/* Veterinarian-specific fields */}
            <div className="form-section">
              <h2 className="form-section-title">Tierarzt-Daten</h2>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="firstName" className="form-label">
                    Vorname *
                  </Form.Label>
                  <Form.Control
                    id="VetFirstName"
                    type="text"
                    placeholder="Vorname"
                    name="firstName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={veterinarianData.firstName}
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
                    id="VetLastName"
                    type="text"
                    placeholder="Nachname"
                    name="lastName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={veterinarianData.lastName}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              <FormGroup className="form-group">
                <Form.Label htmlFor="infoEmail" className="form-label">
                  Info-E-Mail
                </Form.Label>
                <Form.Control
                  id="VetInfoEmail"
                  type="email"
                  placeholder="info@email.com"
                  name="infoEmail"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={veterinarianData.infoEmail}
                  isInvalid={!!errors.infoEmail}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.infoEmail}
                </Form.Control.Feedback>
              </FormGroup>
            </div>

            {/* Person data */}
            <div className="form-section">
              <h2 className="form-section-title">Persönliche Daten</h2>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="dateOfBirth" className="form-label">
                    Geburtsdatum *
                  </Form.Label>
                  <Form.Control
                    id="VetDateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={veterinarianData.dateOfBirth}
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
                    id="VetSex"
                    name="sex"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={veterinarianData.sex ?? ''}
                    isInvalid={!!errors.sex}
                  >
                    <option value="">Bitte wählen</option>
                    <option value="male">Männlich</option>
                    <option value="female">Weiblich</option>
                    <option value="not_applicable">Divers</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.sex}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="email" className="form-label">
                    E-Mail *
                  </Form.Label>
                  <Form.Control
                    id="VetEmail"
                    type="email"
                    placeholder="email@example.com"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={veterinarianData.email}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="phone" className="form-label">
                    Telefon
                  </Form.Label>
                  <Form.Control
                    id="VetPhone"
                    type="tel"
                    placeholder="Telefonnummer"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={veterinarianData.phone}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Adresse</h2>

              <FormGroup className="form-group">
                <Form.Label className="form-label">Land *</Form.Label>
                <Select
                  name="country"
                  options={countryOptions}
                  value={
                    veterinarianData.address.country
                      ? countryOptions.find((opt) => opt.value.id === veterinarianData.address.country?.id)
                      : null
                  }
                  onChange={handleCountryChange}
                />
              </FormGroup>

              <div className="form-row equal-col">
                <FormGroup className="form-group">
                  <Form.Label htmlFor="street" className="form-label">
                    Straße *
                  </Form.Label>
                  <Form.Control
                    id="VetStreet"
                    type="text"
                    placeholder="Straße"
                    name="street"
                    onChange={handleAddressChange}
                    onBlur={handleBlur}
                    value={veterinarianData.address.street}
                    isInvalid={!!errors.street}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.street}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="form-group">
                  <Form.Label htmlFor="streetNumber" className="form-label">
                    Hausnummer *
                  </Form.Label>
                  <Form.Control
                    id="VetStreetNumber"
                    type="text"
                    placeholder="Nummer"
                    name="streetNumber"
                    onChange={handleAddressChange}
                    onBlur={handleBlur}
                    value={veterinarianData.address.streetNumber}
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
                    Postleitzahl *
                  </Form.Label>
                  <Form.Control
                    id="VetCityCode"
                    type="text"
                    placeholder="PLZ"
                    name="cityCode"
                    onChange={handleAddressChange}
                    onBlur={handleBlur}
                    value={veterinarianData.address.cityCode}
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
                    id="VetCity"
                    type="text"
                    placeholder="Stadt"
                    name="city"
                    onChange={handleAddressChange}
                    onBlur={handleBlur}
                    value={veterinarianData.address.city}
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </FormGroup>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Login-Daten</h2>

              <PasswordInput
                id="VetPassword"
                name="password"
                value={veterinarianData.password || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                isInvalid={!!errors.password}
                error={errors.password}
                className="form-group"
                label="Passwort"
                required
              />

              <PasswordInput
                id="VetConfirmPassword"
                name="confirmPassword"
                value={veterinarianData.confirmPassword || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                isInvalid={!!errors.confirmPassword}
                error={errors.confirmPassword}
                className="form-group"
                label="Passwort bestätigen"
                required
              />

              <div className="password-requirements">
                <p className="requirements-title">Passwort-Anforderungen:</p>
                <ul>
                  <li className={passwordRequirements.minLength ? 'met' : ''}>
                    Mindestens 8 Zeichen
                  </li>
                  <li className={passwordRequirements.hasUpperCase ? 'met' : ''}>
                    Mindestens ein Großbuchstabe
                  </li>
                  <li className={passwordRequirements.hasNumber ? 'met' : ''}>
                    Mindestens eine Zahl
                  </li>
                  <li className={passwordRequirements.hasSpecialChar ? 'met' : ''}>
                    Mindestens ein Sonderzeichen
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary w-100 mt-4"
            >
              {isPending ? 'Erstelle Tierarzt...' : 'Tierarzt erstellen'}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
