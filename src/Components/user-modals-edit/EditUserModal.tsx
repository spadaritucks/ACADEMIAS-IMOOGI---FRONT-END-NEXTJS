'use client'
import { Modal, Button } from 'react-bootstrap';
import { useUserEditModal } from './EditUserContext';
import '../../Assets/css/components-styles/UserModals-style.css'



const EditUserModal = () => {
    const { modalShow, modalTitle, modalBody, hideModal } = useUserEditModal();
    

    return (
        <Modal style={{zIndex:3000, display: 'flex', flexDirection:'column', alignItems:'center'}} dialogClassName="modal-width" show={modalShow} onHide={hideModal}>
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

export default EditUserModal;