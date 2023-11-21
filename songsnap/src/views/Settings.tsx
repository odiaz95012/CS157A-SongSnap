import React, { useEffect, useState } from 'react';
import NavBar from "../components/NavBar";
import Cookies from 'js-cookie';
import { get } from 'http';
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from 'axios';
import {PersonCheckFill, PersonFillDash, PlusCircle} from 'react-bootstrap-icons';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface Friend {
    User1ID: number;
    User2ID: number;
    Date: string;
    name: string;
    username: string;
}

interface User {
    ID: number;
    Username: string;
    Email: string;
    Password: string;
    Role: string;
    name: string;
}

interface UserForm {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
}

function Settings() {
    const [userData, setUserData] = useState<User | null>(null);
    const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
    const [userFriends, setUserFriends] = useState<Friend[]>([]);
    const [modal, setModal] = useState(false);
    const [show, setShow] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserForm>({
        id: -1,
        name: '',
        email: '',
        username: '',
        password: ''
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmission = () => {
        handleClose(); // Close the modal
        // axios.post('users/friend-requests/addByUsername', requestData)
        //     .then(response => {
        //         console.log("Response submitted");
        //         // You might want to update the state or do something else upon success
        //     })
        //     .catch(error => {
        //         console.error("Error responding to friend request:", error);
        //         // Handle errors accordingly
        //     })
        //     .finally(() => {
        //         fetchUserData();
        //     });
    };
    const getCookie = (name: string) => {
        return Cookies.get(name);
    }

    const toggle = () => setModal(!modal);

    // Rendering
    const renderFriendRequests = () => {
        return friendRequests.map((request, index) => (
            <div key={index} className="row bg-light rounded-2 py-2 mb-3">
                <div className="col-8">
                    <a href={'user/' + request.User1ID}><h3 className='fw-bold text-black fw-bold mb-0'>{request.name}</h3></a>
                </div>
                <div className="col-2">
                    <button type="button" className="btn btn-primary btn-sm me-2" onClick={() => respondFriendRequest(request.User1ID, "Accepted")}><PersonCheckFill className='icon' /></button>
                </div>
                <div className="col-2">
                    <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => respondFriendRequest(request.User1ID, "Rejected")}><PersonFillDash className='icon' /></button>
                </div>
            </div>
        ));
    };

    const renderFriends = () => {
        return userFriends.map((request, index) => (
            <div key={index} className="row bg-light rounded-2 py-2 mb-3">
                <div className="col-10">
                    <a href={'user/' + request.User1ID}><h3 className='fw-bold text-black fw-bold mb-0'>{request.name}</h3></a>
                </div>
                <div className="col-2">
                    <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => unAddFriend(request.User2ID)}><PersonFillDash className='icon' /></button>
                </div>
            </div>
        ));
    };

    // API Interaction
    const editUserDetails = () => {
        if (userData) {

            axios.post('users/edit', formData)
                .then(response => {
                    console.log("Response submitted");
                })
                .catch(error => {
                    console.error("Error responding to friend request:", error);
                    // Handle errors accordingly
                })
                .finally(() => {
                    fetchUserData();
                });
        } else {
            console.error('userData is null');
        }
    };

    const respondFriendRequest = (ID: number, accept: string) => {
        if (userData) {

            const requestData = {
                user1id: ID,
                user2id: userData.ID,
                decision: accept
            };

            axios.post('users/friend-requests/respond', requestData)
                .then(response => {
                    console.log("Response submitted");
                    // You might want to update the state or do something else upon success
                })
                .catch(error => {
                    console.error("Error responding to friend request:", error);
                    // Handle errors accordingly
                })
                .finally(() => {
                    fetchUserData();
                });
        } else {
            console.error('userData is null');
        }
    };

    const unAddFriend = (ID:number) => {
        if (userData) {
            const user1ID = userData.ID;

            const requestData = {
                user1id: user1ID,
                user2id: ID,
            };

            axios.post('users/friends/remove', requestData)
                .then(response => {
                    console.log("Response submitted");
                    // You might want to update the state or do something else upon success
                })
                .catch(error => {
                    console.error("Error responding to friend request:", error);
                    // Handle errors accordingly
                })
                .finally(() => {
                    fetchUserData();
                });
        } else {
            console.error('userData is null');
        }
    };

    const fetchUserData = async () => {
        // get user id from cookie
        const userID = await getCookie('userID')!;
        setFormData({...formData, id: parseInt(userID)})
        // Fetch user data
        axios.get('/users/id?id=' + userID)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });

        // Fetch friend requests
        axios.get('/users/friend-requests/all?id=' + userID)
            .then(response => {
                setFriendRequests(response.data);
            })
            .catch(error => {
                console.error("Error fetching friend requests:", error);
            });

        // Fetch user's friends
        axios.get('/users/friends/all?id=' + userID)
            .then(response => {
                setUserFriends(response.data);
            })
            .catch(error => {
                console.error("Error fetching user's friends:", error);
            });
    }
    //const userID = 1;
    useEffect(() => {
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
                    {/*<li className='nav-item' role='presentation'>*/}
                    {/*    <button className='nav-link' id='profile-tab' data-bs-toggle='tab' data-bs-target='#profile-tab-pane' type='button' role='tab' aria-controls='profile-tab-pane' aria-selected='false'>Profile</button>*/}
                    {/*</li>*/}
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
                                        <input type="text" className="form-control" id="username" name="username" onChange={e => setFormData(...formData, usern)} placeholder={userData?.Username} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name">Name:</label>
                                        <input type="text" className="form-control" id="name" name="username" placeholder={userData?.name} />
                                    </div>

                                    <div className="form-group mt-3">
                                        <label htmlFor="email">Email address:</label>
                                        <input type="email" className="form-control" id="email" name="email" placeholder={userData?.Email} />
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
                    {/*<div className='tab-pane fade' id='profile-tab-pane' role='tabpanel' aria-labelledby='profile-tab' tabIndex={0}>2</div>*/}
                    <div className='tab-pane fade' id='friends-tab-pane' role='tabpanel' aria-labelledby='friends-tab' tabIndex={0}>
                        <Container className="bg-light rounded-4 p-3 mt-3">
                            <Row>
                                <Col xs="12" lg="6">
                                    <h1 className="fw-bold">Friend Management</h1>
                                </Col>
                                <Col xs="12" lg="3">
                                    <h2 className="fw-bold fs-1 text-secondary text-center">{friendRequests ? friendRequests.length : 0} Requests</h2>
                                </Col>
                                <Col xs="12" lg="3">
                                    <h2 className="fw-bold fs-1 text-secondary text-center">{userFriends ? userFriends.length : 0} Friends</h2>
                                </Col>
                            </Row>
                        </Container>
                        <Container className="mt-4">
                            <Row>
                                <Col xs={12} lg={6} className='px-3'>
                                    <h4 className="fw-bold text-center">Requests</h4>
                                    {renderFriendRequests()}
                                </Col>
                                <Col xs={12} lg={6} className='px-3'>
                                    <h4 className="fw-bold text-center">Friends</h4>
                                    {renderFriends()}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <div className='tab-pane fade' id='disabled-tab-pane' role='tabpanel' aria-labelledby='disabled-tab' tabIndex={0}>4</div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Send Friend Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button type='submit' variant="primary" onClick={handleSubmission}>
                        Send Request
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default Settings;
