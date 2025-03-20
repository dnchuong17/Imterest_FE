import './style/auth.css';
import './style/gallery.css';
import './style/components.css';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Profile from "./pages/Profile";
import ImageDetail from "./pages/ImageDetail";
import Search from "./pages/Search";
import Navbar from './components/Navbar';
import CreateImage from "./pages/CreateImage";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/create-image" element={<CreateImage />} />
                        <Route path="/image/:id" element={<ImageDetail />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}
