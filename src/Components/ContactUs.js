import { useEffect, useRef } from "react";

const ContactUs = () => {
    const contactUsRef = useRef();

    const handleContactUsClick = () => {
        window.location.href = 'mailto:houseittingapp.gmail.com';
    };

    useEffect(() => {
        contactUsRef.current.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <div
            ref={contactUsRef}
            className="min-h-screen bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 py-6 flex flex-col justify-center sm:py-12 z-0">
            <div className="relative py-3 mt-10 mx-4 sm:mx-auto sm:max-w-xl">
                <div
                    className="absolute inset-0 bg-blue-700 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>
                <div className="text-white relative px-4 py-10 bg-blue-500 shadow-lg sm:rounded-3xl sm:p-8">
                    <div className="text-center pb-6">
                        <h1 className="text-3xl">Contact Us!</h1>
                        <p className="text-gray-300">
                            Fill up the form below to send us a message.
                        </p>
                    </div>

                    <form>
                        <input
                            className="shadow mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text" placeholder="Name" name="name" />
                        <input
                            className="shadow mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="email" placeholder="Email" name="email" />
                        <input
                            className="shadow mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text" placeholder="Subject" name="_subject" />
                        <textarea
                            className="shadow mb-4 min-h-0 appearance-none border rounded h-64 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text" placeholder="Type your message here..." name="message"></textarea>

                        <div className="flex justify-center">
                            <input
                                className="shadow bg-gradient-to-r from-blue-700 via-cyan-900 to-green-400 hover:scale-110 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
                                type="submit" value="Submit" />
                        </div>
                    </form>

                    <div className="mt-2 text-center">
                        <h1 className="text-white">Would you rather email us directly? <button className="text-blue-300 font-bold hover:underline" onClick={handleContactUsClick}>Click here</button></h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactUs;
