import { useState } from "react";
import loginStyles from "./Login.module.css";
import { getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseinit";
import { collection, addDoc, getDocs, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import cross from "../../Images/cross.png"

function Login() {
    const auth = getAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        // Sign-in user with email and password
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            navigate(`/${email}`);
        })
        .catch((error) => {
            // Error signing in user
            setError(error.message);
            console.error("Sign-in error:", error.code, error.message);
        });
    }

    return (
        <>
            <h1>Sign-In</h1>
            <form className={loginStyles.form} onSubmit={handleSubmit}>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button>Sign In</button>
                <NavLink className={loginStyles.nav} to="/sign-up"><h3>Sign-Up instead ?</h3></NavLink>

                {/* Conditional rendering for error message */}
                {error && <div className={loginStyles.error}><div className={loginStyles.errContainer}><img src={cross}></img>Invalid Username/Password</div></div>}
            </form>
        </>
    )
}

export { Login };
