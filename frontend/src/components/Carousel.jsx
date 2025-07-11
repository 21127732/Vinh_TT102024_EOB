// Carousel.jsx
import React from 'react';

function Carousel() {
    return ( // Added the return statement here
        <div id="carousel" className="carousel slide" data-bs-ride="carousel">
            {/* Indicators/dots */}
            <div className="carousel-indicators">
                <button
                    type="button"
                    data-bs-target="#carousel"
                    data-bs-slide-to="0"
                    className="active"
                    style={{ backgroundColor: 'black', height: '16px', width: '16px', borderRadius: '50%' }}
                ></button>
                <button
                    type="button"
                    data-bs-target="#carousel"
                    data-bs-slide-to="1"
                    style={{ backgroundColor: 'black', height: '16px', width: '16px', borderRadius: '50%' }}
                ></button>
                <button
                    type="button"
                    data-bs-target="#carousel"
                    data-bs-slide-to="2"
                    style={{ backgroundColor: 'black', height: '16px', width: '16px', borderRadius: '50%' }}
                ></button>
            </div>

            {/* The slideshow/carousel */}
            <div className="row" style={{ height: '700px' }}>
                <div className="carousel-inner">
                    <div className="carousel-item active homepage-carousel-item-1">
                        <div className="container mt-3">
                            <img
                                src="/static/Resources/Model.png"
                                alt="Model"
                                className=" homepage-carousel-block homepage-carousel-img-1"
                            />
                        </div>
                    </div>
                    <div className="carousel-item homepage-carousel-item-2">
                        <div className="container mt-3 text-center">
                            <img
                                src="/static/Resources/Star.png"
                                alt="Star"
                                className=" homepage-carousel-block homepage-carousel-img-2"
                            />
                            <button type="button" className="btn btn-primary">
                                <a href="/EOB/Member" style={{ color: 'white' }}>
                                    Đăng ký
                                </a>
                            </button>
                        </div>
                    </div>
                    <div className="carousel-item homepage-carousel-item-3">
                        <div className="container mt-3 text-center">
                            <img
                                src="/static/Resources/Product.png"
                                alt="Product"
                                className=" homepage-carousel-block homepage-carousel-img-3"
                            />
                            <button type="button" className="btn btn-primary">
                                <a href="/EOB/VLXD" style={{ color: 'white' }}>
                                    Đăng ký
                                </a>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Carousel;
