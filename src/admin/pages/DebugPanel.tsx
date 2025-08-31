import React, { useState } from 'react';

const DebugPanel: React.FC = () => {
  const [debugOutput, setDebugOutput] = useState<string>('Click the buttons above to test your setup...');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setDebugOutput('Testing API connection...\n');
    
    try {
      // Test Products API
      const productsResponse = await fetch('/backend/api/products.php');
      const productsData = await productsResponse.json();
      
      let output = `✅ Products API Test:\n`;
      output += `   Status: ${productsResponse.status}\n`;
      output += `   Response: ${JSON.stringify(productsData, null, 2)}\n\n`;
      
      // Test Sales API
      try {
        const salesResponse = await fetch('/backend/api/sales.php');
        const salesData = await salesResponse.json();
        
        output += `✅ Sales API Test:\n`;
        output += `   Status: ${salesResponse.status}\n`;
        output += `   Response: ${JSON.stringify(salesData, null, 2)}\n\n`;
      } catch (salesError) {
        output += `❌ Sales API Test Failed:\n`;
        output += `   Error: ${salesError instanceof Error ? salesError.message : 'Unknown error'}\n\n`;
      }
      
      // Test Sold Out API
      try {
        const soldOutResponse = await fetch('/backend/api/sold-out.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_id: 1,
            sold_out: false
          })
        });
        const soldOutData = await soldOutResponse.json();
        
        output += `✅ Sold Out API Test:\n`;
        output += `   Status: ${soldOutResponse.status}\n`;
        output += `   Response: ${JSON.stringify(soldOutData, null, 2)}\n\n`;
      } catch (soldOutError) {
        output += `❌ Sold Out API Test Failed:\n`;
        output += `   Error: ${soldOutError instanceof Error ? soldOutError.message : 'Unknown error'}\n\n`;
      }
      
      output += `📊 API Test Summary:\n`;
      output += `   Products API: ${productsResponse.ok ? '✅ Working' : '❌ Failed'}\n`;
      output += `   CORS Headers: ${productsResponse.headers.get('Access-Control-Allow-Origin') ? '✅ Present' : '❌ Missing'}\n`;
      output += `   Content-Type: ${productsResponse.headers.get('Content-Type') || 'Not set'}\n`;
      
      setDebugOutput(output);
    } catch (error) {
      setDebugOutput(`❌ API Test Failed:\n${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testDatabase = async () => {
    setLoading(true);
    setDebugOutput('Testing database connection...\n');
    
    try {
      // Test database by trying to fetch products
      const response = await fetch('/backend/api/products.php');
      const data = await response.json();
      
      let output = `🗄️ Database Test Results:\n\n`;
      
      if (response.ok && data.products) {
        output += `✅ Database Connection: Working\n`;
        output += `📊 Products Count: ${data.products.length}\n`;
        output += `🏷️ Sample Product Data:\n`;
        
        if (data.products.length > 0) {
          const sampleProduct = data.products[0];
          output += `   ID: ${sampleProduct.id}\n`;
          output += `   Name: ${sampleProduct.name}\n`;
          output += `   Price: $${sampleProduct.price}\n`;
          output += `   Processor: ${sampleProduct.processor}\n`;
          output += `   RAM: ${sampleProduct.ram}\n`;
          output += `   Graphics: ${sampleProduct.graphics}\n`;
          output += `   Storage: ${sampleProduct.storage}\n`;
          output += `   Purpose: ${sampleProduct.purpose}\n`;
          output += `   Sold Out: ${sampleProduct.sold_out || false}\n`;
          output += `   Created: ${sampleProduct.created_at || 'N/A'}\n`;
          output += `   Updated: ${sampleProduct.updated_at || 'N/A'}\n\n`;
        }
        
        // Check for sold out products
        const soldOutProducts = data.products.filter((p: any) => p.sold_out);
        output += `🔴 Sold Out Products: ${soldOutProducts.length}\n`;
        
        // Check for products with tags
        const taggedProducts = data.products.filter((p: any) => p.tag);
        output += `🏷️ Products with Tags: ${taggedProducts.length}\n`;
        
        output += `\n📋 Database Schema Check:\n`;
        const requiredFields = ['id', 'name', 'processor', 'ram', 'graphics', 'storage', 'purpose', 'price'];
        const missingFields = requiredFields.filter(field => 
          data.products.length > 0 && !(field in data.products[0])
        );
        
        if (missingFields.length === 0) {
          output += `✅ All required fields present\n`;
        } else {
          output += `❌ Missing fields: ${missingFields.join(', ')}\n`;
        }
        
        // Check for sold_out field specifically
        if (data.products.length > 0 && 'sold_out' in data.products[0]) {
          output += `✅ sold_out field present in database\n`;
        } else {
          output += `❌ sold_out field missing from database\n`;
        }
        
      } else {
        output += `❌ Database Connection: Failed\n`;
        output += `Error: ${data.message || 'Unknown database error'}\n`;
      }
      
      setDebugOutput(output);
    } catch (error) {
      setDebugOutput(`❌ Database Test Failed:\n${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testFileSystem = async () => {
    setLoading(true);
    setDebugOutput('Testing file system and uploads...\n');
    
    try {
      let output = `📁 File System Test:\n\n`;
      
      // Test if we can access product images
      const response = await fetch('/backend/api/products.php');
      const data = await response.json();
      
      if (response.ok && data.products && data.products.length > 0) {
        const productsWithImages = data.products.filter((p: any) => p.image);
        output += `🖼️ Products with Images: ${productsWithImages.length}\n`;
        
        if (productsWithImages.length > 0) {
          output += `📂 Sample Image Paths:\n`;
          productsWithImages.slice(0, 3).forEach((product: any) => {
            output += `   ${product.name}: ${product.image}\n`;
          });
        }
        
        output += `\n📊 Image Statistics:\n`;
        output += `   Total Products: ${data.products.length}\n`;
        output += `   With Images: ${productsWithImages.length}\n`;
        output += `   Without Images: ${data.products.length - productsWithImages.length}\n`;
        
        // Check image accessibility
        if (productsWithImages.length > 0) {
          const sampleImage = productsWithImages[0].image;
          try {
            const imageResponse = await fetch(sampleImage);
            if (imageResponse.ok) {
              output += `✅ Sample image accessible: ${sampleImage}\n`;
            } else {
              output += `❌ Sample image not accessible: ${sampleImage}\n`;
            }
          } catch (imageError) {
            output += `❌ Error accessing sample image: ${imageError instanceof Error ? imageError.message : 'Unknown error'}\n`;
          }
        }
      } else {
        output += `❌ Could not fetch products for file system test\n`;
      }
      
      setDebugOutput(output);
    } catch (error) {
      setDebugOutput(`❌ File System Test Failed:\n${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearOutput = () => {
    setDebugOutput('Debug output cleared. Click any test button to run diagnostics...');
  };

  return (
    <div className="debug-panel">
      <h1 className="page-title">Debug Information</h1>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">System Tests</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <button 
              onClick={testAPI} 
              className="btn btn-primary"
              disabled={loading}
              style={{ marginRight: '10px' }}
            >
              {loading ? 'Testing...' : 'Test API Connection'}
            </button>
            <button 
              onClick={testDatabase} 
              className="btn btn-primary"
              disabled={loading}
              style={{ marginRight: '10px' }}
            >
              {loading ? 'Testing...' : 'Test Database'}
            </button>
            <button 
              onClick={testFileSystem} 
              className="btn btn-primary"
              disabled={loading}
              style={{ marginRight: '10px' }}
            >
              {loading ? 'Testing...' : 'Test File System'}
            </button>
            <button 
              onClick={clearOutput} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Clear Output
            </button>
          </div>
          
          <div 
            style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e1e1e1',
              borderRadius: '8px',
              padding: '15px',
              marginTop: '20px',
              fontFamily: 'monospace',
              maxHeight: '400px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          >
            {loading && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 10px' }}></div>
                <p>Running tests...</p>
              </div>
            )}
            {!loading && debugOutput}
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">System Information</h2>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <strong>Frontend:</strong>
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                <li>React.js with TypeScript</li>
                <li>Admin Panel Components</li>
                <li>Real-time API Integration</li>
              </ul>
            </div>
            <div className="form-group">
              <strong>Backend:</strong>
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                <li>PHP REST API</li>
                <li>MySQL Database</li>
                <li>File Upload Support</li>
                <li>CORS Enabled</li>
              </ul>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <strong>API Endpoints:</strong>
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                <li><code>GET /api/products.php</code> - List products</li>
                <li><code>POST /api/products.php</code> - Create product</li>
                <li><code>PUT /api/products.php?id=X</code> - Update product</li>
                <li><code>DELETE /api/products.php?id=X</code> - Delete product</li>
                <li><code>GET/POST /api/sales.php</code> - Sales management</li>
                <li><code>POST /api/sold-out.php</code> - Toggle sold out status</li>
              </ul>
            </div>
            <div className="form-group">
              <strong>Features:</strong>
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                <li>Product Management (CRUD)</li>
                <li>Sales Tracking</li>
                <li>Sold Out Status Toggle</li>
                <li>Image Upload</li>
                <li>Real-time Dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
