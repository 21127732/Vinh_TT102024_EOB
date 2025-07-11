import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Folder from './Folder';
import OwlCarousel from 'react-owl-carousel';
import DisplayPost from './Display_post';
import axios from 'axios';
import AuthContext from '../context/AuthContext';



// Recursive function to find a folder by ID in a nested folder structure
const findFolderById = (folders, id) => {
    for (const folder of folders) {
        if (folder.id === id) {
            return folder;
        }
        if (folder.subfolders?.length) {
            const result = findFolderById(folder.subfolders, id);
            if (result) return result;
        }
    }
    return null;
};

const PageComponent = () => {
    const navigate = useNavigate();
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [folders, setFolders] = useState([]); // State for folders data
    const { isLoggedIn } = useContext(AuthContext);

    // Fetch folders and include `can_have_posts` field
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axios.get('/api/folders/'); // Adjust API endpoint if necessary
                setFolders(response.data);
            } catch (error) {
                console.error('Error fetching folders:', error);
            }
        };
        fetchFolders();
    }, []);

    // Handle folder selection
    const handleFolderSelect = (selectedId) => {
        setSelectedFolderId(selectedId);
    };

    // Find the selected folder to check `can_have_posts`
    const selectedFolder = selectedFolderId ? findFolderById(folders, selectedFolderId) : null;

    return (
        <div className="row d-flex">
            <div className="row my-5">
                <div className="col-md-10 col-lg-6 col-xl-5">
                    <div className="h5 fw-bold mx-1 mx-md-4 mt-4">
                        <Link to="/EOB/" style={{ color: 'black' }}>Trang chủ / </Link>
                        <Link to="/EOB/Library" style={{ color: 'black' }}> Tất cả Family</Link>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-4">
                        <div className="input-group p-3" style={{ maxWidth: '350px' }}>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Tìm kiếm"
                                style={{ borderRadius: '25px 0 0 25px', border: '2px solid lightgray' }}
                            />
                            <span
                                className="input-group-text"
                                style={{ borderRadius: '0 25px 25px 0', border: '2px solid lightgray' }}
                            >
                                <i className="bi bi-search"></i>
                            </span>
                        </div>
                    </div>

                    <div style={{ border: '1px solid #333', padding: '10px', borderRadius: '5px', width: '95%', margin: '0 auto' }}>
                        <Folder onFolderSelect={handleFolderSelect} />
                    </div>
                </div>

                <div className="col-md-10 col-lg-6 col-xl-7">
                    <div className="d-flex justify-content-start align-items-center mb-3">
                        <div className="me-3">
                            <h2>MODEL MỚI</h2>
                            <p>Các model gần đây nhất <i className="bi bi-chevron-right"></i></p>
                        </div>
                        {isLoggedIn && selectedFolder?.can_have_posts && (
                            <button
                                className="btn btn-primary"
                                style={{
                                    borderRadius: '5px',
                                    height: 'fit-content',
                                }}
                                onClick={() => navigate('/EOB/Post/Create', { state: { selectedFolder } })}
                            >
                                Tạo bài viết mới
                            </button>
                        )}
                    </div>

                    <DisplayPost selectedFolderId={selectedFolderId} />
                    <div className="carousel-wrapper" style={{ backgroundColor: '#f0f0f0' }}>
                        <div
                            className="carousel-container"
                            style={{
                                maxWidth: '80%',
                                margin: '0 auto',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <OwlCarousel
                                id="homepage-carousel"
                                className="owl-theme"
                                loop
                                margin={100}
                                nav
                                autoplay
                                autoplayTimeout={4000}
                                autoplaySpeed={1500}
                                autoplayHoverPause
                                responsive={{
                                    0: {
                                        items: 1,
                                    },
                                    1000: {
                                        items: 4,
                                    },
                                }}
                            >
                                <img src="/static/Resources/Dulux.png" alt="Dulux" width="90" height="40" />
                                <img src="/static/Resources/Austra.png" alt="Austraalu" width="90" height="40" />
                                <img src="/static/Resources/PNP.png" alt="Phương Nam Panel" width="90" height="40" />
                            </OwlCarousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default PageComponent;
