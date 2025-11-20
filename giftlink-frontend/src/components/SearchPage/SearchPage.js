import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';
import './SearchPage.css';

function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);
    
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];
    const navigate = useNavigate();

    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect').value,
            condition: document.getElementById('conditionSelect').value,
        }).toString();

        try {
            const response = await fetch(`${baseUrl}?${queryParams}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    {/* Search Bar */}
                    <div className="search-bar mb-4">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search for items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-primary search-btn" onClick={handleSearch}>
                            Search
                        </button>
                    </div>

                    {/* Filters Section */}
                    <div className="filter-section mb-4 p-3 border rounded">
                        <h5>Filters</h5>
                        
                        {/* Category Dropdown */}
                        <label htmlFor="categorySelect">Category</label>
                        <select id="categorySelect" className="form-control my-2">
                            <option value="">All</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        {/* Condition Dropdown */}
                        <label htmlFor="conditionSelect">Condition</label>
                        <select id="conditionSelect" className="form-control my-2">
                            <option value="">All</option>
                            {conditions.map(condition => (
                                <option key={condition} value={condition}>{condition}</option>
                            ))}
                        </select>

                        {/* Age Range Slider */}
                        <label htmlFor="ageRange">Less than {ageRange} years</label>
                        <input
                            type="range"
                            className="form-control-range age-slider"
                            id="ageRange"
                            min="1"
                            max="10"
                            value={ageRange}
                            onChange={(e) => setAgeRange(e.target.value)}
                        />
                    </div>

                    {/* Search Results */}
                    <div className="search-results">
                        {searchResults.length > 0 ? (
                            searchResults.map(product => (
                                <div key={product.id} className="card product-card mb-3">
                                    {product.image && (
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="card-img-top product-image"
                                        />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">
                                            {product.description?.slice(0, 100)}...
                                        </p>
                                    </div>
                                    <div className="card-footer">
                                        <button 
                                            onClick={() => goToDetailsPage(product.id)} 
                                            className="btn btn-primary"
                                        >
                                            View More
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info no-results" role="alert">
                                No products found. Please revise your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;