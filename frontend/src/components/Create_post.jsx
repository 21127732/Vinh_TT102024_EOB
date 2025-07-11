import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [picture, setPicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const location = useLocation(); // Hook to get the current location
    const [selectedFolder, setSelectedFolder] = useState(null);

    useEffect(() => {
        const fetchFolderDetails = async (folderId) => {
            try {
                const response = await axios.get(`/api/folders/${folderId}/path/`);
                // Merge the data from API with location.state if available
                setSelectedFolder((prev) => ({
                    ...prev,
                    ...response.data,
                }));
            } catch (err) {
                setError('Failed to fetch folder details.');
                console.error('Error fetching folder details:', err);
            }
        };

        // Use folder data from location.state if available
        if (location.state?.selectedFolder) {
            setSelectedFolder(location.state.selectedFolder);
            if (!location.state.selectedFolder.full_path) {
                fetchFolderDetails(location.state.selectedFolder.id); // Fetch full path if not provided
            }
        } else {
            setError('No folder selected. Please select a valid folder from the library.');
        }
    }, [location.state]);

    const handlePostCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        if (!selectedFolder || !selectedFolder.can_have_posts) {
            setError('Selected folder does not allow posts.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('caption', caption);
        formData.append('folder', selectedFolder.id); // Pass folder ID directly
        if (picture) {
            formData.append('picture', picture);
        }

        try {
            const response = await axios.post('/api/posts/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            console.log('Post created successfully:', response.data);
            setSuccess(true);
        } catch (err) {
            console.error('Error creating post:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'Failed to create post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ backgroundColor: '#eee' }}>
            <div className="container h-100" style={{ paddingBottom: '50px' }}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-7 col-xl-6">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <h2 className="text-center h4 fw-bold mb-4">Create a Post</h2>

                                {error && <div className="alert alert-danger">{error}</div>}
                                {success && <div className="alert alert-success">Post created successfully!</div>}

                                {/* Display current folder details */}
                                {selectedFolder && (
                                    <div className="alert alert-info">
                                        <p><strong>Current Folder:</strong></p>
                                        <p><strong>ID:</strong> {selectedFolder.id}</p>
                                        <p><strong>Path:</strong> {selectedFolder.full_path || 'Path not provided'}</p>
                                        <p><strong>Can Have Posts:</strong> {selectedFolder.can_have_posts ? 'Yes' : 'No'}</p>
                                    </div>
                                )}

                                <form onSubmit={handlePostCreate} className="mx-1 mx-md-4">
                                    {/* Title Input */}
                                    <div className="d-flex flex-row mb-4">
                                        <i className="fas fa-heading fa-lg me-3 fa-fw"></i>
                                        <div className="form-outline flex-fill mb-0">
                                            <input
                                                type="text"
                                                id="post_title"
                                                placeholder="Post Title"
                                                className="form-control"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Caption Input */}
                                    <div className="d-flex flex-row mb-4">
                                        <i className="fas fa-pencil-alt fa-lg me-3 fa-fw"></i>
                                        <div className="form-outline flex-fill mb-0">
                                            <textarea
                                                id="post_caption"
                                                placeholder="Post Caption"
                                                className="form-control"
                                                value={caption}
                                                onChange={(e) => setCaption(e.target.value)}
                                                rows="4"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Picture Input */}
                                    <div className="d-flex flex-row mb-4">
                                        <i className="fas fa-image fa-lg me-3 fa-fw"></i>
                                        <div className="form-outline flex-fill mb-0">
                                            <input
                                                type="file"
                                                id="post_picture"
                                                className="form-control"
                                                onChange={(e) => setPicture(e.target.files[0])}
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                            {loading ? 'Creating...' : 'Create Post'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CreatePost;
