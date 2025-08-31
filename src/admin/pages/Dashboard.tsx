import React, { useState, useEffect } from 'react';

interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  soldOutProducts: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    soldOutProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products count
      const productsResponse = await fetch('/backend/api/products.php');
      const productsData = await productsResponse.json();
      const totalProducts = productsData.products ? productsData.products.length : 0;
      const soldOutProducts = productsData.products ? 
        productsData.products.filter((p: any) => p.sold_out).length : 0;

      // Fetch sales data
      const salesResponse = await fetch('/backend/api/sales.php');
      const salesData = await salesResponse.json();
      const totalSales = salesData.sales ? salesData.sales.length : 0;
      const totalRevenue = salesData.sales ? 
        salesData.sales.reduce((sum: number, sale: any) => sum + parseFloat(sale.price), 0) : 0;

      setStats({
        totalProducts,
        totalSales,
        totalRevenue,
        soldOutProducts
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string | null | undefined) => {
    // Convert to number and handle invalid values
    const numericAmount = parseFloat(String(amount || 0));
    
    // If the result is NaN, return a default value
    if (isNaN(numericAmount)) {
      return 'TSh 0.00';
    }
    
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS'
    }).format(numericAmount);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="page-title">Dashboard</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products">
            <i className="fas fa-boxes"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orders">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalSales}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon users">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.soldOutProducts}</h3>
            <p>Sold Out Products</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="card-body">
          <p>Welcome to Tsky Technologies Admin Panel. Use the sidebar to navigate between different sections.</p>
          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" style={{ marginRight: '10px' }}>
              <i className="fas fa-plus"></i> Add New Product
            </button>
            <button className="btn btn-success" style={{ marginRight: '10px' }}>
              <i className="fas fa-chart-line"></i> View Sales Report
            </button>
            <button className="btn btn-secondary">
              <i className="fas fa-cog"></i> System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
