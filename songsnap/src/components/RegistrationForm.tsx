import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

function RegistrationForm() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        createAccount();
    };

    interface inputData {
        name: string;
        username: string;
        email: string;
        password: string;
    }


    const [formData, setFormData] = useState<inputData>({
        name: '',
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const createAccount = async () => {
        try {
            const response = await axios.post('/users/createAccount', {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            console.log(response);
            navigate('/'); // navigate to login on successful account creation
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Name"
                        name="name"
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter your name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please choose a username.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" name="email" onChange={handleChange} required />
                    <Form.Control.Feedback type="invalid">
                        Please provide your email.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom04">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} required />
                    <Form.Control.Feedback type="invalid">
                        Please enter a password.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <div className='d-flex justify-content-center'>
                <Button type="submit" className='mt-2'>Create Account</Button>
            </div>
        </Form>
    );
}

export default RegistrationForm;
