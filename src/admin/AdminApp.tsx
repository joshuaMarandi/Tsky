import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './components/AdminLogin';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import Dashboard from './pages/Dashboard';
import ProductsManagement from './pages/ProductsManagement';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import SalesManagement from './pages/SalesManagement';
import DebugPanel from './pages/DebugPanel';
import './AdminApp.css';

type AdminSection = 'dashboard' | 'products' | 'add' | 'edit' | 'sales' | 'debug';

const AdminMainContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsManagement onEditProduct={() => setActiveSection('edit')} />;
      case 'add':
        return <AddProduct />;
      case 'edit':
        return <EditProduct onBackToProducts={() => setActiveSection('products')} />;
      case 'sales':
        return <SalesManagement />;
      case 'debug':
        return <DebugPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
      />
      <div className={`content-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const AdminAuthWrapper: React.FC = () => {
  const { isAuthenticated, login, loading } = useAuth();
  const [loginError, setLoginError] = useState<string>('');

  const handleLogin = async (username: string, password: string) => {
    setLoginError('');
    const success = await login(username, password);
    
    if (!success) {
      setLoginError('Invalid username or password');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={loginError} />;
  }

  return <AdminMainContent />;
};

const AdminApp: React.FC = () => {
  return (
    <AuthProvider>
      <AdminAuthWrapper />
    </AuthProvider>
  );
};

export default AdminApp;
