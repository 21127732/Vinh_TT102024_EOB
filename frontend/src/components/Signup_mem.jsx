import React, { useState } from 'react';

const SignupMem = () => {
    const [memberType, setMemberType] = useState('individual');
    const [messages, setMessages] = useState([]);
    const [messageType, setMessageType] = useState(null);
    const [formData, setFormData] = useState({
        uname: '',
        c_name: '',
        tax: '',
        phone: '',
        email: '',
        pass: '',
        rpass: '',
        checkbox: false,
    });

    const handleRadioChange = (e) => {
        setMemberType(e.target.value);
        setFormData({
            ...formData,
            uname: '',
            c_name: '',
            tax: '',
        }); // Clear member-specific fields on type change
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessages([]); // Clear previous messages
        setMessageType(null);

        if (formData.pass !== formData.rpass) {
            setMessages(['Passwords do not match.']);
            setMessageType('error');
            return;
        }

        const memberData = {
            member_type: memberType,
            phone: formData.phone,
            email: formData.email,
            pass: formData.pass,
            checkbox: formData.checkbox,
            ...(memberType === 'individual' && { uname: formData.uname }),
            ...(memberType === 'organization' && { c_name: formData.c_name, tax: formData.tax }),
        };

        // Safely get the CSRF token
        const csrfTokenMatch = document.cookie.match(/csrftoken=([\w-]+)/);
        const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : ''; // Default to empty string if not found

        const response = await fetch('/api/signup_mem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Use the CSRF token if available
            },
            body: JSON.stringify(memberData),
        });

        const data = await response.json();
        if (data.error) {
            setMessages([data.error]);
            setMessageType('error');
        } else {
            setMessages(['Signup successful!']);
            setMessageType('success');
        }
    };

    return (


        <section style={{ backgroundColor: '#eee' }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11 my-5">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-between px-2">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-1 order-lg-2">
                                        <p className="text-center h3 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                                            ĐĂNG KÝ THÀNH VIÊN EOB
                                        </p>
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
                                        <form onSubmit={handleSubmit} className="mx-1 mx-md-4">
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0 d-flex">
                                                    <div className="me-3">
                                                        <input
                                                            checked={memberType === 'individual'}
                                                            id="individual"
                                                            name="member_type"
                                                            onChange={handleRadioChange}
                                                            type="radio"
                                                            value="individual"
                                                        />
                                                        <label htmlFor="individual">Cá nhân</label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            checked={memberType === 'organization'}
                                                            id="organization"
                                                            name="member_type"
                                                            onChange={handleRadioChange}
                                                            type="radio"
                                                            value="organization"
                                                        />
                                                        <label htmlFor="organization">Tổ chức</label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Individual Fields */}
                                            {memberType === 'individual' && (
                                                <div id="individual-fields">
                                                    <div className="d-flex flex-row align-items-center mb-4">
                                                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                        <div className="form-outline flex-fill mb-0">
                                                            <input
                                                                className="form-control"
                                                                name="uname"
                                                                placeholder="Họ và tên"
                                                                type="text"
                                                                value={formData.uname}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Organization Fields */}
                                            {memberType === 'organization' && (
                                                <div id="organization-fields">
                                                    <div className="d-flex flex-row align-items-center mb-4">
                                                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                        <div className="form-outline flex-fill mb-0">
                                                            <input
                                                                className="form-control"
                                                                name="c_name"
                                                                placeholder="Tên công ty/ Tổ chức"
                                                                type="text"
                                                                value={formData.c_name}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-row align-items-center mb-4">
                                                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                        <div className="form-outline flex-fill mb-0">
                                                            <input
                                                                className="form-control"
                                                                name="tax"
                                                                placeholder="Mã số thuế"
                                                                type="text"
                                                                value={formData.tax}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Common Fields */}
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        className="form-control"
                                                        name="phone"
                                                        placeholder="Điện thoại *"
                                                        type="text"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        className="form-control"
                                                        name="email"
                                                        placeholder="Email"
                                                        type="text"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        className="form-control"
                                                        name="pass"
                                                        placeholder="Mật khẩu"
                                                        type="password"
                                                        value={formData.pass}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        className="form-control"
                                                        name="rpass"
                                                        placeholder="Xác nhận mật khẩu"
                                                        type="password"
                                                        value={formData.rpass}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Terms & Conditions */}
                                            <div className="form-check d-flex justify-content-center mb-5">
                                                <input
                                                    className="form-check-input"
                                                    name="checkbox"
                                                    style={{ borderWidth: '2px', borderColor: 'black', marginRight: '5px' }}
                                                    type="checkbox"
                                                    checked={formData.checkbox}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label" htmlFor="form2Example3c">
                                                    Đồng ý tất cả điều khoản trong điều khoản sử dụng
                                                </label>
                                            </div>

                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button className="btn btn-primary btn-lg" type="submit">
                                                    Đăng Ký
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="col-md-10 col-lg-5 col-xl-6 order-1 order-lg-2">
                                        <div className="row pt-4">
                                            <img
                                                alt="Logo"
                                                className="img-fluid"
                                                src="/static/Resources/Logo.png"
                                                style={{ width: '35%' }}
                                            />
                                        </div>
                                        <div className="row pt-4">
                                            <h5>Đăng ký thành viên EOB</h5>
                                            <p>
                                                để bắt đầu trao đổi family thiết kế và kiến thức kiến trúc – xây dựng.
                                            </p>
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

export default SignupMem;
