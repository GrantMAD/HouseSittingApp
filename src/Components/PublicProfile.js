import { db, auth } from '../firebase';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, where, getDocs, query, addDoc, doc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobile, faEnvelope, faCalendar, faVenusMars, faClock, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const PublicProfile = () => {
    const { userUid } = useParams();
    const [userData, setUserData] = useState({});
    const [newReview, setNewReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersCollectionRef = collection(db, 'users');
                const queryCondition = where('uid', '==', userUid);
                const userQuerySnapshot = await getDocs(query(usersCollectionRef, queryCondition));

                if (!userQuerySnapshot.empty) {
                    const userDoc = userQuerySnapshot.docs[0];
                    const userId = userDoc.id;


                    const reviewsCollectionRef = collection(db, 'users', userId, 'reviews');
                    const reviewsQuerySnapshot = await getDocs(reviewsCollectionRef);
                    const reviews = reviewsQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setUserData({ id: userId, ...userDoc.data(), reviews });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };



        if (userUid) {
            fetchUserData();
        }
        
    }, [userUid]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const userDocRef = doc(db, 'users', userData.id);
            const userDocSnapshot = await getDocs(collection(userDocRef, 'reviews'));

            const currentUserData = await getCurrentUserData();

            const timestamp = new Date();

            if (!userDocSnapshot.empty) {
                const newReviewDocRef = await addDoc(collection(userDocRef, 'reviews'), {
                    content: newReview,
                    timestamp: timestamp,
                    username: currentUserData.name,
                    profileImage: currentUserData.profileImage,
                });


                setUserData((prevUserData) => ({
                    ...prevUserData,
                    reviews: [...prevUserData.reviews, { id: newReviewDocRef.id, content: newReview, timestamp: timestamp, username: currentUserData.name, profileImage: currentUserData.profileImage }],
                }));
            } else {
                const newReviewsCollectionRef = await addDoc(collection(userDocRef, 'reviews'), {
                    reviews: [{
                        content: newReview,
                        timestamp: timestamp,
                        username: currentUserData.name,
                        profileImage: currentUserData.profileImage,
                    }],
                });

                setUserData((prevUserData) => ({
                    ...prevUserData,
                    reviews: [{ id: newReviewsCollectionRef.id, content: newReview, timestamp: timestamp, username: currentUserData.name, profileImage: currentUserData.profileImage }],
                }));
            }

            setNewReview('');
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentUserData = async () => {
        try {
            const currentUser = auth.currentUser;

            if (currentUser) {
                const currentUserUid = currentUser.uid;
                const usersCollectionRef = collection(db, 'users');
                const queryCondition = where('uid', '==', currentUserUid);
                const userQuerySnapshot = await getDocs(query(usersCollectionRef, queryCondition));

                if (!userQuerySnapshot.empty) {
                    const currentUserDoc = userQuerySnapshot.docs[0];
                    return { name: currentUserDoc.data().name, profileImage: currentUserDoc.data().profileImage };
                } else {
                    console.error('Current user not found in the users collection.');
                }
            } else {
                console.error('No user is currently signed in.');
                
            }
        } catch (error) {
            console.error('Error fetching current user data:', error);
            
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) {
            return 'No timestamp available';
        }

        if (timestamp instanceof Date) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return timestamp.toLocaleString('en-US', options);
        } else if (timestamp.toDate instanceof Function) {
            const date = timestamp.toDate();
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleString('en-US', options);
        } else {
            return 'Invalid timestamp format';
        }
    };

    const socialMediaIcons = {
        facebook: faFacebook,
        twitter: faTwitter,
        instagram: faInstagram,
    };

    return (
        <main className="min-h-screen p-4 md:p-8 lg:p-10  mx-auto bg-zinc-200">
            {userData && Object.keys(userData).length > 0 ? (
                <div className="p-4 md:p-8 lg:p-16">
                    <div
                        className="p-8 bg-white shadow mt-24 border border-blue-600 rounded-lg"
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
                                        src={"/images/profileAvatar.png"}
                                        alt=""
                                        className="w-48 h-48 rounded-full border border-blue-600"
                                    />
                                </div>
                            </div>

                            <div className="space-x-8 lg:space-x-8 md:space-x-2 flex justify-center mt-32 mr-14 md:mt-0 md:justify-center lg:justify-end lg:mr-5">
                                <button
                                    className="text-white py-2 px-4 uppercase rounded bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 hover:scale-105 shadow hover:shadow-lg font-medium ml-[60px] lg:ml-0"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="lg:mt-20 border-b pb-10 md:mt-16">
                            <h1 className="text-4xl font-medium text-gray-800 underline underline-offset-3">{userData.name}</h1>
                            <div className="flex px-32">
                                <div className="text-start">
                                    <h1 className="text-2xl font-semibold underline underline-offset-4 decoration-blue-700 mt-3">User information</h1>
                                    <div className="flex">
                                        <div>
                                            <div className="mt-5">
                                                <h1 className="mb-3 text-lg font-semibold underline underline-offset-4 decoration-blue-700">Contact information</h1>
                                                <div>
                                                    <h1 className="text-black font-semibold underline underline-offset-4 decoration-2 decoration-gray-800">
                                                        <FontAwesomeIcon icon={faMobile} className="text-blue-600 mr-3" />
                                                        Cell Number:</h1>
                                                    <p className="text-gray-800">{userData.number}</p>
                                                </div>
                                                <div>
                                                    <h1 className="text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-gray-800">
                                                        <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 mr-3" />
                                                        Email:</h1>
                                                    <p className="text-gray-800">{userData.email}</p>
                                                </div>
                                            </div>
                                            <div className="mt-5">

                                                <h1 className="mb-3 text-lg font-semibold underline underline-offset-4 decoration-blue-700">Personal information</h1>
                                                <div>
                                                    <h1 className="text-black font-semibold underline underline-offset-4 decoration-2 decoration-gray-800">
                                                        <FontAwesomeIcon icon={faCalendar} className="text-blue-600 mr-3" />
                                                        Date of birth:</h1>
                                                    <p className="text-gray-800">{userData.dateOfBirth}</p>
                                                </div>
                                                <div>
                                                    <h1 className="text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-gray-800">
                                                        <FontAwesomeIcon icon={faVenusMars} className="text-blue-600 mr-2" />
                                                        Gender:</h1>
                                                    <p className="text-gray-800">{userData.gender}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-20">
                                            <div className="mt-5">
                                                <h1 className="mb-3 text-lg font-semibold underline underline-offset-4 decoration-blue-700">Account information</h1>
                                                <div>
                                                    <h1 className="text-black font-semibold underline underline-offset-4 decoration-2 decoration-gray-800">
                                                        <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-3" />
                                                        Member since:</h1>
                                                    <p className="text-gray-800">{userData.memberSince}</p>
                                                </div>
                                                <div>
                                                    <h1 className="text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-gray-800">
                                                        <FontAwesomeIcon icon={faIdCard} className="text-blue-600 mr-3" />
                                                        User Id:</h1>
                                                    <p className="text-gray-800">{userData.userId}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-20 mt-5">
                                            {Object.keys(userData.socialMediaLinks).length > 0 && (
                                                <div>
                                                    <h1 className="mb-3 text-lg font-semibold underline underline-offset-4 decoration-blue-700">Social Media</h1>
                                                    {Object.entries(userData.socialMediaLinks).map(([platform, link]) => (
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
                            </div>
                            <div className="mt-3 flex flex-col text-center">
                                <h1 className="font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-blue-700 text-center mb-5">About Me</h1>
                                <p className="text-gray-800 lg:px-16">{userData.about}</p>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col justify-center">

                            <div className="p-4 md:p-8 lg:p-16 lg:pt-6">
                                <div className="mt-3 flex flex-col justify-center">
                                    <h1 className="text-2xl text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-blue-700 text-center">
                                        User Reviews
                                    </h1>
                                    <div>
                                        <form onSubmit={handleReviewSubmit} className="mt-5">
                                            <label htmlFor="newReview" className="text-lg">
                                                Add a Review for {userData.name}
                                            </label>
                                            <textarea
                                                id="newReview"
                                                value={newReview}
                                                onChange={(e) => setNewReview(e.target.value)}
                                                className="w-full h-32 p-2 border border-gray-300 rounded-md mt-3"
                                                required
                                            />
                                            {isLoading ? (
                                                <div className="inline-block animate-spin rounded-full border-t-4 border-blue-800 border-solid h-8 w-8"></div>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 font-semibold text-white px-4 py-2 mt-3 rounded-md"
                                                >
                                                    Submit
                                                </button>
                                            )}
                                        </form>
                                    </div>
                                    {userData.reviews && userData.reviews.length > 0 && (
                                        <div className="mt-5">
                                            {userData.reviews.map((review) => (
                                                <div key={review.id} className="mb-4">
                                                    <div className="flex justify-center text-lg mb-1">
                                                        <img
                                                            src={review.profileImage || "/images/profileAvatar.png"}
                                                            alt="Profile"
                                                            className="w-8 h-8 rounded-full mr-2"
                                                        />
                                                        <span className="font-semibold">{review.username}</span>
                                                    </div>
                                                    <h1 className="text-gray-500 text-sm">{formatTimestamp(review.timestamp)}</h1>
                                                    <p>{review.content !== undefined ? String(review.content) : 'No content available'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </main>
    )
}

export default PublicProfile;