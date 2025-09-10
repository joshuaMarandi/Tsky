import React from 'react';
import ApiTestComponent from '../components/ApiTestComponent';

const DebugPanel: React.FC = () => {
  return (
    <div className="debug-panel">
      <h1 className="page-title">Debug Information</h1>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">API Connectivity Test</h2>
        </div>
        <div className="card-body">
          <ApiTestComponent />
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
