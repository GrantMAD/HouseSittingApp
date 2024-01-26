import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { db } from "../firebase";
import "../index.css";

const Sitters = () => {
    const [approvedSitters, setApprovedSitters] = useState([]);
    const contactUsRef = useRef();

    const StarRating = ({ rating }) => {
        // Assuming rating is a number from 0 to 5
        const stars = Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`text-2xl ${
                    index < rating
                        ? "text-yellow-400" // Filled star color
                        : "text-gray-300"   // Empty star color
                }`}
            >
                &#9733;
            </span>
        ));
    
        return <div className="flex">{stars}</div>;
    };
    

    useEffect(() => {
        const fetchApprovedSitters = async () => {
            try {
                const approvedSittersData = await getDocs(collection(db, 'ApprovedSitters'));
                const sitters = await Promise.all(approvedSittersData.docs.map(async (doc) => {
                    const userData = await getUserData(doc.data().uid);
                    return {
                        id: doc.id,
                        userUid: doc.data().uid, 
                        roundedRating: userData.roundedRating || 0, 
                        ...doc.data()
                    };
                }));
                setApprovedSitters(sitters);
            } catch (error) {
                console.error("Error fetching approved sitters:", error);
            }
        };

        const getUserData = async (userUid) => {
            const userQuerySnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', userUid)));
            if (!userQuerySnapshot.empty) {
                return userQuerySnapshot.docs[0].data();
            }
            return {};
        };

        fetchApprovedSitters();
    }, []);

    

    return (
        <div
            className="min-h-screen pt-32"
            ref={contactUsRef}
        >
            <div>
                <h1 className="text-black text-4xl font-semibold underline underline-offset-4 decoration-blue-700">Find a Sitter</h1>
            </div>
            <div className="p-8">
                <p>Find the perfect house sitter for your home with ease. Explore our curated network of reliable sitters, each committed to safeguarding your property. Browse profiles, reviews, and references to make the right choice. Your ideal house sitter is just a click away—travel with confidence, knowing your home is in capable hands.</p>
            </div>
            <div className="flex p-8">
                {approvedSitters.map(sitter => (
                    <div key={sitter.id} class="max-w-sm mr-10 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md shadow-gray-600 border border-blue-700">
                        <div class="border-b px-4 pb-6">
                            <div class="text-center my-4">
                                <img class="h-32 w-32 rounded-full mx-auto my-4"
                                    src={sitter.profileImage || "/images/profileAvatar.png"}
                                    alt={sitter.name} />
                                <div class="flex flex-col items-center py-2">
                                    <h3 class="font-bold text-2xl text-gray-800 dark:text-white mb-1 underline underline-offset-2 decoration-blue-700">
                                        {sitter.name.trim().split(/\s+/).slice(0, 1).join(' ')} {sitter.name.trim().split(/\s+/).slice(-1).join(' ')}
                                    </h3>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-2" />
                                        <h1>{sitter.memberSince}</h1>
                                    </div>
                                    <StarRating rating={sitter.roundedRating} />
                                </div>
                            </div>
                            <div class="flex gap-2 px-2">
                                <Link
                                    class="flex-1 rounded-full bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 text-white dark:text-white antialiased font-bold hover:scale-110 px-4 py-2"
                                    to={`/PublicProfile/${sitter.userUid}`}
                                >
                                    Profile
                                </Link>
                                <button
                                    class="flex-1 rounded-full border-2 border-blue-700 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2">
                                    Message
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Sitters;