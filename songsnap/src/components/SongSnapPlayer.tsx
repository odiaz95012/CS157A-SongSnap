import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { HeartFill, Bookmark, BookmarkFill } from 'react-bootstrap-icons';
import '../styles/SongSnapPlayerStyles.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import CommentsContainer from './CommentsContainer';
import { useNavigate } from 'react-router-dom';
interface User {
  Username: string;
  name: string;
  ProfilePicture: string;
  ID: number;
}
interface DzPlayerProps {
  dztype: string;
  trackID: number;
  backgroundTheme: string;
  caption?: string;
  user: User;
  postID: number;
  ownerUserID: number;
  currUserProfilePicture: string;
  pinned?: boolean;
  datePosted: string;
}



const SongSnapPlayer: React.FC<DzPlayerProps> = ({ dztype, trackID, backgroundTheme, caption, user, postID, ownerUserID, currUserProfilePicture, pinned, datePosted }) => {

  interface Comment {
    Text: string;
    Date: string;
    Username: string;
    ID: number;
    UserID: number;
    ProfilePicture: string;
  }
  const navigate = useNavigate();
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [numLikes, setNumLikes] = useState<number>(0);
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
  const [player, setPlayer] = useState<JSX.Element | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

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

  const like = async () => {
    axios.post('/posts/like', {
      postID: postID,
      userID: await Cookies.get('userID'),
      postType: 'songsnap'
    }).then(async (response) => {
      console.log(response);
      await getLikes();
    }).catch((error) => {
      console.log(error);
    });
  };

  const unlike = async () => {
    axios.post('/posts/unlike', {
      postID: postID,
      userID: await Cookies.get('userID'),
      postType: 'songsnap'
    }).then(async () => {
      await getLikes();
    }).catch((error) => {
      console.log(error);
    });
  };



  const getLikes = async () => {
    axios.get(`/posts/get/likes?postID=${postID}&userID=${await Cookies.get('userID')}&postType=songsnap`)
      .then((response) => {
        if (response.data) {
          setNumLikes(response.data.likeCount);
          response.data.isLiked ? setIsLiked(true) : setIsLiked(false);
        } else {
          // No likes for the post, set numLikes to 0
          setNumLikes(0);
        }
      }).catch((error) => {
        console.log(error);
      });
  };

  const getComments = async () => {
    axios.get(`/posts/get/comments?postID=${postID}`)
      .then((response) => {
        setComments(response.data);
      }).catch((error) => { console.log(error) });
  };


  const handleLikeEvent = () => {

    // If isLiked is true, call unlike; if false, call like
    isLiked ? unlike() : like();
    // Toggle the isLiked state
    setIsLiked(!isLiked);
  };

  const favorite = async () => {
    axios.post('/posts/favorite', {
      songSnapID: postID,
      userID: await Cookies.get('userID')
    }).catch((error) => {
      console.log(error);
    })
  };
  const unfavorite = async () => {
    axios.post('/posts/unfavorite', {
      songSnapID: postID,
      userID: await Cookies.get('userID')
    }).catch((error) => {
      console.log(error);
    })
  };

  const handleFavoriteEvent = () => {
    // If isFavorited is true, call unfavorite; if false, call favorite
    isFavorited ? unfavorite() : favorite();
    // Toggle the isFavorited state
    setIsFavorited(!isFavorited);
  };

  const navigateToProfile = (profileID: number) => {
    navigate(`/profile/${profileID}`);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const generatedPlayer = generatePlayer(trackID, dztype);
        setPlayer(generatedPlayer);
        await getLikes();
        await getComments();
        setIframeLoaded(true);
      } catch (e) {
        console.log('Error generating player:', e);
      }
    }
    fetchData();
  }, [trackID, dztype]);

  const formatDate = (inputDate: string): string => {
    const date = new Date(inputDate);
    const now = new Date();

    const isToday = date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      const period = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours % 12 || 12; // Convert 0 to 12

      const formattedTime = `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;

      return formattedTime;
    } else {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear() % 100;
      const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year.toString().padStart(2, '0')}`;
      return formattedDate;
    }
  };

  return (
    <div className='container text-center'>
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
                  <div className='like-count-container'>
                    <div className='like-count-icon'>
                      <HeartFill className='icon' />
                    </div>
                    <span className="form-label like-count">: {numLikes}</span>
                  </div>
                </Col>

              </Row>
              <Row>
                <Col md={4}>
                  <a className={`like-btn me-1 ${isLiked ? 'liked' : ''}`} onClick={handleLikeEvent}>
                    <HeartFill className='like-icon' />
                  </a>
                </Col>
                <Col md={4}>
                  <a className="comment-btn" onClick={toggleComment}>
                    <CommentsContainer comments={comments} postID={postID} postOwnerUserID={ownerUserID} currUserProfilePicture={currUserProfilePicture} />
                  </a>
                </Col>
                <Col md={4}>
                  <a className="fav-post-btn" onClick={handleFavoriteEvent}>
                    {pinned ? (
                      <BookmarkFill className='fav-icon' />
                    ) : (
                      isFavorited ? (
                        <BookmarkFill className='fav-icon' />
                      ) : (
                        <Bookmark className='fav-icon' />
                      )
                    )}


                  </a>
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
                      <div className='d-flex'>
                        <img
                          src={user.ProfilePicture}
                          alt="Profile Picture"
                          width="50px"
                          height="50px"
                          className='my-2 profile-picture'
                          onClick={() => navigateToProfile(user.ID)}
                          style={{ borderRadius: '50%', aspectRatio: '1/1', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="ms-1">
                        <div>
                          <p className="mb-0 text-start">
                            <span className="me-2">{user.Username}</span>
                            <small className="text-white-50">{formatDate(datePosted)}</small>
                          </p>
                        </div>
                        <div>
                          <p className="lead text-start px-3">{caption}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>


              </Row>
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
