import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API_REQUEST_TIMEOUT_MS = 12000;

const AddToCart = ({ productId, quantity = 1, className = '', navigateToCart = true }) => {
  const navigate = useNavigate();
  const { clearCartCount, refreshCartCount } = useCart();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState({ type: 'idle', message: '' });

  const handleAddToCart = async () => {
    setFeedback({ type: 'idle', message: '' });
    const normalizedQuantity = Math.max(1, Number(quantity) || 1);

    const accessToken =
      localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

    if (!accessToken) {
      setFeedback({ type: 'error', message: 'Please sign in to add items to your cart.' });
      setTimeout(() => {
        navigate('/login');
      }, 600);
      return;
    }

    setIsAdding(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/app/cart/add/${productId}/`,
        { quantity: normalizedQuantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: API_REQUEST_TIMEOUT_MS,
        },
      );

      setFeedback({
        type: 'success',
        message: response.data?.message || 'Item added to cart.',
      });
      await refreshCartCount();

      if (navigateToCart) {
        setTimeout(() => {
          navigate('/cart');
        }, 450);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('userEmail');
        clearCartCount();
        window.dispatchEvent(new Event('auth-changed'));
        setFeedback({ type: 'error', message: 'Session expired. Please log in again.' });
        setTimeout(() => {
          navigate('/login');
        }, 600);
      } else {
        const message =
          (error.code === 'ECONNABORTED' && 'Request timed out. Please try again.') ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          'Could not add this item to cart. Please try again.';

        setFeedback({ type: 'error', message });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const defaultButtonClass =
    'px-6 py-2 bg-[#F8F1E3] text-[#2F2218] text-xs font-bold uppercase rounded-full hover:bg-[#EADCC1] transition-colors';

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`${className || defaultButtonClass} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>

      {feedback.message && (
        <p
          className={`text-[11px] font-medium ${
            feedback.type === 'success' ? 'text-emerald-300' : 'text-red-300'
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
};

export default AddToCart;
