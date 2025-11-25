import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getAllAnimalTypes } from "../../api/AnimalTypeAPI";
import { useQuery } from "@tanstack/react-query";
import type { AnimalTypeType, AppointmentFilterType, ServiceType, VeterinaryPracticesType } from "../../../../shared/schemas/ZodSchemas";
import '../../styles/components/common/SearchFilter.scss'

type SearchFilterProps = {
    filterOptions: AppointmentFilterType
    setFilterServiceType: (newServices: number[] | null) => void
    setFilterAnimalType: (newAnimalType: number[] | null) => void
    practicePage: VeterinaryPracticesType | null
}

export function SearchFilter({ filterOptions, setFilterServiceType, setFilterAnimalType, practicePage }: SearchFilterProps) {
    const [showFilterDialog, setShowFilterDialog] = useState<boolean>(false);

    // get all Animaltypes 
    const { isSuccess: isSuccessAnimalType, data: dataAnimalType } = useQuery<Array<AnimalTypeType>>({
        queryKey: ['allAnimaltypes'],
        queryFn: () => getAllAnimalTypes(),
        retry: false
    });

    //get all ServiceType: enabled practicePage === nulll
    


    // get all ServiceType: enabled practicePage !== null
    // for Filter appointments in PracticePage



    const handleOpenFilterDialog = () => {
        setShowFilterDialog(true);
    }
    const handleCloseFilterDialog = () => {
        setShowFilterDialog(false);
    }

    const handleDeleteFilter = () => {
        setFilterServiceType(null);
        setFilterAnimalType(null);
    }

    const checkSelectedAnimalType = (animaltype: AnimalTypeType): boolean =>  {
        const findAnimalType = filterOptions.animalTypeIds?.find((animalId) => {
            return animalId === animaltype.id
        });
          if(findAnimalType !== undefined){
            return true;
          } else {
            return false;
          }
    }

    const checkSelectedServiceType = (service: ServiceType): boolean =>  {
        const findServiceType = filterOptions.serviceTypeIds?.find((servID) => {
            return service.id === servID; 
          });
          if(findServiceType !== undefined){
            return true;
          } else {
            return false;
          }
    }

    const handleChangeAnimalType = (animaltype: AnimalTypeType) => {
        const findAnimalType = filterOptions.animalTypeIds?.find((animalId) => {
            return animalId === animaltype.id
        })
        if(findAnimalType !== undefined){
            setFilterAnimalType(null);
        } else {
            setFilterAnimalType([animaltype.id]);
        }
    }

    const handleChangeServiceType = (service: ServiceType) => {
        const findServiceType = filterOptions.serviceTypeIds?.find((servId) => {
            return service.id === servId; 
          });
        
        if(findServiceType !== undefined){
            // delete these service from array
            let selectedServices = filterOptions.serviceTypeIds?.slice();
            selectedServices?.filter((servId) => servId !== service.id);
            if(selectedServices !== undefined){ // it schould be always !== undefined
                setFilterServiceType(selectedServices);
            } else {
                setFilterServiceType(null);
            }
        } else {
            // add these service to array
            let selectedServices = filterOptions.serviceTypeIds?.slice();
            selectedServices?.push(service.id)
            if(selectedServices !== undefined){ // it schould be always !== undefined
                setFilterServiceType(selectedServices);
            } else {
                setFilterServiceType(null);
            }
        }
    }

    let animaltypes: AnimalTypeType[];
    if (isSuccessAnimalType) {
        animaltypes = dataAnimalType
    } else {
        animaltypes = [];
    }

    let services: AnimalTypeType[];
    if (isSuccessAnimalType) { // TODO edit this for ServiceTypes
        services = dataAnimalType
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
                        return <Form.Check type="radio" id={animaltype.id.toString()} key={animaltype.id.toString()} label={animaltype.name} name="selectAnimaltype" value={animaltype.id} checked={checkSelectedAnimalType(animaltype)} onChange={() => {}} onClick={() => handleChangeAnimalType(animaltype)}/>;
                    })}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Terminart filtern:</Form.Label>
                    {services.map((service) => {
                        return <Form.Check type="checkbox" id={service.id.toString()} key={service.id.toString()} label={service.name} name="selectServiceType" value={service.id} checked={checkSelectedServiceType(service)} onChange={() => handleChangeServiceType(service)}/>;
                    })}
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleDeleteFilter} variant="outline" disabled={filterOptions.animalTypeIds === null && filterOptions.serviceTypeIds === null}>Filter entfernen</Button>
                <Button onClick={handleCloseFilterDialog}>Ergebnisse anzeigen</Button>
            </Modal.Footer>
        </Modal>
    </>;

}