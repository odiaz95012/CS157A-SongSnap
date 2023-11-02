import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//FIGURE OUT HOW TO RETRIEVE MODAL DATA 

interface ModalProps {
    title: string;
    body: JSX.Element;
    submitButtonText: string;
    openButtonText: string;
    functionToExecute?: Function;
}
interface SongSnapInputData {
    songName: string;
    artistName: string;
    backgroundTheme: string;
    privacy: string;
}

function PopUpModal({ title, body, submitButtonText, openButtonText, functionToExecute }: ModalProps) {
  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmission = () => {
    handleClose(); // Close the modal

    // Check if functionToExecute is provided and is a function
    if (functionToExecute && typeof functionToExecute === 'function') {
      functionToExecute();
    }
  };



  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {openButtonText}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={handleSubmission}>
            {submitButtonText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PopUpModal;