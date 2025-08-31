import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="top-header">
      <button 
        className="toggle-sidebar"
        onClick={onToggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>
      
      <form className="header-search" onSubmit={handleSearch}>
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search products, sales..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      
      <div className="header-actions">
        <button className="header-btn" title="Notifications">
          <i className="fas fa-bell"></i>
        </button>
        <button className="header-btn" title="Messages">
          <i className="fas fa-envelope"></i>
        </button>
        <button className="header-btn" title="Settings">
          <i className="fas fa-cog"></i>
        </button>
        
        <div className="header-profile">
          <div className="profile-avatar">
            A
          </div>
          <span>Admin</span>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
