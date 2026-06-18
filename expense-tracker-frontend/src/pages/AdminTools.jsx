import BankManagement  from "./BankManagement";

function AdminTools({token}) {




    return <div><h1>Admin Control Panel</h1><BankManagement token={token} /></div>
}

export default AdminTools;