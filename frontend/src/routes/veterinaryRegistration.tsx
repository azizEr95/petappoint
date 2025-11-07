import { createFileRoute } from '@tanstack/react-router'
import { useState, type ChangeEvent, type MouseEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import '../styles/veterinaryRegistration.modules.css';
import { VeterinaryPracticeCreateSchema } from '../schemas/ZodSchemas';

export const Route = createFileRoute('/veterinaryRegistration')({
    component: veterinaryRegistration,
})

function veterinaryRegistration() {
    const [name, setName] = useState("");
    const [strasse, setStrasse] = useState("");
    const [hausnr, setHausnr] = useState("");
    const [plz, setPlz] = useState("");
    const [stadt, setStadt] = useState("");
    const [land, setLand] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [infoemail, setInfoemail] = useState("");
    const [website, setWebsite] = useState("");
    const [info, setInfo] = useState("");
    // TODO: Adresse fehlt noch
    // const navigate = useNavigate();


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let t = e.target;
        let name = t.name;
        let value = t.value;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "strasse":
                setStrasse(value);
                break;
            case "hausnr":
                setHausnr(value);
                break;
            case "plz":
                setPlz(value);
                break;
            case "stadt":
                setStadt(value);
                break;
            case "land":
                setLand(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "phone":
                setPhone(value);
                break;
            case "infoemail":
                setInfoemail(value);
                break;
            case "website":
                setWebsite(value);
                break;
            case "info":
                setInfo(value);
                break;
            default:
                console.log("Error: Fehler beim Aendern von veterinaryRegristration State in handleChange");
        }
    }

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        //zuerst Adresse ueberpruefen dann erstellen
        //anschließend Tierarztpraxis erstellen
        //was machen wenn ZOD Error geworfen wurde??

        //wie longitude und latitude uebergeben????
        let practice = {
            name: name,
            email: email,
            password: password,
            phone: phone,
            infoemail: infoemail,
            website: website,
            info: info,
            addresses: {
                street: strasse + hausnr,
                citycode: plz,
                city: stadt
            }
        }
        try {
            console.log(practice);
            VeterinaryPracticeCreateSchema.parse(practice);
        }
        catch (e) {
            console.log("Zod Error: veterinaryRegristration " + e);
        }

    }

    return <div className='veterinaryRegristrationSite'>
        <div className='text-center'>Regristrierung Tierarztpraxis</div>

        <Form className='veterinaryRegristrationFormular'>
            <div className='text-CreatePractice'>Name:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisName" type="text" placeholder="Tierarztpraxis Mustertier" name="name" onChange={handleChange} value={name} /></Form.Group>
            <div className='text-CreatePractice'>Straße:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisName" type="text" placeholder="Musterstraße" name="strasse" onChange={handleChange} value={strasse} /></Form.Group>
            <div className='text-CreatePractice'>Hausnr.:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisName" type="text" placeholder="1" name="hausnr" onChange={handleChange} value={hausnr} /></Form.Group>
            <div className='text-CreatePractice'>Postleizahl:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisName" type="text" placeholder="12345" name="plz" onChange={handleChange} value={plz} /></Form.Group>
            <div className='text-CreatePractice'>Stadt:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisName" type="text" placeholder="Musterstadt" name="stadt" onChange={handleChange} value={stadt} /></Form.Group>
            <div className='text-CreatePractice'>Land:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisName" type="text" placeholder="Deutschland" name="land" onChange={handleChange} value={land} /></Form.Group>
            <div className='text-CreatePractice'>E-Mail:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisEmail" type="text" placeholder="mustertier@tier.de" name="email" onChange={handleChange} value={email} /></Form.Group>
            <div className='text-CreatePractice'>Password:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisPassword" type="password" placeholder="*******" name="password" onChange={handleChange} value={password} /></Form.Group>
            <div className='text-CreatePractice'>Telefon:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisPhone" type="text" placeholder="+49 123456789999" name="phone" onChange={handleChange} value={phone} /></Form.Group>
            <div className='text-CreatePractice'>Info E-Mail:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisInfomail" type="text" placeholder="infoMustertier@tier.de" name="infoemail" onChange={handleChange} value={infoemail} /></Form.Group>
            <div className='text-CreatePractice'>Webseite:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisWebsite" type="text" placeholder="https://mustertier.de" name="website" onChange={handleChange} value={website} /></Form.Group>
            <div className='text-CreatePractice'>Praxisinfo:</div>
            <Form.Group className="mb-3"><Form.Control id="CreatePraxisInfo" type="textarea" placeholder="Beschreibung zur Praxis" name="info" onChange={handleChange} value={info} /></Form.Group>
            <Button id="PerformVeterinaryRegristration" variant="primary" type="submit" onClick={handleSubmit}>Registrieren</Button>
        </Form>
    </div>;
}
