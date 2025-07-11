import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Profile = () => {
    const [image, setImage] = useState("/static/Resources/Profile.jpg");

    const { username, email, phone, updateUserData, setEmail, setPhone } = useContext(AuthContext);
    const navigate = useNavigate();


    // Handle image preview
    const previewImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    // Handle the update functionality
    const handleUpdate = async () => {
        try {
            // Make a PUT request to update user data
            await updateUserData({ email, phone });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error during update:", error);
            alert("Update failed. Please try again.");
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            const storedToken = localStorage.getItem('access_token'); // Retrieve the stored access token

            try {
                const response = await axios.get(`/members/${username}/`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });

                const userData = response.data;

                setEmail(userData.email || '');
                setPhone(userData.phone || '');

                localStorage.setItem('phone', response.data.phone || '');
                localStorage.setItem('email', response.data.email || '');

            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);


    return (
        <section style={{ backgroundColor: "#eee" }}>
            <div className="container" style={{ paddingBottom: 50, paddingTop: 30 }}>
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{ borderRadius: 25 }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 d-flex flex-column align-items-center">
                                        <img
                                            src="/static/Resources/Logo.png"
                                            className="img-fluid"
                                            alt="Logo"
                                            style={{ width: "25%" }}
                                        />
                                    </div>
                                </div>
                                <p className="text-center h4 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                                    THÔNG TIN THÀNH VIÊN EOB CỦA TÔI
                                </p>
                                <form>
                                    <div className="row justify-content-between px-2">
                                        <div className="col-md-10 col-lg-6 col-xl-5 order-1 order-lg-2">
                                            <p>
                                                <b style={{ paddingRight: 20 }}>Thành viên Star</b> Yêu cầu thăng hạng đang chờ duyệt
                                            </p>

                                            {/* Display User Information */}
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="uname">Name</label>
                                                <input
                                                    type="text"
                                                    id="uname"
                                                    className="form-control"
                                                    value={username}
                                                    readOnly // Make the field read-only
                                                />
                                            </div>

                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="email">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="form-control"
                                                    value={email || ""}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>

                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="phone">Điện thoại*</label>
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    className="form-control"
                                                    value={phone || ""}
                                                    onChange={(e) => setPhone(e.target.value)}

                                                />
                                            </div>

                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="field">Lĩnh vực</label>
                                                <input
                                                    type="text"
                                                    id="field"
                                                    className="form-control"
                                                    value={""}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-10 col-lg-5 col-xl-6 order-1 order-lg-2 mt-4">
                                            {/* Profile Image Section */}
                                            <div className="row pt-4">
                                                <label><b>Hình đại diện (W 350 x H 150 pixel)</b></label>
                                            </div>
                                            <div
                                                className="row pt-4 justify-content-center"
                                                style={{ width: "fit-content", position: "relative" }}
                                            >
                                                <img
                                                    src={image}
                                                    className="img-fluid rounded-circle"
                                                    alt="PFP"
                                                    id="profilePic"
                                                    style={{
                                                        width: 120,
                                                        height: 120,
                                                        backgroundColor: "#EE1D47",
                                                    }}
                                                />
                                                <img
                                                    src="/static/Resources/Camera.png"
                                                    alt="camera"
                                                    className="position-absolute"
                                                    style={{ width: 60, bottom: 10, right: 30, cursor: "pointer" }}
                                                    onClick={() => document.getElementById("fileInput").click()}
                                                />
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    style={{ display: "none" }}
                                                    accept="image/*"
                                                    onChange={previewImage}
                                                />
                                            </div>

                                            {/* Additional Information */}
                                            <div className="row pt-4">
                                                <ul>
                                                    <li>Điền đầy đủ thông tin để tham gia các hoạt động của EOB dành cho thành viên</li>
                                                </ul>
                                                <p>Tổng điểm: 0 (tải các family / tài liệu tính phí)</p>
                                                <p><b>Đổi mật khẩu</b></p>
                                            </div>
                                        </div>

                                        {/* Update Button */}
                                        <div className="d-flex justify-content-center order-3 mt-5">
                                            <button
                                                type="button"
                                                className="btn btn-primary px-4"
                                                onClick={handleUpdate}
                                            >
                                                Cập nhật
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
