import React, { useState, useEffect } from 'react';
import '../styles/HomeStyles.css';
import NavBar from '../components/NavBar';
import axios, { AxiosRequestConfig } from 'axios';
import SongSnapPlayer from '../components/SongSnapPlayer';
import PopUpModal from '../components/PopUpModal';
import SongSnapForm from '../components/SongSnapForm';
import Cookies from 'js-cookie';
import StoriesContainer from '../components/StoryContainer';

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

    const getSongID = async (songName: string, artistName: string): Promise<number | void> => {
        try {
            const response = await axios.request({
                ...options,
                params: {
                    q: `${songName} ${artistName}`, // Set the song and artist name as a parameter
                },
            });
            console.log(response.data);
            setSongID(response.data.data[0].id);
            return response.data.data[0].id;
        } catch (error) {
            console.error(error);
        }
    };


    const generatePlayer = async (songName: string, artistName: string, backgroundTheme: string, caption: string): Promise<JSX.Element | void> => {
        // Set isLoading to true when generating the player
        setIsLoading(true);

        try {
            const trackID = await getSongID(songName, artistName);
            console.log(trackID)
            if (trackID) {
                const player = <SongSnapPlayer dztype="dzplayer" trackID={trackID} backgroundTheme={backgroundTheme} caption={caption} />;
                setSongSnapPlayer(player);

            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };



    const generateSongSnap = (songName: string, artistName: string, backgroundTheme: string, caption: string) => {
        generatePlayer(songName, artistName, backgroundTheme, caption);
        setPlayerVisible(true);
    };

    interface SongSnapInputData {
        songName: string;
        artistName: string;
        backgroundTheme: string;
        privacy: string;
        caption: string
    }

    const [songSnapData, setSongSnapData] = useState<SongSnapInputData>({
        songName: '',
        artistName: '',
        backgroundTheme: '',
        privacy: '',
        caption: ''

    });

    const handleSongSnapUpload = (formData: SongSnapInputData) => {
        // Do something with the form data, e.g., send it to an API or update the state
        setSongSnapData(formData);
    };

    const getCookie = (name: string) => {
        return Cookies.get(name);
    }

    interface SongSnap {
        postID: number;
        promptID: number;
        songID: number;
        date: string;
        visibility: string;
        caption: string;
        theme: string;
        userID: number;
    }
    const [mainFeedSongSnaps, setMainFeedSongSnaps] = useState<SongSnap[]>([]);
    const [friendsFeedSongSnaps, setFriendsFeedSongSnaps] = useState<SongSnap[]>([]);
    const [isFeedsLoaded, setIsFeedsLoaded] = useState<boolean>(false);

    const getMainFeedSongSnaps = async () => {
        try {
            const response = await axios.get('/posts/get/songSnaps');
            console.log(response.data);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }
    

    const getFriendsFeedSongSnaps = async () => {
        const userID = await getCookie('userID');

        if (userID) {
            const numUserID = parseInt(userID);

            if (!isNaN(numUserID)) { // Check if parsing is successful
                try {
                    const response = await axios.get('/posts/get/friendSongSnaps', {
                        params: {
                            userID: numUserID
                        }
                    });
                    console.log(response.data);
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.log('Invalid userID in the cookie');
            }
        } else {
            console.log('No userID found in the cookie');
        }
    };




    useEffect(() => {
        const populateFeeds = async () => {
            try {
                const mainFeedSongSnaps = await getMainFeedSongSnaps();
                setMainFeedSongSnaps(mainFeedSongSnaps);
                const friendsFeedSongSnaps = await getFriendsFeedSongSnaps();
                setFriendsFeedSongSnaps(friendsFeedSongSnaps);
            } catch (error) {
                console.error(error);
            }
        };
        populateFeeds();
    }, []);





    return (
        <div className='overflow-x-hidden overflow-y-auto'>
            <NavBar />
            <header className="bg-dark py-5">
                <div className="container px-5">
                    <div className="row gx-5 justify-content-center">
                        <div className="col-lg-6">
                            <div className="text-center my-5">
                                <h1 className="display-5 fw-bolder text-white mb-2">Prompt of the Day</h1>
                                <p className="lead text-white-50 mb-4">INSERT PROMPT HERE</p>
                                <div className="d-grid gap-4 d-sm-flex justify-content-sm-center">
                                    <PopUpModal
                                        title='Create a SongSnap'
                                        body={<SongSnapForm onFormSubmit={handleSongSnapUpload} />}
                                        submitButtonText='Publish SongSnap'
                                        openButtonText='Create SongSnap'
                                        functionToExecute={() => generateSongSnap(songSnapData.songName, songSnapData.artistName, songSnapData.backgroundTheme, songSnapData.caption)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Stories Container */}
            <StoriesContainer />
            
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

            <div className="container overflow-auto text-center d-flex justify-content-center align-items-center h-100 feed-container my-3">
                {/* Main Feed View */}
                <div id="main-feed" className={`view ${activeView === 'main-feed' ? 'active-view' : ''}`}>
                    <div className="container text-center">
                        <h1>Main Feed</h1>
                        {/* Add main feed content here */}
                        <div className='row'>
                            <div className='container'>
                                <div className='col-md-12 my-4'>
                                    {isPlayerVisible ? (
                                        /* Display the player when isPlayerVisible is true */
                                        isLoading ? (
                                            /* Display a loading message while isLoading is true */
                                            <p>Loading...</p>
                                        ) : (
                                            /* Display the player when isLoading is false */
                                            songSnapPlayer
                                        )
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Friends Feed View */}
                <div id="friends-feed" className={`view ${activeView === 'friends-feed' ? 'active-view' : ''}`}>
                    <div className="container text-center">
                        <h1>Friends Feed</h1>
                        {/* Add friends feed content here */}
                        <div className='row'>
                            <div className='container'>
                                <div className='col-md-12 my-4'>
                                    {isPlayerVisible ? (
                                        /* Display the player when isPlayerVisible is true */
                                        isLoading ? (
                                            /* Display a loading message while isLoading is true */
                                            <p>Loading...</p>
                                        ) : (
                                            /* Display the player when isLoading is false */
                                            songSnapPlayer
                                        )
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;
