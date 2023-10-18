import React from 'react';
import ProfileDropdown from './ProfileDropdown';
function NavBar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <img className="me-1" src={require('../images/logo.png')} width="50" height="50" alt="SongSnap Logo" style={{borderRadius: '50%'}}/>
                    <a className="navbar-brand" href="#">SongSnap</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item"><button className="btn btn-primary mx-2">Upload Story</button></li>
                            <li className="nav-item"><button className="btn btn-primary mx-2">Upload Prompt</button></li>
                            <li className="nav-item mx-2">
                                <ProfileDropdown/>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar;
