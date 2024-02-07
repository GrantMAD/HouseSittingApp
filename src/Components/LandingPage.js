import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../index.css";

const LandingPage = () => {
    const navigate = useNavigate();
    const [isUserAuthenticated, setUserAuthenticated] = useState(false);
    const [showSignInMessage, setShowSignInMessage] = useState(false);
    const [clickedButton, setClickedButton] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);

    const RegisterNavigation = () => {
        if (isUserAuthenticated) {
            navigate("/Register");
        } else {
            setShowSignInMessage(true);
            setClickedButton("register");
            setTimeout(() => {
                navigate("/SignIn");
            }, 2000); // Adjust the delay time as needed (in milliseconds)
        }
    }

    const SittersNavigation = () => {
        if (isUserAuthenticated) {
            navigate("/Sitters");
        } else {
            setShowSignInMessage(true);
            setClickedButton("sitters");
            setTimeout(() => {
                navigate("/SignIn");
            }, 2000); // Adjust the delay time as needed (in milliseconds)
        }
    }

    const ContactNavigation = () => {
        navigate("/ContactUs");
    }

    return (
        <div className='flex flex-col pt-10 flex-grow'>
            <div className="flex justify-center bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 pt-10">
                <div className="flex flex-col justify-center mr-20 w-1/4 text-start text-white">
                    <h1 className="font-semibold text-2xl">Become a house sitter,</h1>
                    <h1 className="font-semibold text-3xl mb-3">Find a house sitter for your home</h1>
                    <p className="text-lg">Welcome to HouseSittingApp, where your home finds a trusted guardian. Sit back, relax, and let us connect you with reliable house sitters who'll treat your space like their own.</p>
                </div>
                <div>
                    <img src="/images/Landingpageimage.png" alt="" />
                </div>
            </div>
            <div className="flex">
                <div className="w-1/2 border-4 border-r-blue-600 border-b-0 border-t-0 pb-20 pt-20">
                    <div className="lg:px-[30%]">
                        <h1 className="text-gray-800 underline underline-offset-4 decoration-blue-600 text-3xl font-semibold mb-5">Become a house sitter</h1>
                        <p className="mb-8 text-xl">
                            House sitting offers a unique blend of travel and responsibility. As a house sitter, you'll enjoy exploring new locations while providing homeowners with peace of mind. Your role includes maintaining their property, handling routine tasks, and ensuring the safety of their home. This cost-effective and rewarding opportunity is ideal for responsible individuals with a love for pets and excellent communication skills.
                        </p>
                        <button
                            className="bg-blue-600 hover:bg-white hover:border-2 border-blue-600 hover:text-blue-600 text-white font-semibold px-4 py-3 rounded-md drop-shadow-lg"
                            onClick={RegisterNavigation}
                        >
                            Register
                        </button>
                        {showSignInMessage && clickedButton === "register" && <p className="text-red-600 mt-3 font-semibold">You must be signed in. Please wait...</p>}
                    </div>
                </div>
                <div className="w-1/2 pb-20 pt-20">
                    <div className="lg:px-[30%]">
                        <h1 className="text-gray-800 underline underline-offset-4 decoration-blue-600 text-3xl font-semibold mb-5">Find a house sitter</h1>
                        <p className="mb-5 text-xl">
                            Discovering the ideal house sitter is simple with our platform. Explore a curated list of responsible individuals ready to care for your home and pets. Our user-friendly interface and detailed profiles make connecting with trustworthy house sitters a breeze. Travel worry-free, knowing your property is in capable hands. Find a house sitter today for peace of mind and reliable care for your home.
                        </p>
                        <button
                            className="bg-blue-600 hover:bg-white hover:border-2 border-blue-600 hover:text-blue-600 text-white font-semibold px-4 py-3 rounded-md drop-shadow-lg mt-8"
                            onClick={SittersNavigation}
                        >
                            Find sitter
                        </button>
                        {showSignInMessage && clickedButton === "sitters" && <p className="text-red-600 mt-3 font-semibold">You must be signed in. Please wait...</p>}
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 text-white">
                <h1 className="pt-10 text-3xl font-semibold underline underline-offset-4">Contact Us</h1>
                <p className="mt-5 text-xl">Want to contact us at the HouseSittingApp? Click on the button below to send us an email.</p>
                <button
                    className="mt-5 mb-10 font-bold bg-blue-700 text-white px-4 py-3 rounded-md drop-shadow-lg border border-white hover:bg-white hover:text-blue-700 hover:border-blue-700"
                    onClick={ContactNavigation}
                >
                    Contact us
                </button>
            </div>
        </div>
    )
}
export default LandingPage;