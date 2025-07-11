import React, { useState } from 'react';

const SignupVLXD = () => {
    const [formData, setFormData] = useState({
        cname: '',
        phone: '',
        email: '',
        job: '',
        checkbox: false,
    });

    const [messages, setMessages] = useState([]);
    const [messageType, setMessageType] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, checkbox: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.checkbox) {
            setMessages(['Bạn cần đồng ý với điều khoản sử dụng.']);
            setMessageType('error');
            return;
        }

        // Additional field validation
        if (!formData.cname || !formData.phone || !formData.email || !formData.job) {
            setMessages(['Vui lòng điền đầy đủ các trường.']);
            setMessageType('error');
            return;
        }

        // Reset messages and proceed with form submission
        setMessages([]);

        try {
            const response = await fetch('/api/signup_vlxd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check if response is ok (status code 200-299)
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
                setMessageType('error');
            }

            // Check if response is JSON
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Expected JSON response');
                setMessageType('error');
            }

            const data = await response.json();

            // Handle success message or further actions here
            if (data.error) {
                setMessages([data.error]); // Display the error returned from the backend (e.g., "Company name or email already exists")
                setMessageType('error');
            } else {
                setMessages(['Đăng ký thành công!']);
                setMessageType('success');
            }

        } catch (error) {
            setMessages([error.message || 'Đã có lỗi xảy ra khi gửi dữ liệu.']);
            setMessageType('error');
        }
    };

    return (
        <section style={{ backgroundColor: '#eee' }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11 my-5">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body">
                                <div className="row justify-content-between px-2">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-1 order-lg-2">
                                        <p className="text-center h3 fw-bold mb-5 mx-1 mx-md-4 mt-4">VLXD ĐĂNG KÝ</p>

                                        <div className="text-center fw-bold">
                                            {messages.length > 0 && (
                                                <div
                                                    className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'
                                                        }`}
                                                    role="alert"
                                                >
                                                    {messages.map((message, index) => (
                                                        <div key={index}>{message}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="text"
                                                        placeholder="Tên công ty"
                                                        className="form-control"
                                                        name="cname"
                                                        value={formData.cname}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-phone fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="text"
                                                        placeholder="Số điện thoại"
                                                        className="form-control"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="email"
                                                        placeholder="Email"
                                                        className="form-control"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-briefcase fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="text"
                                                        placeholder="Ngành nghề"
                                                        className="form-control"
                                                        name="job"
                                                        value={formData.job}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-check d-flex justify-content-center mb-5">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="checkbox"
                                                    checked={formData.checkbox}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <label className="form-check-label" htmlFor="form2Example3c">
                                                    Đồng ý tất cả điều khoản trong điều khoản sử dụng
                                                </label>
                                            </div>

                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button type="submit" className="btn btn-primary btn-lg">
                                                    Đăng Ký
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="col-md-10 col-lg-5 col-xl-6 order-1 order-lg-2">
                                        <div className="row pt-4">
                                            <img src="/static/Resources/Logo.png" className="img-fluid" alt="Logo" style={{ width: '35%' }} />
                                        </div>
                                        <div className="row pt-4">
                                            <h5>"Vui lòng đăng ký</h5>
                                            <p>
                                                EOB liên hệ tư vấn gói thành viên VIP dành cho đơn vị VLXD để bắt đầu kết nối và chỉ định sản phẩm qua thông tin sản phẩm và thư viện family thiết kế".
                                            </p>
                                        </div>
                                        <div className="row pt-4">
                                            <h6>EOB tăng chất lượng chỉ định sản phẩm:</h6>
                                            <ul>
                                                <li>Thông tin chỉ định đủ và chặt chẽ</li>
                                                <li>Luôn sẵn có suốt quá trình thiết kế</li>
                                                <li>Tích hợp thẳng phần mềm thiết kế</li>
                                                <li>Tư vấn trực tiếp, đúng thời điểm</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignupVLXD;
