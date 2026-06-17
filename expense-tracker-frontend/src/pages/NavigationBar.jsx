
// import { Outlet } from "react-router";
import { Outlet, Link, useNavigate } from "react-router-dom";


function Layout({ onLogout }) {

    function handleLogout() {
        onLogout();
        useNavigate("/");
    }

    return (

        <div className="layout-container">
        
            {/* Left Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>My Expense Tracker</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/transactions">Transactions</Link>
                    <Link to="/settings">Settings</Link>
                    <button type="button" onClick={onLogout} itemID="logoutButton" >
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content Area (where child components render) */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;