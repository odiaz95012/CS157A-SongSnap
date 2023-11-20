import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

function RegistrationForm() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState<boolean>(false);

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{6,30}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        if (!validatePassword(formData.password)) {
            event.stopPropagation();
            alert('Password must include at least 1 capital letter, 1 lowercase letter, 1 number, 1 special character, and be between 6-30 characters.');
            return;
        }

        setValidated(true);
        await createAccount();
    };

    interface inputData {
        name: string;
        username: string;
        email: string;
        password: string;
        profilePicture?: File;
    }


    const [formData, setFormData] = useState<inputData>({
        name: '',
        username: '',
        email: '',
        password: '',
        profilePicture: undefined
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const createAccount = async () => {
        try {
            let requestBody = {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                profilePicture: formData.profilePicture
            };



            // Check if a profile picture is present
            if (formData.profilePicture !== undefined) {
                const formDataToSend = new FormData();
                formDataToSend.append('profilePicture', formData.profilePicture);
                formDataToSend.append('username', formData.username);

                // Upload the profile picture to the backend
                const uploadResponse = await axios.post('users/upload-profile-picture', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });


                // Get the uploaded image URL from the backend response
                requestBody = {
                    ...requestBody,
                    profilePicture: uploadResponse.data.imageUrl
                };
            }

            // Proceed to create account with or without profile picture URL
            const response = await axios.post('/users/createAccount', requestBody);
            if (response.status === 200) {
                navigate('/'); // navigate to login on successful account creation
            } else {
                alert('Error creating account. Please try again.');
            }

        } catch (err) {
            console.log(err);
        }
    };



    const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        if (!file) return;
        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            alert('Please upload a .png or .jpeg file for your profile picutre.');
            return;
        }
        setFormData({ ...formData, profilePicture: file });
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
                    <Form.Text muted>
                        Password must include at least 1 capital letter, 1 lowercase letter, 1 number, 1 special character, and be between 6-30 characters.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                        Please enter a password.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} md="6" controlId="validationCustom05">
                    <Form.Label column={true}>Upload Profile Picture</Form.Label>
                    <Col>
                        <input type="file" onChange={handleProfilePictureUpload} />
                    </Col>
                </Form.Group>
            </Row>
            <div className='d-flex justify-content-center'>
                <Button type="submit" className='mt-2'>Create Account</Button>
            </div>
        </Form>
    );
}

export default RegistrationForm;
