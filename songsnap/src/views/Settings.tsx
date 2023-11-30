import React, { useEffect, useState } from 'react';
import NavBar from "../components/NavBar";
import Cookies from 'js-cookie';
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from 'axios';
import { PersonCheckFill, PersonFillDash } from 'react-bootstrap-icons';

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
    const [userBlocked, setUserBlocked] = useState<Friend[]>([]);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [formData, setFormData] = useState<UserForm>({
        id: -1,
        name: '',
        email: '',
        username: '',
        password: ''
    });
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const getCookie = (name: string) => {
        return Cookies.get(name);
    }

    // Rendering
    const renderBlockedUsers = () => {
        return userBlocked.map((user, index) => (
            <div key={index} className="row bg-light rounded-2 py-2 mb-3">
                <div className="col-10">
                    <a href={'profile/' + user.User2ID}><h3 className='fw-bold text-black fw-bold mb-0'>{user.name}</h3></a>
                </div>
                <div className="col-2">
                    <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => unBlockUser(user.User2ID)}><PersonFillDash className='icon' /></button>
                </div>
            </div>
        ));
    };

    // API Interaction
    const editUserDetails = () => {
        if(profilePicture){
            editProfilePicture();
        }
        if (formData.email.length > 0 || formData.username.length > 0 || formData.password.length > 0) {
            console.log(formData);
            axios
                .post('users/edit', formData)
                .then((response) => {
                    fetchUserData();
                    setStatusMessage(response.data.changes.join(', ') + ' has been updated');
                })
                .catch((error) => {
                    console.error('Error responding to friend request:', error);
                    setStatusMessage('OOOOPS! Something went wrong :(');
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

    const unAddFriend = (ID: number) => {
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

    
    const unBlockUser = (ID:number) => {
        if (userData) {
            const user1ID = userData.ID;

            const requestData = {
                user1id: user1ID,
                user2id: ID,
            };

            axios.post('users/blocked-users/remove', requestData)
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

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const allowedExtensions = ['jpg', 'jpeg', 'png'];
    
            const extension = file.name.split('.').pop()?.toLowerCase(); // Get the file extension
    
            if (extension && allowedExtensions.includes(extension)) {
                setProfilePicture(file);
            } else {
                // File type not allowed, show error message or handle accordingly
                alert('Please select a JPG or PNG file.');
            }
        }
    };
    


    const editProfilePicture = async () => {
        if(!profilePicture) {
            console.error("No profile picture selected");
            return;
        }
        try {
            const userID = await getCookie('userID')!;
            
            const formData = new FormData();
            formData.append('profilePicture', profilePicture);
            formData.append('username', userID); // Assuming username is actually userID

            // Upload profile picture
            const uploadResponse = await axios.post('/users/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const imageUrl = uploadResponse.data.imageUrl;

            // Update profile picture in the database
            const updateResponse = await axios.patch('/users/update-profile-picture', {
                userID: userID,
                imageUrl: imageUrl
            });

            console.log("Profile picture updated:", updateResponse.data.message);
            setStatusMessage(updateResponse.data.message);
            fetchUserData(); // Refresh user data after updating the picture
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
    };


    const fetchUserData = async () => {
        // get user id from cookie
        const userID = await getCookie('userID')!;
        setFormData({ ...formData, id: parseInt(userID) })
        // Fetch user data
        axios.get('/users/id?id=' + userID)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });

        // Fetch blocked users
        axios.get('/users/blocked-users/all?id=' + userID)
            .then(response => {
                setUserBlocked(response.data);
            })
            .catch(error => {
                console.error("Error fetching blocked users:", error);
            });
    }
    //const userID = 1;
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => { console.log(profilePicture) }, [profilePicture]);

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
                        <button className='nav-link' id='blocked-tab' data-bs-toggle='tab' data-bs-target='#blocked-tab-pane' type='button' role='tab' aria-controls='blocked-tab-pane' aria-selected='false'>Blocked</button>
                    </li>
                </ul>
                <div className='tab-content' id='myTabContent'>
                    <div className='tab-pane fade show active' id='home-tab-pane' role='tabpanel' aria-labelledby='home-tab' tabIndex={0}>
                        <div className='row mt-4'>
                            <div className='col-12 col-lg-4 mb-4'>
                                <img className='img-fluid square-img w-100' src='https://costionline.com/icons/profile-photos/4.webp' alt="profile image" />
                            </div>
                            <div className='col-12 col-lg-8'>
                                {statusMessage && (
                                    <div className={`alert ${statusMessage.includes('Error') ? 'alert-danger' : 'alert-success'} mt-3 alert-dismissible`} role='alert'>
                                        {statusMessage}
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="formFile" className="form-label">Upload profile photo</label>
                                    <input className="form-control" type="file" id="formFile" onChange={handleProfilePictureChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="username">Username:</label>
                                    <input type="text" className="form-control" id="username" name="username" onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder={userData?.Username} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input type="text" className="form-control" id="name" name="name" onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={userData?.name} />
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="email">Email address:</label>
                                    <input type="email" className="form-control" id="email" name="email" onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder={userData?.Email} />
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="password">Password:</label>
                                    <input type="password" className="form-control" id="password" name="password" onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Password" />
                                </div>

                                <button type="submit" className="btn btn-primary mt-3" onClick={editUserDetails}>Submit</button>
                            </div>
                        </div>
                    </div>
                    {/*<div className='tab-pane fade' id='profile-tab-pane' role='tabpanel' aria-labelledby='profile-tab' tabIndex={0}>2</div>*/}
                    <div className='tab-pane fade' id='blocked-tab-pane' role='tabpanel' aria-labelledby='blocked-tab' tabIndex={0}>
                        <Container className="bg-light rounded-4 p-3 mt-3">
                            <Row>
                                <Col xs="12" lg="6">
                                    <h1 className="fw-bold">Blocked Users</h1>
                                </Col>
                            </Row>
                        </Container>
                        <p className='text-center fw-bold mb-4'>All Blocked</p>
                        <Container>
                            {renderBlockedUsers()}
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
}


export default Settings;
