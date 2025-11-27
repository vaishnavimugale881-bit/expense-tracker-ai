import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import uploadImage from "../Dashboard/utils/uploadImage";
import { BASE_URL, API_PATHS } from "../Dashboard/utils/apiPath";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Additional validation: check name, email, password are present
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setLoading(false);
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    let profileImageUrl = "";
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic); // uploads to /api/v1/upload
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      // Debugging: log registration payload
      console.log({
        name: form.name,
        email: form.email,
        password: form.password,
        profileImageUrl
      });

      const response = await axios.post(
        BASE_URL + API_PATHS.AUTH.REGISTER, // always use config
        {
          name: form.name,
          email: form.email,
          password: form.password,
          profileImageUrl,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      } else {
        setError("Signup failed: No token returned");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Sign up failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-violet-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border-t-8 border-purple-600">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-1 text-center">Budget Buddy</h1>
        <h2 className="text-md font-medium text-purple-600 mb-1 text-center">Create an Account</h2>
        <p className="text-purple-600 mb-4 text-center">Sign up to start tracking your expenses</p>
        {error && <div className="text-red-500 mb-3 text-center">{error}</div>}
        {/* Avatar Upload Section */}
        <div className="flex justify-center mb-4 relative">
          <div className="relative group">
            <img
              src={previewUrl || "https://www.w3schools.com/howto/img_avatar.png"}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full bg-purple-200 object-cover border-4 border-purple-300"
            />
            <button
              type="button"
              className="absolute bottom-2 right-2 bg-purple-700 hover:bg-purple-800 text-white rounded-full p-2 shadow group-hover:opacity-100 opacity-90 transition"
              onClick={handleAvatarClick}
              style={{ zIndex: 2 }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 16v-6m0 0l-4 4m4-4l4 4" />
                <rect x="4" y="4" width="16" height="16" rx="8" stroke="currentColor" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="name" type="text" placeholder="Name" className="border border-purple-300 rounded px-3 py-2 focus:outline-purple-400 text-purple-700" value={form.name} onChange={handleChange} required autoComplete="name" />
          <input name="email" type="email" placeholder="Email" className="border border-purple-300 rounded px-3 py-2 focus:outline-purple-400 text-purple-700" value={form.email} onChange={handleChange} required autoComplete="username" />
          <input name="password" type="password" placeholder="Password" className="border border-purple-300 rounded px-3 py-2 focus:outline-purple-400 text-purple-700" value={form.password} onChange={handleChange} required autoComplete="new-password" />
          <input name="confirm" type="password" placeholder="Confirm Password" className="border border-purple-300 rounded px-3 py-2 focus:outline-purple-400 text-purple-700" value={form.confirm} onChange={handleChange} required autoComplete="new-password" />
          <button type="submit" className="bg-purple-700 text-white rounded px-4 py-2 font-bold hover:bg-purple-800 transition" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-xs text-center">
          Already have an account?{" "}
          <a href="/login" className="text-purple-700 font-semibold hover:underline">Log in here</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
