import React, { useState } from 'react';

interface ProductFormData {
  name: string;
  processor: string;
  ram: string;
  graphics: string;
  storage: string;
  purpose: string;
  price: string;
  tag: string;
  specs: string;
}

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    processor: '',
    ram: '',
    graphics: '',
    storage: '',
    purpose: '',
    price: '',
    tag: '',
    specs: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.processor || !formData.ram || !formData.graphics || 
        !formData.storage || !formData.purpose || !formData.price) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const submitFormData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value);
      });
      
      // Add file if selected
      if (selectedFile) {
        submitFormData.append('product_image', selectedFile);
      }

      const response = await fetch('/backend/api/products.php', {
        method: 'POST',
        body: submitFormData
      });

      const result = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        // Reset form
        setFormData({
          name: '',
          processor: '',
          ram: '',
          graphics: '',
          storage: '',
          purpose: '',
          price: '',
          tag: '',
          specs: ''
        });
        setSelectedFile(null);
        setImagePreview(null);
        
        // Reset file input
        const fileInput = document.getElementById('add-image') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        throw new Error(result.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      processor: '',
      ram: '',
      graphics: '',
      storage: '',
      purpose: '',
      price: '',
      tag: '',
      specs: ''
    });
    setSelectedFile(null);
    setImagePreview(null);
    
    // Reset file input
    const fileInput = document.getElementById('add-image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="add-product">
      <h1 className="page-title">Add New Product</h1>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Product Information</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="add-name">Product Name *</label>
              <input
                type="text"
                id="add-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="add-processor">Processor *</label>
                <select
                  id="add-processor"
                  name="processor"
                  value={formData.processor}
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
                <label htmlFor="add-ram">RAM *</label>
                <select
                  id="add-ram"
                  name="ram"
                  value={formData.ram}
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
                <label htmlFor="add-graphics">Graphics *</label>
                <select
                  id="add-graphics"
                  name="graphics"
                  value={formData.graphics}
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
                <label htmlFor="add-storage">Storage *</label>
                <select
                  id="add-storage"
                  name="storage"
                  value={formData.storage}
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
                <label htmlFor="add-purpose">Purpose *</label>
                <select
                  id="add-purpose"
                  name="purpose"
                  value={formData.purpose}
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
                <label htmlFor="add-price">Price *</label>
                <input
                  type="number"
                  id="add-price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="add-image">Product Image</label>
                <input
                  type="file"
                  id="add-image"
                  name="product_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <small className="form-text">Upload a product image (JPG, PNG, SVG, etc.)</small>
                {imagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="add-tag">Tag</label>
                <input
                  type="text"
                  id="add-tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  placeholder="e.g., Best Seller, Budget, Premium"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="add-specs">Specifications</label>
              <textarea
                id="add-specs"
                name="specs"
                value={formData.specs}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief specification summary"
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
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={resetForm}
            disabled={loading}
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
