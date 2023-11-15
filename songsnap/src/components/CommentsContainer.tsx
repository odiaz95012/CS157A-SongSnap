import React, { useEffect, useState } from "react";
import { Offcanvas, Row, Col, Form, Button } from 'react-bootstrap';
import { Chat, ChatFill } from "react-bootstrap-icons";
import '../styles/CommentsContainerStyles.css';
import axios from "axios";
import Cookies from "js-cookie";

interface Comment {
    Text: string;
    Date: string;
    Username: string;
}
interface CommentsContainerProps {
    comments: Comment[];
    postID: number;
}
function CommentsContainer({ comments, postID }: CommentsContainerProps): JSX.Element {
    const [show, setShow] = useState(false);
    const [comment, setComment] = useState<string>('');
    const [currComments, setCurrComments] = useState<Comment[]>(comments);

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
        }).then(async () => {
            const username = await Cookies.get('username');
            if (username) {
                setCurrComments(prevComments => [
                    ...prevComments,
                    {
                        Text: comment,
                        Date: new Date().toISOString(),
                        Username: username
                    }
                ]);
            }
        }).catch((err) => {
            console.log(err);
        });
        setComment('');
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
                                <div className="d-flex justify-content-center pe-4">
                                    <Form.Label className="lead">Leave a comment</Form.Label>
                                </div>
                                <Form.Control
                                    as="textarea"
                                    className="publish-comment"
                                    rows={3}
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={handleCommentChange}
                                />
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
                                            <p>
                                                {comment.Username}
                                                <small className="text-muted ps-1">{formatDate(comment.Date)}</small>
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