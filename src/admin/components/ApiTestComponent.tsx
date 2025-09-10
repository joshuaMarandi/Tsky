import React, { useState } from 'react';

const ApiTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testProductsAPI = async () => {
    setLoading(true);
    setTestResults('Testing Products API...\n');

    try {
      const response = await fetch('/backend/api/products.php');
      const data = await response.json();

      setTestResults(prev => prev + `✅ Products API: ${response.status} - ${data.products ? data.products.length : 0} products found\n`);
    } catch (error) {
      setTestResults(prev => prev + `❌ Products API Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
  };

  const testAuthAPI = async () => {
    setLoading(true);
    setTestResults('Testing Auth API...\n');

    try {
      const response = await fetch('/backend/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'login',
          username: 'admin',
          password: 'admin123'
        })
      });

      const data = await response.json();

      if (data.success) {
        setTestResults(prev => prev + `✅ Auth API: Login successful for ${data.user.username}\n`);
      } else {
        setTestResults(prev => prev + `❌ Auth API: ${data.message}\n`);
      }
    } catch (error) {
      setTestResults(prev => prev + `❌ Auth API Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
  };

  const testSoldOutAPI = async () => {
    setLoading(true);
    setTestResults('Testing Sold-Out API...\n');

    try {
      const response = await fetch('/backend/api/sold-out.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: 1,
          sold_out: false
        })
      });

      const data = await response.json();

      if (data.success) {
        setTestResults(prev => prev + `✅ Sold-Out API: Product status updated successfully\n`);
      } else {
        setTestResults(prev => prev + `❌ Sold-Out API: ${data.error || 'Unknown error'}\n`);
      }
    } catch (error) {
      setTestResults(prev => prev + `❌ Sold-Out API Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults('Running all API tests...\n\n');

    await testProductsAPI();
    setTestResults(prev => prev + '\n');
    await testAuthAPI();
    setTestResults(prev => prev + '\n');
    await testSoldOutAPI();

    setTestResults(prev => prev + '\n✅ All tests completed!');
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h3>API Connectivity Test</h3>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runAllTests}
          disabled={loading}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Run All Tests'}
        </button>
        <button
          onClick={testProductsAPI}
          disabled={loading}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Products API
        </button>
        <button
          onClick={testAuthAPI}
          disabled={loading}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Auth API
        </button>
        <button
          onClick={testSoldOutAPI}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Sold-Out API
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e1e1',
          borderRadius: '4px',
          padding: '15px',
          minHeight: '200px',
          whiteSpace: 'pre-wrap',
          fontSize: '14px'
        }}
      >
        {testResults || 'Click a test button to begin...'}
      </div>
    </div>
  );
};

export default ApiTestComponent;
