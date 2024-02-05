import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import { getDocs, collection, query, where, doc, deleteDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const updatedProfileImage = location.state && location.state.updatedProfileImage;
  const [isUserAuthenticated, setUserAuthenticated] = useState(false);
  const [isImageDropdownOpen, setImageDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isAdminPanelOpen, setAdminPanelOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const AdminNotification = ({ message, notificationId, destination, buttonLabel, handleNotificationClick, title }) => {
    return (
      <>
        <div className="underline mb-2">{title}</div>
        <div>{message}</div>
        <button className="bg-blue-700 text-white font-semibold p-2 rounded-md mt-2" onClick={() => handleNotificationClick(notificationId, destination)}>
          {buttonLabel || "View"}
        </button>
      </>
    );
  };

  const UserNotification = ({ message, title, notificationId, destination, handleNotificationClick }) => {
    return (
      <>
        <div className="underline mb-2">{title}</div>
        <div>{message}</div>
        <button className="bg-green-500 text-white font-semibold p-2 rounded-md mt-2 w-24" onClick={() => handleNotificationClick(notificationId, destination)}>
          <FontAwesomeIcon icon={faLongArrowAltRight} className="mr-2" />
        </button>
      </>
    );
  };

  const ReviewNotification = ({ message, title, notificationId, destination, handleNotificationClick }) => {
    return (
      <>
        <div className="underline mb-2">{title}</div>
        <div>{message}</div>
        <button className="bg-green-500 text-white font-semibold p-2 rounded-md mt-2 w-24" onClick={() => handleNotificationClick(notificationId, destination)}>
          <FontAwesomeIcon icon={faLongArrowAltRight} className="mr-2" />
        </button>
      </>
    );
  };


  const toggleImageDropdown = () => {
    setImageDropdownOpen(!isImageDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAdminPanel = () => {
    setAdminPanelOpen(!isAdminPanelOpen);
  };

  const toggleNotification = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && userRole) {
      const userDocRef = collection(db, 'users');
      const userDocSnap = await getDocs(query(userDocRef, where('email', '==', user.email)));

      if (userDocSnap.size > 0) {
        const userData = userDocSnap.docs[0].data();
        const userRole = userData.role || '';

        setNotificationOpen(!isNotificationOpen);

        try {
          let combinedNotifications = [];

          // If user has a role of Admin, fetch admin notifications
          if (userRole === 'Admin') {
            const adminNotificationsRef = collection(db, "adminNotifications");
            const adminQuerySnapshot = await getDocs(adminNotificationsRef);
            combinedNotifications = adminQuerySnapshot.docs.map(doc => doc.data());
          }

          // Fetch user's notifications
          const userNotificationsRef = collection(userDocSnap.docs[0].ref, 'notifications');
          const userQuerySnapshot = await getDocs(userNotificationsRef);
          const userNotificationsData = userQuerySnapshot.docs.map(doc => doc.data());

          // Combine admin and user notifications
          combinedNotifications = [...combinedNotifications, ...userNotificationsData];

          // Update state with combined notifications
          setNotifications(combinedNotifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    }
  };


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUserAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUserAuthenticated(!!user);

      if (user) {
        try {
          const userDocRef = collection(db, 'users');
          const userDocSnap = await getDocs(query(userDocRef, where('email', '==', user.email)));

          if (userDocSnap.size > 0) {
            const userData = userDocSnap.docs[0].data();
            setUserDisplayName(userData.name || '');
            setUserRole(userData.role || '');

            localStorage.setItem("profileImage", userData.profileImage);
            localStorage.setItem("userDisplayName", userData.name || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserDisplayName('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        // Check if user is authenticated and has a role
        if (user && userRole) {
          // Fetch user's role from the database
          const userDocRef = collection(db, 'users');
          const userDocSnap = await getDocs(query(userDocRef, where('email', '==', user.email)));

          if (userDocSnap.size > 0) {
            const userData = userDocSnap.docs[0].data();
            const userRole = userData.role || '';
            let count = 0;

            // Fetch notification count from adminNotifications if user is admin
            if (userRole === 'Admin') {
              const adminNotificationsRef = collection(db, "adminNotifications");
              const adminQuerySnapshot = await getDocs(adminNotificationsRef);
              count += adminQuerySnapshot.size;
            }

            // Fetch notification count from user's notifications sub-collection
            const userNotificationsRef = collection(userDocSnap.docs[0].ref, 'notifications');
            const userNotificationsSnapshot = await getDocs(userNotificationsRef);
            count += userNotificationsSnapshot.size;

            // Update notification count state
            setNotificationCount(count);
          }
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
  }, [userRole]);


  const handleNotificationClick = async (notificationId, destination) => {
    try {
      navigate(destination);

      await deleteNotification(notificationId);

      setNotifications(prevNotifications => prevNotifications.filter(notification => notification.notificationId !== notificationId));
      setNotificationCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const notificationsRef = collection(db, "adminNotifications");
      await deleteDoc(doc(notificationsRef, notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteUserNotification = async (notificationId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = collection(db, 'users');
      const userDocSnap = await getDocs(query(userDocRef, where('email', '==', user.email)));
      if (userDocSnap.size === 0) return;

      const userNotificationsRef = collection(userDocSnap.docs[0].ref, 'notifications');
      await deleteDoc(doc(userNotificationsRef, notificationId));

      // Optionally, you can also update the local state to reflect the deletion
      setNotifications(prevNotifications => prevNotifications.filter(notification => notification.notificationId !== notificationId));
      setNotificationCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error deleting user notification:", error);
    }
  };

  const handleUserNotificationClick = async (notificationId) => {
    try {
      await deleteUserNotification(notificationId);
    } catch (error) {
      console.error("Error handling user notification click:", error);
    }
  };



  return (
    <nav class="fixed w-full bg-white drop-shadow-lg border-b border-blue-700 z-10">
      <div class="px-2 sm:px-6 lg:px-10">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex justify-between w-full">
            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <a href="/">
                <div class="flex flex-shrink-0 items-center">
                  <img class="h-8 w-auto mr-3 hover:scale-125" src="/images/Landingpageimage.png" alt="" />
                  <h1 className="text-blue-600 text-2xl font-semibold font-mono tracking-wide">HouseSittingApp</h1>
                </div>
              </a>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <a href="/" class="text-black hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Home</a>
                  <a href="/AboutUs" class="text-black hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium">About us</a>
                  <a href="/ContactUs" class="text-black hover:bg-blue-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Contact us</a>
                  <a href="/Sitters" class="text-white bg-blue-600 hover:bg-white hover:border-2 border-blue-600 hover:text-blue-600 rounded-md px-3 py-2 text-sm font-medium">Find a sitter</a>
                </div>
              </div>
            </div>

            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-gray-600 hidden sm:block cursor-pointer"
                  onClick={toggleNotification}
                />
                {notificationCount > 0 && (
                  <span className="absolute hidden sm:block animate-pulse top-0 right-0 transform translate-x-1/2 -translate-y-1/2 lg:flex items-center justify-center lg:h-4 lg:w-4 h-3 w-3 rounded-full bg-red-500 text-white text-xs">{notificationCount}</span>
                )}
                {isNotificationOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-700 pt-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-start" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                    <h1 className='text-white font-semibold mb-1 pl-4'>Notifications</h1>
                    {notifications.map((notification, index) => (
                      <div key={index} className="px-4 py-2 text-sm text-white border-t border-white flex flex-col justify-between items-center">
                        {notification.type === 'adminNotification' ? (
                          <AdminNotification
                            title={notification.title}
                            message={notification.message}
                            notificationId={notification.notificationId}
                            destination={notification.destination}
                            buttonLabel={notification.buttonLabel}
                            handleNotificationClick={handleNotificationClick}
                          />
                        ) : notification.type === 'userNotification' ? (
                          <UserNotification
                            title={notification.title}
                            message={notification.message}
                            notificationId={notification.notificationId}
                            destination={notification.destination}
                            buttonLabel={notification.buttonLabel}
                            handleNotificationClick={handleUserNotificationClick}
                          />
                        ) : notification.type === 'reviewNotification' ? (
                          <ReviewNotification
                            title={notification.title}
                            message={notification.message}
                            notificationId={notification.notificationId}
                            destination={notification.destination}
                            buttonLabel={notification.buttonLabel}
                            handleNotificationClick={handleUserNotificationClick}
                          />
                        ) : (
                          <span>Unknown notification type</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="hidden relative rounded-full p-1 text-gray-800 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={toggleImageDropdown}
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              <div>
                {isUserAuthenticated ? (
                  <div className="relative ml-3">
                    <div>
                      <button
                        type="button"
                        className="relative flex rounded-full text-sm focus:outline-none"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        onClick={toggleImageDropdown}
                      >
                        <div className="flex items-center">
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full border border-blue-700 hover:scale-125 hover:border-2"
                            src={updatedProfileImage || localStorage.getItem('profileImage') || "/images/profileAvatar.png"}
                            alt="" />
                          <div className="flex flex-col items-start">
                            <span className="ml-3 text-gray-800 font-semibold">Welcome back,</span>
                            <h1 className="ml-3 font-bold text-blue-700">{`${userDisplayName}`}</h1>
                          </div>
                        </div>
                      </button>
                    </div>
                    {isImageDropdownOpen && (
                      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white pt-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                        <a href="/Profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-700 hover:text-white" role="menuitem" tabIndex="-1" id="user-menu-item-0">Your Profile</a>
                        {isUserAuthenticated && userRole === 'Admin' && (
                          <div className={`relative ${isAdminPanelOpen ? 'border border-blue-700' : ''}`}>
                            <button
                              type="button"
                              className="block text-black hover:text-white hover:bg-blue-700 px-3 py-2 text-sm w-full"
                              onClick={toggleAdminPanel}
                            >
                              Admin Panel
                            </button>
                            {isAdminPanelOpen && (
                              <div className="bg-zinc-100">
                                <a href="/Requests" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white" role="menuitem">Requests</a>
                                <a href="/Users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white" role="menuitem">Users</a>
                              </div>
                            )}
                          </div>
                        )}
                        <a href="/"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-700 hover:text-white" role="menuitem" tabIndex="-1" id="user-menu-item-0"
                          onClick={handleLogout}
                        >Logout</a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <button
                      className="text-blue-600 hover:bg-blue-600 hover:text-white hover:border-2 border-blue-600 font-semibold px-3 py-2 rounded-md mr-3"
                      onClick={() => navigate("/SignIn")}
                    >
                      Log In
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-white hover:border-2 border-blue-600 hover:text-blue-600 text-white font-semibold px-3 py-2 rounded-md"
                      onClick={() => navigate("/SignUp")}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <a href="/" className="text-black hover:bg-blue-600 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Home</a>
          <a href="/AboutUs" className="text-black hover:bg-blue-600 hover:text-white block rounded-md px-3 py-2 text-base font-medium">About us</a>
          <a href="/ContactUs" className="text-black hover:bg-blue-600 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Contact us</a>
          <a href="/Sitters" className="text-white bg-blue-600 hover:bg-white hover:border-2 border-blue-600 hover:text-blue-600 block rounded-md px-3 py-2 text-base font-medium">Find a sitter</a>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
