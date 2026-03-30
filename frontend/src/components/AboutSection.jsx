import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section className="relative py-24 md:py-40 bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <span className="text-[#BD5319] text-xs font-black uppercase tracking-[0.5em]">Our Legacy</span>
              <h2 className="text-5xl md:text-7xl font-bold text-[#F8F1E3] tracking-tighter leading-tight font-serif italic">
                From Earth’s Heart <br/> to Your Table
              </h2>
            </div>
            
            <div className="space-y-8 text-[#DCCFB8] text-lg font-light leading-relaxed max-w-xl">
              <p>
                At NUTS LUXE, we believe that the true essence of nature lies in its simplicity. 
                Our journey begins in the world’s most fertile soils, where each nut is nurtured 
                by expert hands and sun-kissed perfection.
              </p>
              <p>
                We don’t just source nuts; we curate experiences. Our master roasters use 
                time-honored techniques to bring out the deepest aromatic profiles, ensuring 
                that every crunch tells a story of quality, passion, and heritage.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 pt-6">
              <div className="space-y-1">
                <p className="text-[#F8F1E3] text-4xl font-bold font-serif">100%</p>
                <p className="text-[#BD5319] text-[10px] uppercase tracking-widest font-black">Organic Sourcing</p>
              </div>
              <div className="w-[1px] h-12 bg-white/10 hidden sm:block" />
              <div className="space-y-1">
                <p className="text-[#F8F1E3] text-4xl font-bold font-serif">30+</p>
                <p className="text-[#BD5319] text-[10px] uppercase tracking-widest font-black">Premium Varieties</p>
              </div>
              <div className="w-[1px] h-12 bg-white/10 hidden sm:block" />
              <div className="space-y-1">
                <p className="text-[#F8F1E3] text-4xl font-bold font-serif">Hand</p>
                <p className="text-[#BD5319] text-[10px] uppercase tracking-widest font-black">Picked Quality</p>
              </div>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl skew-y-1"
          >
            <img 
              src="/images/about/harvest.png" 
              alt="Harvesting high quality nuts" 
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating Detail */}
            <div className="absolute bottom-10 right-10 left-10 p-8 glass-dark rounded-[2rem] border border-white/10">
               <p className="text-white font-serif italic text-xl">"The secret is in the soil."</p>
               <span className="text-[#BD5319] text-[9px] uppercase tracking-widest font-bold mt-2 block">&mdash; Master Harvester</span>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Decorative Texture/Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#BD5319]/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default AboutSection;
