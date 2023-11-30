import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Search } from 'react-bootstrap-icons';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
    ID: number;
    username: string;
    Email: string;
    name: string;
    ProfilePicture: string;
}
interface SelectUserModalProps{
    openModalBttnText: string;
    functionToExecute: (id:number) => void;
    submitBttnText: string;
    titleText: string;
}

function SelectUserModal({ openModalBttnText, functionToExecute, submitBttnText, titleText}: SelectUserModalProps) : JSX.Element{
    const [show, setShow] = useState(false);
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUserID, setSelectedUserID] = useState<number>(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const sendSearch = () =>{
        axios.get('users/findUser?searchTerm=' + searchInput)
            .then(response => {
                console.log("Response submitted: " + response);
                setSearchResults(response.data);
            })
            .catch(error => {
                console.error("Error responding to friend request:", error);
            });
    };

    const handleSelection = (id:number) =>{
        setSelectedUserID(id);
    }

    const executeRequest = (id:number) => {
        functionToExecute(id);
        handleClose();
    }

    useEffect(() => {
        console.log(selectedUserID);
    }, [selectedUserID])





    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {openModalBttnText}
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleText}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="User's email or name" aria-label="User's email or name"  onChange={(e) => setSearchInput(e.target.value)}/>
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={sendSearch}><Search /></button>

                    </div>
                    <div>
                        <ul className="list-group">
                            {searchResults.length > 0 && (
                                searchResults
                                    .filter(user => user.ID !== parseInt(Cookies.get('userID') || '0')) // Exclude current user
                                    .map((user, index) => (
                                    <li key={index} className="list-group-item p-3 d-flex align-items-center">
                                        <input className="form-check-input me-1" type="radio" name="listGroupRadio" value={user.ID} id={`radio-${index}`} onChange={() => handleSelection(user.ID)}/>
                                        <label className="form-check-label ms-3" htmlFor={`radio-${index}`}>
                                            <div className='float-start'>
                                                <img src={user.ProfilePicture} alt={user.username} style={{ aspectRatio: "1 / 1", objectFit: "cover", width: "60px" }} />
                                            </div>
                                            <div className='float-end ms-3'>
                                                <h4>{user.name}</h4>
                                                <h6>{user.username}</h6>
                                            </div>
                                        </label>
                                    </li>
                                ))
                            )}

                        </ul>

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => executeRequest(selectedUserID)}>
                        {submitBttnText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SelectUserModal;