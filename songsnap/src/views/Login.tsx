import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PopUpAlert from '../components/PopUpAlert';
import '../styles/LoginStyles.css';
import Cookies from 'js-cookie';

function Login() {
    const navigate = useNavigate();

    interface inputData {
        username: string;
        password: string;
    }

    const [formData, setFormData] = useState<inputData>({
        username: '',
        password: ''
    });

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior
        await axios.post('/users/login', {
            username: formData.username,
            password: formData.password
        }).then((response) => {
            Cookies.set('userID', response.data.id);
            Cookies.set('username', response.data.username);
            response.data.isAdmin ? Cookies.set('isAdmin', 'true') : Cookies.set('isAdmin', 'false');
            navigate('/home');
        }).catch((err) => {
            console.log(err);
            setAlert({ text: err.response.data.message, variant: "danger" });
            handleAlert();
        });
    };

    const goToRegistration = () => {
        navigate("/registration");
    };

    interface Alert {
        text: string;
        variant: string;
    }

    const [alert, setAlert] = useState<Alert>({ text: '', variant: '' });
    const handleAlert = () => {
        const alertElem = document.getElementById('alert');
        if (alertElem) {
            alertElem.style.visibility = 'visible';
            // Automatically dismiss the alert after 3 seconds
            setTimeout(() => {
                setAlert({ text: '', variant: '' });
                if (alertElem) {
                    alertElem.style.visibility = 'hidden';
                }
            }, 3000);
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <div className="d-flex align-items-center">
                        <img className="me-1" src={require('../images/logo.png')} width="50" height="50" alt="SongSnap Logo" style={{ borderRadius: '50%' }} />
                        <a className="navbar-brand" href="#">SongSnap</a>
                    </div>
                </div>
            </nav>

            <div className="d-flex justify-content-center my-5">
                <h1>Welcome to SongSnap</h1>
            </div>
            <div className="row">
                <div className="col-md-3 d-none d-md-block"></div>
                <div className="col-md-6 col-12">
                    <div className='col' id='alert'>
                        {alert && (
                            <PopUpAlert text={alert.text} variant={alert.variant} />
                        )}
                    </div>

                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                            <form onSubmit={login}>
                                <div className="text-center mb-3">
                                    <h4>Please Sign In</h4>
                                    <div className="form-outline mb-4">
                                        <div className="d-flex justify-content-start">
                                            <label className="form-label" htmlFor="username">Username</label>
                                        </div>
                                        <input name="username" type="text" id="username" className="form-control" onChange={handleDataChange} />
                                    </div>

                                    <div className="form-outline mb-4">
                                        <div className="d-flex justify-content-start">
                                            <label className="form-label" htmlFor="password">Password</label>
                                        </div>
                                        <input name="password" type="password" id="password" className="form-control" onChange={handleDataChange} />
                                    </div>

                                    <div className="d-flex justify-content-center align-items-center">
                                        <button type="submit" className="btn btn-outline-primary btn-block mb-4">Sign in</button>
                                    </div>

                                    <div className="text-center">
                                        <p>Not a member? <button type="button" className="btn btn-outline-primary" onClick={goToRegistration}>Register</button></p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
