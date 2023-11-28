import React, { useState, useEffect } from 'react';
import '../styles/HomeStyles.css';
import NavBar from '../components/NavBar';
import axios, { AxiosRequestConfig } from 'axios';
import SongSnapPlayer from '../components/SongSnapPlayer';
import PopUpModal from '../components/PopUpModal';
import SongSnapForm from '../components/SongSnapForm';
import Cookies from 'js-cookie';
import DailyPrompt from '../components/DailyPrompt';
import StoriesContainer from '../components/StoryContainer';


function Home() {
    const [activeView, setActiveView] = useState<string>('main-feed');


    const handleActiveFeedChange = (view: string) => {
        setActiveView(view);
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
            return response.data.data[0].id;
        } catch (error) {
            console.error(error);
        }
    };


    const generatePlayer = async (backgroundTheme: string, caption: string, songID: number, userDetails: User, postID: number): Promise<JSX.Element | void> => {
        try {
            if (songID) {
                const player = <SongSnapPlayer
                    dztype="dzplayer"
                    trackID={songID}
                    backgroundTheme={backgroundTheme}
                    caption={caption}
                    user={userDetails}
                    postID={postID}
                    ownerUserID={userDetails.ID}
                    currUserProfilePicture={userDetails.ProfilePicture}
                />;


            }
        } catch (error) {
            console.error(error);
        }
    };



    const postSongSnap = async (backgroundTheme: string, caption: string, visibility: string, songName: string, artistName: string, userDetails: User) => {
        const userID = await getCookie('userID');
        const songID = await getSongID(songName, artistName);
        if (userID && songID) {
            axios.post('/posts/create/songSnap', {
                songID: songID,
                caption: caption,
                theme: backgroundTheme,
                visibility: visibility,
                userID: userID,
                promptID: 1
            })
                .then(async (response) => {
                    if (visibility === 'public') { // post songsnap to main feed
                        setMainFeedSongSnaps([response.data, ...mainFeedSongSnaps]);
                    } else { // post songsnap to friends feed
                        setFriendsFeedSongSnaps([response.data, ...friendsFeedSongSnaps]);
                    }
                    const postID = response.data.PostID;
                    await generateSongSnap(backgroundTheme, caption, songID, userDetails, postID);
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            console.log('No userID found in the cookie');
        }
    };

    const generateSongSnap = (backgroundTheme: string, caption: string, songID: number, userDetails: User, postID: number) => {
        generatePlayer(backgroundTheme, caption, songID, userDetails, postID);
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
        setSongSnapData(formData);
    };

    const getCookie = (name: string) => {
        return Cookies.get(name);
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
    const [mainFeedSongSnaps, setMainFeedSongSnaps] = useState<SongSnap[]>([]);
    const [friendsFeedSongSnaps, setFriendsFeedSongSnaps] = useState<SongSnap[]>([]);
    const [isFeedsLoaded, setIsFeedsLoaded] = useState<boolean>(false);
    const [currUserDetails, setCurrUserDetails] = useState<User>({ Username: '', name: '', ProfilePicture: '', ID: 0 });

    const getMainFeedSongSnaps = async () => {
        try {
            const response = await axios.get('/posts/get/songSnaps')
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
                    return response.data;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            } else {
                console.log('Invalid userID in the cookie');
            }
        } else {
            console.log('No userID found in the cookie');
        }
    };

    interface User {
        Username: string;
        name: string;
        ProfilePicture: string;
        ID: number;
    }

    interface Prompt {
        ID: number;
        PromptText: string;
        Theme: string;
    }





    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const userID = await getCookie('userID');
                const response = await axios.get('/users/id?id=' + userID);
                setCurrUserDetails(response.data);

            } catch (error) {
                console.error(error);
            }
        };
        const populateFeeds = async () => {
            try {
                const mainFeedSongSnaps = await getMainFeedSongSnaps();
                setMainFeedSongSnaps(mainFeedSongSnaps);
                const friendsFeedSongSnaps = await getFriendsFeedSongSnaps();
                if (friendsFeedSongSnaps) {
                    setFriendsFeedSongSnaps(friendsFeedSongSnaps);
                }
                setIsFeedsLoaded(true);
            } catch (error) {
                console.error(error);
            }
        };

        getUserDetails();
        populateFeeds();
    }, []);






    const generateFeedSongSnaps = (songSnaps: SongSnap[]) => {
        return songSnaps.map((songSnap) => {
            const profileDetails: User = {
                Username: songSnap.Username,
                name: songSnap.name,
                ProfilePicture: songSnap.ProfilePicture,
                ID: songSnap.UserID
            };

            return (
                <div className='player-container' key={songSnap.PostID}>
                    <SongSnapPlayer
                        dztype="dzplayer"
                        trackID={songSnap.SongID}
                        backgroundTheme={songSnap.Theme}
                        caption={songSnap.Caption}
                        user={profileDetails}
                        postID={songSnap.PostID}
                        ownerUserID={songSnap.UserID}
                        currUserProfilePicture={currUserDetails.ProfilePicture}
                    />
                </div>
            );
        });
    };







    return (
        <div className='overflow-x-hidden overflow-y-auto'>
            <NavBar />
            <header className="bg-dark py-5">
                <div className="container px-5">
                    <div className="row gx-5 justify-content-center">
                        <div className="col-lg-6">
                            <div className="text-center my-5">

                                <h1 className="display-5 fw-bolder text-white mb-2">Prompt of the Day</h1>
                                <DailyPrompt />
                                {/* <p className="lead text-white mb-4">{dailyPrompt.PromptText}</p>
                                        <p className='text-white-50'>Theme: {dailyPrompt.Theme}</p> */}

                                <div className="d-grid gap-4 d-sm-flex justify-content-sm-center">
                                    <PopUpModal
                                        title='Create a SongSnap'
                                        body={<SongSnapForm onFormSubmit={handleSongSnapUpload} />}
                                        submitButtonText='Publish SongSnap'
                                        openButtonText='Create SongSnap'
                                        functionToExecute={() => postSongSnap(songSnapData.backgroundTheme, songSnapData.caption, songSnapData.privacy, songSnapData.songName, songSnapData.artistName, currUserDetails)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Stories Container */}
            <StoriesContainer userDetails={currUserDetails} context={'home'}/>

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
                        <div className='row'>
                            <div className='container'>
                                <div className='col-md-12 my-5'>
                                    {isFeedsLoaded ? (
                                        generateFeedSongSnaps(mainFeedSongSnaps)
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Friends Feed View */}
                <div id="friends-feed" className={`view ${activeView === 'friends-feed' ? 'active-view' : ''}`}>
                    <div className="container text-center">
                        <h1>Friends Feed</h1>
                        <div className='row'>
                            <div className='container'>
                                <div className='col-md-12 my-5'>
                                    {isFeedsLoaded ? (
                                        generateFeedSongSnaps(friendsFeedSongSnaps)
                                    ) : (
                                        <p>Loading...</p>
                                    )}
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