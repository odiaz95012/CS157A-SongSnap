import React, { useEffect, useState } from 'react';
import NavBar from "../components/NavBar";
import Cookies from 'js-cookie';
import { get } from 'http';
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from 'axios';

function Settings() {
    const [userData, setUserData] = useState(null);
    const [friendRequests, setFriendRequests] = useState(null);
    const [userFriends, setUserFriends] = useState(null);

    const getCookie = (name: string) => {
        return Cookies.get(name);
    }

    //const userID = 1;
    useEffect(() => {

        const fetchUserData = async () => {
            // get user id from cookie
            const userID = await getCookie('userID');
            // Fetch user data
            axios.get('/users/id?id=' + userID)
                .then(response => {
                    console.log(response.data)
                    setUserData(response.data); // Assuming the data retrieved is directly stored in response.data
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });

            // Fetch friend requests
            axios.get('/users/friend-requests/all?id=' + userID)
                .then(response => {
                    console.log(response.data)
                    setFriendRequests(response.data); // Assuming the data retrieved is directly stored in response.data
                })
                .catch(error => {
                    console.error("Error fetching friend requests:", error);
                });

            // Fetch user's friends
            axios.get('/users/friends/all?id=' + userID)
                .then(response => {
                    console.log(response.data)
                    setUserFriends(response.data); // Assuming the data retrieved is directly stored in response.data
                })
                .catch(error => {
                    console.error("Error fetching user's friends:", error);
                });
        }
        fetchUserData();

    }, []);

    const profileImage = {
        width: '100%'
    };


    return (
        <>
            <NavBar />
            <div className='container mt-3'>
                <h1 className='fw-bold text-center'>Account Settings</h1>
                <ul className='nav nav-pills nav-justified mt-4' id='myTab' role='tablist'>
                    <li className='nav-item' role='presentation'>
                        <button className='nav-link active' id='home-tab' data-bs-toggle='tab' data-bs-target='#home-tab-pane' type='button' role='tab' aria-controls='home-tab-pane' aria-selected='true'>Home</button>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <button className='nav-link' id='profile-tab' data-bs-toggle='tab' data-bs-target='#profile-tab-pane' type='button' role='tab' aria-controls='profile-tab-pane' aria-selected='false'>Profile</button>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <button className='nav-link' id='friends-tab' data-bs-toggle='tab' data-bs-target='#friends-tab-pane' type='button' role='tab' aria-controls='friends-tab-pane' aria-selected='false'>Friends</button>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <button className='nav-link' id='disabled-tab' data-bs-toggle='tab' data-bs-target='#disabled-tab-pane' type='button' role='tab' aria-controls='disabled-tab-pane' aria-selected='false' disabled>Disabled</button>
                    </li>
                </ul>
                <div className='tab-content' id='myTabContent'>
                    <div className='tab-pane fade show active' id='home-tab-pane' role='tabpanel' aria-labelledby='home-tab' tabIndex={0}>
                        <div className='row mt-4'>
                            <div className='col-12 col-lg-4 mb-4'>
                                <img className='img-fluid square-img w-100' src='https://costionline.com/icons/profile-photos/4.webp' />
                            </div>
                            <div className='col-12 col-lg-8'>
                                <form action="/submit" method="post">
                                    <div className="mb-3">
                                        <label htmlFor="formFile" className="form-label">Upload profile photo</label>
                                        <input className="form-control" type="file" id="formFile" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="username">Username:</label>
                                        <input type="text" className="form-control" id="username" name="username" placeholder="Enter username" />
                                    </div>

                                    <div className="form-group mt-3">
                                        <label htmlFor="email">Email address:</label>
                                        <input type="email" className="form-control" id="email" name="email" placeholder="Enter email" />
                                    </div>

                                    <div className="form-group mt-3">
                                        <label htmlFor="password">Password:</label>
                                        <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
                                    </div>

                                    <button type="submit" className="btn btn-primary mt-3">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className='tab-pane fade' id='profile-tab-pane' role='tabpanel' aria-labelledby='profile-tab' tabIndex={0}>2</div>
                    <div className='tab-pane fade' id='friends-tab-pane' role='tabpanel' aria-labelledby='friends-tab' tabIndex={0}>
                        <Container className="bg-light rounded-4 p-3 mt-3">
                            <Row>
                                <Col xs="12" lg="6">
                                    <h1 className="fw-bold">Friend Management</h1>
                                </Col>
                                <Col xs="12" lg="3">
                                    <h2 className="fw-bold fs-1 text-secondary text-center">3 Requests</h2>
                                </Col>
                                <Col xs="12" lg="3">
                                    <h2 className="fw-bold fs-1 text-secondary text-center">6 Friends</h2>
                                </Col>
                            </Row>
                        </Container>
                        <Container className="mt-4">
                            <Row>
                                <Col xs={12} lg={6}>
                                    <h4 className="fw-bold text-center">Requests</h4>
                                </Col>
                                <Col xs={12} lg={6}>
                                    <h4 className="fw-bold text-center">Friends</h4>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <div className='tab-pane fade' id='disabled-tab-pane' role='tabpanel' aria-labelledby='disabled-tab' tabIndex={0}>4</div>
                </div>
            </div>
        </>
    );
}


export default Settings;
