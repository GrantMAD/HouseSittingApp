import { db } from '../firebase';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, Timestamp, onSnapshot, updateDoc, arrayUnion, getDoc, doc, setDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobile, faEnvelope, faCalendar, faVenusMars, faClock, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const PublicProfile = () => {
    const { userUid } = useParams();
    const [userData, setUserData] = useState({});
    const [newReview, setNewReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();
    const [showFeedback, setShowFeedback] = useState(false);
    const [starsHovered, setStarsHovered] = useState(0);
    const [alreadyRatedMessageVisible, setAlreadyRatedMessageVisible] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersCollectionRef = collection(db, 'users');
                const userQuerySnapshot = await getDocs(query(usersCollectionRef, where('uid', '==', userUid)));

                if (!userQuerySnapshot.empty) {
                    const userDoc = userQuerySnapshot.docs[0];
                    setUserData({ id: userDoc.id, ...userDoc.data() });

                    // Assuming the user's ratings are stored as an array in the 'ratings' field
                    const averageRating = calculateAverageRating(userDoc.data().ratings);

                    // Use the calculated average rating directly
                    console.log('Average Rating:', averageRating);

                    // Listen for changes in the "reviews" sub-collection
                    const reviewsCollectionRef = collection(userDoc.ref, 'reviews');
                    const unsubscribe = onSnapshot(reviewsCollectionRef, (snapshot) => {
                        const reviewsData = snapshot.docs.map((doc) => doc.data());
                        setReviews(reviewsData);
                    });

                    // Cleanup the listener when the component unmounts
                    return () => unsubscribe();
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userUid) {
            fetchUserData();
        }
    }, [userUid]);


    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;

        const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
        const averageRating = totalRating / ratings.length;

        // Round to the nearest half
        const roundedRating = Math.round(averageRating * 2) / 2;

        return roundedRating;
    };

    const handleStarClick = async (newRating) => {
        try {
            console.log('User UID:', userUid);
            const usersCollectionRef = collection(db, 'users');

            // Query for the correct user document using the 'uid' field
            const userQuerySnapshot = await getDocs(
                query(usersCollectionRef, where('uid', '==', userUid))
            );

            if (!userQuerySnapshot.empty) {
                const userDocRef = userQuerySnapshot.docs[0].ref;
                console.log('User Document Reference:', userDocRef);

                // Fetch the current document data
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    console.log('User Document Data:', userDocSnapshot.data());

                    // Check if the current user has already rated this user
                    const currentUserUid = await getCurrentUserUid();
                    const alreadyRated = userDocSnapshot.data().ratedBy && userDocSnapshot.data().ratedBy.includes(currentUserUid);

                    if (alreadyRated) {
                        // Display message indicating that the user has already rated this user
                        setAlreadyRatedMessageVisible(true);

                        // Hide the message after 3 seconds
                        setTimeout(() => {
                            setAlreadyRatedMessageVisible(false);
                        }, 3000);

                        return;
                    }

                    // Add the current user's UID to the ratedBy array
                    await updateDoc(userDocRef, {
                        ratings: arrayUnion(newRating),
                        ratedBy: arrayUnion(currentUserUid),
                    });

                    // Fetch the updated document data
                    const updatedUserDocSnapshot = await getDoc(userDocRef);

                    // Handle case where ratings field is initially undefined
                    const userRatings = updatedUserDocSnapshot.data().ratings || [];

                    const newRoundedRating = calculateAverageRating(userRatings);

                    // Update the roundedRating field directly in the user document
                    await updateDoc(userDocRef, {
                        roundedRating: newRoundedRating,
                    });

                    setShowFeedback(true);
                    setTimeout(() => {
                        setShowFeedback(false);
                    }, 1000);

                    console.log('Rating updated successfully');
                } else {
                    console.error('User document does not exist.');
                }
            } else {
                console.error('No user document found with the provided uid.');
            }
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };


    const socialMediaIcons = {
        facebook: faFacebook,
        twitter: faTwitter,
        instagram: faInstagram,
    };

    const handleReviewSubmit = async () => {
        try {
            // Fetch the current user's data
            const currentUserUid = await getCurrentUserUid();
            const currentUserQuery = query(collection(db, 'users'), where('uid', '==', currentUserUid));
            const currentUserSnapshot = await getDocs(currentUserQuery);

            if (!currentUserSnapshot.empty) {
                const currentUserDoc = currentUserSnapshot.docs[0].data();

                // Now, you have the current user's data, including name and profileImage
                const usersCollectionRef = collection(db, 'users');
                const userQuery = query(usersCollectionRef, where('uid', '==', userUid));
                const userQuerySnapshot = await getDocs(userQuery);

                if (!userQuerySnapshot.empty) {
                    const userDoc = userQuerySnapshot.docs[0].ref;

                    // Create a sub-collection named "reviews" under the user's document
                    const reviewsCollectionRef = collection(userDoc, 'reviews');

                    // Add a document with the review text and user information to the "reviews" sub-collection
                    await addDoc(reviewsCollectionRef, {
                        text: newReview,
                        timestamp: Timestamp.now(),
                        reviewerName: currentUserDoc.name,
                        reviewerProfileImage: currentUserDoc.profileImage,
                    });

                    // Add a notification to the user's notifications sub-collection
                    const notificationsCollectionRef = collection(userDoc, 'notifications');
                    const notificationRef = doc(notificationsCollectionRef); // Automatically generates a unique ID
                    await setDoc(notificationRef, {
                        notificationId: notificationRef.id,
                        title: 'New Review',
                        message: `${currentUserDoc.name} has added a new review.`,
                        timestamp: Timestamp.now(),
                        type: 'reviewNotification',
                        buttonLabel: "->",
                        destination: "/Profile",
                    });

                    // Clear the input field after submission
                    setNewReview('');

                    // Show feedback for 1 second
                    setShowFeedback(true);
                    setTimeout(() => {
                        setShowFeedback(false);
                    }, 1000);

                    // Reset stars to no color after 3 seconds
                    setTimeout(() => {
                        setShowFeedback(false); // Hide the feedback in case it's still visible
                        setStarsHovered(0); // Reset the stars to no color
                    }, 3000);
                } else {
                    console.error('User not found.');
                }
            } else {
                console.error('Current user not found.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };


    const handleStarHover = (hoveredStars) => {
        setStarsHovered(hoveredStars);
    };


    const getCurrentUserUid = () => {
        const auth = getAuth();

        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(user.uid);
                } else {
                    reject(new Error('User not authenticated'));
                }
            });
        });
    };

    const backToFind = () => {
        navigate("/sitters");
    }

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
                                    <div className="mt-3 flex flex-col text-center">
                                        <h1 className="font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-blue-700 text-center mb-3">
                                            Rate User
                                        </h1>
                                        <div>
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <span
                                                    key={value}
                                                    onClick={() => handleStarClick(value)}
                                                    onMouseEnter={() => handleStarHover(value)}
                                                    onMouseLeave={() => handleStarHover(0)}
                                                    className={`cursor-pointer text-3xl ${value <= starsHovered ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                                                >
                                                    {value <= starsHovered ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>
                                        {showFeedback && <div className="text-green-500 mt-2">Rating submitted!</div>}
                                        {alreadyRatedMessageVisible && <div className="text-red-500 mt-2 font-semibold">You have already voted for this user</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div
                                    className="w-48 h-48 bg-indigo-100 mx-auto rounded-full drop-shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center"
                                >
                                    <img
                                        src={userData.profileImage}
                                        alt=""
                                        className="w-48 h-48 rounded-full border border-blue-600"
                                    />
                                </div>
                            </div>

                            <div className="space-x-8 lg:space-x-8 md:space-x-2 flex justify-center mt-32 mr-14 md:mt-0 md:justify-center lg:justify-end lg:mr-5">
                                <button
                                    className="h-10 w-400 text-white py-2 px-4 uppercase rounded bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 hover:scale-105 shadow hover:shadow-lg font-medium ml-[60px] lg:ml-0"
                                    onClick={backToFind}
                                >
                                    Back to find sitters
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
                                                {userData.number && (
                                                    <div>
                                                        <h1 className="text-black font-semibold underline underline-offset-4 decoration-2 decoration-gray-800">
                                                            <FontAwesomeIcon icon={faMobile} className="text-blue-600 mr-3" />
                                                            Cell Number:</h1>
                                                        <p className="text-gray-800">{userData.number}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <h1 className="text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-gray-800">
                                                        <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 mr-3" />
                                                        Email:</h1>
                                                    <p className="text-gray-800">{userData.email}</p>
                                                </div>
                                            </div>
                                            {userData.gender || userData.dateOfBirth ? (
                                                <div className="mt-5">
                                                    <h1 className="mb-3 text-lg font-semibold underline underline-offset-4 decoration-blue-700">Personal information</h1>
                                                    {userData.dateOfBirth && (
                                                        <div>
                                                            <h1 className="text-black font-semibold underline underline-offset-4 decoration-2 decoration-gray-800">
                                                                <FontAwesomeIcon icon={faCalendar} className="text-blue-600 mr-3" />
                                                                Date of birth:</h1>
                                                            <p className="text-gray-800">{userData.dateOfBirth}</p>
                                                        </div>
                                                    )}
                                                    {userData.gender && (
                                                        <div>
                                                            <h1 className="text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-gray-800">
                                                                <FontAwesomeIcon icon={faVenusMars} className="text-blue-600 mr-2" />
                                                                Gender:</h1>
                                                            <p className="text-gray-800">{userData.gender}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
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
                                                {userData.userId && (
                                                    <div>
                                                        <h1 className="text-black font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-gray-800">
                                                            <FontAwesomeIcon icon={faIdCard} className="text-blue-600 mr-3" />
                                                            User Id:</h1>
                                                        <p className="text-gray-800">{userData.userId}</p>
                                                    </div>
                                                )}
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
                            {userData.about && (
                                <div className="mt-3 flex flex-col text-center">
                                    <h1 className="font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-blue-700 text-center mb-5">About Me</h1>
                                    <p className="text-gray-800 lg:px-16">{userData.about}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-3 flex flex-col justify-center">
                            <div className="p-4 md:p-8 lg:p-16 lg:pt-6">
                                <div className="mt-3 flex flex-col justify-center">
                                    <div className="mt-3 flex flex-col text-center">
                                        <h1 className="font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-blue-700 text-center mb-5">Add a Review</h1>
                                        <textarea
                                            value={newReview}
                                            onChange={(e) => setNewReview(e.target.value)}
                                            placeholder="Write your review here..."
                                            className="w-full h-24 p-2 border border-gray-300 rounded-md mb-3"
                                        />
                                        <button
                                            onClick={handleReviewSubmit}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                    <div className="mt-3">
                                        <h1 className="font-semibold mt-2 underline underline-offset-4 decoration-2 decoration-blue-700 text-center mb-3">Reviews</h1>
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