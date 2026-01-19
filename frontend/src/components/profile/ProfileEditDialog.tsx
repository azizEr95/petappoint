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
import type { SingleValue } from 'react-select';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type {
  CountryType,
  PersonsType,
  PersonsUpdateType,
} from 'vetilib-shared/schemas/ZodSchemas';
import '../../styles/components/ProfileDialog.scss';
import { getAllCountries } from '@/api/CountriesAPI';
import { validatePersonFormular } from '@/utils/ValidateForm';

type ProfileEditDialogProps = {
  hideDialog: () => void
  person: PersonsType
}

export function ProfileEditDialog({
  hideDialog,
  person,
}: ProfileEditDialogProps) {
  const queryClient = useQueryClient()

  const extractStreetAndNumber = (fullStreet: string) => {
    const match = fullStreet.match(/^(.+?)(\d+[a-zA-Z]*)$/);
    if (match) {
      return { street: match[1].trim(), streetNumber: match[2].trim() };
    }
    return { street: fullStreet, streetNumber: '' };
  };

  const { street: initialStreet, streetNumber: initialStreetNumber } = extractStreetAndNumber(person.address.street);

  const [changePassword, setChangePassword] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: person.firstName,
    lastName: person.lastName,
    sex: person.sex,
    dateOfBirth: getDateStringFromDate(person.dateOfBirth),
    phone: person.phone,
    email: person.email,
    address: {
      street: initialStreet,
      streetNumber: initialStreetNumber,
      cityCode: person.address.cityCode,
      city: person.address.city,
      country: undefined as CountryType | undefined,
    },
    password: changePassword ? '' : undefined,
    confirmPassword: changePassword ? '' : undefined,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [profilePictureURL, setProfilePictureURL] = useState<string>(
    getPictureURLForPersonId(person.id, Date.now()),
  );
  const [selectedPictureFile, setSelectedPictureFile] = useState<File>();
  const [errorText, setErrorText] = useState('');

  const { data: dataAllCountries, isSuccess: isSuccessAllCountries } = useQuery({
    queryKey: ['allCountries'],
    queryFn: () => getAllCountries(),
  });

  useEffect(() => {
    if (isSuccessAllCountries && person.address.country) {
      const found = dataAllCountries.find((c: CountryType) => c.id === person.address.country);
      setProfileData((prev) => ({
        ...prev,
        address: { ...prev.address, country: found },
      }));
    }
  }, [isSuccessAllCountries, dataAllCountries, person.address.country]);

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

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    const addressFields = ['street', 'streetNumber', 'cityCode', 'city'];
    const nextData = addressFields.includes(name)
      ? { ...profileData, address: { ...profileData.address, [name]: value } }
      : { ...profileData, [name]: value };

    const newErrors = validatePersonFormular(nextData, errors, name);
    setErrors(newErrors);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
  };

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
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleCountryChange = (selectedOption: SingleValue<{ value: CountryType; label: string }>) => {
    setProfileData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        country: selectedOption?.value,
      },
    }));
  };

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
    const newErrors = validatePersonFormular(profileData, errors);
    setErrors(newErrors);
    if (changePassword && !profileData.confirmPassword) {
    }
    if (Object.keys(newErrors).length !== 0) {
        setErrorText('Bitte korrigieren Sie die Fehler.');
        return;
    }

    if (!profileData.address.country) {
      setErrorText('Land ist erforderlich.');
      return;
    }

    const updatedPerson: PersonsUpdateType = {
      id: person.id,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
      dateOfBirth: new Date(profileData.dateOfBirth),
      sex: profileData.sex,
      address: {
        id: person.address.id,
        street: profileData.address.street + profileData.address.streetNumber,
        cityCode: profileData.address.cityCode,
        city: profileData.address.city,
        country: profileData.address.country.id,
        latitude: person.address.latitude,
        longitude: person.address.longitude,
      },
    };
    if (changePassword && profileData.password) {
      updatedPerson.password = profileData.password;
    }

    updatePersonMutation.mutate(updatedPerson);
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
                  value={profileData.firstName}
                  name="firstName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nachname*</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.lastName}
                  name="lastName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
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
                  value={profileData.sex}
                  name="sex"
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  value={profileData.dateOfBirth}
                  name="dateOfBirth"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.dateOfBirth}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateOfBirth}
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
                  value={profileData.email}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefon*</Form.Label>
                <Form.Control
                  type="tel"
                  value={profileData.phone}
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
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
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Straße*</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.address.street}
                  name="street"
                  onChange={handleAddressChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.street}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.street}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Nr.*</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.address.streetNumber}
                  name="streetNumber"
                  onChange={handleAddressChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.streetNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.streetNumber}
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
                  value={profileData.address.cityCode}
                  name="cityCode"
                  onChange={handleAddressChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.cityCode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.cityCode}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Stadt*</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.address.city}
                  name="city"
                  onChange={handleAddressChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Land*</Form.Label>
                <Select
                  inputId="land"
                  name="country"
                  options={countryOptions}
                  value={profileData.address.country ? countryOptions.find((opt) => opt.value.id === profileData.address.country!.id) : null}
                  onChange={handleCountryChange}
                  onBlur={() => {
                    const newErrors = validatePersonFormular(profileData, errors, 'country');
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
          disabled={updatePersonMutation.isPending}
        >
          {updatePersonMutation.isPending ? 'Speichern...' : 'Speichern'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
