import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type ChangeEvent, type MouseEvent } from 'react';
import { Button, Form } from 'react-bootstrap'
import '../styles/login.modules.css';
import {useAuthStore } from '../stores/store';

export const Route = createFileRoute('/login')({
    component: Login,
})

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {setLogin} = useAuthStore();


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let t = e.target;
        let name = t.name;
        let value = t.value;
        switch (name) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                console.log("Error: Fehler beim Aendern von Login State in handleChange");
        }
    }

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLogin(true);
        navigate({ to: "/appointments" });
    }


    return <div className='login-dialog'>
        <div className='text-center'>Login</div>
        <Form>
        <Form.Group className="mb-3"><Form.Control id="LoginDialogUserIDText" type="text" placeholder="E-Mail" name="email" onChange={handleChange} value={email} /></Form.Group>
        <Form.Group className="mb-3"><Form.Control id="LoginDialogUserIDText" type="password" placeholder="Password" name="password" onChange={handleChange} value={password} /></Form.Group>
        <Button id="PerformLoginButton" variant="primary" type="submit" onClick={handleSubmit}>Login</Button>
    </Form>
    </div>;
}
