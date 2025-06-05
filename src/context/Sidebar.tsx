import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css";

const Sidebar: React.FC = () => {
    const buttonStyle: React.CSSProperties = {
        display: 'block',
        width: '100%',
        padding: '10px 20px',
        margin: '10px 0',
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        textAlign: 'left',
        textDecoration: 'none',
        fontWeight: 'bold',
        cursor: 'pointer'
    };

    return (
        <div style={{ width: '220px', background: '#f5f5f5', padding: '1.5rem', height: '100vh', minHeight: '1000px' }}>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li><Link to="/dashboard" style={buttonStyle}>Dashboard</Link></li>
                    <li><Link to="/users" style={buttonStyle}>Users</Link></li>
                    <li><Link to="/items" style={buttonStyle}>Items</Link></li>
                    <li><Link to="/stock" style={buttonStyle}>Stock</Link></li>
                    <li><Link to="/login" style={buttonStyle}>Login</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
