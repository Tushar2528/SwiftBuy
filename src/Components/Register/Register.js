import { useState } from "react";
import registerStyles from "./Register.module.css";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../../firebaseinit";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from 'firebase/firestore';



function Register() {


  

 
  const auth = getAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    // Create user with email and password
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with the provided name
      await updateProfile(user, {
        displayName: name
      });

      // Store user email in the Firestore database
      const usersCollectionRef = collection(db, "users");
      await addDoc(usersCollectionRef, { email });

      // Navigate to the desired page
      navigate(`/${email}`);
    } catch (error) {
      // Error creating user
      setError(error.message);
      console.error("User creation error:", error.code, error.message);
    }
  }

  return (
    <>
      <h1>Sign Up</h1>
      <form className={registerStyles.form} onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
        {error && <p>{error}</p>}
      </form>
    </>
  );
}

export { Register };






