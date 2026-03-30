

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollAnimatedHero from '../components/ScrollAnimatedHero';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/app/products/');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load products. Please check if the backend is running.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-black">
      <Header />
      <ScrollAnimatedHero />
      <AboutSection />
      
      {/* Next Section for smooth transition */}
      <section className="relative z-20 min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-[#F8F1E3] p-20">
         <div className="max-w-6xl w-full text-center space-y-12">
            <div className="space-y-4">
               <h2 className="text-5xl md:text-7xl font-bold tracking-tight">Our Nutty Collection</h2>
               <p className="text-xl text-[#DCCFB8] font-light max-w-2xl mx-auto leading-relaxed">
                  From the heart of nature to your doorstep, we bring you the finest selection of handpicked nuts. 
               </p>
            </div>

            {loading ? (
               <div className="flex justify-center p-20">
                  <div className="w-10 h-10 border-2 border-[#F8F1E3]/25 border-t-[#F8F1E3] rounded-full animate-spin"></div>
               </div>
            ) : error ? (
               <div className="p-10 bg-red-900/20 border border-red-500/20 rounded-2xl text-red-400">
                  {error}
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
                  {products.map(product => (
                     <div key={product.id} className="group relative aspect-[4/5] bg-neutral-800 rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer shadow-2xl">
                        {product.image && (
                           <img 
                              src={product.image} 
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                           />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end items-start">
                           <span className="text-xs uppercase tracking-[0.3em] text-[#BD5319] font-bold mb-3">Premium</span>
                           <h3 className="text-3xl font-bold mb-2">{product.name}</h3>
                           <p className="text-[#DCCFB8] text-sm mb-6 line-clamp-2">{product.description}</p>
                           <div className="flex w-full items-center justify-between">
                              <span className="text-2xl font-serif italic text-[#F8F1E3]">${product.price}</span>
                              <button className="px-6 py-2 bg-[#F8F1E3] text-[#2F2218] text-xs font-bold uppercase rounded-full hover:bg-[#EADCC1] transition-colors">
                                 Add to Cart
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </section>

      <footer className="py-20 text-center text-[#CBBFA9] text-sm border-t border-white/5">
         &copy; 2026 NUTS LUXE. Premium Taste, Naturally.
      </footer>
    </div>
  );
}

export default Home;
