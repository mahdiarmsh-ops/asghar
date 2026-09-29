import React from "react";
import { ArrowLeft } from "lucide-react";

interface HeroProps {
  onSponsorClick: () => void;
  onAboutClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onSponsorClick, 
  onAboutClick 
}) => {
  return (
    <section className="relative w-full border-b border-brand-light/60 bg-white overflow-hidden">
      
      {/* Background and Hero Image Frame */}
      <div className="relative w-full min-h-[440px] sm:min-h-[500px] md:min-h-[560px] lg:min-h-[600px] flex items-center">
        
        {/* Exact Approved Visual Asset Preserved */}
        <img
          src="/src/assets/images/iranian_classroom_perfect_1783850418444.jpg"
          alt="کلاس آموزش و شکوفایی کودکان در طرح پنجره"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Remove all white halos/overlays completely as requested */}

        {/* Content Container positioned carefully on the empty back wall area */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full h-full flex items-start sm:items-center">
          <div className="max-w-xs sm:max-w-sm md:max-w-md text-right space-y-3 sm:space-y-4 pr-1 sm:pr-4 pt-4 sm:pt-0">
            
            {/* Primary Slogan: 2/3 size, 2 lines, right aligned, positioned on back wall, no halo */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3.5xl font-black text-brand-deep leading-snug tracking-tight drop-shadow-xs">
              زندگی را<br />هدیه می‌دهیم.
            </h1>

            {/* Buttons: Half the previous size */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {/* PRIMARY CTA: مشارکت کنید (half size) */}
              <button
                id="hero-primary-cta"
                type="button"
                onClick={onSponsorClick}
                className="px-4 py-2 rounded-lg bg-brand-yellow hover:bg-[#d8cc2c] text-brand-charcoal font-black text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-98 cursor-pointer border border-brand-yellow/90"
              >
                مشارکت کنید
              </button>

              {/* SECONDARY CTA: پنجره چیست؟ (half size) */}
              <button
                id="hero-secondary-cta"
                type="button"
                onClick={onAboutClick}
                className="px-3.5 py-2 rounded-lg bg-white/90 hover:bg-white text-brand-deep font-bold text-xs sm:text-sm border border-brand-light/90 shadow-2xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <span>پنجره چیست؟</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};

