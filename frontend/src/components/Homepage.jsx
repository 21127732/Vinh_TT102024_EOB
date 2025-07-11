import React, { useState } from 'react';
import Carousel from './Carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import OwlCarousel from 'react-owl-carousel';



const HomePage = () => {
    // Define a state variable for the button text
    const [buttonText, setButtonText] = useState('Tất Cả NCC');

    // Update the button text when an item is clicked
    const changeButtonText = (text) => {
        setButtonText(text);  // Update the state
    };

    return (
        <>
            <Carousel />

            {/* Các công ty */}
            <div className="row res_comp" style={{ backgroundColor: '#f0f0f0' }}>
                <div className="homepage-carousel-container">
                    <OwlCarousel
                        id="homepage-carousel"
                        className="owl-theme"
                        loop
                        margin={10}
                        nav
                        autoplay
                        autoplayTimeout={4000}
                        autoplaySpeed={1500}
                        autoplayHoverPause
                        responsive={{
                            0: {
                                items: 1,
                            },
                            600: {
                                items: 3,
                            },
                            1000: {
                                items: 6,
                            },
                        }}
                    >
                        <div className="item">
                            <a href="https://australu.com/">
                                <img
                                    src="/static/Resources/Austra.png"
                                    alt="Austraalu"
                                    width="170"
                                    height="70"
                                />
                            </a>
                        </div>
                        <div className="item">
                            <a href="https://www.dulux.vn/">
                                <img
                                    src="/static/Resources/Dulux.png"
                                    alt="Dulux"
                                    width="110"
                                    height="40"
                                />
                            </a>
                        </div>
                        <div className="item">
                            <a href="https://phuongnampanel.com/">
                                <img
                                    src="/static/Resources/PNP.png"
                                    alt="Phương Nam Panel"
                                    width="110"
                                    height="40"
                                />
                            </a>
                        </div>
                        <div className="item">
                            <a href="https://australu.com/">
                                <img
                                    src="/static/Resources/Austra.png"
                                    alt="Austraalu"
                                    width="170"
                                    height="70"
                                />
                            </a>
                        </div>
                        <div className="item">
                            <a href="https://www.dulux.vn/">
                                <img
                                    src="/static/Resources/Dulux.png"
                                    alt="Dulux"
                                    width="110"
                                    height="40"
                                />
                            </a>
                        </div>
                        <div className="item">
                            <a href="https://phuongnampanel.com/">
                                <img
                                    src="/static/Resources/PNP.png"
                                    alt="Phương Nam Panel"
                                    width="110"
                                    height="40"
                                />
                            </a>
                        </div>
                    </OwlCarousel>
                </div>
            </div>

            {/* Bốn tấm hình */}
            <div
                className="res_post container-fluid"
                style={{ padding: '75px 100px 0 200px' }}
            >
                <div className="row" style={{ paddingBottom: '50px' }}>
                    {/* Tấm hình đầu tiên */}
                    <div className="col d-flex justify-content-center align-items-stretch">
                        <div
                            className="row w-100"
                            style={{
                                border: '2px solid lightgray',
                                padding: '20px 10px',
                                marginRight: '20px',
                            }}
                        >
                            <div className="col-sm-5 d-flex justify-content-center align-items-center">
                                <img
                                    src="/static/Resources/Family-design.jpg"
                                    alt="Family"
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="col-sm-7 d-flex flex-column">
                                <h6 className="text-center">Thư viện Family thiết kế</h6>
                                <p>
                                    Thư viện family thiết kế gồm các family do các KTS và đơn vị
                                    VLXD uy tín chia sẻ. Hãy đăng ký và trở thành thành viên EOB
                                    để tải các family miễn phí cho các bản vẽ công trình.
                                </p>
                                <div className="mt-auto text-end">
                                    <span>
                                        <b>
                                            Xem thêm <i className="bi bi-chevron-right"></i>
                                        </b>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tấm hình thứ 2 */}
                    <div className="col d-flex justify-content-center align-items-stretch">
                        <div
                            className="row w-100"
                            style={{
                                border: '2px solid lightgray',
                                padding: '20px 10px',
                                marginRight: '20px',
                            }}
                        >
                            <div className="col-sm-5 d-flex justify-content-center align-items-center">
                                <img
                                    src="/static/Resources/Activity-topic.jpg"
                                    alt="AT"
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="col-sm-7 d-flex flex-column">
                                <h6 className="text-center">Hoạt động chuyên đề</h6>
                                <p>
                                    Các hoạt động chuyên đề phong phú như hội thảo, coffee talk,
                                    luncheon, lunch box với các chủ đề hấp dẫn và diễn giả đầu
                                    ngành. Hãy theo dõi và tham gia các hoạt động giành cho các
                                    thành viên EOB.
                                </p>
                                <div className="mt-auto text-end">
                                    <span>
                                        <b>
                                            Xem thêm <i className="bi bi-chevron-right"></i>
                                        </b>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ paddingBottom: '30px' }}>
                    {/* Tấm hình thứ 3 */}
                    <div className="col d-flex justify-content-center align-items-stretch">
                        <div
                            className="row w-100"
                            style={{
                                border: '2px solid lightgray',
                                padding: '20px 10px',
                                marginRight: '20px',
                            }}
                        >
                            <div className="col-sm-5 d-flex justify-content-center align-items-center">
                                <img
                                    src="/static/Resources/Post-topic.jpg"
                                    alt="PT"
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="col-sm-7 d-flex flex-column">
                                <h6 className="text-center">Bài viết chuyên đề</h6>
                                <p>
                                    Tập hợp các bài viết kiến trúc xây dựng của các thành viên EOB
                                    pro, các diễn giả đầu ngành và các giải pháp VLXD uy tín. Hãy
                                    theo dõi để không bỏ lỡ các bài viết bổ ích.
                                </p>
                                <div className="mt-auto text-end">
                                    <span>
                                        <b>
                                            Xem thêm <i className="bi bi-chevron-right"></i>
                                        </b>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tấm hình thứ 4 */}
                    <div className="col d-flex justify-content-center align-items-stretch">
                        <div
                            className="row w-100"
                            style={{
                                border: '2px solid lightgray',
                                padding: '20px 10px',
                                marginRight: '20px',
                            }}
                        >
                            <div className="col-sm-5 d-flex justify-content-center align-items-center">
                                <img
                                    src="/static/Resources/Course-topic.jpg"
                                    alt="CT"
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="col-sm-7 d-flex flex-column">
                                <h6 className="text-center">Sản phẩm xây dựng</h6>
                                <p>
                                    Cập nhật những sản phẩm vật liệu xây dựng mới nhất và đang
                                    được các nhà thầu ưu tiên sử dụng. Hãy đăng ký ngay để trở
                                    thành thành viên EOB.
                                </p>
                                <div className="mt-auto text-end">
                                    <span>
                                        <b>
                                            Xem thêm <i className="bi bi-chevron-right"></i>
                                        </b>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {/* Thông số thành viên, đơn vị... */}
                <div className="res_post row text-dark text-center" style={{ paddingLeft: '100px', paddingRight: '100px', paddingTop: '100px', paddingBottom: '50px' }}>
                    <div className="col-sm-3 p-2">
                        <img src="/static/Resources/Member.png" alt="Member" width="100" height="60" />
                        <p>Thành viên</p>
                        <h1 style={{ fontSize: '60px' }}><b>1446</b></h1>
                    </div>

                    <div className="col-sm-3 p-2">
                        <img src="/static/Resources/Unit.png" alt="Unit" width="100" height="60" />
                        <p>Đơn vị VLXD</p>
                        <h1 style={{ fontSize: '60px' }}><b>3</b></h1>
                    </div>

                    <div className="col-sm-3 p-2">
                        <img src="/static/Resources/Family.png" alt="Family" width="100" height="60" />
                        <p>Family</p>
                        <h1 style={{ fontSize: '60px' }}><b>198</b></h1>
                    </div>

                    <div className="col-sm-3 p-2">
                        <img src="/static/Resources/Document.png" alt="Document" width="100" height="60" />
                        <p>Tài liệu</p>
                        <h1 style={{ fontSize: '60px' }}><b>198</b></h1>
                    </div>
                </div>

                <div className="container-fluid text-black d-flex flex-column justify-content-end" style={{ position: 'relative', width: '100%', height: '100vh', zIndex: 1 }}>
                    {/* Pseudo-element background image with opacity */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: 'url(/static/Resources/Background.jpg)',
                            backgroundSize: 'cover',
                            opacity: 0.8,
                            zIndex: -1, // Place it behind the content
                        }}
                    ></div>

                    <div className="row justify-content-center align-items-center" style={{ zIndex: 2, textAlign: 'center' }}>
                        <h4><b>Công trình tiêu biểu</b></h4>
                    </div>

                    <div className="row justify-content-center align-items-center" style={{ zIndex: 2 }}>
                        <div className="col-12 col-md-6 p-2 d-flex justify-content-center">
                            {/* Input Group */}
                            <div className="input-group w-100" style={{ maxWidth: '500px' }}>
                                {/* Search Input */}
                                <input className="form-control" type="text" placeholder="Tìm kiếm" style={{ borderRadius: '25px 0 0 25px', border: '2px solid lightgray' }} />

                                {/* Dropdown Button inside Input Group */}
                                <button
                                    id="dropdownButton"
                                    type="button"
                                    className="btn dropdown-toggle bg-white text-dark"
                                    style={{
                                        textDecoration: 'none',
                                        borderRadius: '0 25px 25px 0',
                                        border: '2px solid lightgray',
                                        minWidth: '170px',  // Set a fixed width for the button
                                        textAlign: 'center'  // Center the text inside the button
                                    }}
                                    data-bs-toggle="dropdown"
                                >
                                    <b>{buttonText}</b>
                                </button>

                                {/* Dropdown Menu */}
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('Tất Cả NCC')}>Tất cả NCC</a></li>
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('AN CƯỜNG')}>AN CƯỜNG</a></li>
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('DULUX')}>DULUX</a></li>
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('BM WINDOWS')}>BM WINDOWS</a></li>
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('INAX')}>INAX</a></li>
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('LYSAGHT')}>LYSAGHT</a></li>
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('EUROTILE')}>EUROTILE</a></li>
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('SAINT-GOBAIN')}>SAINT-GOBAIN</a></li>
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('PANASONIC')}>PANASONIC</a></li>
                                    <li><a className="dropdown-item" href="#ncc" onClick={() => changeButtonText('SCG')}>SCG</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Tin tức */}
                <div className="res_new container-fluid align-items-center" style={{ paddingLeft: '200px', paddingRight: '100px', paddingTop: '75px' }}>
                    <div className="row d-flex justify-content-center align-items-stretch" style={{ paddingBottom: '50px' }}>
                        <div className="row">
                            <h5><b>Tin tức cập nhật</b></h5>
                        </div>
                        {/* Tin tức đầu tiên */}
                        <div className="col d-flex flex-column" style={{ border: '1px solid lightgray', width: '300px', paddingBottom: '30px', marginRight: '40px' }}>
                            <div>
                                <img src="/static/Resources/Festival.jpg" alt="Fes" style={{ width: '105%', height: 'auto' }} />
                            </div>
                            <h6 className="text-left" style={{ paddingBottom: '20px' }}>FESTIVAL KTS TRẺ TOÀN QUỐC LẦN THỨ IX - YÊN BÁI 2023</h6>
                            <p className="text-justify flex-grow-1">Kỳ liên hoan sắc màu !!! <br /> Vượt qua bao gian khó, bao áp lực... ngày trở về trọn niềm vui. Đi xin từng tấm hình cùng với anh em, bởi nhớ lắm từng nục cười giữa anh em.</p>
                            <div className="mt-auto pt-3 text-right">
                                <span style={{ float: 'right' }}><b>Xem thêm <i className="bi bi-chevron-right"></i></b></span>
                            </div>
                        </div>
                        {/* Tin tức thứ 2 */}
                        <div className="col d-flex flex-column" style={{ border: '1px solid lightgray', width: '300px', paddingBottom: '30px', marginRight: '40px' }}>
                            <div>
                                <img src="/static/Resources/Color.jpg" alt="Color" style={{ width: '105%', height: 'auto' }} />
                            </div>
                            <h6 className="text-left" style={{ paddingBottom: '20px' }}>Dulux kỷ niệm 20 năm ColourFutures - Màu Dulux Của Năm</h6>
                            <p className="text-justify flex-grow-1">Năm 2023 đánh dấu một mốc quan trọng - kỷ niệm 20 năm chiến dịch Màu Dulux Của Năm. Tìm nguồn cảm hứng từ những câu chuyện mà sắc trong một ấn phẩm ColourFutures đặc biệt, và khám phá tất cả những màu sắc ra mắt trong hai thập kỷ qua. Hãy để màu sắc biến đổi cuộc sống của bạn.</p>
                            <div className="mt-auto pt-3 text-right">
                                <span style={{ float: 'right' }}><b>Xem thêm <i className="bi bi-chevron-right"></i></b></span>
                            </div>
                        </div>
                        {/* Tin tức thứ 3 */}
                        <div className="col d-flex flex-column" style={{ border: '1px solid lightgray', width: '300px', paddingBottom: '30px', marginRight: '40px' }}>
                            <div>
                                <img src="/static/Resources/Top10.jpg" alt="Top10" style={{ width: '105%', height: 'auto' }} />
                            </div>
                            <h6 className="text-left" style={{ paddingBottom: '20px' }}>LỘ DIỆN TOP 10 CHUNG KẾT AN CƯỜNG INTERIOR DESIGN AWARD 2023</h6>
                            <p className="text-justify flex-grow-1">Kỳ liên hoan sắc màu !!! <br /> Ngày 17 tháng 10 vừa qua, tại Sheraton Hotel, An Cường interior Design Award 2023 đã cùng Hội đồng Giám khảo tiến hành chọn ra Top 10 dự án xuất sắc nhất trong 21 dự án vào Bán kết được công bố vào ngày 6 thánh 9 vừa qua.</p>
                            <div className="mt-auto pt-3 text-right">
                                <span style={{ float: 'right' }}><b>Xem thêm <i className="bi bi-chevron-right"></i></b></span>
                            </div>
                        </div>

                        {/* Tin tức thứ 4 */}
                        <div className="col d-flex flex-column" style={{ border: '1px solid lightgray', width: '300px', paddingBottom: '30px', marginRight: '40px' }}>
                            <div>
                                <img src="/static/Resources/Areus.jpg" alt="Areus" style={{ width: '105%', height: 'auto' }} />
                            </div>
                            <h6 className="text-left" style={{ paddingBottom: '20px' }}>AREUS Atelier đối thoại với văn hóa bằng nội thất CHẤM</h6>
                            <p className="text-justify flex-grow-1">Là một sản phẩm nội thất của hãng nội thất cao cấp Areus Atelier. Từ những đặc trưng của văn hóa dân gian Việt Nam, Areus mong muốn mỗi sản phẩm của mình sẽ là một cuộc trò chuyện với văn hóa dân gian, giúp tạo ra một không gian sống giàu cảm xúc...</p>
                            <div className="mt-auto pt-3 text-right">
                                <span style={{ float: 'right' }}><b>Xem thêm <i className="bi bi-chevron-right"></i></b></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;