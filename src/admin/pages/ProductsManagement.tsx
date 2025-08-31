import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  processor: string;
  ram: string;
  graphics: string;
  storage: string;
  purpose: string;
  price: number;
  image: string;
  specs: string;
  tag?: string;
  sold_out?: boolean | number | string;
  created_at?: string;
  updated_at?: string;
}

interface ProductsManagementProps {
  onEditProduct: () => void;
}

const ProductsManagement: React.FC<ProductsManagementProps> = ({ onEditProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/backend/api/products.php');
      const data = await response.json();
      
      if (response.ok && data.products) {
        setProducts(data.products);
      } else {
        setError('No products found.');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Error loading products: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleSoldOutStatus = async (productId: number, soldOut: boolean) => {
    try {
      const response = await fetch('/backend/api/sold-out.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: productId,
          sold_out: soldOut
        })
      });

      const rawText = await response.text();
      console.log('Raw API Response:', rawText);

      let result;
      try {
        result = JSON.parse(rawText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response that failed to parse:', rawText);
        throw new Error(`API returned invalid JSON: ${rawText}`);
      }

      if (response.ok && result.success) {
        // Update the product in the state
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { ...product, sold_out: soldOut }
              : product
          )
        );
        
        // Show success message
        alert(`Product ${soldOut ? 'marked as sold out' : 'marked as available'} successfully!`);
      } else {
        throw new Error(result.message || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Error toggling sold out status:', error);
      alert('Error updating product status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/backend/api/products.php?id=${productId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        alert('Product deleted successfully!');
      } else {
        throw new Error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const formatPrice = (price: number | string | null | undefined) => {
    // Convert to number and handle invalid values
    const numericPrice = parseFloat(String(price || 0));
    
    // If the result is NaN, return a default value
    if (isNaN(numericPrice)) {
      return 'TSh 0.00';
    }
    
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS'
    }).format(numericPrice);
  };

  if (loading) {
    return (
      <div className="products-management">
        <h1 className="page-title">Products Catalog</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-management">
      <h1 className="page-title">Products Catalog</h1>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Products</h2>
          <button className="btn btn-sm btn-primary" onClick={onEditProduct}>
            Add New
          </button>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Processor</th>
                  <th>RAM</th>
                  <th>Price</th>
                  <th>Purpose</th>
                  <th>Tag</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map(product => {
                    const isSoldOut = product.sold_out === true || product.sold_out === 1 || product.sold_out === '1';
                    const statusText = isSoldOut ? 'SOLD OUT' : 'AVAILABLE';
                    const statusColor = isSoldOut ? '#dc3545' : '#28a745';
                    const toggleButtonText = isSoldOut ? 'Mark Available' : 'Mark Sold Out';
                    const toggleButtonClass = isSoldOut ? 'btn-success' : 'btn-warning';
                    
                    return (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.processor}</td>
                        <td>{product.ram}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.purpose}</td>
                        <td>{product.tag || '-'}</td>
                        <td>
                          <span style={{ color: statusColor, fontWeight: 'bold' }}>
                            {statusText}
                          </span>
                        </td>
                        <td>
                          <button 
                            className={`btn ${toggleButtonClass} btn-sm`}
                            style={{ marginRight: '5px' }}
                            onClick={() => toggleSoldOutStatus(product.id, !isSoldOut)}
                          >
                            {toggleButtonText}
                          </button>
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ marginRight: '5px' }}
                            onClick={onEditProduct}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;
