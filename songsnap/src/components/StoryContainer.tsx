import React, { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Heart, HeartFill, Chat, ChatFill } from 'react-bootstrap-icons';
import Cookies from 'js-cookie';

interface Story {
  PostID: number;
  SongID: number;
  Date: string;
  Visibility: string;
  Caption: string;
  Duration: number;
  UserID: number;
}

interface StoryModalProps {
  show: boolean;
  handleClose: () => void;
  story: Story | null;
}

// Define StoryModal component
// ... (Imports remain the same)

const StoryModal: React.FC<StoryModalProps> = ({ show, handleClose, story }) => {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [player, setPlayer] = useState<JSX.Element | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [userData, setUserData] = useState(null);

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
        style={{ width: '29.1vh', height: '29.1vh', position: 'relative' }}
        onLoad={() => setIframeLoaded(true)}
      />
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="sm">
      <Modal.Header closeButton className="story-header">
        <Modal.Title>{userData}</Modal.Title>
      </Modal.Header >
      <Modal.Body className='d-flex justify-content-center align-items-center story'>
        <div>
          {story ? (
            <div className='theme-container' >
              {iframeLoaded && player ? (
                <>
                  <Row>
                    <Col xs={12} md={12} style={{ width: '175px', height: '0px' }}>
                      {player}
                    </Col>
                  </Row>
                  <Row className="mt-2" >
                    <Col md={12} style={{ width: '320px', height: '240px' }}>
                      <Button variant='primary' className='like-btn me-1' onClick={() => setIsLiked(!isLiked)} style={{ marginLeft: "-55px", width: '150px'}}>
                        {isLiked ? (
                          <HeartFill className='icon' />
                        ) : (
                          <Heart className='icon' />
                        )}
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-2" >
                    <Col xs={12} md={4} style={{ width: '300px', height: '0px' }}>
                      <div className='caption-container'>
                        <div className='caption-content' text-center my-3>
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

const StoriesContainer: React.FC = () => {
  const [activeStories, setActiveStories] = useState<Story[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    axios.get<Story[]>('/posts/get/activeStories')
      .then(response => {
        setActiveStories(response.data);
      })
      .catch(error => {
        console.error('Error fetching active stories:', error);
      });
  }, []);

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
        <h3>Stories</h3>
      </div>
      <div className="scrolling-container d-flex justify-content-center">
        {activeStories.map((story) => (
          <div
            className="scrolling-content"
            key={story.PostID}
            onClick={() => handleImageClick(story)}
          >
            <Image
              className="avatar"
              src={require('../images/logo.png')}
              alt={`Logo ${story.PostID}`}
            />
          </div>
        ))}
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
