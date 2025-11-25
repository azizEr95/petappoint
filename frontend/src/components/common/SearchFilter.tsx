import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getAllAnimalTypes } from "../../api/AnimalTypeAPI";
import { useQuery } from "@tanstack/react-query";
import type { AnimalTypeType, AppointmentFilterType, ServiceType, VeterinaryPracticeSearchQueryType, VeterinaryPracticesType } from "../../../../shared/schemas/ZodSchemas";
import '../../styles/components/common/SearchFilter.scss'
import { getAllAvailableServices } from "../../api/ServicesAPI";
import { useNavigate } from "@tanstack/react-router";

type SearchFilterProps = {
    searchFilter: VeterinaryPracticeSearchQueryType,
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

    // get all Animaltypes 
    const { isSuccess: isSuccessAnimalType, data: dataAnimalType } = useQuery<Array<AnimalTypeType>>({
        queryKey: ['allAnimaltypes'],
        queryFn: () => getAllAnimalTypes(),
        retry: false
    });

    //get all ServiceType: enabled practicePage === nulll 
    const { isSuccess: isSuccessAllAvailableServices, data: dataAllAvailableServices } = useQuery<Array<ServiceType>>({
        queryKey: ['allAvailableServicetypes'],
        queryFn: () => getAllAvailableServices(),
        retry: false
    });


    // get all ServiceType: enabled practicePage !== null
    // for Filter appointments in PracticePage



    const handleOpenFilterDialog = () => {
        setShowFilterDialog(true);
    }
    const handleCloseFilterDialog = () => {
        setFilterServiceType(filterServiceTypeLocal)
        setFilterAnimalType(filterAnimalTypeLocal)
        console.log(filterAnimalTypeLocal.map(id => id.toString()))
        navigate({
            to: '/search',
            search: {
              name: searchFilter.name,
              address: searchFilter.address,
              animalTypeIds: filterAnimalTypeLocal.join("-"),
              serviceTypeIds: filterServiceTypeLocal.join("-")
            },
          })
        setShowFilterDialog(false);
    }

    const handleDeleteFilter = () => {
        setFilterServiceTypeLocal([]);
        setFilterAnimalTypeLocal([]);
    }

    const checkSelectedAnimalType = (animaltype: AnimalTypeType): boolean =>  {
        const findAnimalType = filterAnimalTypeLocal.find((animalId) => {
            return animalId === animaltype.id
        });
          if(findAnimalType !== undefined){
            return true;
          } else {
            return false;
          }
    }

    const checkSelectedServiceType = (service: ServiceType): boolean =>  {
        const findServiceType = filterServiceTypeLocal.find((servID) => {
            return service.id === servID; 
          });
          if(findServiceType !== undefined){
            return true;
          } else {
            return false;
          }
    }

    const handleChangeAnimalType = (animaltype: AnimalTypeType) => {
        const findAnimalType = filterAnimalTypeLocal.find((animalId) => {
            return animalId === animaltype.id
        })
        if(findAnimalType !== undefined){
            setFilterAnimalTypeLocal([]);
        } else {
            setFilterAnimalTypeLocal([animaltype.id]);
        }
    }

    const handleChangeServiceType = (service: ServiceType) => {
        const findServiceType = filterServiceTypeLocal.find((servId) => {
            return service.id === servId; 
          });
        
        if(findServiceType !== undefined){
            // delete these service from array
            let selectedServices = filterServiceTypeLocal.slice();
            selectedServices = selectedServices?.filter((servId) => servId !== service.id);
            if(selectedServices !== undefined){ // it schould be always !== undefined
                setFilterServiceTypeLocal(selectedServices);
            } else {
                setFilterServiceTypeLocal([]);
            }
        } else {
            // add these service to array
            let selectedServices = filterServiceTypeLocal.slice();
            selectedServices?.push(service.id)
            if(selectedServices !== undefined){ // it schould be always !== undefined
                setFilterServiceTypeLocal(selectedServices);
            } else {
                setFilterServiceTypeLocal([]);
            }
        }
    }

    let animaltypes: AnimalTypeType[];
    if (isSuccessAnimalType) {
        animaltypes = dataAnimalType;
    } else {
        animaltypes = [];
    }

    let services: ServiceType[];
    if (isSuccessAllAvailableServices) {
        services = dataAllAvailableServices
    } else {
        services = [];
    }


    return <>
        <Button id="FilterButton" onClick={handleOpenFilterDialog}><i className="bi bi-sliders"></i> Filter</Button>
        <Modal show={showFilterDialog} onHide={handleCloseFilterDialog}>
            <Modal.Header closeButton>
                <Modal.Title>Filter</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Tierart:</Form.Label>
                    {animaltypes.map((animaltype) => {
                        return <Form.Check type="radio" id={animaltype.id.toString() + animaltype.name} key={animaltype.id.toString() + animaltype.name} label={animaltype.name} name="selectAnimaltype" value={animaltype.id} checked={checkSelectedAnimalType(animaltype)} onChange={() => {}} onClick={() => handleChangeAnimalType(animaltype)}/>;
                    })}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Terminart filtern:</Form.Label>
                    {services.map((service) => {
                        return <Form.Check type="checkbox" id={service.id.toString() + service.name} key={service.id.toString() + service.name} label={service.name} name="selectServiceType" value={service.id} checked={checkSelectedServiceType(service)} onChange={() => handleChangeServiceType(service)}/>;
                    })}
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleDeleteFilter} variant="outline" disabled={filterAnimalTypeLocal === null && filterServiceTypeLocal === null}>Filter entfernen</Button>
                <Button onClick={handleCloseFilterDialog}>Ergebnisse anzeigen</Button>
            </Modal.Footer>
        </Modal>
    </>;

}