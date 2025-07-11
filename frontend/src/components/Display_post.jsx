import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DisplayPost({ selectedFolderId }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const postsPerPage = 6;

    const navigate = useNavigate();

    const updatePosts = (postId, isLiked, Refresh) => {
        const updatedPosts = posts.map((post) =>
            post.id === postId
                ? {
                    ...post,
                    like_count: isLiked
                        ? post.like_count + 1
                        : post.like_count - 1,
                    is_liked: isLiked,
                }
                : post
        );

        if (!Refresh)
            setPosts(updatedPosts);
    };

    const handleLikeToggle = async (postId, Refresh) => {
        if (!isAuthenticated) return;

        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.post(
                `/api/posts/${postId}/like/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            updatePosts(postId, response.data.is_liked, Refresh);
        } catch (err) {
            console.error('Error toggling like status:', err);
            setError('Failed to update like status.');
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError('');

            try {
                const accessToken = localStorage.getItem('access_token');
                if (accessToken) {
                    setIsAuthenticated(true);
                }

                const response = await axios.get('/api/posts/', {
                    params: {
                        folder_id: selectedFolderId, // Explicitly filter by folder ID
                    },
                });
                const fetchedPosts = response.data;

                const updatedPosts = await Promise.all(
                    fetchedPosts.map(async (post) => {
                        if (isAuthenticated) {
                            try {
                                const likeResponse = await axios.get(`/api/posts/${post.id}/check-like/`, {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                });
                                return { ...post, is_liked: likeResponse.data.is_liked };
                            } catch (err) {
                                console.error(`Error checking like status for post ${post.id}:`, err);
                                return post; // Return post without modifying is_liked if API call fails
                            }
                        } else {
                            return post;
                        }
                    })
                );

                setPosts(updatedPosts);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to load posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [selectedFolderId, isAuthenticated]);


    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (endIndex < posts.length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handlePostClick = (postId) => {
        navigate(`/EOB/Library/${postId}`);
    };

    if (loading) {
        return <div>Loading Posts...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (posts.length === 0) {
        return null; // Render nothing when there are no posts
    }

    return (
        <div className="container" style={{ paddingBottom: '50px', paddingTop: '0', paddingLeft: '0' }}>
            <div className="col-lg-12">
                <div className="card-body p-md-5">
                    {currentPosts.length > 0 && (
                        <div className="row">
                            {currentPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="col-lg-4 col-md-6 mb-4"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className="card d-flex flex-column"
                                        style={{ borderRadius: '15px', minHeight: '400px', maxHeight: '400px' }}
                                    >
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title text-center" onClick={() => handlePostClick(post.id)}><b>{post.title}</b></h5>
                                            <p className="card-text" onClick={() => handlePostClick(post.id)}>{post.caption}</p>

                                            {post.picture && (
                                                <img
                                                    onClick={() => handlePostClick(post.id)}
                                                    src={post.picture}
                                                    alt={post.title}
                                                    className="img-fluid mb-3"
                                                    style={{
                                                        maxHeight: '275px',
                                                    }}
                                                />
                                            )}

                                            <div className="flex-grow-1"></div>

                                            <p className="text-muted text-center">
                                                Folder ID: {post.folder?.id || 'Unknown'}
                                            </p>

                                            <p className="text-muted text-center mt-auto">
                                                {post.like_count}{' '}
                                                <i
                                                    className={`bi bi-heart${post.is_liked ? '-fill' : ''} text-danger`}
                                                    onClick={() => isAuthenticated && handleLikeToggle(post.id, false)}
                                                    style={{ cursor: isAuthenticated ? 'pointer' : 'default' }}
                                                ></i>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {currentPosts.length > 0 && (
                        <div className="d-flex justify-content-center mt-4">
                            <button
                                className="btn btn-light me-2"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                &lt;
                            </button>
                            <button className="btn btn-secondary" disabled>
                                {currentPage}
                            </button>
                            <button
                                className="btn btn-light ms-2"
                                onClick={handleNextPage}
                                disabled={endIndex >= posts.length}
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DisplayPost;
