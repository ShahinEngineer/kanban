import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import logo from '../../assets/logo.png';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            login();
            navigate('/');
        }, 800);
    };

    return (
        <div className="login-page">
            <div className="login-hero">
                <div className="login-hero__content">
                    <h1 className="login-hero__quote">
                        "Construction is the art of making a meaningful whole out of many parts."
                    </h1>
                    <p className="login-hero__author">Building the Future with SolveX</p>
                </div>
            </div>

            <div className="login-form-container">
                <div className="login-header">
                    <img src={logo} alt="SolveX" className="login-logo" />
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Please enter your details to sign in.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <a href="#" className="login-forgot">Forgot Password?</a>

                    <Button className="login-button" type="submit" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                <div className="login-footer">
                    Don't have an account?
                    <a href="#" className="login-link">Sign up</a>
                </div>
            </div>
        </div>
    );
};
