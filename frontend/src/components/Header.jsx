import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { isLoggedIn, username, logout } = useContext(AuthContext);  // Get values from AuthContext
    const navigate = useNavigate();


    const handleLogout = async () => {
        try {
            // Call the logout function from AuthContext
            await logout();
            navigate('/EOB/Login');  // Redirect to login page after logout
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <nav className="sticky-nav" style={{ border: '1px solid black' }}>
            <div className="row text-white align-items-center" style={{ fontSize: '13px', paddingLeft: '30px', paddingRight: '30px', backgroundColor: '#1c2d5a' }}>
                <div className="res_remove col-6 d-flex align-items-center" style={{ textAlign: 'left' }}>
                    <div className="res_remove col-sm-3 p-1">
                        <Link to="/EOB" style={{ color: 'white' }}>Công trình tiêu biểu</Link>
                    </div>
                    <div className="res_remove col-sm-1 p-1">
                        <Link to="/EOB/" style={{ color: 'white' }}>Tin Tức</Link>
                    </div>
                </div>

                <div className="black_nav col-6 d-flex justify-content-end align-items-center" style={{ textAlign: 'right' }}>
                    {!isLoggedIn ? (
                        <>
                            <div className="col-sm-3 p-1">
                                <Link to="/EOB/Member" style={{ color: 'white' }}>Đăng Ký Thành Viên</Link>
                            </div>

                            <div className="col-sm-2 p-1">
                                <Link to="/EOB/VLXD" style={{ color: 'white' }}>VLXD Đăng Ký</Link>
                            </div>

                            <div className="col-sm-2 p-1">
                                <Link to="/EOB/Login" style={{ color: 'white' }}>Đăng Nhập</Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="col-sm-3 p-1">
                                <Link to="/EOB/Profile" style={{ color: 'white' }}>
                                    {username} {/* Display username from context */}
                                </Link>
                            </div>

                            <div className="col-sm-3 p-1">
                                <button
                                    onClick={handleLogout}
                                    style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    )}

                    <div className="col-sm-2 p-1 dropdown">
                        <button type="button" className="btn dropdown-toggle text-white w-100" style={{ backgroundColor: '#1c2d5a' }}>
                            <img src="/static/Resources/Vie.png" alt="Viet flag" /> Vi
                        </button>
                    </div>

                </div>
            </div>

            <div className="header-row row bg-white text-dark align-items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="white_nav logo col-sm-1 p-3" style={{ marginLeft: '20px' }}>
                    <Link to="/EOB/">
                        <img src="/static/Resources/Logo.png" alt="EOB logo" width="120" height="60" />
                    </Link>
                </div>

                <div className="lib_model res_remove col-sm-2 p-4 dropdown" style={{ textAlign: 'right' }}>
                    <button
                        className="dropdown-toggle text-dark"
                        style={{ textDecoration: 'none', background: 'none', border: 'none' }}
                        id="dropdownMenuLink"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <b>THƯ VIỆN MODEL</b>
                    </button>
                    <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="/EOB/Library">Tất cả thư viện</Link></li>
                        <li><Link className="dropdown-item" to="/EOB/">Thư viện EOB</Link></li>
                        <li><Link className="dropdown-item" to="/EOB/">Thư viện VLXD</Link></li>
                    </ul>
                </div>

                <div className="button_toggle white_nav button col-sm-2 d-flex align-items-center justify-content-center">
                    <Link to="/EOB/Library" className="btn btn-primary p-2 d-flex align-items-center justify-content-center " style={{ width: '50px', height: '50px' }}>
                        <i class="bi bi-folder-fill"></i>
                    </Link>
                </div>


                <form className="white_nav search col-sm-3 p-4" style={{ marginLeft: 'auto' }}>
                    <div className="input-group">
                        <input className="form-control" type="text" placeholder="Tìm kiếm" style={{ borderRadius: '25px 0 0 25px', border: '2px solid lightgray' }} />
                        <span className="input-group-text" style={{ borderRadius: '0 25px 25px 0', border: '2px solid lightgray' }}>
                            <i className="bi bi-search"></i>
                        </span>
                    </div>
                </form>
            </div>
        </nav>
    );
};

export default Header;
