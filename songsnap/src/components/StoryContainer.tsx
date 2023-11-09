import React, { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Heart, HeartFill, Chat, ChatFill } from 'react-bootstrap-icons';

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
const StoryModal: React.FC<StoryModalProps> = ({ show, handleClose, story }) => {

  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [player, setPlayer] = useState<JSX.Element | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);


  useEffect(() => {
    try {
      if (story) {
        const generatedPlayer = generatePlayer(story.SongID);
        setPlayer(generatedPlayer);
        setIframeLoaded(true);
      }
    } catch (e) {
      console.log('Error generating player:', e);
    }
  }, [story]);


  const generatePlayer = (trackID: number) => {
    console.log(trackID);
    return (
      <iframe
        id="dzplayer"
        title='StoryPlayer'
        data-dztype='dzplayer'
        src={`https://www.deezer.com/plugins/player?type=tracks&id=${trackID}&format=classic&color=007FEB&autoplay=false&playlist=true&width=700&height=550`}
        className="player"
        style={{ width: '25vh', height: '25vh',position: 'relative' }}
        onLoad={() => setIframeLoaded(true)}
      />
    );
  };



  return (

    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>

      </Modal.Header>
      <Modal.Body>
        {story ? (
          <div className='theme-container'>
            {iframeLoaded && player ? (
              <>
                <Row>
                  <Col xs={4} md={8}>
                    {player}
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Button variant='primary' className='like-btn me-1' onClick={() => setIsLiked(!isLiked)}>
                      {isLiked ? (
                        <HeartFill className='icon' />
                      ) : (
                        <Heart className='icon' />
                      )}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} md={11}>
                    <div className='caption-container' >
                      <div className='caption-content'>
                        <p>{story.Caption}</p>
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
      </Modal.Body>
    </Modal>
  );
};

const StoriesContainer: React.FC = () => {
  const [activeStories, setActiveStories] = useState<Story[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    // Fetch active stories
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
    <div className="container justify-content-center mt-3">
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
            <img
              className="avatar"
              src={require('../images/logo.png')}
              alt={`Logo ${story.PostID}`}
            />
          </div>
        ))}
      </div>

      {/* Render StoryModal */}
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