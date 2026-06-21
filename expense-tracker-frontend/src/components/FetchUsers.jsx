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
            const data = await fetch(endpoint,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization" : "Bearer "+token,
                        "Content-Type" : "application/json"
                    }
                }
            );

            if (!response.ok) {
                const errorData = await data.json();
                throw Error(errorData.detail)
            }
        }
        catch(err) {
            throw alert("Error deleting user: "+err)
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
                                        <td><button onClick={() => deleteUser(row.id)}>Delete User</button></td>
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