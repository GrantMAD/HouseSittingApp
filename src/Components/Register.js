import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, getDocs, where, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Register = () => {
    const adminNotificationsCollectionRef = collection(db, "adminNotifications");
    const usersCollectionRef = collection(db, "Requests");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [experience, setExperience] = useState("");
    const [reasonForApplying, setReasonForApplying] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const contactUsRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            setIsLoading(true);

            const userQuery = query(collection(db, "users"), where("email", "==", email));
            const userQuerySnapshot = await getDocs(userQuery);
    
            if (!userQuerySnapshot.empty) {
                const userDocument = userQuerySnapshot.docs[0].data();

                const requestData = {
                    name: name,
                    address: address,
                    contactNumber: contactNumber,
                    email: email,
                    experience: experience,
                    reasonForApplying: reasonForApplying,
                    profileImage: userDocument.profileImage || "",
                    memberSince: userDocument.memberSince,
                    uid:userDocument.uid
                };
    
                await addDoc(usersCollectionRef, requestData);

                const notificationData = {
                    notificationId: '',
                    title: "New Registration",
                    message: `New registration by ${userDocument.name}`,
                    timestamp: new Date(),
                    type: "adminNotification",
                    destination: "/Requests",
                    buttonLabel: "View Request",
                  };
                  
                  const notificationRef = await addDoc(adminNotificationsCollectionRef, notificationData);
                  const notificationId = notificationRef.id; 
                  
                  await updateDoc(notificationRef, { notificationId });
                  
    
                setName("");
                setAddress("");
                setContactNumber("");
                setEmail("");
                setExperience("");
                setReasonForApplying("");
    
                console.log('Data submitted successfully!');
                navigate("/");
            } else {
                console.error('User not found with the provided email');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        contactUsRef.current.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <div
            ref={contactUsRef}
            className="min-h-screen pt-32 bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700">
            <div className="flex text-start justify-center pt-10">
                <div className="w-3/4 border border-black rounded-md">
                    <div className="mt-5 md:col-span-2 md:mt-0">
                        <form action="#">
                            <div className="bg-white shadow sm:overflow-hidden sm:rounded-md">
                                <div className="text-center text-3xl font-semibold pt-8 underline underline-offset-4 decoration-blue-700">
                                    <h1>House sitter registration</h1>
                                </div>
                                <div className="p-8">
                                    <p>Thank you for your interest in becoming a house sitter! This registration form is designed to gather essential information about potential house sitters who are interested in providing their services. Your details will help us match you with homeowners seeking responsible individuals to care for their homes and pets while they are away.</p>
                                </div>
                                <div className="space-y-6 px-4 py-5 sm:p-8 sm:pt-0">
                                    <div className="bg-white">
                                        <div className="flex flex-col">
                                            <div className="flex">
                                                <div className="w-1/2 mb-3 mr-5">
                                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 after:content-none">
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="first-name"
                                                        id="first-name"
                                                        autoComplete="given-name"
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="w-1/2 mb-3">
                                                    <label htmlFor="Address" className="block text-sm font-medium text-gray-700 after:content-none">
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="Address"
                                                        name="Address"
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <div className="w-1/2 mb-3 mr-5">
                                                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 after:content-none">
                                                        Contact Number
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="number"
                                                        id="number"
                                                        autoComplete="number"
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                        onChange={(e) => setContactNumber(e.target.value)}
                                                    />
                                                </div>
                                                <div className="w-1/2 mb-3">
                                                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 after:content-none">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        id="email"
                                                        autoComplete="email"
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-1"
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-1/2 mb-3">
                                                <label htmlFor="about" className="block text-sm font-medium text-gray-700 after:content-none">
                                                    Experiance
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        type="text"
                                                        id="about"
                                                        name="about"
                                                        rows={3}
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-2"
                                                        placeholder="Experiance"
                                                        onChange={(e) => setExperience(e.target.value)}
                                                    />
                                                </div>
                                                <p className="mt-2 text-sm text-black">
                                                    Brief summary about your experiance house sitting
                                                </p>
                                            </div>
                                            <div className="w-1/2 mb-3">
                                                <label htmlFor="about" className="block text-sm font-medium text-gray-700 after:content-none">
                                                    Reason for applying
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        type="text"
                                                        id="about"
                                                        name="about"
                                                        rows={3}
                                                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-indigo-500 sm:text-sm p-2"
                                                        placeholder="Reason for applying"
                                                        onChange={(e) => setReasonForApplying(e.target.value)}
                                                    />
                                                </div>
                                                <p className="mt-2 text-sm text-black">
                                                    Brief summary about why you are applying to become a house sitter
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    {isLoading ? (
                                        <div className="inline-block animate-spin rounded-full border-t-4 border-blue-800 border-solid h-8 w-8"></div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={handleSubmit}
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
export default Register;