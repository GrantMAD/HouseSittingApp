import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const SignIn = (props) => {
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const loginButtonRef = useRef(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const signIn = async () => {
        try {
            setIsLoading(true);
            const user = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
            console.log(user);
            if (props.funcNav) {
                props.funcNav(true)
            }

            navigate('/');
        } catch (error) {
            console.error("Error signing in:", error);
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
        loginButtonRef.current = document.getElementById("loginButton");
    }, []);

    return (
        <div className="min-h-screen p-60 bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700">
            <div className="flex border-2 border-blue-700 rounded-2xl bg-white">
                <div className="flex flex-col justify-center items-center p-10 w-1/2">
                    <div className="w-36">
                        <img src="/images/Landingpageimage.png" alt="" />
                    </div>
                    <h1 className="mb-8 text-2xl text-center text-gray-900 font-semibold">
                        Sign In
                    </h1>
                    <div className="flex flex-col items-center w-full">
                        <input
                            type="text"
                            className="border-2 border-blue-700 bg-gray-200 placeholder-black w-2/5 mb-4 text-black rounded-lg p-2"
                            name="fullname"
                            placeholder="Email"
                            onChange={(event) => {
                                setSignInEmail(event.target.value);
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
                            placeholder="Password"
                            onChange={(event) => {
                                setSignInPassword(event.target.value);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    loginButtonRef.current.click();
                                }
                            }}
                        />
                        {isLoading ? (
                            <div className="inline-block animate-spin rounded-full border-t-4 border-blue-800 border-solid h-8 w-8"></div>
                        ) : (
                            <button
                                id="loginButton"
                                type="submit"
                                className="w-2/6 bg-gradient-to-r from-blue-700 via-cyan-900 to-green-400 text-center py-3 rounded-lg text-white focus:outline-none my-1 font-semibold"
                                onClick={signIn}
                            >
                                Sign In
                            </button>
                        )}
                        <div className="text-gray-800 font-semibold text-center mt-2">
                            Don't have an account? &nbsp;
                            <a
                                className="no-underline text-blue-800"
                                href="/SignUp"
                            >
                                Sign Up
                            </a>
                            <h1 className="text-gray-800 font-semibold text-center">Back to the <a className="text-blue-600" href="/">Landing Page</a></h1>
                        </div>
                    </div>
                </div>
                <div className="flex items-center w-1/2 p-10 border-2 border-r-blue-700 rounded-l-2xl">
                    <div className="flex flex-col">
                        <h1 className="text-black font-semibold text-xl mb-1">Nice to see you</h1>
                        <h1 className="text-black text-5xl font-medium underline underline-offset-8 decoration-blue-700">WELCOME BACK</h1>
                        <p className="text-center mr-[20%] ml-[20%] mt-10 text-black">Welcome back to HouseSittingApp! Ready to manage your house-sitting experience with ease? Sign in now to access your personalized dashboard, review ongoing sits, or find the ideal housesitter. Your secure journey continues here. Welcome back to a world of trusted connections! 🏠🔑</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignIn;