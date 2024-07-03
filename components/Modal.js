import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto'
    }
};

Modal.setAppElement('#__next'); // ID root Next.js

function CustomModal({ isOpen, onRequestClose, onSubmit, title, children }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel={title}
        >
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div>{children}</div>
            <div className="mt-4 flex justify-end">
                <button onClick={onRequestClose} className="bg-gray-300 px-4 py-2 rounded mr-2">Cancel</button>
                <button onClick={onSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
            </div>
        </Modal>
    );
}

export default CustomModal;