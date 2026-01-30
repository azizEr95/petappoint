import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Form, FormGroup } from 'react-bootstrap'
import Select from 'react-select'
import {
  getVeterinarianCreateType,
  scrollToFirstError,
  validateVeterinarianFormular,
} from '../../utils/ValidateForm'
import { PasswordInput } from '../../components/common/PasswordInput'
import {
  checkPersonByEmail,
  createVeterinarian,
} from '../../api/VeterinarianAPI'
import { useLoginContext } from '../../LoginContext'
import { useTitle } from '../../utils/useTitle'
import { getAllCountries } from '../../api/CountriesAPI'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import { getAllAvailableServices } from '../../api/ServicesAPI'
import type { MultiValue, SingleValue } from 'react-select'
import type {
  AnimalTypeType,
  CountryType,
  ServiceType,
} from 'vetilib-shared/schemas/ZodSchemas'
import '../../styles/routes/veterinarianCreate.scss'
import type { VeterinarianValidateType } from '@/types/validation'

export const Route = createFileRoute('/veterinarians/create')({
  component: VeterinarianCreateComponent,
})

function VeterinarianCreateComponent() {
  useTitle('Tierarzt erstellen')
  const navigate = useNavigate()
  const { login } = useLoginContext()
  const queryClient = useQueryClient()

  const [accountMode, setAccountMode] = useState<'new' | 'existing'>('new')
  const [existingPersonData, setExistingPersonData] = useState<{
    firstName: string
    lastName: string
  } | null>(null)
  const [selectedAnimalTypes, setSelectedAnimalTypes] = useState<Array<number>>(
    [],
  )
  const [selectedServices, setSelectedServices] = useState<Array<number>>([])

  const [veterinarianData, setVeterinarianData] =
    useState<VeterinarianValidateType>({
      firstName: '',
      lastName: '',
      infoEmail: '',
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
    })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  const { data: dataCountries, isSuccess: isSuccessCountries } = useQuery({
    queryKey: ['allCountries'],
    queryFn: () => getAllCountries(),
  })

  const { data: dataAnimalTypes, isSuccess: isSuccessAnimalTypes } = useQuery({
    queryKey: ['allAnimalTypes'],
    queryFn: () => getAllAnimalTypes(undefined),
  })

  const { data: dataServices, isSuccess: isSuccessServices } = useQuery({
    queryKey: ['allServices'],
    queryFn: () => getAllAvailableServices(undefined),
  })

  const checkPasswordRequirements = (pwd: string) => {
    setPasswordRequirements({
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    })
  }

  const getMaxDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const { mutate: mutateCreateVeterinarian, isPending } = useMutation({
    mutationFn: (vet: any) => createVeterinarian(vet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinarians'] });
      navigate({ to: '/veterinarians', search: { veterinarianName: "", sortBy: "name-asc", specialization: ""} });
    },
    onError: (error: any) => {
      setErrors({
        ...errors,
        [error.field || 'general']: error.message,
      })
    },
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setVeterinarianData((prev: VeterinarianValidateType) => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'password' && value) {
      checkPasswordRequirements(value)
      if (
        veterinarianData.confirmPassword &&
        value !== veterinarianData.confirmPassword
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwörter stimmen nicht überein',
        }))
      } else if (
        veterinarianData.confirmPassword &&
        value === veterinarianData.confirmPassword
      ) {
        setErrors((prev) => {
          const newErr = { ...prev }
          delete newErr.confirmPassword
          return newErr
        })
      }
    }
  }

  const handleAddressChange = (e: any) => {
    const { name, value } = e.target
    setVeterinarianData((prev: VeterinarianValidateType) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }))
  }

  const handleCountryChange = (
    selectedOption: SingleValue<{ value: CountryType; label: string }>,
  ) => {
    const updatedVet = {
      ...veterinarianData,
      address: {
        ...veterinarianData.address,
        country: selectedOption?.value,
      },
    }
    setVeterinarianData(updatedVet)
  }

  const handleAnimalTypesChange = (
    selectedOptions: MultiValue<{ value: number; label: string }>,
  ) => {
    setSelectedAnimalTypes(selectedOptions.map((opt) => opt.value))
  }

  const handleServicesChange = (
    selectedOptions: MultiValue<{ value: number; label: string }>,
  ) => {
    setSelectedServices(selectedOptions.map((opt) => opt.value))
  }

  const handleEmailCheck = async (email: string) => {
    if (!email || !email.includes('@')) return

    try {
      const result = await checkPersonByEmail(email)
      if (result.exists) {
        if (
          result.isVeterinarian ||
          result.firstName === undefined ||
          result.lastName === undefined
        ) {
          setErrors({ ...errors, email: 'Person ist bereits Tierarzt' })
          setExistingPersonData(null)
        } else {
          setExistingPersonData({
            firstName: result.firstName,
            lastName: result.lastName,
          })
          setErrors({ ...errors, email: '' })
        }
      } else {
        setErrors({
          ...errors,
          email: 'Person mit dieser Email existiert nicht',
        })
        setExistingPersonData(null)
      }
    } catch (err) {
      console.error('Email check failed:', err)
    }
  }

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? '#2c8a59' : base.borderColor,
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(44, 138, 89, 0.25)' : base.boxShadow,
      '&:hover': {
        borderColor: '#2c8a59',
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#2c8a59' : state.isFocused ? 'rgba(125, 216, 159, 0.2)' : base.backgroundColor,
      color: state.isSelected ? 'white' : base.color,
    }),
  }

  const countryOptions = useMemo(() => {
    if (!isSuccessCountries) {
      return []
    }
    return dataCountries
      .map((country: CountryType) => ({
        value: country,
        label: country.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [isSuccessCountries, dataCountries])

  const animalTypeOptions = useMemo(() => {
    if (!isSuccessAnimalTypes) return []
    return dataAnimalTypes
      .map((type: AnimalTypeType) => ({
        value: type.id,
        label: type.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [isSuccessAnimalTypes, dataAnimalTypes])

  const serviceOptions = useMemo(() => {
    if (!isSuccessServices) return []
    return dataServices
      .map((service: ServiceType) => ({
        value: service.id,
        label: service.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [isSuccessServices, dataServices])

  const handleBlur = (e: any) => {
    const name = e.target.name
    const newErrors = validateVeterinarianFormular(
      veterinarianData,
      errors,
      name,
      accountMode,
    )
    setErrors(newErrors)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors = validateVeterinarianFormular(
      veterinarianData,
      errors,
      undefined,
      accountMode,
    )
    setErrors(newErrors)

    if (Object.keys(newErrors).length !== 0) {
      setTimeout(() => {
        scrollToFirstError(newErrors)
      }, 100)
      return
    }

    const practiceId = login && login.role === 'company' ? login.id : undefined;

    if (accountMode === 'existing') {
      // Minimal payload for existing person
      const payload = {
        email: veterinarianData.email,
        infoEmail: veterinarianData.infoEmail || null,
        fk_veterinarypracticeid: practiceId || null,
        animalTypeIds: selectedAnimalTypes,
        serviceIds: selectedServices,
      }
      mutateCreateVeterinarian(payload)
    } else {
      // Full payload for new person
      const vet = getVeterinarianCreateType(veterinarianData, 'new', practiceId)
      const payload = {
        ...vet,
        animalTypeIds: selectedAnimalTypes,
        serviceIds: selectedServices,
      }
      mutateCreateVeterinarian(payload)
    }
  }

  // Guard: only practice users can create veterinarians
  if (!login || login.role !== 'company') {
    return (
      <div className="container mt-4">
        <Alert variant="danger">Nur Praxen können Tierärzte erstellen.</Alert>
      </div>
    )
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

          <FormGroup className="mb-4">
            <Form.Label className="form-label fw-bold">Account-Typ</Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                id="modeNew"
                name="accountMode"
                label="Neuer Account"
                checked={accountMode === 'new'}
                onChange={() => {
                  setAccountMode('new')
                  setErrors({})
                  setExistingPersonData(null)
                }}
              />
              <Form.Check
                type="radio"
                id="modeExisting"
                name="accountMode"
                label="Bestehende Email"
                checked={accountMode === 'existing'}
                onChange={() => {
                  setAccountMode('existing')
                  setErrors({})
                  setExistingPersonData(null)
                }}
              />
            </div>
          </FormGroup>

          {accountMode === 'existing' && (
            <Alert variant="info" className="mb-4">
              Person muss bereits registriert sein. Nach Email-Eingabe werden
              Name automatisch geladen.
            </Alert>
          )}

          {accountMode === 'new' && (
            <Alert variant="info" className="mb-4">
              Backend prüft automatisch ob Person existiert. Falls ja, wird nur
              Tierarzt-Eintrag erstellt.
            </Alert>
          )}

          <Form className="auth-form" onSubmit={handleSubmit}>
            {/* Veterinarian-specific fields */}
            <div className="form-section">
              <h2 className="form-section-title">Tierarzt-Daten</h2>

              {accountMode === 'existing' && (
                <FormGroup className="form-group">
                  <Form.Label className="form-label">Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={veterinarianData.email}
                    onChange={handleChange}
                    onBlur={(e) => {
                      handleBlur(e)
                      handleEmailCheck(e.target.value)
                    }}
                    isInvalid={!!errors.email}
                    placeholder="Email des bestehenden Accounts"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </FormGroup>
              )}

              {accountMode === 'existing' && existingPersonData && (
                <>
                  <FormGroup className="form-group">
                    <Form.Label className="form-label">Vorname</Form.Label>
                    <Form.Control
                      type="text"
                      value={existingPersonData.firstName}
                      disabled
                      className="bg-light"
                    />
                  </FormGroup>
                  <FormGroup className="form-group">
                    <Form.Label className="form-label">Nachname</Form.Label>
                    <Form.Control
                      type="text"
                      value={existingPersonData.lastName}
                      disabled
                      className="bg-light"
                    />
                  </FormGroup>
                </>
              )}

              {accountMode === 'new' && (
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
              )}

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

            {/* Specialization fields */}
            <div className="form-section">
              <h2 className="form-section-title">Spezialisierung</h2>

              <FormGroup className="form-group">
                <Form.Label className="form-label">
                  Behandelbare Tierarten
                </Form.Label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  name="animalTypes"
                  options={animalTypeOptions}
                  value={animalTypeOptions.filter((opt) =>
                    selectedAnimalTypes.includes(opt.value),
                  )}
                  onChange={handleAnimalTypesChange}
                  placeholder="Tierarten auswählen..."
                  styles={selectStyles}
                />
              </FormGroup>

              <FormGroup className="form-group">
                <Form.Label className="form-label">
                  Angebotene Leistungen
                </Form.Label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  name="services"
                  options={serviceOptions}
                  value={serviceOptions.filter((opt) =>
                    selectedServices.includes(opt.value),
                  )}
                  onChange={handleServicesChange}
                  placeholder="Leistungen auswählen..."
                  styles={selectStyles}
                />
              </FormGroup>
            </div>

            {/* Person data - only for new mode */}
            {accountMode === 'new' && (
              <>
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
                        Telefon *
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
                          ? countryOptions.find(
                            (opt) =>
                              opt.value.id ===
                              veterinarianData.address.country?.id,
                          )
                          : null
                      }
                      onChange={handleCountryChange}
                      styles={selectStyles}
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
                    <p className="requirements-title">
                      Passwort-Anforderungen:
                    </p>
                    <ul>
                      <li
                        className={passwordRequirements.minLength ? 'met' : ''}
                      >
                        Mindestens 8 Zeichen
                      </li>
                      <li
                        className={
                          passwordRequirements.hasUpperCase ? 'met' : ''
                        }
                      >
                        Mindestens ein Großbuchstabe
                      </li>
                      <li
                        className={passwordRequirements.hasNumber ? 'met' : ''}
                      >
                        Mindestens eine Zahl
                      </li>
                      <li
                        className={
                          passwordRequirements.hasSpecialChar ? 'met' : ''
                        }
                      >
                        Mindestens ein Sonderzeichen
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}

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
  )
}
