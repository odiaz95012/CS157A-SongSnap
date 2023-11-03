import React, { useEffect } from 'react';
import NavBar from "../components/NavBar";

function Settings() {
    // useEffect(() => {
    //     const cookies = document.cookie;
    //     console.log('All cookies:', cookies);
    //
    //     // Retrieve a specific cookie by name
    //     const specificCookie = cookies('login');
    //     console.log('Value of "yourCookieName" cookie:', specificCookie);
    // }, []);

    const profileImage = {
        width: '100%'
    };

    return (
        <>
            <NavBar />
            <div className='container mt-3'>
                <h1 className='fw-bold text-center'>Account Settings</h1>
                <ul className='nav nav-pills nav-justified mt-4' id='myTab' role='tablist'>
                    <li className='nav-item' role='presentation'>
                        <button className='nav-link active' id='home-tab' data-bs-toggle='tab' data-bs-target='#home-tab-pane' type='button' role='tab' aria-controls='home-tab-pane' aria-selected='true'>Home</button>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <button className='nav-link' id='profile-tab' data-bs-toggle='tab' data-bs-target='#profile-tab-pane' type='button' role='tab' aria-controls='profile-tab-pane' aria-selected='false'>Profile</button>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <button className='nav-link' id='contact-tab' data-bs-toggle='tab' data-bs-target='#contact-tab-pane' type='button' role='tab' aria-controls='contact-tab-pane' aria-selected='false'>Contact</button>
                    </li>
                    <li className='nav-item' role='presentation'>
                        <button className='nav-link' id='disabled-tab' data-bs-toggle='tab' data-bs-target='#disabled-tab-pane' type='button' role='tab' aria-controls='disabled-tab-pane' aria-selected='false' disabled>Disabled</button>
                    </li>
                </ul>
                <div className='tab-content' id='myTabContent'>
                    <div className='tab-pane fade show active' id='home-tab-pane' role='tabpanel' aria-labelledby='home-tab' tabIndex={0}>
                        <div className='row mt-4'>
                            <div className='col-12 col-lg-4 mb-4'>
                                <img className='img-fluid square-img w-100' src='https://costionline.com/icons/profile-photos/4.webp' />
                            </div>
                            <div className='col-12 col-lg-8'>
                                <form action="/submit" method="post">
                                    <div className="mb-3">
                                        <label htmlFor="formFile" className="form-label">Upload profile photo</label>
                                        <input className="form-control" type="file" id="formFile" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="username">Username:</label>
                                        <input type="text" className="form-control" id="username" name="username" placeholder="Enter username" />
                                    </div>

                                    <div className="form-group mt-3">
                                        <label htmlFor="email">Email address:</label>
                                        <input type="email" className="form-control" id="email" name="email" placeholder="Enter email" />
                                    </div>

                                    <div className="form-group mt-3">
                                        <label htmlFor="password">Password:</label>
                                        <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
                                    </div>

                                    <button type="submit" className="btn btn-primary mt-3">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className='tab-pane fade' id='profile-tab-pane' role='tabpanel' aria-labelledby='profile-tab' tabIndex={0}>2</div>
                    <div className='tab-pane fade' id='contact-tab-pane' role='tabpanel' aria-labelledby='contact-tab' tabIndex={0}>3</div>
                    <div className='tab-pane fade' id='disabled-tab-pane' role='tabpanel' aria-labelledby='disabled-tab' tabIndex={0}>4</div>
                </div>
            </div>
        </>
    );
}


export default Settings;
