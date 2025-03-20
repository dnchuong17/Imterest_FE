import { useState, useContext } from 'react';
import { login as loginAPI } from '../api/auth.js';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../style/auth.css';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const parseJwt = (token) => {
        console.log(token);
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = JSON.parse(atob(base64));
            return jsonPayload;
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = await loginAPI(form.email, form.password);

            if (token) {
                const decoded = parseJwt(token);
                console.log('Token decoded: ', decoded);

                login(token, {
                    name: decoded.payload.name,
                    userId: decoded.payload.id
                });

                alert('Login successful!');
                navigate('/');
            } else {
                alert('Login failed.');
            }
        } catch (error) {
            console.error("Login request failed:", error);
            alert("Login request failed. Check console for details.");
        }
    };


    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
