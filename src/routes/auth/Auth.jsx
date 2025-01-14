import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Login.css';
import './Register.css';

const LoginForm = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Formulario enviado:', formData);
            setSuccessMessage('Inicio de sesión exitoso');
            setFormData({
                email: '',
                password: ''
            });
        }
    };

    return (
        <div className="login-container-dsk">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group-dsk">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group-dsk">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <button className="login-button-dsk" type="submit">Login</button>
            </form>
            {successMessage && <p className="success-dsk">{successMessage}</p>}
            <p>Don't have an account? <button onClick={onToggle} className="link-button">Register</button></p>
        </div>
    );
}

const RegisterForm = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};
        if (!formData.userName) {
            newErrors.userName = 'El nombre de usuario es obligatorio';
        }
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La confirmación de contraseña es obligatoria';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Formulario enviado:', formData);
            setSuccessMessage('Registro exitoso');
            setFormData({
                userName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        }
    };

    return (
        <div className="register-container-dsk">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group-dsk">
                    <label htmlFor="userName">Username:</label>
                    <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} />
                    {errors.userName && <span className="error">{errors.userName}</span>}
                </div>
                <div className="form-group-dsk">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group-dsk">
                    <label htmlFor="password">Password:</label>   
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div className="form-group-dsk">
                    <label htmlFor="confirmPassword">Confirm password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
                <button className="register-button-dsk" type="submit">Register</button>
            </form>
            {successMessage && <p className="success-dsk">{successMessage}</p>}
            <p>Already have an account? <button onClick={onToggle} className="link-button">Login</button></p>
        </div>
    );
}

const AuthPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');

    useEffect(() => {
        // Actualizamos isLogin cuando cambian los searchParams
        setIsLogin(searchParams.get('mode') !== 'register');
    }, [searchParams]);

    useEffect(() => {
        setSearchParams({ mode: isLogin ? 'login' : 'register' });
    }, [isLogin, setSearchParams]);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <>
            {isLogin 
                ? <LoginForm onToggle={toggleForm} />
                : <RegisterForm onToggle={toggleForm} />
            }
        </>
    );
};

export default AuthPage;