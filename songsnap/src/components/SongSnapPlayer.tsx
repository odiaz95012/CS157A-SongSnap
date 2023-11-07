import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Heart, HeartFill, Chat, ChatFill } from 'react-bootstrap-icons';
import '../styles/SongSnapPlayerStyles.css';

interface DzPlayerProps {
  dztype: string;
  trackID: number;
  backgroundTheme: string;
  caption?: string;
}

const SongSnapPlayer: React.FC<DzPlayerProps> = ({ dztype, trackID, backgroundTheme, caption }) => {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
  const [player, setPlayer] = useState<JSX.Element | null>(null);

  const formatBackgroundThemeTxt = (backgroundTheme: string): string => {
    return backgroundTheme.replace(/\s+/g, '').toLowerCase();
  }

  const generatePlayer = (trackID: number, dztype: string) => {
    return (
      <iframe
        id="dzplayer"
        title='SongSnapPlayer'
        data-dztype={dztype}
        src={`https://www.deezer.com/plugins/player?type=tracks&id=${trackID}&format=classic&color=007FEB&autoplay=false&playlist=true&width=700&height=550`}
        className="player"
        onLoad={() => setIframeLoaded(true)}
      />
    );
  };

  const toggleComment = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  useEffect(() => {
    try {
      const generatedPlayer = generatePlayer(trackID, dztype);
      setPlayer(generatedPlayer);
      setIframeLoaded(true);
    } catch (e) {
      console.log('Error generating player:', e);
    }
  }, [trackID, dztype]);

  return (
    <div className='container text-center player-container my-3'>
      {backgroundTheme && (
        <div className='theme-container'>
          {iframeLoaded && player ? (
            <>
              <Row>
                <Col xs={4} md={8}>
                  <Image
                    src={require(`../images/${formatBackgroundThemeTxt(backgroundTheme)}.png`)}
                    alt="Background Theme"
                    className='theme'
                    rounded
                  />
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
                <Col md={4}>
                  <Button variant='primary' className='comment-btn' onClick={toggleComment}>
                    {isCommentOpen ? (
                      <ChatFill className='icon' />
                    ) : (
                      <Chat className='icon' />
                    )
                    }

                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xs={4} md={8}>
                  {player}
                </Col>
              </Row>
              <Row>
                <Col xs={4} md={12}>
                  <div className='caption-container'>
                    <div className='caption-content'>
                      <p>{caption}</p>
                    </div>
                  </div>
                </Col>
              </Row>
              {isCommentOpen && (
                <Row>

                  <Col xs={6} md={12}>
                    <div className='comments-container'>
                      <input type='text' className="form-control publish-comment" placeholder='Add a comment...' />
                      <div className='comments-content'>
                        <p>Comment</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </>
          ) : (
            <div className="loading-state">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongSnapPlayer;
