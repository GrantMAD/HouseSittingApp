import { useState, useEffect } from "react"
import { db, auth } from "../firebase";
import { collection, query, where, updateDoc, getDocs } from "firebase/firestore";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { v4 } from 'uuid';
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
    const [userData, setUserData] = useState(null);
    const [newName, setNewName] = useState();
    const [email, setEmail] = useState();
    const [dateOfBirth, setDateOfBirth] = useState();
    const [gender, setGender] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [newAbout, setNewAbout] = useState();
    const [newNumber, setNewNumber] = useState(0);
    const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);
    const [socialMediaLinks, setSocialMediaLinks] = useState({});
    const [profileImageUpload, setProfileImageUpload] = useState();
    const [profileUpdated, setProfileUpdated] = useState(false);
    const navigate = useNavigate();
    const usersCollectionRef = collection(db, "users");

    useEffect(() => {
        const fetchUserData = async () => {
            const usersCollectionRef = collection(db, "users");
            const userQuery = query(usersCollectionRef, where("email", "==", auth.currentUser.email));
            const querySnapshot = await getDocs(userQuery);
            if (querySnapshot.empty) {
                console.log("No matching documents.");
                return;
            }
            querySnapshot.forEach((doc) => {
                setUserData(doc.data());
            });
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData !== undefined && userData !== null) {
            setNewName(userData.name)
            setEmail(userData.email)
            setDateOfBirth(userData.dateOfBirth)
            setGender(userData.gender)
            setNewAbout(userData.about)
            setNewNumber(userData.number)
            setProfileImageUpload(userData.image)
        }
    }, [userData]);

    const UpdateUser = async (e) => {
        setIsLoading(true);
        const profileURL = await uploadProfileImage();
        const userQuery = query(usersCollectionRef, where("email", "==", userData.email));
        const data = await getDocs(userQuery)
        const userDocRef = data.docs[0].ref

        let updatedUser = {
            name: newName,
            email: email,
            dateOfBirth: dateOfBirth,
            gender: gender,
            number: newNumber,
            about: newAbout,
            socialMediaLinks: { ...userData.socialMediaLinks, ...socialMediaLinks },
        }

        if (profileURL !== undefined) {
            updatedUser = {
                profileImage: profileURL,
                ...updatedUser
            }
        }

        await updateDoc(userDocRef, updatedUser);
        setProfileUpdated(!profileUpdated);
        navigate('/Profile', { state: { updatedProfileImage: profileURL } });
    };

    const uploadProfileImage = async () => {
        if (profileImageUpload == null) return;
        const ProfileRef = ref(storage, `profileImages/${profileImageUpload.name + v4()}`);
        return uploadBytes(ProfileRef, profileImageUpload).then(async (uploadResult) => {
            const downloadURL = await getDownloadURL(uploadResult.ref);
            return downloadURL;
        })
    };

    const toggleSocialMediaOption = (option) => {
        if (selectedSocialMedia.includes(option)) {
            setSelectedSocialMedia(selectedSocialMedia.filter((selected) => selected !== option));
        } else {
            setSelectedSocialMedia([...selectedSocialMedia, option]);
        }
    };

    const socialMediaIcons = {
        facebook: faFacebook,
        twitter: faTwitter,
        instagram: faInstagram,
    };

    const socialMediaColors = {
        facebook: '#1877F2',   
        twitter: '#1DA1F2',    
        instagram: '#E4405F',  
    };

    return (
        <div className="min-h-screen pt-32 bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700">
            <div className="flex text-start justify-center pt-10">
                <div className="w-3/4 border border-black rounded-md">
                    <div className="mt-5 md:col-span-2 md:mt-0">
                        <form action="#">
                            <div className="bg-white shadow sm:overflow-hidden sm:rounded-md">
                                <div className="text-center text-3xl font-semibold pt-8 underline underline-offset-4 decoration-blue-700">
                                    <h1>Profile</h1>
                                </div>
                                {userData && (
                                    <div className="space-y-6 px-4 py-5 sm:p-6">
                                        <div>
                                            <label htmlFor="about" className="block text-sm font-medium text-gray-700 after:content-none">
                                                About
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    defaultValue={userData.about}
                                                    type="text"
                                                    id="about"
                                                    name="about"
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                    placeholder="About yourself"
                                                    onChange={(event) => {
                                                        setNewAbout(event.target.value);
                                                    }}

                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-black">
                                                Brief description for your profile.
                                            </p>
                                        </div>
                                        <div className="bg-white">
                                            <div className="grid grid-cols-6 gap-6">
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 after:content-none">
                                                        Name
                                                    </label>
                                                    <input
                                                        defaultValue={userData.name}
                                                        type="text"
                                                        name="first-name"
                                                        id="first-name"
                                                        autoComplete="given-name"
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                        onChange={(event) => {
                                                            setNewName(event.target.value);
                                                        }}

                                                    />
                                                </div>
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label htmlFor="date-of-birth" className="block text-sm font-medium text-gray-700 after:content-none">
                                                        Date of Birth
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="date-of-birth"
                                                        name="date-of-birth"
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                        onChange={(event) => {
                                                            setDateOfBirth(event.target.value);
                                                        }}
                                                        value={dateOfBirth}
                                                    />
                                                </div>

                                                <div className="col-span-6 sm:col-span-3">
                                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 after:content-none">
                                                        Gender
                                                    </label>
                                                    <select
                                                        id="gender"
                                                        name="gender"
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                        onChange={(event) => {
                                                            setGender(event.target.value);
                                                        }}
                                                        value={gender}
                                                    >
                                                        <option value="" disabled>Select gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>

                                                <div className="col-span-6 sm:col-span-4">
                                                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 after:content-none">
                                                        Contact Number
                                                    </label>
                                                    <input
                                                        defaultValue={userData.number}
                                                        type="number"
                                                        name="number"
                                                        id="number"
                                                        autoComplete="number"
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                        onChange={(event) => {
                                                            setNewNumber(event.target.value);
                                                        }}

                                                    />
                                                </div>
                                                <div className="col-span-6 sm:col-span-4">
                                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 after:content-none">
                                                        Email address
                                                    </label>
                                                    <input
                                                        defaultValue={userData.email}
                                                        type="text"
                                                        name="email-address"
                                                        id="email-address"
                                                        autoComplete="email"
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                        disabled={true}
                                                        onChange={(event) => {
                                                            setEmail(event.target.value);
                                                        }}

                                                    />
                                                </div>
                                                <div className="col-span-6 sm:col-span-4">
                                                    <div>
                                                        <h2 className="text-sm font-medium text-gray-700 underline underline-offset-4 decoration-blue-700 mb-3">Add Social Media Links:</h2>
                                                        {["Facebook", "Twitter", "Instagram"].map((option) => (
                                                            <div key={option} className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    id={option.toLowerCase()}
                                                                    name={option.toLowerCase()}
                                                                    checked={selectedSocialMedia.includes(option.toLowerCase())}
                                                                    onChange={() => toggleSocialMediaOption(option.toLowerCase())}
                                                                />
                                                                <label htmlFor={option.toLowerCase()} className="ml-2 text-gray-700">
                                                                    <FontAwesomeIcon
                                                                        icon={socialMediaIcons[option.toLowerCase()]}
                                                                        className="mr-2"
                                                                        style={{ color: socialMediaColors[option.toLowerCase()] }}
                                                                    />
                                                                    {option}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {selectedSocialMedia.map((option) => (
                                                        <div key={option} className="col-span-6 sm:col-span-3 mt-3">
                                                            <label htmlFor={option} className="block text-sm font-medium text-gray-700">
                                                                <FontAwesomeIcon
                                                                    icon={socialMediaIcons[option.toLowerCase()]}
                                                                    className="mr-2"
                                                                    style={{ color: socialMediaColors[option.toLowerCase()] }}
                                                                />
                                                                {option}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id={option}
                                                                name={option}
                                                                className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                                onChange={(event) => setSocialMediaLinks({ ...socialMediaLinks, [option.toLowerCase()]: event.target.value })}
                                                                value={socialMediaLinks[option.toLowerCase()] || ""}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 after:content-none">Profile Image</label>
                                            <div className="mt-1 flex items-center">
                                                <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100 mt-5">
                                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </span>
                                                <div className="mb-3 ml-5 w-96 text-center">
                                                    <label for="formFileMultiple" class="form-label inline-block mb-2 text-gray-700 underline underline-offset-2 after:content-none">Input Image here</label>
                                                    <input
                                                        className="form-control
                                block
                                w-full
                                px-3
                                py-1.5
                                text-base
                                font-normal
                                text-gray-700
                                bg-white bg-clip-padding
                                border border-solid border-gray-500
                                rounded
                                transition
                                ease-in-out
                                m-0
                                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                        type="file"
                                                        id="formFileMultiple"
                                                        multiple
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];
                                                            setProfileImageUpload(file);
                                                        }}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    {isLoading ? (
                                        <div className="inline-block animate-spin rounded-full border-t-4 border-blue-800 border-solid h-8 w-8"></div>
                                    ) : (
                                        <button
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                UpdateUser();
                                            }}
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProfileForm
