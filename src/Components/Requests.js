import { faUser, faMinus, faPlus, faMapMarkerAlt, faPhone, faEnvelope, faUserTie, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import "../index.css";

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const requestsCollectionRef = collection(db, 'Requests');
    const [isLoading, setIsLoading] = useState(false);
    const [openAccordionId, setOpenAccordionId] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        const getRequests = async () => {
            try {
                const requestData = await getDocs(requestsCollectionRef);
                setRequests(requestData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        getRequests();
    }, [requestsCollectionRef]);

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            const approvedSitterRef = await addDoc(collection(db, 'ApprovedSitters'), {
                name: selectedRequest.name,
                address: selectedRequest.address,
                profileImage: selectedRequest.profileImage, // Assuming you have a profileImage field
            });

            // Delete the document in the Requests collection
            await deleteDoc(doc(db, 'Requests', selectedRequest.id));

            // Log the reference to the new ApprovedSitters document
            console.log("Approved Sitter Document Reference:", approvedSitterRef);
        } catch (error) {
            console.error('Error approving sitter:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32">
            <div className="flex justify-center">
                <h1 className="text-3xl md:text-4xl text-black font-semibold underline underline-offset-8 decoration-2 decoration-blue-700">Requests</h1>
            </div>
            <div className="mt-5">
                <h1>This is where requests for registration to become a house sitter are posted. Review the users data and either approve the user to become a house sitter by clicking on the approve button or decline the user by clicking on the decline button.</h1>
            </div>
            <div className="mt-5 mb-10">
                {requests.length === 0 ? (
                    <p className="text-center lg:text-2xl md:text-2xl text-lg font-semibold">There are currently no requests</p>
                ) : (
                    requests.map((request, index) => (
                        <div class="flex flex-col items-center mb-3 lg:mr-[25%] lg:ml-[25%] md:ml-[4%] md:mr-[4%]">
                            <div class="w-full pr-10 pl-10">
                                <div key={request.id}>
                                    <input type="checkbox" name="panel" id={`panel-${index + 1}`} class="hidden" />
                                    <label
                                        for={`panel-${index + 1}`}
                                        class="relative block bg-gray-800  text-zinc-200 p-4 shadow-md accordion rounded-tl-lg rounded-tr-lg hover:bg-gray-700 font-semibold text-start"
                                        onClick={() => {
                                            setSelectedRequest(request);
                                            setOpenAccordionId((prev) => (prev === request.id ? null : request.id));
                                        }}
                                    >
                                        <div className='flex justify-between'>
                                            <div className='ml-6'>
                                                <FontAwesomeIcon icon={faUser} className="mr-3" />
                                                Registration request from {request.firstName}
                                            </div>
                                            <div className='mr-6'>
                                                <FontAwesomeIcon icon={openAccordionId ? faMinus : faPlus} />
                                            </div>
                                        </div>
                                    </label>
                                    {selectedRequest?.id === request.id && openAccordionId === request.id && (
                                        <div class="accordion__content overflow-hidden bg-gray-100 transition duration-500 ease-in-out">
                                            <div class="bg-white p-5 md:p-10 rounded-br-lg rounded-bl-lg shadow-xl shadow-gray-500 border border-blue-800">
                                                <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                                                    <h1 class="text-xl md:text-2xl mb-3 md:mb-8 font-semibold underline underline-offset-4 decoration-1 text-black text-center">{request.name} Request</h1>
                                                </div>
                                                <div className="flex flex-col text-start">
                                                    <div className="mb-4">
                                                        <h1 className="text-lg font-semibold underline underline-offset-2 decoration-blue-700">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-700" />
                                                            Address
                                                        </h1>
                                                        <h1>{request.address}</h1>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h1 className="text-lg font-semibold underline underline-offset-2 decoration-blue-700">
                                                            <FontAwesomeIcon icon={faPhone} className="mr-2 text-blue-700" />
                                                            Contact number
                                                        </h1>
                                                        <h1>{request.contactNumber}</h1>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h1 className="text-lg font-semibold underline underline-offset-2 decoration-blue-700">
                                                            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-700" />
                                                            Email
                                                        </h1>
                                                        <h1>{request.email}</h1>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h1 className="text-lg font-semibold underline underline-offset-2 decoration-blue-700">
                                                            <FontAwesomeIcon icon={faUserTie} className="mr-2 text-blue-700" />
                                                            Experience
                                                        </h1>
                                                        <p>{request.experience}</p>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h1 className="text-lg font-semibold underline underline-offset-2 decoration-blue-700">
                                                            <FontAwesomeIcon icon={faComment} className="mr-2 text-blue-700" />
                                                            Reason for applying
                                                        </h1>
                                                        <p>{request.reasonForApplying}</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end mt-5">
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 hover:scale-105 hover:drop-shadow-2xl text-zinc-200 font-bold py-2 px-4 rounded mr-3"

                                                    >
                                                        Decline
                                                    </button>
                                                    {isLoading ? (
                                                        <div className="inline-block animate-spin rounded-full border-t-4 border-blue-800 border-solid h-8 w-8"></div>
                                                    ) : (
                                                        <button
                                                            className="bg-gradient-to-l from-blue-800 to-violet-600 hover:bg-gradient-to-r hover:scale-105 hover:drop-shadow-2xl text-zinc-200 font-bold py-2 px-4 rounded"
                                                            onClick={handleApprove}
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
export default Requests;