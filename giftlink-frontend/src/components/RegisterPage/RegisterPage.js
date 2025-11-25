// Step 1: Import necessary modules
import React, { useState } from 'react';
import { urlConfig } from '../../config'; // Task 1
import { useAppContext } from '../../context/AuthContext'; // Task 2
import { useNavigate } from 'react-router-dom'; // Task 3
import './RegisterPage.css';

function RegisterPage() {
    // 🧩 States for user inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Task 4: State for error message
    const [showerr, setShowerr] = useState('');

    // Task 5: Local variables for navigate and setIsLoggedIn
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    // Step 2: Handle register API call and set user details
    const handleRegister = async (e) => {
        e.preventDefault(); // prevent form reload
        setShowerr(''); // clear previous errors

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST', // Task 6: Set POST method
                headers: {      // Task 7: Set headers
                    'content-type': 'application/json',
                },
                body: JSON.stringify({   // Task 8: Set body to send user details
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            });

            const json = await response.json(); // Task 1: Access data from backend

            if (json.authtoken) {
                // Task 2: Set user details in sessionStorage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);

                // Task 3: Set state of user to logged in
                setIsLoggedIn(true);

                // Task 4: Navigate to MainPage
                navigate('/app');
            } else {
                // Task 5: Set error message if registration fails
                setShowerr(json.error || 'Registration failed');
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setShowerr("Something went wrong. Please try again."); // Task 6: Display error message
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        {showerr && (
                            <div className="alert alert-danger" role="alert">
                                {showerr}
                            </div>
                        )}

                        <form onSubmit={handleRegister}>
                            <div className="form-group mb-3">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="form-control"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="form-control"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group mb-4">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Register
                            </button>
                        </form>

                        <p className="mt-4 text-center">
                            Already a member?{' '}
                            <a href="/app/login" className="text-primary">
                                Login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;