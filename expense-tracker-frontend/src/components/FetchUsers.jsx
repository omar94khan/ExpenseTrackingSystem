import {useState, useEffect} from 'react';
import { apiFetch } from '../api';

function FetchUsers({token, refreshCount, setRefreshCount}) {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    async function getUsers() {
        const endpoint = "/users/fetchAll";
        const options = {
                    method: "GET"
                };

        setLoading(true);
        
        try {
            const response = await apiFetch(endpoint, options);

            if (!response) {return};

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
        const endpoint = "/users/delete/"+user_id;
        const options = {
                    method: "DELETE"
                };
        setLoading(true)

        try {
            const response = await apiFetch(endpoint, options);

            if (!response) return

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
        const endpoint = "/users/admin/promote?user_id="+user_id+"&isAdmin="+adminToggle
        const options = {
                    method: "POST"
                }; 
        setLoading(true)

        try {
            const response = await apiFetch(endpoint, options)

            if (!response) {return};

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
                                        <td>{row.email ? row.email : "Not Available"}</td>
                                        <td>{row.email_verified ? "True" : "False"}</td>
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
                            <th>Email</th>
                            <th>Verified</th>
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