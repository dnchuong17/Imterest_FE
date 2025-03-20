import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import '../style/navbar.css';
import apiClient from '../api/apiClient';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.trim() === '') {
                setSuggestions([]);
                return;
            }

            setIsSearching(true);
            try {
                const res = await apiClient.get(`/images/search?title=${searchTerm}`);
                const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
                setDropdownOpen(false);
                setSuggestions(data || []);
            } catch (error) {
                console.error('Error fetching search suggestions:', error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimeout = setTimeout(fetchSuggestions, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/search?query=${searchTerm}`);
            setSearchTerm('');
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.title);
        setSuggestions([]);
        navigate(`/search?query=${suggestion.title}`);
        setSearchTerm('');
    };

    const handleCreateImageClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/create-image');
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDropdownToggle = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleProfileClick = () => {
        setDropdownOpen(false);
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="navbar-wrapper">
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/" className="home-btn">
                        <img src="/logo.svg" alt="Home" className="logo-image"/>
                    </Link>
                    <button className="create-btn" onClick={handleCreateImageClick}>
                        Create Image
                    </button>
                </div>

                <div className="search-container">
                    <FaSearch className="search-icon"/>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />

                    {suggestions.length > 0 && (
                        <div className="suggestion-list">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index} // Ensure a unique key
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)} // Handle suggestion click
                                >
                                    {suggestion.title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Section */}
                <div className="navbar-right">
                    {user ? (
                        <div className="dropdown" ref={dropdownRef}>
                            <button className="avatar" onClick={handleDropdownToggle}>
                                {user.name.charAt(0).toUpperCase()}
                            </button>
                            {dropdownOpen && (
                                <div className="dropdown-menu right">
                                    <Link to="/profile" onClick={handleProfileClick}>Profile</Link>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="login-register-links">
                            <Link to="/login" className="login-btn">Login</Link>
                            <Link to="/register" className="register-btn">Register</Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
