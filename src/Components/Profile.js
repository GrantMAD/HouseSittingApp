import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobile, faEnvelope, faCalendar, faVenusMars, faClock, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Profile = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState()
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const updatedProfileImage = location.state && location.state.updatedProfileImage;

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's basic information
        const usersCollectionRef = collection(db, 'users');
        const userQuery = query(usersCollectionRef, where("email", "==", user.email));
        const userData = await getDocs(userQuery);
        setUsers(userData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        // Fetch user's reviews data
        if (!userData.empty) {
          const userDoc = userData.docs[0];
          const reviewsCollectionRef = collection(userDoc.ref, 'reviews');
          const reviewsSnapshot = await getDocs(reviewsCollectionRef);
          const reviewsData = reviewsSnapshot.docs.map((doc) => doc.data());
          setReviews(reviewsData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  const editProfile = () => {
    navigate('/ProfileForm');
  }

  const deleteAccount = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      await deleteUser(auth.currentUser);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const socialMediaIcons = {
    facebook: faFacebook,
    twitter: faTwitter,
    instagram: faInstagram,
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-10  mx-auto bg-zinc-200">
      <div className="p-4 md:p-8 lg:p-16">
        {users.map((user) => {
          return <div
            className="p-8 bg-white shadow mt-24 border border-blue-600 rounded-lg"
            key={user.id}
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0 pl-32">
                <div className="relative">

                </div>
              </div>
              <div className="relative">
                <div
                  className="w-48 h-48 bg-indigo-100 mx-auto rounded-full drop-shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center"
                >
                  <img
                    src={updatedProfileImage || localStorage.getItem('profileImage') || "/images/profileAvatar.png"}
                    alt=""
                    className="w-48 h-48 rounded-full border border-blue-600"
                  />
                </div>
              </div>

              <div className="space-x-8 lg:space-x-8 md:space-x-2 flex justify-center mt-32 mr-14 md:mt-0 md:justify-center lg:justify-end lg:mr-5">
                <button
                  className="text-white py-2 px-4 uppercase rounded bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 hover:scale-105 shadow hover:shadow-lg font-medium ml-[60px] lg:ml-0"
                  onClick={editProfile}
                >
                  Edit Profile
                </button>
                <div
                  className="relative inline-block"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <button
                    className="bg-gradient-to-l from-red-500 to-red-600 hover:bg-gradient-to-r hover:scale-105 hover:drop-shadow-2xl text-white font-bold py-2 px-4 rounded shadow-xl"
                    onClick={async () => {
                      deleteAccount(user.id);
                    }}
                  >
                    Delete Account
                  </button>
                  {showTooltip && (
                    <div className="absolute bg-zinc-200 rounded-md px-2 py-1 text-gray-800 border border-gray-800 mt-2 whitespace-nowrap mr-32 -right-32 font-semibold">
                      By clicking Delete Account you will be deleting your account from our database.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:mt-20 border-b pb-10 md:mt-16">
              <h1 className="text-4xl font-medium text-gray-800 underline underline-offset-3">{user.name}</h1>
              <div className="flex flex-col lg:px-32">
                <div className="lg:text-start">
                  <h1 className="text-2xl font-semibold underline underline-offset-4 decoration-blue-700 mt-3">User information</h1>
                  <div className="flex flex-col lg:flex-row">
                    <div> 
                      <div className="mt-5">
                        <h1 className="mb-3 text-lg font-semibold underline underline-offset-4 decoration-blue-700">Contact information</h1>
                        {user.number && (
                          <div>
                            <h1 className="text-black font-semibold underline underline-offset-4 decoration-2 decoration-gray-800">
                              <FontAwesomeIcon icon={faMobile} className="text-blue-600 mr-3" />
                              Cell Number:
                            </h1>
                            <p className="text-gray-800">{user.number}</p>
                          </div>
                        )}
                        <div>
                          <h1 className="text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-gray-800">
                            <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 mr-3" />
                            Email:
                          </h1>
                          <p className="text-gray-800">{user.email}</p>
                        </div>
                      </div>
                      {user.gender || user.dateOfBirth ? (
                        <div className="mt-5">
                          <h1 className="mb-3 text-lg font-semibold underline underline-offset-4 decoration-blue-700">Personal information</h1>
                          {user.dateOfBirth && (
                            <div>
                              <h1 className="text-black font-semibold underline underline-offset-4 decoration-2 decoration-gray-800">
                                <FontAwesomeIcon icon={faCalendar} className="text-blue-600 mr-3" />
                                Date of birth:
                              </h1>
                              <p className="text-gray-800">{user.dateOfBirth || "None"}</p>
                            </div>
                          )}
                          {user.gender && (
                            <div>
                              <h1 className="text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-gray-800">
                                <FontAwesomeIcon icon={faVenusMars} className="text-blue-600 mr-2" />
                                Gender:
                              </h1>
                              <p className="text-gray-800">{user.gender || "None"}</p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="lg:ml-20">
                      <div className="mt-5">
                        <h1 className="mb-3 text-lg font-semibold underline underline-offset-4 decoration-blue-700">Account information</h1>
                        <div>
                          <h1 className="text-black font-semibold underline underline-offset-4 decoration-2 decoration-gray-800">
                            <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-3" />
                            Member since:
                          </h1>
                          <p className="text-gray-800">{user.memberSince}</p>
                        </div>
                        <div>
                          <h1 className="text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-gray-800">
                            <FontAwesomeIcon icon={faIdCard} className="text-blue-600 mr-3" />
                            User Id:
                          </h1>
                          <p className="text-gray-800">{user.userId}</p>
                        </div>
                      </div>
                    </div>
                    {Object.keys(user.socialMediaLinks).length > 0 && (
                      <div className="flex flex-col lg:items-start items-center lg:ml-20 mt-5">
                        <h1 className="mb-3 text-lg font-semibold underline underline-offset-4 decoration-blue-700">Social Media</h1>
                        {Object.entries(user.socialMediaLinks).map(([platform, link]) => (
                          <div key={platform} className="flex items-center mt-2">
                            <FontAwesomeIcon
                              icon={socialMediaIcons[platform]}
                              className="text-blue-600 mr-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => window.open(link, '_blank')}
                            />
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-800 hover:underline"
                            >
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-col text-center">
                <h1 className="font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-blue-700 text-center mb-5">About Me</h1>
                <p className="text-gray-800 lg:px-16">{user.about || "None"}</p>
              </div>
            </div>
            <div className="mt-5">
              <h1 className="font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-blue-700 text-center mb-3">Your Reviews</h1>
              <div className='mt-5'>
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-500">User currently has no reviews</p>
                ) : (
                  reviews.map((review, index) => (
                    <div key={index} className='flex flex-col items-center justify-center mb-3'>
                      <div className='flex justify-center items-center mb-3'>
                        <img
                          src={review.reviewerProfileImage}
                          alt=""
                          className='rounded-full h-8 w-8 mr-2'
                        />
                        <h1 className="font-semibold">{review.reviewerName}</h1>
                      </div>
                      <p className="mb-3">{review.text}</p>
                      <p className="text-gray-500 ml-2">
                        Posted on {new Date(review.timestamp.toMillis()).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        })}
      </div>

    </div>
  )
}

export default Profile;