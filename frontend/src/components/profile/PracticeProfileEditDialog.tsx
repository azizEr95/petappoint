import { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
} from 'react-bootstrap'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Select from 'react-select'
import { PasswordInput } from '../common/PasswordInput'
import type { SingleValue } from 'react-select'
import type { ChangeEvent, KeyboardEvent } from 'react'
import type {
  CountryType,
  VeterinaryPracticesType,
} from 'petappoint-shared/schemas/ZodSchemas'
import {
  getPictureURLForPracticeId,
  getVeterinaryPracticesById,
  updateVeterinaryPractice,
  uploadPictureForPracticeId,
} from '@/api/VeterinaryPracticeAPI'
import { getAllCountries } from '@/api/CountriesAPI'
import { validatePracticeFormular } from '@/utils/ValidateForm'
import '@/styles/components/ProfileDialog.scss'

type PracticeProfileEditDialogProps = {
  hideDialog: () => void
  practiceId: number
}

export function PracticeProfileEditDialog({
  hideDialog,
  practiceId,
}: PracticeProfileEditDialogProps) {
  const queryClient = useQueryClient();
  const [changePassword, setChangePassword] = useState(false);

  const extractStreetAndNumber = (fullStreet: string) => {
    const match = fullStreet.match(/^(.+?)(\d+[a-zA-Z]*)$/)
    if (match) {
      return { street: match[1].trim(), streetNumber: match[2].trim() }
    }
    return { street: fullStreet, streetNumber: '' }
  }

  const { data: practice, isLoading: practiceLoading } = useQuery({
    queryKey: ['practice', practiceId],
    queryFn: () => getVeterinaryPracticesById(practiceId.toString()),
    enabled: !!practiceId,
  })

  const { data: dataAllCountries, isSuccess: isSuccessAllCountries } = useQuery({
    queryKey: ['allCountries'],
    queryFn: () => getAllCountries(),
  })

  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: '',
    infoEmail: '',
    website: '',
    info: '',
    address: {
      street: '',
      streetNumber: '',
      cityCode: '',
      city: '',
      country: undefined as CountryType | undefined,
    },
    password: changePassword ? '' : undefined,
    confirmPassword: changePassword ? '' : undefined,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [profilePictureURL, setProfilePictureURL] = useState<string>('')
  const [selectedPictureFile, setSelectedPictureFile] = useState<File>()
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    if (practice && isSuccessAllCountries) {
      const { street, streetNumber } = extractStreetAndNumber(practice.address.street)
      setProfileData({
        name: practice.name,
        phone: practice.phone,
        email: practice.email,
        infoEmail: practice.infoEmail,
        website: practice.website || '',
        info: practice.info || '',
        address: {
          street,
          streetNumber,
          cityCode: practice.address.cityCode,
          city: practice.address.city,
          country: dataAllCountries.find(
            (c: CountryType) => c.id === practice.address.country,
          ),
        },
        password: undefined,
        confirmPassword: undefined,
      })
      setProfilePictureURL(getPictureURLForPracticeId(practice.id, Date.now()))
    }
  }, [practice, dataAllCountries, isSuccessAllCountries])

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

  const updatePracticeMutation = useMutation({
    mutationFn: async () => {
      if (!practice) throw new Error('Practice not found')

      const updatedPractice: VeterinaryPracticesType = {
        id: practice.id,
        name: profileData.name,
        phone: profileData.phone,
        email: profileData.email,
        infoEmail: profileData.infoEmail,
        website: profileData.website || null,
        info: profileData.info || null,
        address: {
          id: practice.address.id,
          street: `${profileData.address.street} ${profileData.address.streetNumber}`.trim(),
          cityCode: profileData.address.cityCode,
          city: profileData.address.city,
          country: profileData.address.country?.id || 0,
          longitude: practice.address.longitude,
          latitude: practice.address.latitude,
        },
      }

      await updateVeterinaryPractice(practice.id, updatedPractice)

      if (selectedPictureFile) {
        await uploadPictureForPracticeId(practice.id, selectedPictureFile)
      }

      queryClient.invalidateQueries({ queryKey: ['practice', practiceId] })
    },
    onSuccess: () => {
      setErrorText('')
      setSelectedPictureFile(undefined)
      hideDialog()
    },
    onError: (error) => {
      setErrorText('Fehler beim Aktualisieren: ' + error.message)
    },
  })

  const handleBlur = (e: any) => {
    const { name, value } = e.target
    const addressFields = ['street', 'streetNumber', 'cityCode', 'city']
    const nextData = addressFields.includes(name)
      ? {
        ...profileData,
        address: { ...profileData.address, [name]: value },
      }
      : { ...profileData, [name]: value }

    const newErrors = validatePracticeFormular(nextData, errors, name)
    setErrors(newErrors)
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === 'newPassword') {
      if (profileData.confirmPassword && value === profileData.confirmPassword && errors.confirmPassword) {
        const next = { ...errors };
        delete next.confirmPassword;
        setErrors(next);
      }
    }
    if (name === 'confirmPassword') {
      if (value === profileData.password && errors.confirmPassword) {
        const next = { ...errors };
        delete next.confirmPassword;
        setErrors(next);
      }
    }
  }

  const handleChangeCheckedPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setChangePassword(checked);
    setProfileData((prev) => ({
      ...prev,
      password: checked ? '' : undefined,
      confirmPassword: checked ? '' : undefined,
    }));
  }

  const handleAddressChange = (e: any) => {
    const { name, value } = e.target

    setProfileData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }))
  }

  const handleCountryChange = (option: SingleValue<CountryType>) => {
    setProfileData((prev) => ({
      ...prev,
      address: { ...prev.address, country: option || undefined },
    }))
  }

  const handleSubmit = () => {
    const newErrors = validatePracticeFormular(profileData, errors)
    setErrors(newErrors)
    console.log(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updatePracticeMutation.mutate()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !updatePracticeMutation.isPending) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (practiceLoading) {
    return (
      <Modal show={true} centered>
        <Modal.Body>Laden...</Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal show={true} onHide={hideDialog} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Praxis-Profil bearbeiten</Modal.Title>
      </Modal.Header>

      <Modal.Body onKeyDown={handleKeyDown}>
        <Container>
          <Row className="justify-content-center mb-4">
            <Col xs="auto" className="text-center">
              {profilePictureURL && (
                <Image
                  src={profilePictureURL}
                  roundedCircle
                  width={200}
                  height={200}
                  alt="Praxis-Bild"
                  className="mb-3"
                />
              )}
              <Form.Group>
                <Form.Label>Praxis-Bild ändern</Form.Label>
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
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Name der Praxis</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.name}
                />
                {errors.name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.phone}
                />
                {errors.phone && (
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Info-Email</Form.Label>
                <Form.Control
                  type="email"
                  name="infoEmail"
                  value={profileData.infoEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.infoEmail}
                />
                {errors.infoEmail && (
                  <Form.Control.Feedback type="invalid">
                    {errors.infoEmail}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="url"
                  name="website"
                  value={profileData.website}
                  onChange={handleChange}
                  placeholder="z.B. https://example.com"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email (Login)</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                />
                <Form.Text className="text-muted">
                  Email kann nicht geändert werden
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Beschreibung</Form.Label>
                <Form.Control
                  as="textarea"
                  name="info"
                  value={profileData.info}
                  onChange={handleChange}
                  rows={3}
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
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Straße</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={profileData.address.street}
                  onChange={handleAddressChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.street}
                />
                {errors.street && (
                  <Form.Control.Feedback type="invalid">
                    {errors.street}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Nr.</Form.Label>
                <Form.Control
                  type="text"
                  name="streetNumber"
                  value={profileData.address.streetNumber}
                  onChange={handleAddressChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.streetNumber}
                />
                {errors.streetNumber && (
                  <Form.Control.Feedback type="invalid">
                    {errors.streetNumber}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Postleitzahl</Form.Label>
                <Form.Control
                  type="text"
                  name="cityCode"
                  value={profileData.address.cityCode}
                  onChange={handleAddressChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.cityCode}
                />
                {errors.cityCode && (
                  <Form.Control.Feedback type="invalid">
                    {errors.cityCode}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Stadt</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={profileData.address.city}
                  onChange={handleAddressChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.city}
                />
                {errors.city && (
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Land</Form.Label>
                <Select
                  options={dataAllCountries || []}
                  getOptionLabel={(option: CountryType) => option.name}
                  getOptionValue={(option: CountryType) => option.id.toString()}
                  value={profileData.address.country}
                  onChange={handleCountryChange}
                  placeholder="Land auswählen..."
                  isClearable
                  isSearchable
                  noOptionsMessage={() => 'Keine Länder gefunden'}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: errors.country ? '#dc3545' : base.borderColor,
                    }),
                  }}
                />
                {errors.country && (
                  <div className="invalid-feedback d-block">
                    {errors.country}
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
                onChange={handleChangeCheckedPassword}
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
                    name="password"
                    value={profileData.password || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    isInvalid={!!errors.newPassword}
                    error={errors.newPassword}
                    className="mb-3"
                    label="Neues Passwort*"
                    required
                  />
                </Col>
                <Col md={6}>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={profileData.confirmPassword || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    isInvalid={!!errors.confirmPassword}
                    error={errors.confirmPassword}
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
          disabled={updatePracticeMutation.isPending}
        >
          {updatePracticeMutation.isPending ? 'Speichern...' : 'Speichern'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
