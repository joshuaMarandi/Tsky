import { useProductContext } from '../../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faUndo } from '@fortawesome/free-solid-svg-icons';

const FilterSection = () => {
  const { filters, setFilters, resetFilters, convertToTZS } = useProductContext();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <section id="filter-section" className="filter-section">
      <div className="container">
        <h2>Find Your PC by Specifications</h2>
        <div className="filter-container">
          <div className="filter-group">
            <label htmlFor="processor">Processor</label>
            <select 
              id="processor" 
              name="processor" 
              value={filters.processor}
              onChange={handleFilterChange}
            >
              <option value="">Any Processor</option>
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
          <div className="filter-group">
            <label htmlFor="ram">RAM</label>
            <select 
              id="ram" 
              name="ram" 
              value={filters.ram}
              onChange={handleFilterChange}
            >
              <option value="">Any RAM</option>
              <option value="4gb">4GB</option>
              <option value="8gb">8GB</option>
              <option value="16gb">16GB</option>
              <option value="32gb">32GB</option>
              <option value="64gb">64GB</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="graphics">Graphics Card</label>
            <select 
              id="graphics" 
              name="graphics" 
              value={filters.graphics}
              onChange={handleFilterChange}
            >
              <option value="">Any Graphics Card</option>
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
          <div className="filter-group">
            <label htmlFor="storage">Storage</label>
            <select 
              id="storage" 
              name="storage" 
              value={filters.storage}
              onChange={handleFilterChange}
            >
              <option value="">Any Storage</option>
              <option value="ssd-256">256GB SSD</option>
              <option value="ssd-512">512GB SSD</option>
              <option value="ssd-1tb">1TB SSD</option>
              <option value="hdd-1tb">1TB HDD</option>
              <option value="ssd-2tb">2TB SSD</option>
              <option value="hdd-2tb">2TB HDD</option>
              <option value="combo-ssd-hdd">SSD + HDD Combo</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="purpose">Purpose</label>
            <select 
              id="purpose" 
              name="purpose" 
              value={filters.purpose}
              onChange={handleFilterChange}
            >
              <option value="">Any Purpose</option>
              <option value="gaming">Gaming</option>
              <option value="office">Office/Home</option>
              <option value="workstation">Workstation</option>
              <option value="design">Design/Creative</option>
              <option value="streaming">Streaming</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="priceRange">Price Range (up to TZS {convertToTZS(filters.priceRange).toLocaleString()})</label>
            <div className="price-range">
              <input 
                type="range" 
                id="priceRange" 
                name="priceRange" 
                min="500" 
                max="5000" 
                step="100" 
                value={filters.priceRange}
                onChange={handleFilterChange}
              />
              <span className="price-display">TZS {convertToTZS(filters.priceRange).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="filter-buttons">
          <button className="btn btn-primary" onClick={() => setFilters(filters)}>
            <FontAwesomeIcon icon={faFilter} /> Apply Filters
          </button>
          <button className="btn btn-secondary" onClick={resetFilters}>
            <FontAwesomeIcon icon={faUndo} /> Reset Filters
          </button>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;