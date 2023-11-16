import React, {useEffect, useState} from 'react';
import RegistrationForm from '../components/RegistrationForm';
import NavBar from "../components/NavBar";
import {Badge, Container} from 'react-bootstrap'
import axios from 'axios';
import {useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {PersonCheckFill} from "react-bootstrap-icons";

interface User {
    ID: number;
    Username: string;
    Email: string;
    Password: string;
    Role: string;
    ProfilePicture: string;
    name: string;
}

function Profile() {
    const { accountID } = useParams();
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const fetchUserData = async () => {
        // get user id from cookie
        const userID = Cookies.get("userID");
        // Fetch user data
        axios.get('/users/id?id=' + userID)
            .then(response => {
                setLoggedInUser(response.data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });

        axios.get('/users/id?id=' + accountID)
            .then(response => {
                setProfileUser(response.data);
                renderHeader();
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }
    //const userID = 1;
    useEffect(() => {
        fetchUserData();
    }, []);

    const renderHeader = () => {
        const profileButton = () => {
            function sendFriendRequest(ID: number | undefined) {
                if(ID != undefined){
                    axios.post('users/friend-requests/create', {"User1ID": loggedInUser?.ID, "User2ID": ID})
                        .then(response => {
                            console.log("Response submitted");
                            // You might want to update the state or do something else upon success
                        })
                        .catch(error => {
                            console.error("Error responding to friend request:", error);
                            // Handle errors accordingly
                        })
                        .finally(() => {
                            renderHeader();
                        });
                }
            }

            //TODO: make it such that if the user already has this friend, it disables itself. Also if you do that, might as well add a friends counter as well

            if(profileUser?.ID === loggedInUser?.ID){
                return (<button type="button" className="btn btn-primary btn-sm me-2 disabled"><PersonCheckFill className='icon' /></button>);
            }else{
                return (<button type="button" className="btn btn-primary btn-sm me-2" onClick={() => sendFriendRequest(profileUser?.ID)}><PersonCheckFill className='icon' /></button>);
            }
        };

        if (!profileUser || accountID == undefined) {
            return (<h1 className='text-center fw-bold'>OOPS! There was an error :(</h1>); // or some fallback content if profileUser is null or undefined
        }

        return (
            <Container className='bg-light rounded-3 p-4 mt-2'>
                <Row>
                    <Col md={6}>
                        <h1 className='fw-bold'>{profileUser.name}</h1>
                        <p className='text-secondary'>{profileUser.Username} {profileUser.ID === loggedInUser?.ID ? <Badge color="primary">You</Badge> : ''}</p>
                    </Col>
                    <Col md={6} className='text-end'>
                        {profileButton()}
                    </Col>
                </Row>
            </Container>
        );
    };

    const renderPosts = () => {
        const renderPostCards = () => {
            songSnapData.map((post, index) => (
                <>
                </>
            ));
        };
        return <>
            <h5 className='text-center fw-bold'>{songSnapData?.length} Posts</h5>
            {renderPostCards()}
        </>
    };

    return (
        <>
            <NavBar />
            {renderHeader()}
            {renderPosts()}
        </>
    );
}


export default Profile;
