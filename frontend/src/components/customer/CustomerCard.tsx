import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { CustomerType } from "@/api/CustomerAPI";
import { getPicturePlaceholderAnimal } from "@/api/AnimalsAPI";
import { getAnimaltypeById } from "@/api/AnimalTypeAPI";

type CustomerCardProps = {
    customer: CustomerType
}

export function CustomerCard({ customer }: CustomerCardProps) {
    const navigate = useNavigate();
    const [animalPictureURL, setAnimalPictureURL] = useState<string>();

    const { data: dataAnimalType } = useQuery({
        queryKey: ['animaltype', customer.animal.animalTypeId],
        queryFn: () => getAnimaltypeById(customer.animal.animalTypeId.toString()),
        staleTime: 0,
    })

    // fetch animal picture
    // use it when all rights available from backend
    // const { data: animalPictureData, isSuccess: isSuccessPictureData } = useQuery({
    //     queryKey: ['animalPicture', customer.animal.id],
    //     queryFn: () => getPictureFromAnimal(customer.animal.id),
    //     staleTime: 0,
    //     retry: false,
    // })
    const { data: animalUnknownPictureData, isSuccess: isSuccessUnknownPictureData } = useQuery({
        queryKey: ['animalUnknownPicture'],
        queryFn: () => getPicturePlaceholderAnimal(),
        staleTime: 0,
    })

    useEffect(() => { // use this effect to set the picture URL when data is fetched
        // if (isSuccessPictureData && animalPictureData) {
        //     setAnimalPictureURL(animalPictureData);
        // } else if (isSuccessUnknownPictureData && animalUnknownPictureData) {
        setAnimalPictureURL(animalUnknownPictureData);
        // }
        // }, [isSuccessPictureData, animalPictureData, isSuccessUnknownPictureData, animalUnknownPictureData]);
    }, [isSuccessUnknownPictureData, animalUnknownPictureData]);

    const handleClickAnimal = () => {
        navigate({
            to: '/customers/$animalId',
            params: { animalId: customer.animal.id.toString() },
            state: { customer: customer },
        });
    }

    return (
        <div className="customer-card-wrapper">
            <div className="card customer-card">
                <div className="row g-0 d-flex align-items-center">
                    <div className="col-auto">
                        <img
                            src={animalPictureURL}
                            width={120}
                            height={120}
                            alt="Tierbild"
                            className="rounded-circle"
                            style={{ objectFit: "cover" }}
                        />
                    </div>

                    <div className="col ps-3" onClick={handleClickAnimal}>
                        <div className="card-body p-2">
                            <div className="fw-bold card-title-text">{customer.animal.name}</div>
                            <div className="text-muted small">{dataAnimalType?.name}</div>
                        </div>
                        <div className="card-body p-2">
                            <div className="fw-bold card-title-text">{customer.person.firstName} {customer.person.lastName}</div>
                            <div className="text-muted small">{customer.person.email}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}