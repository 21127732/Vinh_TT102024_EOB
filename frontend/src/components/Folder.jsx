// Folder.jsx
import React, { useState, useEffect } from 'react';
import Recursive_folder from './Recursive_folder';
import axios from 'axios';

const FolderPage = ({ onFolderSelect }) => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axios.get('/api/folders/');
                setFolders(response.data);
            } catch (err) {
                setError('Failed to load folders.');
                console.error('Error fetching folders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFolders();
    }, []);

    const handleFolderClick = (id) => {
        console.log(`Selected Folder ID: ${id}`);
        if (onFolderSelect) onFolderSelect(id);
    };

    if (loading) return <div>Loading folders...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="folder-page">
            {folders.map((folder) => (
                <Recursive_folder
                    key={folder.id}
                    folder={folder}
                    onFolderClick={handleFolderClick}
                />
            ))}
        </div>
    );
};

export default FolderPage;
