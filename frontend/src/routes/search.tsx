import { createFileRoute } from '@tanstack/react-router'
import { z } from "zod"
import { SearchField } from '../components/SearchField';
import { VeterinaryPracticeList } from '../components/VeterinaryPracticeList';
//import '../styles/search.modules.css';

const searchSchema = z.object({
    name: z.string().default(""),
    ort: z.string().default(""),
})

export const Route = createFileRoute('/search')({
    validateSearch: searchSchema,
    component: SearchComponent,
})

function SearchComponent() {
    const { name, ort } = Route.useSearch();

    return <div className='background-green'>
        <div className="text-center">vetlib</div>
        <SearchField searchNameBeginn={name} searchOrtBeginn={ort}/>
        <VeterinaryPracticeList searchName={name} searchOrt={ort}/>
    </div>
}
