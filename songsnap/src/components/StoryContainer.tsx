import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import '../styles/StoryStyles.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface Story {
  PostID: number;
  SongID: number;
  Date: string;
  Visibility: string;
  Caption: string;
  Duration: number;
  UserID: number;
  profilePicture: string;
}


interface StoryModalProps {
  show: boolean;
  handleClose: () => void;
  story: Story | null;
}



const StoryModal: React.FC<StoryModalProps> = ({ show, handleClose, story }) => {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [player, setPlayer] = useState<JSX.Element | null>(null);
  const [numLikes, setNumLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    try {
      if (story) {
        const generatedPlayer = generatePlayer(story.SongID);
        setPlayer(generatedPlayer);
        setIframeLoaded(true);
      }
    } catch (e) {
      console.error('Error generating player:', e);
    }
  }, [story]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/users/id?id=' + story?.UserID);
        setUserData(response.data.Username);
        const userIdString = await Cookies.get('userID');
        const userIdNumber = userIdString ? parseInt(userIdString, 10) : undefined;
        setCurrentUserId(userIdNumber);
        await getLikes();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (story) {
      fetchData();
    }
  }, [story]);

  const generatePlayer = (trackID: number) => {
    return (
      <iframe
        id="dzplayer"
        title='StoryPlayer'
        data-dztype='dzplayer'
        src={`https://www.deezer.com/plugins/player?type=tracks&id=${trackID}&format=classic&color=007FEB&autoplay=true&playlist=true&width=100%&height=100%`}
        className="player"
        style={{ width: '250px', height: '250px', position: 'relative' }}
        onLoad={() => setIframeLoaded(true)}
      />
    );
  };

  const like = async () => {
    if (story) {
      try {
        const userID = await Cookies.get('userID');
        await axios.post('/posts/like', {
          postID: story.PostID,
          userID: userID
        });
        await getLikes();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error: 'story' is null or undefined");
    }
  };


  const unlike = async () => {
    if (story) {
      try {
        const userID = await Cookies.get('userID');
        await axios.post('/posts/unlike', {
          postID: story.PostID,
          userID: userID
        });
        await getLikes();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error: 'story' is null or undefined");
    }
  };

  const handleLikeEvent = () => {
    isLiked ? unlike() : like();
    setIsLiked(!isLiked);
  };


  const getLikes = async () => {
    if (story) {
      try {
        const userID = await Cookies.get('userID');
        const response = await axios.get(`/posts/get/likes?postID=${story.PostID}&userID=${userID}`);

        if (response.data) {
          setNumLikes(response.data.likeCount);
          response.data.isLiked ? setIsLiked(true) : setIsLiked(false);
        } else {
          setNumLikes(0);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error: 'story' is null or undefined");
    }
  };

  const navigate = useNavigate();

  const navigateToProfile = (profileID: number) => {
    navigate(`/profile/${profileID}`);
  };



  return (
    <Modal show={show} onHide={handleClose} centered size="sm">
      <Modal.Header closeButton className="story-header" style={{ display: 'flex' }}>
        {story && (
          <Modal.Title>
            <Image
              src={story.profilePicture}
              alt="Profile Picture"
              className='profile-picture'
              roundedCircle
              onClick={() => navigateToProfile(story.UserID)}
            />
            {" " + userData}
          </Modal.Title>
        )}
      </Modal.Header>

      <Modal.Body className='d-flex justify-content-center align-items-center story'>
        <div>
          {story ? (
            <div className='theme-container' >
              {iframeLoaded && player ? (
                <>
                  <Row>
                    <Col xs={12} md={12} style={{ width: '175px', height: '0px', marginRight: '140px' }}>
                      {player}
                    </Col>
                  </Row>
                  {story.UserID != currentUserId && (
                    <Row className="mt-2" >
                      <Col md={12} style={{ width: '320px', height: '240px' }}>
                        <Button variant='primary' className='like-btn me-1' onClick={handleLikeEvent} style={{ marginLeft: "-55px", width: '150px' }}>
                          {isLiked ? (
                            <HeartFill className='icon' />
                          ) : (
                            <Heart className='icon' />
                          )}
                        </Button>
                      </Col>
                    </Row>
                  )}
                  {story.UserID === currentUserId && (
                    <Row className="mt-2" >
                      <Col xs={12} md={4} style={{ width: '500px', height: '240px' }}>

                        <div className='like-count-container' style={{ marginTop: '320px', marginLeft: '215px' }}>
                          <div className='like-count-icon' >
                            <HeartFill className='icon' />
                          </div>
                          <span className="form-label like-count">: {numLikes}</span>
                        </div>

                      </Col>
                    </Row>
                  )}
                  <Row className="mt-2" >
                    <Col xs={12} md={4} style={{ width: '300px', height: '0px', marginLeft: '-10px' }}>
                      <div className='caption-container'>
                        <div className='caption-content text-center my-3' >
                          <p>{story?.Caption}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <div className="loading-state">Loading...</div>
              )}
            </div>
          ) : (
            <div>No story available</div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};


interface User {
  Username: string;
  name: string;
  ProfilePicture: string;
  ID: number;
}
interface StoriesContainerProps {
  userDetails: User;
  context: string;
}

const StoriesContainer: React.FC<StoriesContainerProps> = ({ userDetails, context }: StoriesContainerProps) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await getCookie('userID');
        let endpoint = '';

        if (context === 'home') {
          endpoint = '/posts/get/activeStories';
        } else if (context === 'profile') {
          endpoint = '/posts/get/personalStories';
        }

        if (endpoint) {
          const response = await axios.get<Story[]>(endpoint, {
            params: {
              userID: userID,
            },
          });

          const storiesWithProfilePictures = await Promise.all(
            response.data.map(async (story) => {
              const userResponse = await axios.get<User>(`/users/id?id=${story.UserID}`);
              const storyWithProfilePicture = { ...story, profilePicture: userResponse.data.ProfilePicture };
              return storyWithProfilePicture;
            })
          );

          setStories(storiesWithProfilePictures);

        }
      } catch (error) {
        console.error(`Error fetching ${context === 'home' ? 'active' : 'personal'} stories:`, error);
      }
    };

    fetchData();
  }, [context]);


  const getCookie = (name: string) => {
    return Cookies.get(name);
  }


  const handleImageClick = (story: Story) => {
    setSelectedStory(story);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  


  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-start">
        <h3>{context === 'home' ? 'Stories' : 'My Stories'}</h3>
      </div>
      <div className="scrolling-container d-flex justify-content-center">
        {stories.length === 0 ? (
          <div className="no-stories-message lead mt-2">No stories yet :(</div>
        ) : (
          <div className="scrolling-container d-flex justify-content-center">
            {stories.map((story) => (
              <div
                className="scrolling-content"
                key={story.PostID}
                onClick={() => handleImageClick(story)}
              >
                <Image
                  className={`avatar ${story.Visibility === 'public' ? 'public-avatar' : 'private-avatar'}`}
                  src={story.profilePicture}
                  alt={`Logo ${story.PostID}`}
                  roundedCircle
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedStory && (
        <StoryModal
          show={showModal}
          handleClose={handleCloseModal}
          story={selectedStory}
        />
      )}
    </div>
  );
};

export default StoriesContainer;
