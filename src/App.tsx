import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import AdminApp from './admin/AdminApp';
import './App.css'

function App() {
  return (
    <ProductProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Admin Route */}
            <Route path="/admin" element={<AdminApp />} />
            
            {/* Public Routes */}
            <Route path="/*" element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    {/* Add more routes as needed */}
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ProductProvider>
  )
}

export default App
