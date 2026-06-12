import { useState, useEffect } from 'react';

function UserCard({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // ← add this

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError(error.message);  // ← store error in state
            } finally {
                setLoading(false);  // ← always runs, success or failure
            }
        }

        fetchUser();
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Company: {user.company.name}</p>
        </div>
    );
}

export default UserCard;