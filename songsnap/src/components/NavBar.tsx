import React, {useState} from 'react';
import ProfileDropdown from './ProfileDropdown';
import { useNavigate } from 'react-router-dom';
import PopUpModal from './PopUpModal';
import StoryForm from './StoryForm';

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
    const handleStoryUpload = (formData: StoryInputData) => {
        setStoryData(formData);
    };
    const generateStory = (songName: string, artistName: string, caption: string) => {
        //generatePlayer(songName, artistName, caption);
        //setPlayerVisible(true);
    };
    const navigate = useNavigate();
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <img className="me-1" src={require('../images/logo.png')} width="50" height="50" alt="SongSnap Logo" style={{borderRadius: '50%'}}/>
                    <a className="navbar-brand" href="#" onClick={() => navigate('/home')}>SongSnap</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <div className="d-grid gap-4 d-sm-flex justify-content-sm-center">
                                    <PopUpModal
                                        title='Create a Story'
                                        body={<StoryForm onFormSubmit={handleStoryUpload} />}
                                        submitButtonText='Publish Story'
                                        openButtonText='Upload Story'
                                        functionToExecute={() => generateStory(storyData.songName, storyData.artistName, storyData.caption)}
                                    />
                            </div>
                            <li className="nav-item"><button className="btn btn-primary mx-2">Upload Prompt</button></li>
                            <li className="nav-item mx-2">
                                <ProfileDropdown/>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
    
}


export default NavBar;
