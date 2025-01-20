import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { login, register } from '../../utils/api/fetch';  
import './Login.css';
import './Register.css';

const LoginForm = ({ onToggle }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await login(formData.email, formData.password);
                
                if (response.success) {
                    const { token, userId } = response.data;
                    localStorage.setItem('token', token);


                    window.dispatchEvent(new Event('login'));
                    
                    localStorage.setItem('userId', userId);

                    setSuccessMessage('Inicio de sesión exitoso');
                    setFormData({
                        email: '',
                        password: ''
                    });
                    navigate('/'); // Redirigir a la página principal por ahora
                } else {
                    setErrors({ 
                        submit: response.message || 'Error al iniciar sesión' 
                    });
                }
            } catch (error) {
                setErrors({ submit: 'Error en el servidor' });
            } finally {
                setIsLoading(false);
            }
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                {errors.submit && <div className="error">{errors.submit}</div>}
                <button className="login-button-dsk" type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
            </form>
            {successMessage && <p className="success-dsk">{successMessage}</p>}
            <p>Don't have an account? <button onClick={onToggle} className="link-button" disabled={isLoading}>Register</button></p>
        </div>
    );
}

const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>-_]/.test(password);
    
    const errors = [];
    if (!minLength) errors.push('tener al menos 6 caracteres');
    if (!hasUpperCase) errors.push('incluir al menos una mayúscula');
    if (!hasLowerCase) errors.push('incluir al menos una minúscula');
    if (!hasSpecialChar) errors.push('incluir al menos un carácter especial');
    
    return {
        isValid: minLength && hasUpperCase && hasLowerCase && hasSpecialChar,
        errorMessage: errors.length > 0 ? `La contraseña debe ${errors.join(', ')}` : ''
    };
};

const RegisterForm = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmedPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) {
            newErrors.username = 'El nombre de usuario es obligatorio';
        }
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        
        const passwordValidation = validatePassword(formData.password);
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.errorMessage;
        }
        
        if (!formData.confirmedPassword) {
            newErrors.confirmedPassword = 'La confirmación de contraseña es obligatoria';
        } else if (formData.confirmedPassword !== formData.password) {
            newErrors.confirmedPassword = 'Las contraseñas no coinciden';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await register(
                    formData.email,
                    formData.username,
                    formData.password,
                    formData.confirmedPassword
                );
                
                if (response.success) {
                    setSuccessMessage('Registro exitoso');
                    setFormData({
                        email: '',
                        username: '',
                        password: '',
                        confirmedPassword: ''
                    });
                    onToggle(); // Redirige al login
                } else {
                    setErrors({ 
                        submit: response.message || 'Error al registrar usuario' 
                    });
                }
            } catch (error) {
                setErrors({ 
                    submit: error.message || 'Error en el servidor' 
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="register-container-dsk">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group-dsk">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group-dsk">
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    {errors.username && <span className="error">{errors.username}</span>}
                </div>
                <div className="form-group-dsk">
                    <label htmlFor="password">Password:</label>   
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div className="form-group-dsk">
                    <label htmlFor="confirmedPassword">Confirm password:</label>
                    <input 
                        type="password" 
                        id="confirmedPassword" 
                        name="confirmedPassword" 
                        value={formData.confirmedPassword} 
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    {errors.confirmedPassword && <span className="error">{errors.confirmedPassword}</span>}
                </div>
                {errors.submit && <div className="error">{errors.submit}</div>}
                <button className="register-button-dsk" type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Register'}
                </button>
            </form>
            {successMessage && <p className="success-dsk">{successMessage}</p>}
            <p>Already have an account? <button onClick={onToggle} className="link-button" disabled={isLoading}>Login</button></p>
        </div>
    );
}

const AuthPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');

    useEffect(() => {
        // Si el usuario está autenticado, redirigir a la página principal
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
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