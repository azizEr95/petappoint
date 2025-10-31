import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllVeterinaryPratice } from "../api/VeterinaryPractice";

export function VeterinaryPraticeList() {
    const queryClient = useQueryClient();

    const {isPending, isError, isSuccess, data, error} = useQuery({ queryKey: ['tierarztpraxen'], queryFn: getAllVeterinaryPratice })

    if(isPending){
        console.log("pending")
        return <div>Tierarztpraxen laden</div>
    }

    if(isError){
        console.log("error")
        return <div>Error beim Laden der Tierarztpraxen: {error.message}</div>
    }

    if(isSuccess){
        return <div id="VeterinaryPracticeList">
            {data.map((praxis: any) => {
            <div key={praxis.name}>{praxis.name}</div>
        }
        )}
        </div>;
    }
    
}