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
import { addOneAvailableAppointments } from '@/api/AppointmentsAPI';

export const Route = createFileRoute('/appointments/create')({
  component: CreateAppointmentComponent,
});

function CreateAppointmentComponent() {
  const { login } = useLoginContext();
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<
    MultiValue<{ value: ServiceType; label: string }>
  >([]);
  const [appointmentData, setAppointmentData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    date: '',
    veterinarianId: -1,
  });

  const { isSuccess: isSuccessVeterinarians, data: dataAllVeterinarians } = useQuery<Array<VeterinariansType>>({
    queryKey: ['allVeterinarians', login ? login.id.toString() : ""], // login ist always true here
    queryFn: () => getVeterinariansByPracticeId(login ? login.id.toString() : ""), // login ist always true here
    retry: false,
    enabled: login !== false && login.role === 'company',
  });

  const { isSuccess: isSuccessServicesVeterinary, data: dataServicesVeterinary } = useQuery<Array<ServiceType>>({
    queryKey: ['allServicesVeterinary', appointmentData.veterinarianId],
    queryFn: () => getServicesFromVeterinary(appointmentData.veterinarianId.toString()),
    retry: false,
    enabled: appointmentData.veterinarianId !== -1,
  });

  const createOneAppointment = useMutation({
    mutationFn: (appointment: AppointmentsCreateType) =>
      addOneAvailableAppointments(appointment),
    onSuccess: () => {
      navigate({ to: '/dashboard' });
    },
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
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAppointmentData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if(name === "veterinarianId") {
      setSelectedServices([]);
    }
  }

  const handleSelectServices = (
    raceSelect: MultiValue<{ value: ServiceType; label: string }>,
  ) => {
    setSelectedServices(raceSelect);
  }

  const handleCancelCreateAppointment = () => {
    navigate({ to: '/dashboard' });
  }

  const handleSubmitCreateOneAppointment = () => {
    const newAppointment: AppointmentsCreateType = {
      startTime: new Date(appointmentData.date + "T" + appointmentData.startTime),
      endTime: new Date(appointmentData.date + "T" + appointmentData.endTime),
      veterinaryId: parseInt(appointmentData.veterinarianId.toString()),
      veterinaryPracticeId: login ? login.id : -1, // login is always true here
      availableServiceIds: selectedServices.map((service) => service.value.id),
    };
    createOneAppointment.mutate(newAppointment);
  }


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
          value={appointmentData.date}
        />
      </Form.Group>
      <div className="appointment-time-container">
        <Form.Group className="mb-3 appointment-start-time">
          <Form.Label>Startzeit*:</Form.Label>
          <Form.Control
            type="time"
            name="startTime"
            value={appointmentData.startTime}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3 appointment-end-time">
          <Form.Label>Endzeit*:</Form.Label>
          <Form.Control
            type="time"
            name="endTime"
            value={appointmentData.endTime}
            onChange={handleChange}
          />
        </Form.Group>
      </div>
      {isSuccessVeterinarians && <Form.Group className="mb-3">
        <Form.Label>Tierarzt*:</Form.Label>
        <Form.Control
          as="select"
          name="veterinarianId"
          value={appointmentData.veterinarianId}
          onChange={handleChange}
        >
          <option value="">Bitte auswählen</option>
          {dataAllVeterinarians.map((vetenerian) => (
            <option key={vetenerian.id} value={vetenerian.id}>
              {vetenerian.firstName} {vetenerian.lastName}
            </option>
          ))}
        </Form.Control>
      </Form.Group>}
      {isSuccessServicesVeterinary && <Form.Group className="mb-3">
        <Form.Label>
          Services auswählen (mehrere möglich)*:
        </Form.Label>
        <Select
          closeMenuOnSelect={false}
          isMulti={true}
          placeholder="Bitte Services auswählen"
          options={serviceOptions}
          value={selectedServices}
          onChange={handleSelectServices}
        />
      </Form.Group>}
      <Button variant="secondary" onClick={handleCancelCreateAppointment}>
        Abbrechen
      </Button>
      <Button variant="primary" onClick={handleSubmitCreateOneAppointment}>
        Anlegen
      </Button>
    </Container>
  </div>;
}
