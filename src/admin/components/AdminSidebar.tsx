import React from 'react';

type AdminSection = 'dashboard' | 'products' | 'add' | 'edit' | 'sales' | 'debug';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  collapsed
}) => {
  const menuItems = [
    {
      id: 'dashboard' as AdminSection,
      label: 'Dashboard',
      icon: 'fas fa-chart-pie'
    },
    {
      id: 'products' as AdminSection,
      label: 'Manage Products',
      icon: 'fas fa-boxes'
    },
    {
      id: 'add' as AdminSection,
      label: 'Add Product',
      icon: 'fas fa-plus-circle'
    },
    {
      id: 'edit' as AdminSection,
      label: 'Edit Product',
      icon: 'fas fa-edit'
    },
    {
      id: 'sales' as AdminSection,
      label: 'Manage Sales',
      icon: 'fas fa-chart-line'
    },
    {
      id: 'debug' as AdminSection,
      label: 'Debug Panel',
      icon: 'fas fa-bug'
    }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <a href="#" className="sidebar-logo">
          Tsky Technologies
        </a>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.id} className="menu-item">
            <button
              className={`menu-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              <i className={`menu-icon ${item.icon}`}></i>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
