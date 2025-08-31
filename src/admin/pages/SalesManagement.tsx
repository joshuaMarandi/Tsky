import React, { useState, useEffect } from 'react';

interface Sale {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  sale_date: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const SalesManagement: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    price: '',
    sale_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  // Add keyboard event listener for ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showAddModal) {
        closeModal();
      }
    };

    if (showAddModal) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal]);

  const loadSales = async () => {
    try {
      const response = await fetch('/backend/api/sales.php');
      const data = await response.json();
      
      if (response.ok && data.sales) {
        // Ensure price values are numeric
        const salesWithNumericPrices = data.sales.map((sale: any) => ({
          ...sale,
          price: parseFloat(String(sale.price || 0))
        }));
        setSales(salesWithNumericPrices);
      } else {
        setSales([]);
      }
    } catch (error) {
      console.error('Error loading sales:', error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch('/backend/api/products.php');
      const data = await response.json();
      
      if (response.ok && data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill price when product is selected
    if (name === 'product_id' && value) {
      const selectedProduct = products.find(p => p.id.toString() === value);
      if (selectedProduct) {
        setFormData(prev => ({
          ...prev,
          price: selectedProduct.price.toString()
        }));
      }
    }
  };

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_id || !formData.price || !formData.sale_date) {
      alert('Please fill in all fields.');
      return;
    }

    const selectedProduct = products.find(p => p.id.toString() === formData.product_id);
    if (!selectedProduct) {
      alert('Please select a valid product.');
      return;
    }

    const saleData = {
      product_id: parseInt(formData.product_id),
      product_name: selectedProduct.name,
      price: parseFloat(formData.price),
      sale_date: formData.sale_date
    };

    try {
      const response = await fetch('/backend/api/sales.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saleData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Sale added successfully!');
        setShowAddModal(false);
        setFormData({
          product_id: '',
          price: '',
          sale_date: new Date().toISOString().split('T')[0]
        });
        loadSales(); // Reload sales list
      } else {
        throw new Error(result.message || 'Failed to add sale');
      }
    } catch (error) {
      console.error('Error adding sale:', error);
      alert('Error adding sale: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const deleteSale = async (saleId: number) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) {
      return;
    }

    try {
      const response = await fetch(`/backend/api/sales.php?id=${saleId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        alert('Sale deleted successfully!');
        loadSales();
      } else {
        throw new Error(result.message || 'Failed to delete sale');
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      alert('Error deleting sale: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const closeModal = () => {
    setShowAddModal(false);
    setFormData({
      product_id: '',
      price: '',
      sale_date: new Date().toISOString().split('T')[0]
    });
  };

  const totalRevenue = sales.reduce((sum, sale) => {
    const price = parseFloat(String(sale.price || 0));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  if (loading) {
    return (
      <div className="sales-management">
        <h1 className="page-title">Manage Sales</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="sales-management">
      <h1 className="page-title">Manage Sales</h1>

      {/* Sales Summary */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>{sales.length}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Sales History */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Sales History</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            Add Sale
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                      No sales found
                    </td>
                  </tr>
                ) : (
                  sales.map(sale => (
                    <tr key={sale.id}>
                      <td>{sale.id}</td>
                      <td>{sale.product_name}</td>
                      <td>{formatCurrency(sale.price)}</td>
                      <td>{formatDate(sale.sale_date)}</td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteSale(sale.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Sale Modal */}
      {showAddModal && (
        <div 
          className="modal" 
          style={{ display: 'flex' }}
          onClick={(e) => {
            // Close modal when clicking on backdrop
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Sale</h2>
              <span className="close" onClick={closeModal}>&times;</span>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSale}>
                <div className="form-group">
                  <label htmlFor="sale-product-select">Product *</label>
                  <select
                    id="sale-product-select"
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a product...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sale-price">Price *</label>
                  <input
                    type="number"
                    id="sale-price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sale-date">Date *</label>
                  <input
                    type="date"
                    id="sale-date"
                    name="sale_date"
                    value={formData.sale_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Add Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
