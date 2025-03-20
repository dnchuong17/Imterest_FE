import { useState, useEffect } from 'react';
import {Link, useLocation} from 'react-router-dom';
import apiClient from '../api/apiClient';
import '../style/gallery.css';

const Search = () => {
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim()) {
                searchImages(query);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const searchImages = async (searchQuery) => {
        setIsSearching(true);
        setError(null);

        try {
            const res = await apiClient.get(`/images/search?title=${searchQuery}`);
            console.log(res.data);
            const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            if (data) {
                setResults(data);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div style={{padding: '20px'}}>
            <h1 style={{textAlign: 'center'}}>Search Results for "{query}"</h1>

            {isSearching && <p style={{textAlign: 'center'}}>Searching...</p>}

            {error && <p style={{textAlign: 'center', color: 'red'}}>{error}</p>}

            <div className="gallery-grid">
                {results.length > 0 ? (
                    results.map((img) => (
                        <div key={img.id} className="image-card">
                            <Link to={`/image/${img.id}`}>
                                <img src={img.url} alt={img.title}/>
                            </Link>
                            <div className="image-overlay">
                                <h3>{img.title}</h3>
                            </div>
                        </div>
                    ))
                ) : (
                    !isSearching && <p style={{textAlign: 'center'}}>No images found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;
