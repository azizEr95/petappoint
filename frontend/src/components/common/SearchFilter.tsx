import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getAllAnimalTypes, getAnimaltypesFromPractice } from "../../api/AnimalTypeAPI";
import { useQuery } from "@tanstack/react-query";
import type { AnimalTypeType, AppointmentFilterType, ServiceType, VeterinaryPracticeSearchQueryType, VeterinaryPracticesType } from "../../../../shared/schemas/ZodSchemas";
import '../../styles/components/common/SearchFilter.scss'
import { getAllAvailableServices, getServicesFromPractice } from "../../api/ServicesAPI";
import { useNavigate } from "@tanstack/react-router";

type SearchFilterProps = {
    searchFilter: VeterinaryPracticeSearchQueryType | null,
    filterOptions: AppointmentFilterType
    setFilterServiceType: (newServices: number[]) => void
    setFilterAnimalType: (newAnimalType: number[]) => void
    practicePage: VeterinaryPracticesType | null
}

export function SearchFilter({ searchFilter, filterOptions, setFilterServiceType, setFilterAnimalType, practicePage }: SearchFilterProps) {
    const navigate = useNavigate();
    const [showFilterDialog, setShowFilterDialog] = useState<boolean>(false);
    const [filterServiceTypeLocal, setFilterServiceTypeLocal] = useState<number[]>(filterOptions.serviceTypeIds !== undefined ? filterOptions.serviceTypeIds : []);
    const [filterAnimalTypeLocal, setFilterAnimalTypeLocal] = useState<number[]>(filterOptions.animalTypeIds !== undefined ? filterOptions.animalTypeIds : []);
    const [practice, setPractice] = useState<VeterinaryPracticesType | null>(practicePage);

    // get all Animaltypes 
    const { isSuccess: isSuccessAnimalType, data: dataAnimalType } = useQuery<Array<AnimalTypeType>>({
        queryKey: ['allAnimaltypes'],
        queryFn: () => getAllAnimalTypes(),
        retry: false,
        enabled: practicePage === null
    });

    //get all ServiceType
    const { isSuccess: isSuccessAllAvailableServices, data: dataAllAvailableServices } = useQuery<Array<ServiceType>>({
        queryKey: ['allAvailableServicetypes'],
        queryFn: () => getAllAvailableServices(),
        retry: false,
        enabled: practicePage === null
    });

    // get all ServiceType from practice
    const { isSuccess: isSuccessServicesPractice, data: dataServicesPractice } = useQuery<Array<ServiceType>>({
        queryKey: ['ServicetypesPractice', practice?.id],
        queryFn: () => getServicesFromPractice(practice?.id.toString() ?? ""), // id is always !== undefined because of enabled condition
        retry: false,
        enabled: practicePage !== null
    });

    // get all AnimalTypes from practice
    const { isSuccess: isSuccessAnimaltypesPractice, isPending: isPendingAnimaltypesPractice, data: dataAnimaltypesPractice } = useQuery<Array<AnimalTypeType>>({
        queryKey: ['AnimaltypesPractice', practice?.id],
        queryFn: () => getAnimaltypesFromPractice(practice?.id.toString() ?? ""), // id is always !== undefined because of enabled condition
        retry: false,
        enabled: practicePage !== null
    });

    const handleOpenFilterDialog = () => {
        setShowFilterDialog(true);
    }

    const handleCloseFilterDialog = () => {
        setFilterServiceType(filterServiceTypeLocal)
        setFilterAnimalType(filterAnimalTypeLocal)
        if (practice === null && searchFilter !== null) { // searchFilter is null when it is an practicePage
            navigate({
                to: '/search',
                search: {
                    name: searchFilter.name,
                    address: searchFilter.address,
                    animalType: filterAnimalTypeLocal.join("-"),
                    serviceType: filterServiceTypeLocal.join("-")
                },
            })
        }
        setShowFilterDialog(false);
    }

    const handleDeleteFilter = () => {
        setFilterServiceTypeLocal([]);
        setFilterAnimalTypeLocal([]);
    }

    const checkSelectedAnimalType = (animaltype: AnimalTypeType): boolean => {
        const findAnimalType = filterAnimalTypeLocal.find((animalId) => {
            return animalId === animaltype.id
        });
        if (findAnimalType !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    const checkSelectedServiceType = (service: ServiceType): boolean => {
        const findServiceType = filterServiceTypeLocal.find((servID) => {
            return service.id === servID;
        });
        if (findServiceType !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    const handleChangeAnimalType = (animaltype: AnimalTypeType) => {
        const findAnimalType = filterAnimalTypeLocal.find((animalId) => {
            return animalId === animaltype.id
        })
        if (findAnimalType !== undefined) {
            setFilterAnimalTypeLocal([]);
        } else {
            setFilterAnimalTypeLocal([animaltype.id]);
        }
    }

    const handleChangeServiceType = (service: ServiceType) => {
        const findServiceType = filterServiceTypeLocal.find((servId) => {
            return service.id === servId;
        });

        if (findServiceType !== undefined) {
            // delete these service from array
            let selectedServices = filterServiceTypeLocal.slice();
            selectedServices = selectedServices?.filter((servId) => servId !== service.id);
            if (selectedServices !== undefined) { // it schould be always !== undefined
                setFilterServiceTypeLocal(selectedServices);
            } else {
                setFilterServiceTypeLocal([]);
            }
        } else {
            // add these service to array
            let selectedServices = filterServiceTypeLocal.slice();
            selectedServices?.push(service.id)
            if (selectedServices !== undefined) { // it schould be always !== undefined
                setFilterServiceTypeLocal(selectedServices);
            } else {
                setFilterServiceTypeLocal([]);
            }
        }
    }

    let animaltypes: AnimalTypeType[];
    if (isSuccessAnimalType && !isPendingAnimaltypesPractice) {
        animaltypes = dataAnimalType;
    } else if (isSuccessAnimaltypesPractice) {
        animaltypes = dataAnimaltypesPractice;
    } else {
        animaltypes = [];
    }

    let services: ServiceType[];
    if (isSuccessAllAvailableServices) {
        services = dataAllAvailableServices
    } else if (isSuccessServicesPractice) {
        services = dataServicesPractice;
    } else {
        services = [];
    }

    let activeFilter = 0;
    if (filterOptions.animalTypeIds?.length !== undefined && filterOptions.animalTypeIds?.length > 0) {
        activeFilter++;
    }
    if (filterOptions.serviceTypeIds?.length !== undefined && filterOptions.serviceTypeIds?.length > 0) {
        activeFilter++;
    }
    return <>
        <Button id="FilterButton" onClick={handleOpenFilterDialog}>
            <i className="bi bi-sliders"></i> Filter {activeFilter > 0 && <span>({activeFilter})</span>}
            </Button>
        <Modal show={showFilterDialog} onHide={handleCloseFilterDialog}>
            <Modal.Header closeButton>
                <Modal.Title>Filter</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Tierart:</Form.Label>
                    {animaltypes.map((animaltype) => {
                        return <Form.Check type="radio" id={animaltype.id.toString() + animaltype.name} key={animaltype.id.toString() + animaltype.name} label={animaltype.name} name="selectAnimaltype" value={animaltype.id} checked={checkSelectedAnimalType(animaltype)} onChange={() => { }} onClick={() => handleChangeAnimalType(animaltype)} />;
                    })}
                    {animaltypes.length === 0 && <div>Diese Praxis hat keine Tierarten.</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Terminart filtern:</Form.Label>
                    {services.map((service) => {
                        return <Form.Check type="checkbox" id={service.id.toString() + service.name} key={service.id.toString() + service.name} label={service.name} name="selectServiceType" value={service.id} checked={checkSelectedServiceType(service)} onChange={() => handleChangeServiceType(service)} />;
                    })}
                    {services.length === 0 && <div>Diese Praxis hat keine Terminarten.</div>}
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleDeleteFilter} variant="outline" disabled={filterAnimalTypeLocal === null && filterServiceTypeLocal === null}>Filter entfernen</Button>
                <Button onClick={handleCloseFilterDialog}>Ergebnisse anzeigen</Button>
            </Modal.Footer>
        </Modal>
    </>;

}