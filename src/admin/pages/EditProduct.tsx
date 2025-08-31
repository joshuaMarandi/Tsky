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

interface EditProductProps {
  onBackToProducts: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ onBackToProducts }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadProductsForEdit();
  }, []);

  const loadProductsForEdit = async () => {
    try {
      const response = await fetch('/backend/api/products.php');
      const data = await response.json();
      
      if (response.ok && data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error loading products for edit:', error);
    }
  };

  const handleProductSelect = async (productId: string) => {
    if (!productId) {
      setSelectedProduct(null);
      setImagePreview(null);
      return;
    }

    try {
      const response = await fetch(`/backend/api/products.php?id=${productId}`);
      const product = await response.json();
      
      if (response.ok) {
        setSelectedProduct(product);
        setImagePreview(product.image || null);
      }
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!selectedProduct) return;
    
    const { name, value } = e.target;
    setSelectedProduct(prev => prev ? {
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    } : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      alert('Please select a product to edit.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Add all product fields
      formData.append('id', selectedProduct.id.toString());
      formData.append('name', selectedProduct.name);
      formData.append('processor', selectedProduct.processor);
      formData.append('ram', selectedProduct.ram);
      formData.append('graphics', selectedProduct.graphics);
      formData.append('storage', selectedProduct.storage);
      formData.append('purpose', selectedProduct.purpose);
      formData.append('price', selectedProduct.price.toString());
      formData.append('specs', selectedProduct.specs);
      formData.append('tag', selectedProduct.tag || '');
      formData.append('_method', 'PUT');
      
      // Add file if selected
      if (selectedFile) {
        formData.append('product_image', selectedFile);
      } else if (selectedProduct.image) {
        formData.append('current_image', selectedProduct.image);
      }

      const response = await fetch(`/backend/api/products.php?id=${selectedProduct.id}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert('Product updated successfully!');
        // Reload products list
        loadProductsForEdit();
        // Clear selection
        setSelectedProduct(null);
        setSelectedFile(null);
        setImagePreview(null);
        
        // Reset select dropdown
        const select = document.getElementById('edit-product-select') as HTMLSelectElement;
        if (select) {
          select.value = '';
        }
      } else {
        throw new Error(result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (!selectedProduct) {
      alert('Please select a product to delete.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${selectedProduct.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/backend/api/products.php?id=${selectedProduct.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        alert('Product deleted successfully!');
        // Reload products list
        loadProductsForEdit();
        // Clear selection
        setSelectedProduct(null);
        setSelectedFile(null);
        setImagePreview(null);
        
        // Reset select dropdown
        const select = document.getElementById('edit-product-select') as HTMLSelectElement;
        if (select) {
          select.value = '';
        }
      } else {
        throw new Error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const cancelEdit = () => {
    setSelectedProduct(null);
    setSelectedFile(null);
    setImagePreview(null);
    
    // Reset select dropdown
    const select = document.getElementById('edit-product-select') as HTMLSelectElement;
    if (select) {
      select.value = '';
    }
  };

  return (
    <div className="edit-product">
      <h1 className="page-title">Edit Product</h1>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Select Product</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="edit-product-select">Choose a product to edit</label>
            <select
              id="edit-product-select"
              onChange={(e) => handleProductSelect(e.target.value)}
            >
              <option value="">Select a product...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (ID: {product.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {selectedProduct && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header">
            <h2 className="card-title">Edit Product Information</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="edit-name">Product Name *</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={selectedProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-processor">Processor *</label>
                  <select
                    id="edit-processor"
                    name="processor"
                    value={selectedProduct.processor}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Processor</option>
                    <option value="intel-i3">Intel Core i3</option>
                    <option value="intel-i5">Intel Core i5</option>
                    <option value="intel-i7">Intel Core i7</option>
                    <option value="intel-i9">Intel Core i9</option>
                    <option value="amd-ryzen3">AMD Ryzen 3</option>
                    <option value="amd-ryzen5">AMD Ryzen 5</option>
                    <option value="amd-ryzen7">AMD Ryzen 7</option>
                    <option value="amd-ryzen9">AMD Ryzen 9</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-ram">RAM *</label>
                  <select
                    id="edit-ram"
                    name="ram"
                    value={selectedProduct.ram}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select RAM</option>
                    <option value="4gb">4GB DDR4</option>
                    <option value="8gb">8GB DDR4</option>
                    <option value="16gb">16GB DDR4</option>
                    <option value="32gb">32GB DDR4</option>
                    <option value="64gb">64GB DDR4</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-graphics">Graphics *</label>
                  <select
                    id="edit-graphics"
                    name="graphics"
                    value={selectedProduct.graphics}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Graphics</option>
                    <option value="integrated">Integrated Graphics</option>
                    <option value="nvidia-gtx1650">NVIDIA GTX 1650</option>
                    <option value="nvidia-gtx1660">NVIDIA GTX 1660</option>
                    <option value="nvidia-rtx3050">NVIDIA RTX 3050</option>
                    <option value="nvidia-rtx3060">NVIDIA RTX 3060</option>
                    <option value="nvidia-rtx3070">NVIDIA RTX 3070</option>
                    <option value="nvidia-rtx3080">NVIDIA RTX 3080</option>
                    <option value="amd-rx6500">AMD RX 6500</option>
                    <option value="amd-rx6600">AMD RX 6600</option>
                    <option value="amd-rx6700">AMD RX 6700</option>
                    <option value="amd-rx6800">AMD RX 6800</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-storage">Storage *</label>
                  <select
                    id="edit-storage"
                    name="storage"
                    value={selectedProduct.storage}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Storage</option>
                    <option value="ssd-256">256GB SSD</option>
                    <option value="ssd-512">512GB SSD</option>
                    <option value="ssd-1tb">1TB SSD</option>
                    <option value="ssd-2tb">2TB SSD</option>
                    <option value="hdd-1tb">1TB HDD</option>
                    <option value="hdd-2tb">2TB HDD</option>
                    <option value="combo-ssd-hdd">512GB SSD + 2TB HDD</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-purpose">Purpose *</label>
                  <select
                    id="edit-purpose"
                    name="purpose"
                    value={selectedProduct.purpose}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Purpose</option>
                    <option value="gaming">Gaming</option>
                    <option value="office">Office/Home</option>
                    <option value="workstation">Workstation</option>
                    <option value="design">Design/Creative</option>
                    <option value="streaming">Streaming</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-price">Price *</label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={selectedProduct.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-image">Product Image</label>
                  <input
                    type="file"
                    id="edit-image"
                    name="product_image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="form-text">Upload a new product image (JPG, PNG, SVG, etc.)</small>
                  {imagePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={imagePreview}
                        alt="Current/Preview"
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="edit-tag">Tag</label>
                  <input
                    type="text"
                    id="edit-tag"
                    name="tag"
                    value={selectedProduct.tag || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-specs">Specifications</label>
                <textarea
                  id="edit-specs"
                  name="specs"
                  value={selectedProduct.specs}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </form>
          </div>
          <div className="card-footer">
            <button 
              type="submit" 
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Updating Product...' : 'Update Product'}
            </button>
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={deleteProduct}
              disabled={loading}
            >
              Delete Product
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={cancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={onBackToProducts}
              disabled={loading}
            >
              Back to Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
