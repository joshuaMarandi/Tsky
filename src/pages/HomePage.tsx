import Hero from '../components/layout/Hero';
import FilterSection from '../components/filter/FilterSection';
import ProductList from '../components/product/ProductList';

const HomePage = () => {
  return (
    <>
      <Hero />
      <FilterSection />
      <ProductList />
    </>
  );
};

export default HomePage;