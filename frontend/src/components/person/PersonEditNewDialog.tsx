import { useMemo, useState } from 'react';
import { Alert, Button, Form, FormGroup, Modal } from 'react-bootstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Select from 'react-select';
import { getPersonCreateType, validatePersonFormular } from '../../utils/ValidateForm';
import { getAllCountries } from '../../api/CountriesAPI';
import type { SingleValue } from 'react-select';
import type { CountryType, PersonsCreateType } from 'vetilib-shared/schemas/ZodSchemas';
import type { PersonsValidateType } from '@/types/validation';
import { personRegistration } from '@/api/LoginAPI';

type PersonEditNewDialogProps = {
    hideDialogNewPerson: () => void
    onPersonCreated?: (personId: number) => void
    showSuccessNotification: () => void
}

export function PersonEditNewDialog({
    hideDialogNewPerson,
    onPersonCreated,
    showSuccessNotification
}: PersonEditNewDialogProps) {
    const queryClient = useQueryClient();

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

    const { data: dataCountries, isSuccess: isSuccessCountries } = useQuery({
        queryKey: ['allCountries'],
        queryFn: () => getAllCountries(),
    });

    const getMaxDate = (): string => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const { mutate: mutateCreatePerson, isPending } = useMutation({
        mutationFn: (person: PersonsCreateType) => personRegistration(person),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            showSuccessNotification();
            if (onPersonCreated) {
                onPersonCreated(data.id);
            }
            hideDialogNewPerson();
        },
        onError: (error: any) => {
            setErrors({
                ...errors,
                [error.field || 'general']: error.message || 'Fehler beim Erstellen der Person',
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Set dummy password for validation - backend will generate real password
        const personDataWithPassword = {
            ...personData,
            password: 'TempPassword123!',
            confirmPassword: 'TempPassword123!'
        };

        const newErrors = validatePersonFormular(personDataWithPassword, errors);
        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) {
            return;
        }

        const person = getPersonCreateType(personDataWithPassword);
        mutateCreatePerson(person!);
    };

    const customSelectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            borderColor: state.isFocused ? '#2c8a59' : base.borderColor,
            boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(44, 138, 89, 0.25)' : base.boxShadow,
            '&:hover': {
                borderColor: state.isFocused ? '#2c8a59' : base.borderColor,
            },
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#2c8a59'
                : state.isFocused
                    ? 'rgba(125, 216, 159, 0.2)'
                    : base.backgroundColor,
            color: state.isSelected ? 'white' : base.color,
            '&:active': {
                backgroundColor: 'rgba(44, 138, 89, 0.3)',
            },
        }),
    };

    return (
        <Modal show={true} onHide={hideDialogNewPerson} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Neuen Tierbesitzer anlegen</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errors.general && (
                    <Alert variant="danger" dismissible onClose={() => setErrors({ ...errors, general: '' })}>
                        {errors.general}
                    </Alert>
                )}

                <Alert variant="info" className="mb-3">
                    Ein temporäres Passwort wird automatisch generiert und per E-Mail versendet.
                </Alert>

                <Form id="person-create-form" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <h6 className="mb-3">Persönliche Daten</h6>

                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup className="mb-3">
                                    <Form.Label>Vorname *</Form.Label>
                                    <Form.Control
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
                            </div>

                            <div className="col-md-6">
                                <FormGroup className="mb-3">
                                    <Form.Label>Nachname *</Form.Label>
                                    <Form.Control
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
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup className="mb-3">
                                    <Form.Label>Geburtsdatum *</Form.Label>
                                    <Form.Control
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
                            </div>

                            <div className="col-md-6">
                                <FormGroup className="mb-3">
                                    <Form.Label>Geschlecht *</Form.Label>
                                    <Form.Select
                                        name="sex"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={personData.sex ?? ''}
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
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup className="mb-3">
                                    <Form.Label>E-Mail *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="email@example.com"
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
                            </div>

                            <div className="col-md-6">
                                <FormGroup className="mb-3">
                                    <Form.Label>Telefon</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Telefonnummer"
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
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h6 className="mb-3">Adresse</h6>

                        <FormGroup className="mb-3">
                            <Form.Label>Land *</Form.Label>
                            <Select
                                name="country"
                                options={countryOptions}
                                value={
                                    personData.address.country
                                        ? countryOptions.find((opt) => opt.value.id === personData.address.country?.id)
                                        : null
                                }
                                onChange={handleCountryChange}
                                styles={customSelectStyles}
                            />
                        </FormGroup>

                        <div className="row">
                            <div className="col-md-8">
                                <FormGroup className="mb-3">
                                    <Form.Label>Straße *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Straße"
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
                            </div>

                            <div className="col-md-4">
                                <FormGroup className="mb-3">
                                    <Form.Label>Hausnummer *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nummer"
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
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <FormGroup className="mb-3">
                                    <Form.Label>Postleitzahl *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="PLZ"
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
                            </div>

                            <div className="col-md-8">
                                <FormGroup className="mb-3">
                                    <Form.Label>Stadt *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Stadt"
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
                        </div>
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={hideDialogNewPerson} disabled={isPending}>
                    Abbrechen
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    form="person-create-form"
                    disabled={isPending}
                >
                    {isPending ? 'Wird erstellt...' : 'Erstellen'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
