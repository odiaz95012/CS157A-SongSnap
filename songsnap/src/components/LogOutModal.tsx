import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function LogOutModal() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const logout = () => {
        Cookies.remove('userID');
        Cookies.remove('username');
        Cookies.remove('isAdmin');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <a onClick={handleShow}>
                Log Out
            </a>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Log Out</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='text-center'>
                        <p className='lead'>Are you sure you want to log out?</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleLogout}>
                        Log Out
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LogOutModal;