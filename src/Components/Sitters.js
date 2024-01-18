import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../index.css";

const Sitters = () => {
    const [approvedSitters, setApprovedSitters] = useState([]);

    useEffect(() => {
        const fetchApprovedSitters = async () => {
            try {
                const approvedSittersData = await getDocs(collection(db, 'ApprovedSitters'));
                setApprovedSitters(approvedSittersData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching approved sitters:", error);
            }
        };

        fetchApprovedSitters();
    }, []);

    return (
        <div className="min-h-screen pt-32">
            <div>
                <h1 className="text-black text-4xl font-semibold underline underline-offset-4 decoration-blue-700">Find a Sitter</h1>
            </div>
            <div className="p-8">
                <p>Find the perfect house sitter for your home with ease. Explore our curated network of reliable sitters, each committed to safeguarding your property. Browse profiles, reviews, and references to make the right choice. Your ideal house sitter is just a click away—travel with confidence, knowing your home is in capable hands.</p>
            </div>
            <div className="flex p-8">
                {approvedSitters.map(sitter => (
                    <div key={sitter.id} class="max-w-sm mr-10 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                        <div class="border-b px-4 pb-6">
                            <div class="text-center my-4">
                                <img class="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                                    src={sitter.profileImage || "/images/profileAvatar.png"}
                                    alt={sitter.name} />
                                <div class="py-2">
                                    <h3 class="font-bold text-2xl text-gray-800 dark:text-white mb-1">{sitter.name}</h3>
                                    <div class="inline-flex text-gray-700 dark:text-gray-300 items-center">
                                        <svg class="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1" fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                            <path class=""
                                                d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                                        </svg>
                                        {sitter.address}
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-2 px-2">
                                <button
                                    class="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
                                >
                                    Profile
                                </button>
                                <button
                                    class="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2">
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