import LandingPage from './Components/LandingPage';
import Nav from './Components/Nav';
import Profile from './Components/Profile'
import Footer from './Components/Footer';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './Components/signup.js';
import SignIn from './Components/SignIn.js';
import ProfileForm from './Components/ProfileForm.js';
import ContactUs from './Components/ContactUs.js';
import AboutUs from './Components/AboutUs.js';
import Register from './Components/Register.js';
import Sitters from './Components/Sitters.js';
import Requests from './Components/Requests.js';
import PublicProfile from './Components/PublicProfile.js';
import React from 'react';
import { useState } from 'react';
import './App.css';

function App() {

  const [showNav, setShowNav] = useState(true);
  return (
    <div className="App">
    <BrowserRouter>
      { showNav &&
        <Nav />
      }
        <Routes>
        <Route path="/" element={ <LandingPage/>} />
        <Route path="/ContactUs" element={ <ContactUs/>} />
        <Route path="/AboutUs" element={ <AboutUs/>} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Requests" element={<Requests />} />
        <Route path="/Sitters" element={<Sitters />} />
        <Route path="/SignUp" element={<SignUp funcNav={setShowNav}/>} />
        <Route path="/SignIn" element={<SignIn funcNav={setShowNav}/>} />
        <Route path="/ProfileForm" element={<ProfileForm/>} />
        <Route path="/PublicProfile/:userUid" element={<PublicProfile/>} />
        </Routes>
      { showNav &&
        <Footer/>
      }
      </BrowserRouter>
    </div>
  );
}

export default App;
