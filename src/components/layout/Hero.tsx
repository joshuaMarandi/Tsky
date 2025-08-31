import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h2>Find Your Perfect PC</h2>
          <p>Browse our extensive collection of custom and pre-built PCs</p>
          <Link to="/#filter-section" className="btn btn-primary">Start Browsing</Link>
        </div>
      </div>
    </section>
  );
};
export default Hero;