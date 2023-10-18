import React, { useState } from 'react'
import '../styles/HomeStyles.css';
import NavBar from '../components/NavBar';

function Home() {
  const [activeView, setActiveView] = useState('main-feed');

  const handleActiveFeedChange = (view) => {
    setActiveView(view);
  };
  return (
    <div>
      <NavBar />
      <header className="bg-dark py-5">
        <div className="container px-5">
          <div className="row gx-5 justify-content-center">
            <div className="col-lg-6">
              <div className="text-center my-5">
                <h1 className="display-5 fw-bolder text-white mb-2">Prompt of the Day</h1>
                <p className="lead text-white-50 mb-4">INSERT PROMPT HERE</p>
                <div className="d-grid gap-4 d-sm-flex justify-content-sm-center">
                      <button className="btn btn-primary">Upload SongSnap</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Stories Container */}
      <div className="container justify-content-center mt-3">
        <div className="d-flex justify-content-start">
          <h3>Stories</h3>
        </div>
        <div className="scrolling-container d-flex justify-content-center">
          {/*Place holders for now*/}
          {Array.from({ length: 15 }).map((_, index) => (
            <div className="scrolling-content" key={index}>
              <img className="avatar" src={require('../images/logo.png')} alt={`Logo ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      {/* Feed Container */}
      <div className="d-flex-1 text-center justify-content-center align-items-center mt-3">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h1>SongSnap</h1>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 mb-4 justify-content-center">
            <nav className="navbar navbar-expand-lg navbar-light justify-content-center ">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className={`nav-link ${activeView === 'main-feed' ? 'active' : ''}`} href="#main-feed" onClick={() => handleActiveFeedChange('main-feed')}>Main Feed</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ${activeView === 'friends-feed' ? 'active' : ''}`} href="#friends-feed" onClick={() => handleActiveFeedChange('friends-feed')}>Friends Feed</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="container text-start">
        {/* Main Feed View */}
        <div id="main-feed" className={`view ${activeView === 'main-feed' ? 'active-view' : ''}`}>
          <div className="container">
            <h1>Main Feed</h1>
            {/* Add main feed content here */}
          </div>
        </div>

        {/* Friends Feed View */}
        <div id="friends-feed" className={`view ${activeView === 'friends-feed' ? 'active-view' : ''}`}>
          <div className="container">
            <h1>Friends Feed</h1>
            {/* Add friends feed content here */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home