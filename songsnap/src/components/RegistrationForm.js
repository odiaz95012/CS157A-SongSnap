import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function RegistrationForm() {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    
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