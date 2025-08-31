import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart, faShare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, formatPrice } = useProductContext();
  const [mainImage, setMainImage] = useState('');
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Find the current product
  const product = products.find(p => p.id === Number(id));

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      setIsImageLoading(true);

      // Find similar products (same purpose or processor)
      const similar = products
        .filter(p => 
          (p.purpose === product.purpose || p.processor === product.processor) && 
          p.id !== product.id
        )
        .slice(0, 3);

      setSimilarProducts(similar);
    }
  }, [product, products]);

  const changeMainImage = (newImage: string) => {
    setIsImageLoading(true);
    setMainImage(newImage);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    const message = `Habari, nahitaji kununua hii laptop Tafadhali nihudumie:\n\nProduct ID: ${product?.id}\nName: ${product?.name}\nSpecs: ${product?.specs}\nPrice: ${formatPrice(product?.price || 0)}\nQuantity: ${quantity}\nTotal: ${formatPrice((product?.price || 0) * quantity)}\n\nNaomba kujua Taratibu zinazohitajika.`;
    const whatsappUrl = `https://wa.me/+255759007588?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // Add wishlist logic here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out this ${product?.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist.</p>
          <Link to="/" className="btn btn-primary">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Helper functions to get readable names
  const getProcessorName = (processorCode: string) => {
    const processorMap: { [key: string]: string } = {
      'intel-i3': 'Intel Core i3',
      'intel-i5': 'Intel Core i5',
      'intel-i7': 'Intel Core i7',
      'intel-i9': 'Intel Core i9',
      'amd-ryzen3': 'AMD Ryzen 3',
      'amd-ryzen5': 'AMD Ryzen 5',
      'amd-ryzen7': 'AMD Ryzen 7',
      'amd-ryzen9': 'AMD Ryzen 9'
    };
    return processorMap[processorCode] || processorCode;
  };

  const getRamName = (ramCode: string) => {
    const ramMap: { [key: string]: string } = {
      '4gb': '4GB DDR4',
      '8gb': '8GB DDR4',
      '16gb': '16GB DDR4',
      '32gb': '32GB DDR4',
      '64gb': '64GB DDR4'
    };
    return ramMap[ramCode] || ramCode;
  };

  const getGraphicsName = (graphicsCode: string) => {
    const graphicsMap: { [key: string]: string } = {
      'integrated': 'Integrated Graphics',
      'nvidia-gtx1650': 'NVIDIA GTX 1650',
      'nvidia-gtx1660': 'NVIDIA GTX 1660',
      'nvidia-rtx3050': 'NVIDIA RTX 3050',
      'nvidia-rtx3060': 'NVIDIA RTX 3060',
      'nvidia-rtx3070': 'NVIDIA RTX 3070',
      'nvidia-rtx3080': 'NVIDIA RTX 3080',
      'amd-rx6500': 'AMD RX 6500',
      'amd-rx6600': 'AMD RX 6600',
      'amd-rx6700': 'AMD RX 6700',
      'amd-rx6800': 'AMD RX 6800'
    };
    return graphicsMap[graphicsCode] || graphicsCode;
  };

  const getStorageName = (storageCode: string) => {
    const storageMap: { [key: string]: string } = {
      'ssd-256': '256GB SSD',
      'ssd-512': '512GB SSD',
      'ssd-1tb': '1TB SSD',
      'ssd-2tb': '2TB SSD',
      'hdd-1tb': '1TB HDD',
      'hdd-2tb': '2TB HDD',
      'combo-ssd-hdd': '512GB SSD + 2TB HDD'
    };
    return storageMap[storageCode] || storageCode;
  };

  const getPurposeName = (purposeCode: string) => {
    const purposeMap: { [key: string]: string } = {
      'gaming': 'Gaming',
      'office': 'Office/Home',
      'workstation': 'Workstation',
      'design': 'Design/Creative',
      'streaming': 'Streaming'
    };
    return purposeMap[purposeCode] || purposeCode;
  };

  return (
    <div className="container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {product.name}
      </div>

      <div className="product-detail">
        <div className="product-gallery">
          <div className="main-image">
            {isImageLoading && <div className="image-loading">Loading...</div>}
            <img 
              src={mainImage} 
              alt={product.name}
              onLoad={handleImageLoad}
              style={{ opacity: isImageLoading ? 0.5 : 1 }}
            />
          </div>
          <div className="thumbnail-container">
            <div 
              className={`thumbnail ${mainImage === product.image ? 'active' : ''}`} 
              onClick={() => changeMainImage(product.image)}
            >
              <img src={product.image} alt="Main view" />
            </div>
            {/* Additional thumbnails would be added here in a real application */}
            <div 
              className={`thumbnail ${mainImage === product.image ? '' : 'active'}`} 
              onClick={() => changeMainImage(product.image)}
            >
              <img src={product.image} alt="Side view" />
            </div>
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1>{product.name}</h1>
            <div className="product-actions-header">
              <button 
                className={`btn-icon ${isWishlisted ? 'active' : ''}`}
                onClick={handleWishlistToggle}
                title="Add to Wishlist"
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button 
                className="btn-icon"
                onClick={handleShare}
                title="Share Product"
              >
                <FontAwesomeIcon icon={faShare} />
              </button>
            </div>
          </div>

          <div className="product-price-detail">{formatPrice(product.price)}</div>

          <div className="product-specs-detail">
            <h3>Specifications:</h3>
            <ul>
              <li>
                <strong>Processor:</strong> 
                <span>{getProcessorName(product.processor)}</span>
              </li>
              <li>
                <strong>RAM:</strong> 
                <span>{getRamName(product.ram)}</span>
              </li>
              <li>
                <strong>Graphics:</strong> 
                <span>{getGraphicsName(product.graphics)}</span>
              </li>
              <li>
                <strong>Storage:</strong> 
                <span>{getStorageName(product.storage)}</span>
              </li>
              <li>
                <strong>Purpose:</strong> 
                <span>{getPurposeName(product.purpose)}</span>
              </li>
            </ul>
          </div>

          <div className="product-description">
            <h3>Description:</h3>
            <p>
              The {product.name} is a powerful {getPurposeName(product.purpose).toLowerCase()} computer 
              designed to deliver exceptional performance. With its {getProcessorName(product.processor)}, 
              {getRamName(product.ram)} memory, and {getGraphicsName(product.graphics)} graphics, 
              this PC can handle all your computing needs with ease.
            </p>
          </div>

          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                min="1"
                max="10"
              />
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button className="btn btn-primary" onClick={handleBuyNow}>
              <FontAwesomeIcon icon={faShoppingCart} /> Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="similar-products">
        <h2>Similar Products</h2>
        <div className="product-grid">
          {similarProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              specs={product.specs}
              price={product.price}
              image={product.image}
              tag={product.tag}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;