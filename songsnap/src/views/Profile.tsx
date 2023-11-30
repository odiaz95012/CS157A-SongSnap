import React, { useEffect, useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import NavBar from "../components/NavBar";
import { Badge, Container, Image } from 'react-bootstrap'
import axios from 'axios';
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {PersonCheckFill, PersonFillAdd, Fire} from "react-bootstrap-icons";
import ProfileTabs from '../components/ProfileTabs';
import StoriesContainer from '../components/StoryContainer';
import StreaksContainer from '../components/StreaksContainer';


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
        // Fetch user data
        axios.get('/users/id?id=' + accountID)
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

        axios.get('/posts/get/favorites/?userID=' + accountID)
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
        axios.get('/users/activeStreak?id=' + accountID)
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
        console.log('Logged in User ID: ' + loggedInUser?.ID);
        console.log('account ID: ' + accountID);
    }, []);

    const getPublicSongSnaps = async () => {
        axios.get('/posts/get/userPublicSongSnaps/?userID=' + accountID)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error fetching user public song snaps:", error);
            });
    };

    const renderHeader = () => {
        const profileButton = () => {
            function sendFriendRequest(ID: number | undefined) {
                if (ID !== undefined) {
                    axios.post('users/friend-requests/create', { "User1ID": loggedInUser?.ID, "User2ID": ID })
                        .then(response => {
                            console.log("Response submitted");
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

            if (accountID === Cookies.get('userID')) {
                // Self
                return (<button type="button" className="btn btn-primary btn-sm me-2 disabled"><PersonCheckFill className='icon' /></button>);
            } else if(profileUserFriends.some((user) => user.User2ID === parseInt(Cookies.get('userID')!))) {
                // Friends, display remove button
                return (<button type="button" className="btn btn-primary btn-sm me-2" onClick={() => sendFriendRequest(profileUser?.ID)}><PersonCheckFill className='icon' /></button>); //TODO: make this remove friend
            } else {
                // Not friends, display add button
                return (<button type="button" className="btn btn-secondary btn-sm me-2" onClick={() => sendFriendRequest(profileUser?.ID)}><PersonFillAdd className='icon' /></button>);
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
                        <p className='text-secondary'>{profileUser.Username} {accountID === Cookies.get('userID') ? <Badge color="primary">You</Badge> : ''}</p>
                    </Col>
                    <Col sm={6} md={3}>
                        <h1 className='fw-bold text-center'>{profileUserFriends.length} Friends</h1>
                        <h1 className='fw-bold text-center'>{profileUserPosts.length} Posts</h1>
                    </Col>
                    <Col sm={6} md={3} className='text-end'>
                        {accountID === Cookies.get('userID') ? (
                            <>
                                {profileUserStreak ? (
                                    <>
                                        {profileUserStreak.Length !== undefined && (
                                            <h1 className='fw-bold text-center'>
                                                <Fire className='mb-2' style={{ color: 'rgb(255, 119, 0)' }} />Streak: {profileUserStreak.Length}
                                            </h1>
                                        )}
                                        {profileUserStreak.StartDate && (
                                            <h5 className='text-center'>Since {profileUserStreak.StartDate.substring(0, 10)}</h5>
                                        )}
                                    </>
                                ) : (
                                    <h1 className='fw-bold text-center'>Streak: 0</h1>
                                )}
                                {profileUser !== null && (
                                    <StreaksContainer userDetails={profileUser} />
                                )}
                            </>
                        ) : (
                            <Image
                                src={profileUser.ProfilePicture}
                                className='profile-picture'
                                thumbnail
                                style={{ height: '150px', width: '150px' }}
                            />
                        )}
                    </Col>
                    <Col sm={12} md={3} className='text-end'>
                        {profileButton()}
                    </Col>
                </Row>
                <>
                    {/*Display profile picture in a new row for when a user views their own profile*/}
                    {accountID === Cookies.get('userID') ? (
                        <Row>
                            <Col sm={12} md={12}>
                                <Image
                                    src={loggedInUser?.ProfilePicture}
                                    className='profile-picture'
                                    thumbnail
                                    style={{ height: '150px', width: '150px' }}
                                />
                            </Col>
                        </Row>

                    ) : (null)

                    }
                </>
            </Container >
        );
    };




    return (
        <>
            <NavBar />
            {renderHeader()}
            {profileUser !== null && accountID === Cookies.get('userID') && (
                <StoriesContainer userDetails={profileUser} context={'profile'} />
            )}

            <Container className='align-items-center d-flex flex-column mt-4'>
                <Row>
                    <Col md={12} className='text-center'>
                        <ProfileTabs personalSongSnaps={profileUserPosts} pinnedSongSnaps={profileUserPinnedPosts} viewerAccountID={accountID!} />
                    </Col>
                </Row>

            </Container>

        </>
    );
}


export default Profile;
