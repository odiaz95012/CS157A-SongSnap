import React, { useEffect, useState } from "react";
import { Offcanvas, Row, Col, Form, Button, FloatingLabel } from 'react-bootstrap';
import { Chat, ChatFill, Trash } from "react-bootstrap-icons";
import '../styles/CommentsContainerStyles.css';
import axios from "axios";
import Cookies from "js-cookie";

//TODO: FIGURE OUT WHY COMMENTS ARE DELETING IN REAL TIME 
interface Comment {
    Text: string;
    Date: string;
    Username: string;
    ID: number;
    UserID: number;
    ProfilePicture: string;
}
interface CommentsContainerProps {
    comments: Comment[];
    postID: number;
    postOwnerUserID: number;
    currUserProfilePicture: string;
}
function CommentsContainer({ comments, postID, postOwnerUserID, currUserProfilePicture }: CommentsContainerProps): JSX.Element {

    const [show, setShow] = useState(false);
    const [comment, setComment] = useState<string>('');
    const [currComments, setCurrComments] = useState<Comment[]>(comments);
    const currUserID = parseInt(Cookies.get('userID')!);

    useEffect(() => {
        const isDifferent = comments.length > currComments.length &&
            comments[comments.length - 1].Text !== currComments[currComments.length - 1]?.Text;

        if (isDifferent) {
            setCurrComments(comments);
        }
    }, [comments, currComments]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };


    const publishComment = async () => {
        axios.post('posts/publish/comment', {
            text: comment,
            postID: postID,
            userID: await Cookies.get('userID')
        }).then(async (result) => {
            const username = await Cookies.get('username');
            const userID = await Cookies.get('userID');
            if (username) {
                setCurrComments(prevComments => [
                    ...prevComments,
                    {
                        Text: comment,
                        Date: new Date().toISOString(),
                        Username: username,
                        ID: result.data.commentID,
                        UserID: parseInt(userID!),
                        ProfilePicture: currUserProfilePicture
                    }
                ]);
            }
        }).catch((err) => {
            console.log(err);
        });
        setComment('');
    };

    const deleteComment = async (commentID: number) => {
        axios.post('posts/delete/comment', {
            commentID: commentID,
            postID: postID
        }).then(async () => {
            setCurrComments(prevComments => prevComments.filter(comment => comment.ID !== commentID));
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        <>
            {show ? (
                <ChatFill className="icon" />
            ) : (
                <Chat onClick={handleShow} className="icon" />
            )
            }
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        Comments
                    </Offcanvas.Title>

                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <div className="d-flex justify-content-start pe-4">
                                    <Form.Label className="lead">Comment</Form.Label>
                                </div>
                                <FloatingLabel
                                    controlId="floatingTextarea"
                                    label="Leave a comment"
                                    className="mb-3"
                                    onChange={handleCommentChange}
                                >
                                    <Form.Control as="textarea" placeholder="Leave a comment here" />
                                </FloatingLabel>
                                <div className="d-flex justify-content-center">
                                    <Button variant="primary" size="sm" onClick={publishComment}>Publish Comment</Button>
                                </div>

                            </Form.Group>

                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <div className='comments-content'>
                                {currComments.map((comment, index) => (
                                    <div className="comment" key={index}>
                                        <div className="mb-1">
                                            <img
                                                src={comment.ProfilePicture}
                                                alt="Profile Picture"
                                                className='profile-picture'
                                                width="25px"
                                                height="25px"
                                                style={{ borderRadius: '50%' }}
                                            />
                                        </div>
                                        <p>
                                            {comment.Username}
                                            <small className="text-muted ps-1">{formatDate(comment.Date)}</small>
                                            {(comment.UserID === currUserID || currUserID === postOwnerUserID) && (
                                                <button onClick={() => deleteComment(comment.ID)} className="btn btn-sm btn-danger ms-2">
                                                    <Trash />
                                                </button>
                                            )}
                                        </p>
                                        <p className="lead">{comment.Text}</p>

                                    </div>

                                ))}
                            </div>
                        </Col>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default CommentsContainer;