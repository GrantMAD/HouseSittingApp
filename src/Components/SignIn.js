import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const SignIn = (props) => {
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertForThreeSeconds, setShowAlertForThreeSeconds] = useState(false);
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
            setShowAlert(true);
            setShowAlertForThreeSeconds(true);
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

    useEffect(() => {
        let timeout;
        if (showAlertForThreeSeconds) {
          timeout = setTimeout(() => {
            setShowAlertForThreeSeconds(false);
          }, 3000);
        }
    
        return () => clearTimeout(timeout); 
    
      }, [showAlertForThreeSeconds]);

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
                        <div className="flex flex-col items-center w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
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
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="absolute top-3.5 right-52 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                        {showAlert && showAlertForThreeSeconds && (
                            <div>
                                <div class="flex bg-red-200 rounded-lg p-4 mb-4 text-sm text-red-700 mt-3" role="alert">
                                    <svg class="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                                    <div>
                                        <span class="font-medium">Incorrect Email or password, Please try again</span>
                                    </div>
                                </div>
                            </div>
                        )}
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