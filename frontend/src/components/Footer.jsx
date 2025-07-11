import React from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa'; // Importing React icons for social media

const Footer = () => {
    return (
        <div className="row p-4 text-white text-left" style={{ backgroundColor: '#1c2d5a' }}>
            <div className="col-sm-4 p-2">
                <h5>CÔNG TY CỔ PHẦN ERA OF BIMB (EOB)</h5>
                <div>
                    <i className="bi bi-geo-alt"></i> Tầng 4 62A Huỳnh Mẫn Đạt, Phường 19, Quận Bình Thạnh, Tp.Hồ Chí Minh, Việt Nam
                </div>
                <div>
                    <i className="bi bi-envelope"></i> info.eob@gmail.com
                </div>
            </div>

            <div className="col-sm-3 p-2">
                <h5>TRUY CẬP NHANH</h5>
                <div>
                    <i className="bi bi-chevron-right"></i> Trang chủ
                </div>
                <div>
                    <i className="bi bi-chevron-right"></i> Tất cả thư viện
                </div>
                <div>
                    <i className="bi bi-chevron-right"></i> Thư viện EOB
                </div>
                <div>
                    <i className="bi bi-chevron-right"></i> Thư viện VLXD
                </div>
            </div>

            <div className="col-sm-2 p-2">
                <h5>KHÁC</h5>
                <div>
                    <i className="bi bi-chevron-right"></i> Hoạt động
                </div>
                <div>
                    <i className="bi bi-chevron-right"></i> Khóa học
                </div>
            </div>

            <div className="col-sm-3 p-2">
                <div>THEO DÕI CHÚNG TÔI</div>
                <div className="row">
                    <button className="col">
                        <FaTwitter size={24} />
                    </button>
                    <button className="col">
                        <FaFacebook size={24} />
                    </button>
                    <button className="col">
                        <FaLinkedin size={24} />
                    </button>
                    <button className="col">
                        <FaInstagram size={24} />
                    </button>
                </div>
            </div>

            <div className="container">
                <div className="row mt-4 border-top mx-xl-5 py-4">
                    © Eob.vn. All Rights Reserved.
                </div>
            </div>
        </div>
    );
};

export default Footer;
