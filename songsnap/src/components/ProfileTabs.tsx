import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import SongSnapPlayer from "../components/SongSnapPlayer";

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
    personalSongSnaps: SongSnap[];
    pinnedSongSnaps: SongSnap[];
};
function ProfileTabs({ personalSongSnaps, pinnedSongSnaps }: ProfileTabsProps): JSX.Element {

    const [viewState, setViewState] = useState<string>('personalSongSnaps');
    const [personalTabContent, setPersonalTabContent] = useState<JSX.Element | null>(null);
    const [pinnedTabContent, setPinnedTabContent] = useState<JSX.Element | null>(null);

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
    


    const generateTabView = (songSnaps: SongSnap[], isPinned : boolean) => {
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
        // Generate content for "My Song Snaps" tab
        const personalContent = generateTabView(personalSongSnaps, false);
        setPersonalTabContent(personalContent);

        // Generate content for "Pinned Song Snaps" tab
        const pinnedContent = generateTabView(pinnedSongSnaps, true);
        setPinnedTabContent(pinnedContent);

    }, [personalSongSnaps, pinnedSongSnaps]);

    const handleTabChange = (selectedTab: string | null) => {
        if (selectedTab) {
            setViewState(selectedTab);
        }
    };

    return (
        <>
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
        </>
    );
};

export default ProfileTabs