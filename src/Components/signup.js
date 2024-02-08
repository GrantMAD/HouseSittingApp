import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { collection, addDoc, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { SHA256 } from 'crypto-js';
import "../index.css";

const Signup = (props) => {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const usersCollectionRef = collection(db, "users");
    const [isLoading, setIsLoading] = useState(false);
    const loginButtonRef = useRef(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const register = async () => {
        try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
            const user = userCredential.user;
            const currentDate = new Date();
            const formattedDate = currentDate.toDateString();
            const hashedName = SHA256(userName).toString();
            const generatedUserId = hashedName.slice(0, 10);
    
            // Add user document
            await addDoc(usersCollectionRef, {
                name: userName,
                email: userEmail,
                number: "",
                about: "",
                dateOfBirth: "",
                gender: "",
                memberSince: formattedDate,
                userId: generatedUserId,
                uid: user.uid,
                profileImage: "",
                socialMediaLinks: {},
                role: "User",
            });
    
            // Find the user document using their UID
            const userQuerySnapshot = await getDocs(query(usersCollectionRef, where('uid', '==', user.uid)));
    
            // If the user document exists, add the notification to its sub-collection
            if (!userQuerySnapshot.empty) {
                const userDocRef = userQuerySnapshot.docs[0].ref;
                const userNotificationsRef = collection(userDocRef, 'notifications');
                
                // Add a notification with auto-generated notificationId
                const notificationRef = doc(userNotificationsRef); // Automatically generates a unique ID
                await setDoc(notificationRef, {
                    notificationId: notificationRef.id, // Assign auto-generated ID as notificationId
                    title: "Welcome to HouseSittingApp!",
                    message: "Thank you for signing up. We hope you have a great experience!",
                    type: "welcomeNotification",
                    createdAt: new Date(),
                });
            } else {
                console.error("User document not found");
            }
    
            navigate('/SignIn');
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            setIsLoading(false);
        }
    }
    
    
    useEffect(() => {
        if (props.funcNav) {
            props.funcNav(false)
        }
    })

    useEffect(() => {
        loginButtonRef.current = document.getElementById("signupButton");
    }, []);

    return (
        <div className="min-h-screen p-60 bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700">
            <div className="flex border-2 border-blue-700 rounded-2xl bg-white">
                <div className="flex items-center w-1/2 p-10 border-2 border-r-blue-700 rounded-l-2xl">
                    <div className="flex flex-col">
                        <h1 className="text-black font-semibold text-xl mb-1">Nice to see you</h1>
                        <h1 className="text-black text-5xl font-medium underline underline-offset-8 decoration-blue-700">WELCOME</h1>
                        <p className="text-center mr-[20%] ml-[20%] mt-10 text-black">Welcome to HouseSittingApp! Your journey to worry-free house-sitting starts here. Sign up in a few clicks, connect with reliable sitters, or find the perfect gig. Our vetted community ensures your home's security. Simply set preferences, availability, and create a unique profile. Join HouseSittingApp today for trusted connections and unmatched peace of mind! 🏠🔐</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center p-10 w-1/2">
                    <div className="w-36">
                        <img src="/images/Landingpageimage.png" alt="" />
                    </div>
                    <h1 className="mb-8 text-2xl text-center text-gray-900 font-semibold">
                        Sign Up
                    </h1>
                    <div className="flex flex-col items-center w-full">
                        <input
                            type="text"
                            className="border-2 border-blue-700 bg-gray-200 placeholder-black w-2/5 mb-4 text-black rounded-lg p-2 hover:bg-white"
                            name="fullname"
                            placeholder="Full Name"
                            onChange={(event) => {
                                setUserName(event.target.value);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    loginButtonRef.current.click();
                                }
                            }}
                        />
                        <input
                            type="text"
                            className="border-2 border-blue-700 bg-gray-200 placeholder-black w-2/5 mb-4 text-black rounded-lg p-2"
                            name="fullname"
                            placeholder="Email"
                            onChange={(event) => {
                                setUserEmail(event.target.value);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    loginButtonRef.current.click();
                                }
                            }}
                        />
                        <div className="flex flex-col items-center w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="border-2 border-blue-700 bg-gray-200 placeholder-black w-2/5 mb-4 text-black rounded-lg p-2"
                                name="password"
                                placeholder="Password"
                                value={userPassword}
                                onChange={(event) => setUserPassword(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        loginButtonRef.current.click();
                                    }
                                }}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="absolute top-3.5 right-52 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        {isLoading ? (
                            <div className="inline-block animate-spin rounded-full border-t-4 border-blue-800 border-solid h-8 w-8"></div>
                        ) : (
                            <button
                                id="signupButton"
                                type="submit"
                                className="w-2/6 bg-gradient-to-r from-blue-700 via-cyan-900 to-green-400 text-center py-3 rounded-lg text-white focus:outline-none my-1 font-semibold"
                                onClick={register}
                            >
                                Create Account
                            </button>
                        )}
                        <div className="text-gray-800 font-semibold text-center mt-2">
                            Already have an account? &nbsp;
                            <a
                                className="no-underline text-blue-800"
                                href="/SignIn"
                            >
                                Log in
                            </a>
                            <h1 className="text-gray-800 font-semibold text-center">Back to the <a className="text-blue-600" href="/">Landing Page</a></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Signup;