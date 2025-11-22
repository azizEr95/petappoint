import { useState, type ChangeEvent } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getAllAnimalTypes } from "../../api/AnimalTypeAPI";
import { useQuery } from "@tanstack/react-query";
import type { AnimalTypeType, ServiceType, VeterinaryPracticesType } from "../../../../shared/schemas/ZodSchemas";


type SearchFilterProps = {
    filterServiceType: ServiceType[] | null
    setFilterServiceType: (newServices: ServiceType[] | null) => void
    filterAnimalType: AnimalTypeType | null
    setFilterAnimalType: (newAnimalType: AnimalTypeType | null) => void
    practicePage: VeterinaryPracticesType | null
}

export function SearchFilter({ filterServiceType, setFilterServiceType, filterAnimalType, setFilterAnimalType, practicePage }: SearchFilterProps) {
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

    const checkSelectedServiceType = (service: ServiceType): boolean =>  {
        const findServiceType = filterServiceType?.find((serv) => {
            return service.id === serv.id; 
          });
          if(findServiceType !== undefined){
            return true;
          } else {
            return false;
          }
    }

    const handleChangeAnimalType = (animaltype: AnimalTypeType) => {
        if(filterAnimalType?.id === animaltype.id){
            setFilterAnimalType(null);
        } else {
            setFilterAnimalType(animaltype);
        }
    }

    const handleChangeServiceType = (service: ServiceType) => {
        const findServiceType = filterServiceType?.find((serv) => {
            return service.id === serv.id; 
          });
        
        if(findServiceType !== undefined){
            // delete these service from array
            let selectedServices = filterServiceType?.slice();
            selectedServices?.filter((serv) => serv.id !== service.id);
            if(selectedServices !== undefined){ // it schould be always !== undefined
                setFilterServiceType(selectedServices);
            } else {
                setFilterServiceType(null);
            }
        } else {
            // add these service to array
            let selectedServices = filterServiceType?.slice();
            selectedServices?.push(service)
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
        <Button onClick={handleOpenFilterDialog}>Filter</Button>
        <Modal show={showFilterDialog} onHide={handleCloseFilterDialog}>
            <Modal.Header closeButton>
                <Modal.Title>Filter</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Tierart:</Form.Label>
                    {animaltypes.map((animaltype) => {
                        return <Form.Check type="radio" id={animaltype.id.toString()} key={animaltype.id.toString()} label={animaltype.name} name="selectAnimaltype" value={animaltype.id} checked={animaltype.id === filterAnimalType?.id} onClick={() => handleChangeAnimalType(animaltype)}/>;
                    })}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Terminart filtern:</Form.Label>
                    {services.map((service) => {
                        return <Form.Check type="checkbox" id={service.id.toString()} key={service.id.toString()} label={service.name} name="selectServiceType" value={service.id} checked={checkSelectedServiceType(service)} onClick={() => handleChangeServiceType(service)}/>;
                    })}
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleCloseFilterDialog} variant="outline">Filter entfernen</Button>
                <Button onClick={handleCloseFilterDialog}>Ergebnisse anzeigen</Button>
            </Modal.Footer>
        </Modal>
    </>;

}