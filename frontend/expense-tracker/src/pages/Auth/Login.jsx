import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/inputs/Inputs";
import { validateEmail } from "../Dashboard/utils/helper";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); // persist user across refreshes
        updateUser(user);                                    // update context for current session
        navigate("/dashboard");
      } else {
        setError("Login failed: no token returned");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-violet-200 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border-t-8 border-violet-500">
        <h1 className="text-3xl font-extrabold text-violet-600 mb-1 text-center">Budget Buddy</h1>
        <h2 className="text-md font-medium text-slate-700 mb-1 text-center">An Expense Tracker</h2>
        <p className="text-slate-700 mb-8 text-center">Please enter your details to log in</p>
        <form className="space-y-5" onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="john@example.com"
            name="email"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
            name="password"
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary w-full rounded mt-3 transition ${isLoading ? "opacity-60 cursor-not-allowed" : "bg-violet-500 hover:bg-violet-600"}`}
          >
            {isLoading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
        <p className="text-sm text-slate-700 mt-7 text-center">
          Don't have an account?{" "}
          <Link className="font-semibold text-violet-700 underline" to="/signup">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
