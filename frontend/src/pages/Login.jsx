import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/app/users/login/`, {
        email,
        password,
      });

      const { access, refresh, message } = response.data;

      if (!access || !refresh) {
        setErrorMessage('Login response is missing tokens. Please try again.');
        return;
      }

      const targetStorage = rememberMe ? localStorage : sessionStorage;
      const alternateStorage = rememberMe ? sessionStorage : localStorage;

      alternateStorage.removeItem('accessToken');
      alternateStorage.removeItem('refreshToken');
      alternateStorage.removeItem('userEmail');

      targetStorage.setItem('accessToken', access);
      targetStorage.setItem('refreshToken', refresh);
      targetStorage.setItem('userEmail', email);
      window.dispatchEvent(new Event('auth-changed'));

      setSuccessMessage(message || 'Login successful.');
      setTimeout(() => {
        navigate('/');
      }, 400);
    } catch (error) {
      const apiError =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Login failed. Please check your credentials and try again.';

      setErrorMessage(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#F8F1E3] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(189,83,25,0.25),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(248,241,227,0.12),_transparent_35%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_35px_80px_rgba(0,0,0,0.7)] bg-neutral-950/80 backdrop-blur-xl">
          <section className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#2F2218] via-[#241a13] to-black border-r border-white/10">
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.35em] uppercase text-[#DCCFB8]">Welcome Back</p>
              <h1 className="text-4xl font-bold leading-tight">
                Nuts<span className="text-[#BD5319]">Luxe</span> Member Area
              </h1>
              <p className="text-[#DCCFB8] text-sm leading-relaxed max-w-sm">
                Sign in to manage orders, save your favorites, and keep your premium selections one click away.
              </p>
            </div>

            <div className="space-y-3 text-sm text-[#E7D9C2]">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#BD5319]" />
                Track orders in real-time
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#BD5319]" />
                Access members-only bundles
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#BD5319]" />
                Faster checkout experience
              </p>
            </div>
          </section>

          <section className="p-7 sm:p-10 md:p-12">
            <div className="mb-8">
              <p className="text-[11px] tracking-[0.35em] uppercase text-[#DCCFB8] mb-3">Account Login</p>
              <h2 className="text-3xl font-bold">Sign in</h2>
              <p className="text-sm text-[#CBBFA9] mt-2">Use your account credentials to access your member experience.</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {errorMessage && (
                <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {successMessage}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-[#DCCFB8]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-[#BD5319] focus:outline-none text-[#F8F1E3] placeholder:text-[#CBBFA9]/50 transition-colors"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-[#DCCFB8]">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-[#BD5319] focus:outline-none text-[#F8F1E3] placeholder:text-[#CBBFA9]/50 transition-colors"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#DCCFB8]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="accent-[#BD5319]"
                  />
                  Remember me
                </label>
                <button type="button" className="text-[#F8F1E3] hover:text-[#BD5319] transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#F8F1E3] text-[#2F2218] font-bold uppercase tracking-[0.2em] hover:bg-[#EADCC1] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-sm text-[#CBBFA9] flex items-center justify-between gap-4">
              <Link
                to="/register"
                className="px-4 py-2 rounded-full border border-white/20 text-[#F8F1E3] hover:border-[#BD5319] hover:text-[#BD5319] transition-colors"
              >
                New customer? Create account
              </Link>
              <Link
                to="/"
                className="px-4 py-2 rounded-full border border-white/20 text-[#F8F1E3] hover:border-[#BD5319] hover:text-[#BD5319] transition-colors"
              >
                Back Home
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
