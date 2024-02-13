import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { db } from "../firebase";

const Sitters = () => {
    const [approvedSitters, setApprovedSitters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const contactUsRef = useRef();

    const StarRating = ({ rating }) => {
        const stars = Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`text-2xl ${
                    index < rating
                        ? "text-yellow-400" 
                        : "text-gray-300"   
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
                setIsLoading(false);
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
        <div className="min-h-screen pt-32" ref={contactUsRef}>
            <div>
                <h1 className="text-black text-4xl font-semibold underline underline-offset-4 decoration-blue-700">Find a Sitter</h1>
            </div>
            <div className="p-8">
                <p>Find the perfect house sitter for your home with ease. Explore our curated network of reliable sitters, each committed to safeguarding your property. Browse profiles, reviews, and references to make the right choice. Your ideal house sitter is just a click away—travel with confidence, knowing your home is in capable hands.</p>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <div className="inline-block animate-spin rounded-full border-t-4 border-blue-800 border-solid h-8 w-8"></div>
                </div>
            ) : (
            <div className="flex flex-wrap justify-center lg:justify-start md:justify-start p-8">
                {approvedSitters.map(sitter => (
                    <div key={sitter.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 px-2">
                        <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md shadow-gray-600 border border-blue-700">
                            <div className="border-b px-4 pb-6">
                                <div className="text-center my-4">
                                    <img className="h-32 w-32 rounded-full mx-auto my-4 border border-blue-700 shadow-xl"
                                        src={sitter.profileImage || "/images/profileAvatar.png"}
                                        alt={sitter.name} />
                                    <div className="flex flex-col items-center py-2">
                                        <div>
                                        <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1 underline underline-offset-2 decoration-blue-700">
                                            {sitter.name.trim().split(/\s+/).slice(0, 1).join(' ')} {sitter.name.trim().split(/\s+/).slice(-1).join(' ')}
                                        </h3>
                                        <div className="flex flex-col items-center">
                                            <h1>{sitter.email}</h1>
                                        </div>
                                        </div>
                                        <StarRating rating={sitter.roundedRating} />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="flex gap-2 px-2 w-1/2">
                                        <Link
                                            className="flex-1 shadow-xl rounded-full bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 text-white dark:text-white antialiased font-bold hover:scale-110 px-4 py-2"
                                            to={`/PublicProfile/${sitter.userUid}`}
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}

export default Sitters;