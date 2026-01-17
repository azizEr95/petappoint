import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Container, Form } from 'react-bootstrap';
import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { MultiValue } from 'react-select';
import '../../styles/routes/createAppointment.scss';
import type { AppointmentsCreateType, ServiceType, VeterinariansType } from 'vetilib-shared/schemas/ZodSchemas';
import { useLoginContext } from '@/LoginContext';
import { getVeterinariansByPracticeId } from '@/api/VeterinarianAPI';
import { getServicesFromVeterinary } from '@/api/ServicesAPI';
import { addAvailableAppointments } from '@/api/AppointmentsAPI';
import { compareDates } from '@/utils/DateToStringFormat';
import { useTitle } from '@/utils/useTitle';

export const Route = createFileRoute('/appointments/create')({
  component: CreateAppointmentComponent,
});

type AppointmentFormData = {
  name: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  date: string | undefined;
  veterinarianId: number | undefined;
  endDate: string | undefined;
}

function CreateAppointmentComponent() {
  useTitle('Termine erstellen');
  const { login } = useLoginContext();
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<
    MultiValue<{ value: ServiceType; label: string }>
  >([]);
  const [weeklyAppointment, setWeeklyAppointment] = useState<boolean>(false);
  const [selectedWeekdays, setSelectedWeekdays] = useState<Array<{ id: number; label: string }>>([]);
  const [createdAppointmentsOnWeekday] = useState<Array<{ id: number; label: string }>>([]);
  const [isLoadingCreateWeeklyAppointments, setIsLoadingCreateWeeklyAppointments] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [appointmentData, setAppointmentData] = useState<AppointmentFormData>({
    name: undefined,
    startTime: undefined,
    endTime: undefined,
    date: undefined,
    veterinarianId: undefined,
    endDate: undefined,
  });

  const weekdays = [
    { id: 1, label: 'Montag' },
    { id: 2, label: 'Dienstag' },
    { id: 3, label: 'Mittwoch' },
    { id: 4, label: 'Donnerstag' },
    { id: 5, label: 'Freitag' },
    { id: 6, label: 'Samstag' },
    { id: 0, label: 'Sonntag' },
  ];

  const { isSuccess: isSuccessVeterinarians, data: dataAllVeterinarians } = useQuery<Array<VeterinariansType>>({
    queryKey: ['allVeterinarians', login ? login.id.toString() : "logged out"], // login ist always true here because of the enabled flag
    queryFn: () => getVeterinariansByPracticeId(login ? login.id.toString() : "logged out"), // login ist always true here because of the enabled flag
    retry: false,
    enabled: login !== false && login.role === 'company',
  });

  const { isSuccess: isSuccessServicesVeterinary, data: dataServicesVeterinary } = useQuery<Array<ServiceType>>({
    queryKey: ['allServicesVeterinary', appointmentData.veterinarianId],
    queryFn: () => getServicesFromVeterinary(appointmentData.veterinarianId!.toString()),
    retry: false,
    enabled: appointmentData.veterinarianId !== undefined,
  });

  const createAppointment = useMutation({
    mutationFn: (appointment: AppointmentsCreateType) =>
      addAvailableAppointments(appointment),
    onSuccess: () => {
      if (selectedWeekdays.length !== createdAppointmentsOnWeekday.length && weeklyAppointment) {
        handleMutateCreateWeeklyAppointments();
      } else {
        if (weeklyAppointment) {
          localStorage.setItem('createWeeklyAppointmentSuccess', 'true');
        } else {
          localStorage.setItem('createAppointmentSuccess', 'true');
        }
        navigate({ to: '/dashboard' });
      }
    }
  });

  useEffect(() => {
    if (login !== false && login.verified && login.role !== 'company') {
      navigate({ to: '/dashboard' });
    } else if (login === false) {
      navigate({ to: '/' });
    }
  }, [login]);

  const serviceOptions = useMemo(() => {
    if (!isSuccessServicesVeterinary || dataServicesVeterinary.length === 0) {
      return [];
    }
    let options = dataServicesVeterinary;
    options = options.filter((service) => {
      const sameService = selectedServices.find((selService) => {
        if (selService.value.id === service.id) {
          return true;
        }
      });
      if (sameService !== undefined) {
        return false;
      } else {
        return true;
      }
    });
    if (selectedServices.length + options.length !== dataServicesVeterinary.length) {
      // not all options are currently shown
      dataServicesVeterinary.map((service) => {
        const findSelect = selectedServices.find((serviceSe) => {
          if (serviceSe.value.id === service.id) {
            return true;
          }
        });
        const findOptions = selectedServices.find((serviceOp) => {
          if (serviceOp.value.id === service.id) {
            return true;
          }
        });
        if (findSelect === undefined && findOptions === undefined) {
          options.push(service);
        }
      });
    }
    return options.map((x) => ({
      value: x,
      label: x.name,
    }));
  }, [isSuccessServicesVeterinary, dataServicesVeterinary, selectedServices]);

  const handleClickBack = () => {
    window.history.back();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'veterinarianId') {
      setAppointmentData(prevState => ({
        ...prevState,
        veterinarianId: value !== "" ? parseInt(value) : undefined
      }));
    } else {
      setAppointmentData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    delete errors[name];
    if (name === "veterinarianId") {
      appointmentData.veterinarianId = undefined
      setSelectedServices([]);
    }
    if (name === "date" && weeklyAppointment) {
      delete errors["endDate"];
      validateForm("endDate");
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    validateForm(name);
    if (name === "date" && weeklyAppointment) {
      validateForm("endDate");
    }
  };

  const handleSelectServices = (
    raceSelect: MultiValue<{ value: ServiceType; label: string }>,
  ) => {
    setSelectedServices(raceSelect);
  };

  const handleCancelCreateAppointment = () => {
    navigate({ to: '/dashboard' });
  };

  const validateForm = (nameField?: string): boolean => {
    const newErrors: { [key: string]: string } = { ...errors };

    if (nameField === 'date' || nameField === undefined) {
      const now = new Date();
      if (!appointmentData.date) {
        newErrors.date = 'Datum ist erforderlich';
      } else if (compareDates(new Date(appointmentData.date), now) < 0) {
        newErrors.date = 'Datum darf nicht in der Vergangenheit liegen';
      }
    }

    if (nameField === 'startTime' || nameField === undefined) {
      if (!appointmentData.startTime) {
        newErrors.startTime = 'Startzeit ist erforderlich';
      }
    }

    if (nameField === 'endTime' || nameField === undefined) {
      if (!appointmentData.endTime) {
        newErrors.endTime = 'Endzeit ist erforderlich';
      } else if (appointmentData.startTime && appointmentData.endTime <= appointmentData.startTime) {
        newErrors.endTime = 'Endzeit muss nach Startzeit liegen';
      }
    }

    if (nameField === 'veterinarianId' || nameField === undefined) {
      if (appointmentData.veterinarianId === undefined) {
        newErrors.veterinarianId = 'Tierarzt ist erforderlich';
      }
    }

    if (selectedServices.length === 0) {
      newErrors.services = 'Mindestens ein Service ist erforderlich';
    } else {
      delete newErrors.services;
    }

    if (weeklyAppointment) {
      if (nameField === 'weekdays' || nameField === undefined) {
        if (selectedWeekdays.length === 0) {
          newErrors.weekdays = 'Mindestens ein Wochentag ist erforderlich';
        }
      }

      if (nameField === 'endDate' || nameField === undefined) {
        const now = new Date();
        let oneYearAfterStart;
        if(appointmentData.date){
          oneYearAfterStart = new Date(appointmentData.date);
          oneYearAfterStart.setFullYear(oneYearAfterStart.getFullYear() + 1);
        }
        if (!appointmentData.endDate) {
          newErrors.endDate = 'Enddatum ist erforderlich';
        } else if (appointmentData.date && appointmentData.endDate < appointmentData.date) {
          newErrors.endDate = 'Enddatum muss nach dem Startdatum liegen';
        } else if (compareDates(new Date(appointmentData.endDate), now) < 0) {
          newErrors.endDate = 'Datum darf nicht in der Vergangenheit liegen';
        } else if (oneYearAfterStart && compareDates(new Date(appointmentData.endDate), oneYearAfterStart) > 0) {
          newErrors.endDate = 'Enddatum darf maximal ein Jahr nach Startdatum liegen';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCreateAppointment = () => {
    if (!login) return;

    if (!validateForm()) {
      return;
    }

    if (weeklyAppointment) {
      setIsLoadingCreateWeeklyAppointments(true);
      handleMutateCreateWeeklyAppointments();
    } else {
      const newOneAppointment = {
        startTime: new Date(appointmentData.date + "T" + appointmentData.startTime),
        endTime: new Date(appointmentData.date + "T" + appointmentData.endTime),
        veterinaryId: appointmentData.veterinarianId!,
        veterinaryPracticeId: login.id,
        availableServiceIds: selectedServices.map((service) => service.value.id),
        endDate: undefined,
      };

      createAppointment.mutate(newOneAppointment);
    }
  };

  const handleMutateCreateWeeklyAppointments = () => {
    if (!login) return;

    for (const weekday of selectedWeekdays) { // loop over all weekdays, create for every selected weekday weekly appointments
      if (createdAppointmentsOnWeekday.find((w) => w.id === weekday.id)) { // if weekday is already created, skip them
        continue;
      }
      const newWeeklyAppointment = {
        startTime: new Date(appointmentData.date + "T" + appointmentData.startTime),
        endTime: new Date(appointmentData.date + "T" + appointmentData.endTime),
        veterinaryId: appointmentData.veterinarianId!,
        veterinaryPracticeId: login.id,
        availableServiceIds: selectedServices.map((service) => service.value.id),
        endDate: new Date(appointmentData.endDate!)
      };

      while (newWeeklyAppointment.startTime.getDay() !== weekday.id) { // set Date to correct weekday
        newWeeklyAppointment.startTime.setDate(newWeeklyAppointment.startTime.getDate() + 1);
        newWeeklyAppointment.endTime.setDate(newWeeklyAppointment.endTime.getDate() + 1);
      }
      createdAppointmentsOnWeekday.push({ id: weekday.id, label: weekday.label });
      createAppointment.mutate(newWeeklyAppointment);
      return; // exit function to wait for next mutation cycle
    }
  }

  const handleWeeklyChange = (newValue: boolean) => {
    delete errors.weekdays;
    delete errors.endDate;
    setWeeklyAppointment(newValue);
    if (!newValue) {
      setSelectedWeekdays([]);
    }
  };

  const handleWeekdayToggle = (weekdayId: number) => {
    delete errors.weekdays;
    const weekday = weekdays.find((w) => w.id === weekdayId);
    if (!weekday) return;
    setSelectedWeekdays((prev) => {
      const exists = prev.some((w) => w.id === weekday.id);
      return exists ? prev.filter((w) => w.id !== weekday.id) : [...prev, weekday];
    });
  };

  return <div className="booking-page">
    <div className="booking-header">
      <button className="back-button" onClick={handleClickBack}>
        <i className="bi bi-arrow-left"></i>
        Zurück
      </button>
      <h1>Termine erstellen</h1>
    </div>
    <Container className="appointment-container">
      <Form.Group className="mb-3 appointment-date">
        <Form.Label>Datum*:</Form.Label>
        <Form.Control
          type="date"
          name="date"
          onChange={handleChange}
          onBlur={handleBlur}
          value={appointmentData.date || ''}
          isInvalid={!!errors.date}
          disabled={isLoadingCreateWeeklyAppointments}
        />
        <Form.Control.Feedback type="invalid">
          {errors.date}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="appointment-time-container">
        <Form.Group className="mb-3 appointment-start-time">
          <Form.Label>Startzeit*:</Form.Label>
          <Form.Control
            type="time"
            name="startTime"
            value={appointmentData.startTime || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.startTime}
            disabled={isLoadingCreateWeeklyAppointments}
          />
          <Form.Control.Feedback type="invalid">
            {errors.startTime}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3 appointment-end-time">
          <Form.Label>Endzeit*:</Form.Label>
          <Form.Control
            type="time"
            name="endTime"
            value={appointmentData.endTime || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.endTime}
            disabled={isLoadingCreateWeeklyAppointments}
          />
          <Form.Control.Feedback type="invalid">
            {errors.endTime}
          </Form.Control.Feedback>
        </Form.Group>
      </div>
      {isSuccessVeterinarians && <Form.Group className="mb-3">
        <Form.Label>Tierarzt*:</Form.Label>
        <Form.Control
          as="select"
          name="veterinarianId"
          value={appointmentData.veterinarianId || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={!!errors.veterinarianId}
          disabled={isLoadingCreateWeeklyAppointments}
        >
          <option value="">Bitte auswählen</option>
          {dataAllVeterinarians.map((vetenerian) => (
            <option key={vetenerian.id} value={vetenerian.id}>
              {vetenerian.firstName} {vetenerian.lastName}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.veterinarianId}
        </Form.Control.Feedback>
      </Form.Group>}
      <Form.Group className="mb-3">
        <Form.Label>
          Services auswählen (mehrere möglich)*:
        </Form.Label>
        <Select
          name="services"
          closeMenuOnSelect={false}
          isMulti={true}
          placeholder={!isSuccessServicesVeterinary ? "Bitte zuerst Tierarzt auswählen" : "Bitte Services auswählen"}
          options={serviceOptions}
          value={selectedServices}
          onChange={handleSelectServices}
          isDisabled={!isSuccessServicesVeterinary || isLoadingCreateWeeklyAppointments}
          onBlur={handleBlur}
        />
        {errors.services && (
          <div className="invalid-feedback d-block">
            {errors.services}
          </div>
        )}
      </Form.Group>
      <Form.Group className="mb-3 weekly-appointment-header">
        <Form.Label>Termin wöchentlich wiederholen*:</Form.Label>
        <Form.Check
          type="switch"
          id="weeklyAppointmentSwitch"
          label={weeklyAppointment ? "Ja" : "Nein"}
          checked={weeklyAppointment}
          onChange={(e) => handleWeeklyChange(e.target.checked)}
          disabled={isLoadingCreateWeeklyAppointments}
        />
      </Form.Group>
      {weeklyAppointment && (<>
        <Form.Group className="mb-3">
          <Form.Label>Wochentage auswählen*:</Form.Label>
          <div className="weekday-selection">
            {weekdays.map((weekday) => (
              <Form.Check
                name="weekdays"
                key={weekday.id}
                type="checkbox"
                id={`weekday-${weekday.id}`}
                label={weekday.label}
                checked={selectedWeekdays.some((w) => w.id === weekday.id)}
                onChange={() => handleWeekdayToggle(weekday.id)}
                onBlur={handleBlur}
                disabled={isLoadingCreateWeeklyAppointments}
              />
            ))}
          </div>
          {errors.weekdays && (
            <div className="invalid-feedback d-block">
              {errors.weekdays}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3 appointment-date">
          <Form.Label>Enddatum*:</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            onChange={handleChange}
            onBlur={handleBlur}
            value={appointmentData.endDate || ''}
            isInvalid={!!errors.endDate}
            disabled={isLoadingCreateWeeklyAppointments}
          />
          <Form.Control.Feedback type="invalid">
            {errors.endDate}
          </Form.Control.Feedback>
        </Form.Group>
      </>)}
      <div className="appointment-buttons">
        <Button variant="primary" onClick={handleSubmitCreateAppointment} disabled={isLoadingCreateWeeklyAppointments}>
          {isLoadingCreateWeeklyAppointments ? "Wird angelegt" : "Anlegen"}
        </Button>
        <Button variant="secondary" onClick={handleCancelCreateAppointment}>
          Abbrechen
        </Button>
      </div>
    </Container>
  </div>;
}
