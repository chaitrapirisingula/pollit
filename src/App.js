import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorPage from './Pages/ErrorPage';
import HostSession from './Pages/HostSession';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import UserSession from './Pages/UserSession';
import './Design/App.css';

/**
 * Routes for all pages on the web-app.
 * 
 * @returns pollit app
 */
function App() {

  /**
   * Determines if screen is in mobile view.
   */
  const mql = window.matchMedia('(max-width: 1000px)');
  mql.addEventListener('change', (e) => {
      setMobileView(e.matches);
  });
  const [mobileView, setMobileView] = useState(mql.matches);

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/profile' element={<Profile mobileView={mobileView}/>} />
          <Route path='/host/session' element={<HostSession mobileView={mobileView}/>} />
          <Route path='/user/session' element={<UserSession mobileView={mobileView}/>} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;