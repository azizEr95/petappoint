import { Button, Form, Modal } from 'react-bootstrap'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { updatePersonEmail } from '../../api/PersonsAPI'
import { useLoginContext } from '../../LoginContext'
import { newToken } from '../../api/LoginAPI'

type ChangeEmailDialogProps = {
    hideEmailEditDialog: () => void
    email: string
}

// visibility from this component has to be handled from the parent component
export function ChangeEmailDialog({
    hideEmailEditDialog,
    email,
}: ChangeEmailDialogProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const { login } = useLoginContext();
    const [newEmail, setNewEmail] = useState(email);
    const [error, setError] = useState('');

    const { mutate: mutateEditEmailPerson } = useMutation({
        mutationFn: (id: number) => updatePersonEmail(id, newEmail),
        onSuccess: () => {
            mutateNewCode();
        },
        onError: () => {
            setError('Mit dieser Email gibt es bereits einen Account');
        }
    })

    const { mutate: mutateNewCode } = useMutation({
        mutationFn: () => newToken(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['person'] })
            hideEmailEditDialog()
            navigate({
                to: '/registration/verify-email',
            });
        },
    })

    const handleSubmitEditEmail = () => {
        const beforeAt = newEmail.split('@')[0]

        if (!newEmail.trim()) {
            setError('E-Mail ist erforderlich');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(newEmail)) {
            setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
        } else if ((newEmail.match(/@/g) || []).length !== 1) {
            setError('E-Mail darf nur ein @ enthalten');
        } else if (!/[a-zA-Z]/.test(beforeAt)) {
            setError('E-Mail muss vor dem @ mindestens einen Buchstaben enthalten');
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newEmail)) {
            setError('E-Mail enthält ungültige Zeichen');
        } else if (login) { // only if email is valid edit email
            mutateEditEmailPerson(login.id);
        } else {
            // irgendwo weiterleiten, useer ist nicht eingeloggt
        }
    }

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setNewEmail(e.target.value);
    }

    return (
        <Modal
            show={true}
            onHide={hideEmailEditDialog}
            className="email-dialog"
        >
            <Modal.Header closeButton>
                <Modal.Title>Email ändern</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group>
                    <Form.Label>Neue E-Mail Adresse</Form.Label>
                    <Form.Control type="text" placeholder='Bitte den Grund eingeben' value={newEmail} onChange={handleChangeEmail} isInvalid={error !== ""}></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        {error}
                    </Form.Control.Feedback>
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={hideEmailEditDialog}>
                    Abbrechen
                </Button>
                <Button onClick={handleSubmitEditEmail}>
                    Neuen Code anfordern
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
