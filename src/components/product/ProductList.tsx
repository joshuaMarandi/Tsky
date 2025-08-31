import { useProductContext } from '../../context/ProductContext';
import ProductCard from './ProductCard';

const ProductList = () => {
  const { filteredProducts, loading, error, fetchProducts } = useProductContext();

  const handleRetry = () => {
    fetchProducts();
  };

  if (loading) {
    return (
      <section className="products-section">
        <div className="container">
          <h2>Available PCs</h2>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="container">
        <h2>Available PCs</h2>
        
        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={handleRetry} className="btn btn-primary">
              Retry Loading
            </button>
          </div>
        )}
        
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products match your filter criteria. Please try different filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                specs={product.specs}
                price={product.price}
                image={product.image}
                tag={product.tag}
                sold_out={product.sold_out}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;