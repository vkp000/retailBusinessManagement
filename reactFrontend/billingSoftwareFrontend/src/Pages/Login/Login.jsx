import { useContext, useState } from 'react';
import './Login.css';
import toast from 'react-hot-toast';
import { login } from '../../Service/AuthService';
import { AppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/Asset';

const Login = () => {
    const { setAuthData } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ email: "", password: "" });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData(d => ({ ...d, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(data);
            if (response.status === 200) {
                toast.success("Welcome back!");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                setAuthData(response.data.token, response.data.role);
                navigate("/dashboard");
            }
        } catch (err) {
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <img src={assets.logo} alt="Logo" height="36" />
                </div>
                <h1 className="login-title">Sign in</h1>
                <p className="login-sub">Enter your credentials to continue</p>

                <form onSubmit={onSubmitHandler}>
                    <label className="login-label">Email</label>
                    <input
                        className="login-input"
                        type="text" name="email"
                        placeholder="yourname@example.com"
                        onChange={onChangeHandler}
                        value={data.email}
                        autoComplete="email"
                    />
                    <label className="login-label">Password</label>
                    <input
                        className="login-input"
                        type="password" name="password"
                        placeholder="Enter your password"
                        onChange={onChangeHandler}
                        value={data.password}
                        autoComplete="current-password"
                    />
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in →"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;