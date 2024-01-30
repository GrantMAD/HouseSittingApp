import "../index.css";
import { db } from '../firebase';
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollectionRef = collection(db, 'users');
                const querySnapshot = await getDocs(usersCollectionRef);
                const usersData = querySnapshot.docs.map(doc => doc.data());
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

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

    const updateUserRole = async (userUid, newRole) => {
        try {
            const usersCollectionRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersCollectionRef);
            
            const userDoc = querySnapshot.docs.find(doc => doc.data().uid === userUid);
            
            if (userDoc) {
                const userDocRef = doc(db, 'users', userDoc.id);
                await updateDoc(userDocRef, { role: newRole });
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.uid === userUid ? { ...user, role: newRole } : user
                    )
                );
            } else {
                console.error(`User with UID ${userUid} does not exist.`);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };
    
    

    return (
        <div className="min-h-screen md:p-10 lg:pt-24 lg:pb-24 lg:px-10">
            <div className="flex justify-center pt-20 md:pt-10 pb-5">
                <h1 className="text-3xl md:text-4xl text-black font-semibold underline underline-offset-8 decoration-2 decoration-blue-700">Users</h1>
            </div>
            <p>This page is here to allow admins to view all users that have currently signed up. This page is only visible to admins.</p>
            <div className="mt-5">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-1/4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Name</th>
                            <th className="w-1/4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Email</th>
                            <th className="w-1/4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Rating</th>
                            <th className="w-1/ px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Role</th>
                            
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.uid}>
                                <td className="w-1/4 px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="w-1/4 px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="flex justify-center px-6 py-4 whitespace-nowrap"><StarRating rating={user.roundedRating} /></td>
                                <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                                <select
                                        value={user.role}
                                        onChange={e => updateUserRole(user.uid, e.target.value)}
                                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}
export default Users;