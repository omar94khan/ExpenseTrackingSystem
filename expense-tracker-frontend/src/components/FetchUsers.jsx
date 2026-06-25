import {useState, useEffect} from 'react';


function FetchUsers({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    async function getUsers() {
        const endpoint = "http://localhost:8000/users/fetchAll";
        setLoading(true);
        
        try {
            const response = await fetch(endpoint,
                        {
                            method: "GET",
                            headers : {
                                    "Authorization": "Bearer " + token,
                                    "Content-Type": "application/json"
                                }
                        }
                    );
                if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail);
                    }

                const data = await response.json();
                setUsers(data);
        }
        catch(err) {
                throw alert("Error fetching users: "+err);
            }
        finally {
            setLoading(false)
        }
    };

    
    async function deleteUser(user_id) {
        const endpoint = "http://localhost:8000/users/delete/"+user_id;
        setLoading(true)

        try {
            const response = await fetch(endpoint,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization" : "Bearer "+token,
                        "Content-Type" : "application/json"
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw Error(errorData.detail)
            }

            setRefreshCount((e) => e+1)
        }
        catch(err) {
            throw alert("Error deleting user: "+err)
        }
        finally {
            setLoading(false)
        }
    };

    async function promoteUser(user_id, adminToggle) {
        const endpoint = "http://localhost:8000/users/admin/promote?user_id="+user_id+"&isAdmin="+adminToggle
        setLoading(true)

        try {
            const response = await fetch(endpoint,
                {
                    method: "POST",
                    headers: {
                        "Authorization" : "Bearer "+token,
                        "Content-Type" : "application/json"
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw Error(errorData.detail)
            }

            setRefreshCount((e) => e+1)
            alert("User Admin status successfully changed.")
        }
        catch(err) {
            throw alert("Error changing user Admin status: "+err)
        }
        finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        getUsers();
    }, [refreshCount]);

    function populateTable() {
        return users.map((row) =>   <tr>
                                        <td>{row.id}</td>
                                        <td>{row.username}</td>
                                        <td>{row.created_on}</td>
                                        <td>{row.isAdmin ? "Granted" : "Not Granted"}</td>
                                        <td><button onClick={() => deleteUser(row.id)}>Delete User</button></td>
                                        <td><button onClick={() => promoteUser(row.id, row.isAdmin ? false : true)}>Toggle Admin</button></td>
                                    </tr>);
        };



    return (<div className='users-management-div'>
               <h3>List of Users</h3>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Created On</th>
                            <th>Admin Rights</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {populateTable()}
                    </tbody>
                </table>
            
            </div>)
}

export default FetchUsers;