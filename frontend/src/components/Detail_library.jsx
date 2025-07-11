import React from 'react';
import { Link } from 'react-router-dom';
import Folder from './Folder';
import OwlCarousel from 'react-owl-carousel';
import PostDetail from './Detail_post';

const DetailLibrary = () => {
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
                        <Folder />
                    </div>
                </div>

                <div className="col-md-10 col-lg-6 col-xl-7">
                    <h2>MODEL MỚI</h2>
                    <p>Các model gần đây nhất <i className="bi bi-chevron-right"></i> </p>
                    <PostDetail />
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

export default DetailLibrary;
