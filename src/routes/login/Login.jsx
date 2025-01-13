import './Login.css'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const loginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
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
            // Aquí puedes realizar la lógica para enviar el formulario(APIcall)
            console.log('Formulario enviado:', formData);
            setSuccessMessage('Inicio de sesión exitoso');
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
                <button type="submit">Login</button>
            </form>
            {successMessage && <p className="success-dsk">{successMessage}</p>}
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default loginForm