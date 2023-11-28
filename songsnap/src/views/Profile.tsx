import React, { useEffect, useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import NavBar from "../components/NavBar";
import { Badge, Container } from 'react-bootstrap'
import axios from 'axios';
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PersonCheckFill, Fire } from "react-bootstrap-icons";
import ProfileTabs from '../components/ProfileTabs';
import StoriesContainer from '../components/StoryContainer';


interface User {
    ID: number;
    Username: string;
    Email: string;
    Password: string;
    Role: string;
    ProfilePicture: string;
    name: string;
}

interface Friend {
    User1ID: number;
    User2ID: number;
    Date: string;
    name: string;
    username: string;
}

interface Streak {
    PostID: number;
    StreakID: number;
    StartDate: string;
    EndDate: string;
    Length: number;
}

interface SongSnap {
    PostID: number;
    PromptID: number;
    SongID: number;
    date: string;
    Visibility: string;
    Caption: string;
    Theme: string;
    UserID: number;
    Username: string;
    name: string;
    ProfilePicture: string;
}


function Profile() {
    const { accountID } = useParams();
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [profileUserFriends, setProfileUserFriends] = useState<Friend[]>([]);
    const [profileUserPosts, setProfileUserPosts] = useState<SongSnap[]>([]);
    const [profileUserPinnedPosts, setProfileUserPinnedPosts] = useState<SongSnap[]>([]);
    const [profileUserStreak, setProfileUserStreak] = useState<Streak | null>(null);
    const fetchUserData = async () => {
        // get user id from cookie
        const userID = await Cookies.get("userID");
        // Fetch user data
        axios.get('/users/id?id=' + userID)
            .then(response => {
                setLoggedInUser(response.data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });

        axios.get('/posts/get/userSongSnaps/?userID=' + accountID)
            .then(response => {
                setProfileUserPosts(response.data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });

        axios.get('/posts/get/favorites/?userID=' + userID)
            .then(response => {
                setProfileUserPinnedPosts(response.data);
            })
            .catch(error => {
                console.error("Error fetching user's pinned posts:", error);
            });

        axios.get('/users/id?id=' + accountID)
            .then(response => {
                setProfileUser(response.data);
                axios.get('/users/friends/all?id=' + accountID)
                    .then(response => {
                        setProfileUserFriends(response.data);
                        console.log(profileUserFriends);
                        renderHeader();
                    })
                    .catch(error => {
                        console.error("Error fetching user data:", error);
                    });
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
        axios.get('/users/activeStreak?id=' + userID)
            .then(response => {
                setProfileUserStreak(response.data[0]);
            })
            .catch(error => {
                console.error("Error fetching user streak data:", error);
            });
    }
    //const userID = 1;
    useEffect(() => {
        const fetchData = async () => {
            await fetchUserData();
        }
        fetchData();
    }, []);

    const renderHeader = () => {
        const profileButton = () => {
            function sendFriendRequest(ID: number | undefined) {
                if (ID !== undefined) {
                    axios.post('users/friend-requests/create', { "User1ID": loggedInUser?.ID, "User2ID": ID })
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

            if (profileUser?.ID === loggedInUser?.ID) {
                return (<button type="button" className="btn btn-primary btn-sm me-2 disabled"><PersonCheckFill className='icon' /></button>);
            } else if (false) {
                //TODO: make it such that if the user already has this friend, it disables itself. Also if you do that, might as well add a friends counter as well
            } else {
                return (<button type="button" className="btn btn-primary btn-sm me-2" onClick={() => sendFriendRequest(profileUser?.ID)}><PersonCheckFill className='icon' /></button>);
            }
        };

        if (!profileUser || accountID === undefined) {
            return (<h1 className='text-center fw-bold'>OOPS! There was an error :(</h1>); // or some fallback content if profileUser is null or undefined
        }


        return (
            <Container className='bg-light rounded-3 p-4 mt-2'>
                <Row>
                    <Col sm={6} md={3}>
                        <h1 className='fw-bold'>{profileUser.name}</h1>
                        <p className='text-secondary'>{profileUser.Username} {profileUser.ID === loggedInUser?.ID ? <Badge color="primary">You</Badge> : ''}</p>
                    </Col>
                    <Col sm={6} md={3}>
                        <h1 className='fw-bold text-center'>{profileUserFriends.length} Friends</h1>
                        <h1 className='fw-bold text-center'>{profileUserPosts.length} Posts</h1>
                    </Col>
                    <Col sm={6} md={3} className='text-end'>
                        {profileUserStreak ? (
                            <>
                                {profileUserStreak.Length !== undefined && (
                                    <h1 className='fw-bold text-center'><Fire className='mb-2' style={{ color: 'rgb(255, 119, 0)' }} />Streak: {profileUserStreak.Length}</h1>
                                )}
                                {profileUserStreak.StartDate && (
                                    <h5 className='text-center'>Since {profileUserStreak.StartDate.substring(0, 10)}</h5>
                                )}
                            </>
                        ) : (
                            <h1 className='fw-bold text-center'>Streak: 0</h1>
                        )}
                    </Col>

                    <Col sm={12} md={3} className='text-end'>
                        {profileButton()}
                    </Col>
                </Row>
            </Container>
        );
    };




    return (
        <>
            <NavBar />
            {renderHeader()}
            {profileUser !== null && (
                <StoriesContainer userDetails={profileUser} context={'profile'} />
            )}
            <Container className='align-items-center d-flex flex-column mt-4'>
                <Row>
                    <Col md={12} className='text-center'>
                        <ProfileTabs personalSongSnaps={profileUserPosts} pinnedSongSnaps={profileUserPinnedPosts} />
                    </Col>
                </Row>

            </Container>

        </>
    );
}


export default Profile;
