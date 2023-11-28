import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';


type PromptSubmission = {
    promptText: string;
    promptTheme: string;
};
type UserPromptSubmission = {
    onSubmit: (formData: PromptSubmission) => void;
};

function UserPromptSubmissionForm({onSubmit}: UserPromptSubmission) {


    const [validated, setValidated] = useState<boolean>(false);
    const [formData, setFormData] = useState<PromptSubmission>({
        promptText: '',
        promptTheme: ''
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setValidated(true);
            onSubmit(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col md={12}>
                        <div className='text-center'>
                            <p className='lead'>Please enter the required details.</p>
                            <p className='text-body-secondary'>Note: The prompt submissions will be reviewed by an admin to be incorporated into the daily prompt rotation.</p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Form.Group as={Col} md={12} controlId="promptText" className='my-2'>
                        <Form.Label column className='lead fs-5'>
                            Prompt Text
                        </Form.Label>
                        <Form.Control
                            required
                            as={'textarea'}
                            placeholder="Please enter the prompt..."
                            name="promptText"
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a prompt.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md={12} controlId="promptText" className='my-2 mb-3'>
                        <Form.Label column className='lead fs-5'>
                            Prompt Theme
                        </Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder="Prompt theme..."
                            name="promptTheme"
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a theme for the prompt.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <div className='d-flex justify-content-center'>
                        <Button type="submit" variant="primary">Set Prompt Details</Button>
                    </div>
                </Row>
            </Form>
        </>
    )
}

export default UserPromptSubmissionForm;