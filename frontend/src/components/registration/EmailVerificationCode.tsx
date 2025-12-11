import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Form } from "react-bootstrap";

export function EmailVerificationCode() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (code.length === 6) {
            navigate({ to: `/registration/email-confirmation/${code}` })
        }
    }

    const handleCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        const newCode = value.slice(0, 6)
        setCode(newCode)
    }

    return (
        <Form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <Form.Label htmlFor="code" className="form-label">
                    Bestätigungscode *
                </Form.Label>
                <Form.Control
                    id="code"
                    type="text"
                    className="form-input"
                    placeholder="123456"
                    name="code"
                    value={code}
                    onChange={handleCode}
                    maxLength={6}
                />
            </div>

            <button
                type="submit"
                className="auth-button"
                disabled={code.length !== 6}
            >
                {code.length === 6 ? 'Bestätigen' : 'Code eingeben (6 Ziffern)'}
            </button>
        </Form>
    )
}