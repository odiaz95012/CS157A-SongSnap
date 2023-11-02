import React, { useState, useEffect } from 'react';
import '../styles/HomeStyles.css';
import NavBar from '../components/NavBar';
import axios, { AxiosRequestConfig } from 'axios';
import SongSnapPlayer from './SongSnapPlayer';

function Home() {
    const [activeView, setActiveView] = useState<string>('main-feed');
    const [songName, setSongName] = useState<string>('');
    const [songID, setSongID] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [songSnapPlayer, setSongSnapPlayer] = useState<JSX.Element | null>(null);
    const [isPlayerVisible, setPlayerVisible] = useState<boolean>(false);

    const handleActiveFeedChange = (view: string) => {
        setActiveView(view);
    };

    const handleSongName = (e: React.ChangeEvent<HTMLInputElement>) => {
        let song = e.target.value;
        setSongName(song.replaceAll(' ', '%20'));
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

    const getSongID = async (songName: string): Promise<number | void> => {
        try {
            const response = await axios.request({
                ...options,
                params: { q: songName }, // Set the artist name as a parameter
            });
            setSongID(response.data.data[0].id);
            return response.data.data[0].id;
        } catch (error) {
            console.error(error);
        }
    }

    const generatePlayer = async (songName: string): Promise<JSX.Element | void> => {
        // Set isLoading to true when generating the player
        setIsLoading(true);

        try {
            const trackID = await getSongID(songName);
            console.log(trackID)
            if (trackID) {
                const player = <SongSnapPlayer dztype="dzplayer" trackID={trackID} />;
                setSongSnapPlayer(player);

            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };



    const handleSearchClick = () => {
        generatePlayer(songName);
        setPlayerVisible(true);
    };

    return (
        <div className='overflow-auto'>
            <NavBar />
            <header className="bg-dark py-5">
                <div className="container px-5">
                    <div className="row gx-5 justify-content-center">
                        <div className="col-lg-6">
                            <div className="text-center my-5">
                                <h1 className="display-5 fw-bolder text-white mb-2">Prompt of the Day</h1>
                                <p className="lead text-white-50 mb-4">INSERT PROMPT HERE</p>
                                <div className="d-grid gap-4 d-sm-flex justify-content-sm-center">
                                    <button className="btn btn-primary">Upload SongSnap</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Stories Container */}
            <div className="container justify-content-center mt-3">
                <div className="d-flex justify-content-start">
                    <h3>Stories</h3>
                </div>
                <div className="scrolling-container d-flex justify-content-center">
                    {/* Place holders for now */}
                    {Array.from({ length: 15 }).map((_, index) => (
                        <div className="scrolling-content" key={index}>
                            <img className="avatar" src={require('../images/logo.png')} alt={`Logo ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
            {/* Feed Container */}
            <div className="d-flex-1 text-center justify-content-center align-items-center mt-3">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h1>SongSnap</h1>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-6 mb-4 justify-content-center">
                        <nav className="navbar navbar-expand-lg navbar-light justify-content-center">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className={`nav-link ${activeView === 'main-feed' ? 'active' : ''}`} href="#main-feed" onClick={() => handleActiveFeedChange('main-feed')}>Main Feed</a>
                                </li>
                                <li className="nav-item">
                                    <a className={`nav-link ${activeView === 'friends-feed' ? 'active' : ''}`} href="#friends-feed" onClick={() => handleActiveFeedChange('friends-feed')}>Friends Feed</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="container text-start mb-6">
                {/* Main Feed View */}
                <div id="main-feed" className={`view ${activeView === 'main-feed' ? 'active-view' : ''}`}>
                    <div className="container justify-content-center overflow-auto text-center">
                        <h1>Main Feed</h1>
                        {/* Add main feed content here */}
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='form-outline'>
                                    <input type='text' className='form-control' name="songName" id="songName" onChange={handleSongName} />
                                    <label htmlFor='songName' className='form-label'>Song Name</label>
                                </div>
                                <button type='button' className='btn btn-primary' onClick={handleSearchClick}>Search</button>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='container overflow-auto'>
                                <div className='col-md-12 my-4'>
                                    {isPlayerVisible && (
                                        // Display the player when isPlayerVisible is true
                                        isLoading ? (
                                            // Display a loading message while isLoading is true
                                            <p>Loading...</p>
                                        ) : (
                                            // Display the player when isLoading is false
                                            songSnapPlayer
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Friends Feed View */}
                <div id="friends-feed" className={`view ${activeView === 'friends-feed' ? 'active-view' : ''}`}>
                    <div className="container">
                        <h1>Friends Feed</h1>
                        {/* Add friends feed content here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
