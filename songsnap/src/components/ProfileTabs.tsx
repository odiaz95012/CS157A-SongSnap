import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import SongSnapPlayer from "../components/SongSnapPlayer";
import Cookies from 'js-cookie';
import axios from 'axios';

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

interface SongSnapUserData {
    Username: string;
    name: string;
    ProfilePicture: string;
    ID: number;
}
interface ProfileTabsProps {
    viewerAccountID: string;
    personalSongSnaps: SongSnap[];
    pinnedSongSnaps: SongSnap[];
};
function ProfileTabs({ personalSongSnaps, pinnedSongSnaps, viewerAccountID }: ProfileTabsProps): JSX.Element {


    const [viewState, setViewState] = useState<string>('personalSongSnaps');
    const [personalTabContent, setPersonalTabContent] = useState<JSX.Element | null>(null);
    const [pinnedTabContent, setPinnedTabContent] = useState<JSX.Element | null>(null);
    const [userProfileSongSnaps, setUserProfileSongSnaps] = useState<SongSnap[]>([]);
    const [userProfileTabContent, setUserProfileTabContent] = useState<JSX.Element | null>(null);

    const generateFeedSongSnaps = (songSnaps: SongSnap[], isPinned: boolean) => {
        return songSnaps.map((songSnap) => {
            const profileDetails: SongSnapUserData = {
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
                        currUserProfilePicture={songSnap.ProfilePicture}
                        pinned={isPinned} // for pinned songnsnaps only
                    />
                </div>
            );
        });
    };



    const generateTabView = (songSnaps: SongSnap[], isPinned: boolean) => {
        if (songSnaps.length === 0) {
            return (
                <div className='no-stories'>
                    <h3>No SongSnaps to show</h3>
                </div>
            );
        }

        return (
            <div>
                {generateFeedSongSnaps(songSnaps, isPinned)}
            </div>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            const loggedInUserID = Cookies.get('userID');
            if (loggedInUserID === viewerAccountID) {
                // Generate content for "My Song Snaps" tab
                const personalContent = generateTabView(personalSongSnaps, false);
                setPersonalTabContent(personalContent);
    
                // Generate content for "Pinned Song Snaps" tab
                const pinnedContent = generateTabView(pinnedSongSnaps, true);
                setPinnedTabContent(pinnedContent);
            } else {
                try {
                    const response = await axios.get('/posts/get/userPublicSongSnaps/?userID=' + viewerAccountID);
                    setUserProfileSongSnaps(response.data);
                    const userContent = generateTabView(response.data, false);
                    setUserProfileTabContent(userContent);
                } catch (error) {
                    console.log("Error fetching user song snaps:", error);
                    // Handle errors accordingly
                }
            }
        };
    
        fetchData();
    }, [personalSongSnaps, pinnedSongSnaps, viewerAccountID]);
    

    const handleTabChange = (selectedTab: string | null) => {
        if (selectedTab) {
            setViewState(selectedTab);
        }
    };

    return (
        <>
            {viewerAccountID === Cookies.get('userID') ? (
                <Tabs
                    activeKey={viewState}
                    onSelect={handleTabChange}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="personalSongSnaps" title="My Song Snaps">
                        {personalTabContent}
                    </Tab>
                    {pinnedSongSnaps && (
                        <Tab eventKey="pinnedSongSnaps" title="Pinned Song Snaps">
                            {pinnedTabContent && pinnedSongSnaps.length > 0 ? (
                                pinnedTabContent
                            ) : (
                                <div className='no-stories'><h3>No Pinned SongSnaps to show</h3></div>
                            )}
                        </Tab>
                    )}
                </Tabs>
            ) : (
                <Tabs
                    activeKey={viewState}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="userSongSnaps" title={userProfileSongSnaps.length > 0 ? `${userProfileSongSnaps[0].Username}'s SongSnaps`: 'User SongSnaps'} active>
                        {userProfileTabContent}
                    </Tab>
                </Tabs>
            )

            }

        </>
    );
};

export default ProfileTabs