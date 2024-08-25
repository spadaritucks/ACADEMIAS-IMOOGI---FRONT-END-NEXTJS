'use client'
import { Modal, Button } from 'react-bootstrap';
import { useModal } from './errorContext';


const GlobalModal = () => {
    const { modalShow, modalTitle, modalBody, hideModal } = useModal();

    return (
        <Modal show={modalShow} onHide={hideModal} style={{zIndex:3000, display: 'flex', flexDirection:'column', alignItems:'center'}}>
            <Modal.Header>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalBody}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GlobalModal;