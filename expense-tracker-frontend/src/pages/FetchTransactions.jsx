import {useState} from 'react';


function FetchTransactions({token, adhoctrigger, triggerSetter}) {

    const [loading, setLoading] = useState(false);

    async function getTransactions() {
        const endpoint = "http://localhost:8000/transactions/fetch";
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
        }
        catch(err) {
                throw alert("Error logging in: "+err);
            }
        finally {
            setLoading(false)
            triggerSetter(false)
        }
    };

    if (adhoctrigger) {return getTransactions()};
    return <h3>{getTransactions}</h3>
}

export default FetchTransactions;