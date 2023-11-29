import React, { useEffect, useState } from 'react';
import NavBar from "../components/NavBar";
import Cookies from 'js-cookie';
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from 'axios';
import {PersonCheckFill, PersonFillDash} from 'react-bootstrap-icons';

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

function Friends() {
    const [userData, setUserData] = useState<User | null>(null);
    const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
    const [userFriends, setUserFriends] = useState<Friend[]>([]);
    const getCookie = (name: string) => {
        return Cookies.get(name);
    }

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
    const respondFriendRequest = (ID: number, accept: string) => {
        if (userData) {

            const requestData = {
                user1id: ID,
                user2id: userData.ID,
                decision: accept
            };

            axios.post('users/friend-requests/respond', requestData)
                .then(response => {
                    console.log("Response submitted: " + response);
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
                })
                .catch(error => {
                    console.error("Error responding to friend request:", error);
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

    return (
        <>
            <NavBar />
            <div className='container mt-3'>
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
        </>
    );
}


export default Friends;
