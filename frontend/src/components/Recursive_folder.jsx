import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';

const Recursive_folder = ({ folder, onFolderClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleFolderClick = () => {
        toggleOpen();
        if (onFolderClick) onFolderClick(folder.id);
    };

    return (
        <div className="folder" style={{ marginLeft: '20px' }}>
            <div
                className="folder-name"
                onClick={handleFolderClick}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <span style={{ marginRight: '8px' }}>
                    {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                </span>
                <span style={{ marginRight: '8px', color: 'gold' }}>
                    {isOpen ? <FaFolderOpen /> : <FaFolder />}
                </span>
                {folder.name}
            </div>
            {isOpen && folder.subfolders && (
                <div className="subfolders">
                    {folder.subfolders.map((subfolder) => (
                        <Recursive_folder
                            key={subfolder.id}
                            folder={subfolder}
                            onFolderClick={onFolderClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recursive_folder;
