import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { cartCount, clearCartCount, isCartLoading } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')),
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')));
    };

    window.addEventListener('storage', syncAuthState);
    window.addEventListener('auth-changed', syncAuthState);
    syncAuthState();

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('auth-changed', syncAuthState);
    };
  }, []);

  const clearAuthStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userEmail');
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      clearAuthStorage();
      clearCartCount();
      setIsLoggedIn(false);
      setMobileMenuOpen(false);
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/');
      return;
    }

    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Shop', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Sourcing', href: '#' },
    { name: 'Reviews', href: '#' },
  ];
  const cartBadgeValue = isCartLoading ? '...' : cartCount > 99 ? '99+' : cartCount;

  return (
    <nav 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl transition-all duration-500 ease-out ${
        isScrolled ? 'top-4' : 'top-8'
      }`}
    >
      <div 
        className={`relative flex items-center justify-between px-6 py-3 md:px-10 md:py-4 transition-all duration-500 border border-white/10 ${
          isScrolled 
            ? 'bg-black/60 backdrop-blur-xl rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]' 
            : 'bg-white/5 backdrop-blur-md rounded-[2.5rem]'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 bg-[#BD5319] rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
             <span className="text-[#F8F1E3] font-bold text-xs">N</span>
          </div>
          <span className="text-[#F8F1E3] font-bold tracking-[0.2em] uppercase text-sm md:text-base">
            Nuts<span className="text-[#BD5319]">Luxe</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-[#E4D6BF] hover:text-[#F8F1E3] text-[11px] uppercase tracking-[0.3em] font-bold transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#BD5319] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-[#E4D6BF] hover:text-[#F8F1E3] transition-colors">
            <Search size={18} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="relative cursor-pointer group"
            aria-label="Open cart"
          >
            <ShoppingCart size={18} className="text-[#E4D6BF] group-hover:text-[#F8F1E3] transition-colors" />
            <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-[#BD5319] text-[#FFF4E0] text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartBadgeValue}
            </span>
          </button>
          <button
            type="button"
            onClick={handleAuthAction}
            className="hidden sm:flex items-center gap-2 px-5 py-2 bg-[#F8F1E3] text-[#2F2218] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#BD5319] hover:text-[#FFF4E0] transition-all duration-300"
          >
            <User size={14} />
            <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
          </button>
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-[#F8F1E3]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-4 p-8 bg-black/90 backdrop-blur-2xl rounded-[2rem] border border-white/10 md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-[#F8F1E3] text-lg font-bold tracking-[0.2em] uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr className="w-full border-white/10" />
              <button
                type="button"
                onClick={handleAuthAction}
                className="w-full py-4 bg-[#F8F1E3] text-[#2F2218] font-bold uppercase tracking-widest text-xs rounded-full text-center"
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
