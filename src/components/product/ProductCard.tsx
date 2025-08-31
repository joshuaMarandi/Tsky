import { Link } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';

interface ProductCardProps {
  id: number;
  name: string;
  specs: string;
  price: number;
  image: string;
  tag?: string;
  sold_out?: boolean;
}

const ProductCard = ({ id, name, specs, price, image, tag, sold_out }: ProductCardProps) => {
  const { formatPrice } = useProductContext();

  return (
    <div className={`product-card ${sold_out ? 'sold-out' : ''}`}>
      {tag && <div className="product-tag">{tag}</div>}
      <div className="product-image">
        <img src={image} alt={name} />
        {sold_out && (
          <div className="sold-out-overlay">
            <span className="sold-out-text top-right">SOLD OUT</span>
            <span className="sold-out-text bottom-left">SOLD OUT</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3>{name}</h3>
        <p className="product-specs">{specs}</p>
        <div className="product-price">{formatPrice(price)}</div>
        <div className="product-actions">
          <Link 
            to={`/product/${id}`} 
            className={`btn btn-primary ${sold_out ? 'disabled' : ''}`}
          >
            View Details
          </Link>
          <button 
            className={`btn btn-secondary ${sold_out ? 'disabled' : ''}`}
            disabled={sold_out}
            onClick={() => {
              const message = `Habari, nahitaji kununua hii laptop Tafadhali nihudumie:\n\nProduct ID: ${id}\nName: ${name}\nSpecs: ${specs}\nPrice: ${formatPrice(price)}\n\nNaomba kujua Taratibu zinazohitajika.`;
              const whatsappUrl = `https://wa.me/+255759007588?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            {sold_out ? 'Sold Out' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;