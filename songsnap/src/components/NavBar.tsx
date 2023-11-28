import React, { useState } from 'react';
import ProfileDropdown from './ProfileDropdown';
import { useNavigate } from 'react-router-dom';
import PopUpModal from './PopUpModal';
import StoryForm from './StoryForm';
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import UserPromptSubmission from './UserPromptSubmission';

interface StoryInputData {
    songName: string;
    artistName: string;
    duration: string;
    privacy: string;
    caption: string
}

function NavBar() {
    const [storyData, setStoryData] = useState<StoryInputData>({
        songName: '',
        artistName: '',
        duration: '',
        privacy: '',
        caption: ''

    });

    const [songID, setSongID] = useState<number | null>(null);
    const handleStoryUpload = (formData: StoryInputData) => {
        setStoryData(formData);
    };

    const options: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://deezerdevs-deezer.p.rapidapi.com/search/',
        params: { q: '' },
        headers: {
            'X-RapidAPI-Key': '94fa4a2b1emsh37ec7863badf270p10aa96jsn29c67fd2c4aa',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };

    const getSongID = async (songName: string, artistName: string): Promise<number | void> => {
        try {
            const response = await axios.request({
                ...options,
                params: {
                    q: `${songName} ${artistName}`,
                },
            });
            setSongID(response.data.data[0].id);
            return response.data.data[0].id;
        } catch (error) {
            console.error(error);
        }
    };

    const navigate = useNavigate();

    const getCookie = (name: string) => {
        return Cookies.get(name);
    }

    const postStory = async (duration: string, caption: string, visibility: string, songName: string, artistName: string) => {
        const userID = await getCookie('userID');
        const songID = await getSongID(songName, artistName);
        if (userID && songID) {
            axios.post('/posts/create/story', {
                songID: songID,
                caption: caption,
                duration: duration,
                visibility: visibility,
                userID: userID,
                promptID: 1
            })
            window.location.reload();
        } else {
            console.log('No userID found in the cookie');
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <img className="me-1" src={require('../images/logo.png')} width="50" height="50" alt="SongSnap Logo" style={{ borderRadius: '50%' }} />
                    <a className="navbar-brand" href="#" onClick={() => navigate('/home')}>SongSnap</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <div className="d-grid gap-4 d-sm-flex justify-content-sm-center mx-2 my-2">
                                <PopUpModal
                                    title='Create a Story'
                                    body={<StoryForm onFormSubmit={handleStoryUpload} />}
                                    submitButtonText='Publish Story'
                                    openButtonText='Upload Story'
                                    functionToExecute={() => postStory(storyData.duration, storyData.caption, storyData.privacy, storyData.songName, storyData.artistName)}
                                />
                            </div>
                            <li className="nav-item mx-2">
                                <div className="d-grid gap-4 d-sm-flex justify-content-sm-center mx-2 my-2">
                                    <UserPromptSubmission />
                                </div>

                            </li>
                            {Cookies.get('isAdmin') === 'true' ? (
                                <li className="nav-item">
                                    <div className="d-grid gap-4 d-sm-flex justify-content-sm-center mx-2 my-2">
                                        <button className="btn btn-primary mx-2" onClick={() => navigate('/admin')}>Admin Page</button>
                                    </div>
                                </li>
                            ) : (null)}
                            <li className="nav-item mx-2">
                                <div className="d-grid gap-4 d-sm-flex justify-content-sm-center mx-2 my-2">
                                    <ProfileDropdown id={Cookies.get('userID')!} />
                                </div>

                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )

}


export default NavBar;
