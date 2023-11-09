import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CheckBox from './RadioGroup';

interface StoryInputData {
    songName: string;
    artistName: string;
    duration: string;
    privacy: string;
    caption: string;
}

interface StoryFormProps {
    onFormSubmit: (formData: StoryInputData) => void;
}

function StoryForm({ onFormSubmit }: StoryFormProps) {
    const [validated, setValidated] = useState<boolean>(false);
    const [formData, setFormData] = useState<StoryInputData>({
        songName: '',
        artistName: '',
        duration: '',
        privacy: '',
        caption: ''
    });

    //Callback function to update the selected privacy setting
    const handlePrivacySelection = (privacy: string) => {
        setFormData({ ...formData, privacy: privacy });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            onFormSubmit(formData); // Call the callback with the form data
            setValidated(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        console.log(formData);
    }, [formData])


    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label className='h6'>Song Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter song name"
                        name="songName"
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a song name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label className='h6'>Artist Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter artist name"
                        name="artistName"
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter an artist name.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Form.Label className='h6'>Duration</Form.Label>
                    <Form.Control
                        as="select"
                        required
                        name="duration"
                        onChange={handleChange}
                    >
                        <option value="">Select duration</option>
                        <option value="1">1 hr</option>
                        <option value="3">3 hr</option>
                        <option value="6">6 hr</option>
                        <option value="12">12 hr</option>
                        <option value="24">24 hr</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Please select a duration.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom04">
                    <Form.Label className='h6'>Privacy</Form.Label>
                    <CheckBox numRadios={2} radioLabels={['Public', 'Private']} onRadioSelect={handlePrivacySelection} />
                    {/* <Form.Control type="password" placeholder="Password" name="password" required /> */}
                    <Form.Control.Feedback type="invalid">
                        Please choose a privacy setting, either public or private.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Col md="12">
                    <Form.Label className='h6'>Caption</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter a caption"
                        style={{ height: '100px' }}
                        name="caption"
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <div className='d-flex justify-content-center'>
                <Button type="submit" variant="primary">Set Details</Button>
            </div>


        </Form>
    )
}

export default StoryForm