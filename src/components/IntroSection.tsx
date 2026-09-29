import React from "react";
import { ArrowLeft, Compass, Palette, BookMarked, Users } from "lucide-react";

interface IntroSectionProps {
  onLearnMore: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onLearnMore }) => {
  return (
    <section id="project-intro-section" className="space-y-6 pt-2">
      
      {/* Section Header with Clear Link to Existing Project Information Page */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-light/70 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-brand-deep tracking-tight">
            پنجره چیست؟
          </h2>
          <p className="text-xs sm:text-sm text-brand-charcoal/75">
            آشنایی اجمالی با اهداف و سازوکار کفالت فرهنگی در مناطق کم‌برخوردار
          </p>
        </div>

        {/* Clear, Accessible Link to Existing Project-Information Page */}
        <button
          id="intro-learn-more-btn"
          type="button"
          onClick={onLearnMore}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-light/35 hover:bg-brand-deep hover:text-white text-brand-deep font-bold text-xs sm:text-sm border border-brand-light/80 transition-all cursor-pointer shadow-2xs group self-start sm:self-auto shrink-0"
        >
          <span>اطلاعات تفصیلی درباره طرح</span>
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3 Core Concise Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* 1. What Panjeréh is */}
        <div className="bg-white rounded-2xl p-5 border border-brand-light/70 space-y-2 text-right shadow-2xs">
          <h3 className="text-sm sm:text-base font-extrabold text-brand-deep flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-brand-light/50 flex items-center justify-center text-xs font-black text-brand-deep">
              ۱
            </span>
            <span>پنجره چیست؟</span>
          </h3>
          <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed">
            پلتفرمی مستقل و شفاف برای پیوند مستقیم نیکوکاران با کلاس‌های درس در مناطق مرزی و محروم سراسر ایران.
          </p>
        </div>

        {/* 2. What Cultural Sponsorship means */}
        <div className="bg-white rounded-2xl p-5 border border-brand-light/70 space-y-2 text-right shadow-2xs">
          <h3 className="text-sm sm:text-base font-extrabold text-brand-deep flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-brand-light/50 flex items-center justify-center text-xs font-black text-brand-deep">
              ۲
            </span>
            <span>کفالت فرهنگی چیست؟</span>
          </h3>
          <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed">
            تأمین معلمان متخصص برای زنگ‌های هنر، قرآن و مهارت‌های زندگی؛ دروسی که سال‌ها در این مدارس مغفول مانده‌اند.
          </p>
        </div>

        {/* 3. What Support is provided */}
        <div className="bg-white rounded-2xl p-5 border border-brand-light/70 space-y-2 text-right shadow-2xs">
          <h3 className="text-sm sm:text-base font-extrabold text-brand-deep flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-brand-light/50 flex items-center justify-center text-xs font-black text-brand-deep">
              ۳
            </span>
            <span>حمایت شامل چه مواردی است؟</span>
          </h3>
          <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed">
            پوشش دستمزد مربی، ملزومات کارگاهی و نقاشی، نوشت‌افزار رایگان و سوخت تردد معلم به روستاهای دورافتاده.
          </p>
        </div>

      </div>

      {/* 3 Pillars Gallery (Existing Visual Assets 100% Preserved) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-extrabold text-brand-charcoal/85">
            سه محور اصلی آموزش در پنجره:
          </span>
          <button
            type="button"
            onClick={onLearnMore}
            className="text-xs text-brand-deep font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>مشاهده سرفصل‌ها</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Pillar 1: هنر و خلاقیت */}
          <div 
            onClick={onLearnMore}
            className="relative h-36 sm:h-40 rounded-2xl overflow-hidden shadow-2xs border border-brand-light/70 group/pillar cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600" 
              alt="کلاس و معلم هنر در طرح پنجره" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/pillar:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/95 via-brand-charcoal/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4 text-right z-10">
              <div className="flex items-center gap-1.5 text-white group-hover/pillar:text-brand-yellow transition-colors">
                <Palette className="w-4 h-4 text-brand-yellow" />
                <h3 className="text-base font-black">هنر و خلاقیت</h3>
              </div>
              <p className="text-xs text-white/90 mt-0.5 font-medium line-clamp-1">
                پرورش استعداد، نقاشی و صنایع‌دستی
              </p>
            </div>
          </div>

          {/* Pillar 2: انس با قرآن */}
          <div 
            onClick={onLearnMore}
            className="relative h-36 sm:h-40 rounded-2xl overflow-hidden shadow-2xs border border-brand-light/70 group/pillar cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600" 
              alt="آموزش و انس با قرآن کریم در طرح پنجره" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/pillar:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/95 via-brand-charcoal/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4 text-right z-10">
              <div className="flex items-center gap-1.5 text-white group-hover/pillar:text-brand-yellow transition-colors">
                <BookMarked className="w-4 h-4 text-brand-yellow" />
                <h3 className="text-base font-black">انس با قرآن</h3>
              </div>
              <p className="text-xs text-white/90 mt-0.5 font-medium line-clamp-1">
                روان‌خوانی، مفاهیم کاربردی و قصص قرآنی
              </p>
            </div>
          </div>

          {/* Pillar 3: معارف و مهارت‌های زندگی */}
          <div 
            onClick={onLearnMore}
            className="relative h-36 sm:h-40 rounded-2xl overflow-hidden shadow-2xs border border-brand-light/70 group/pillar cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600" 
              alt="تعلیم اخلاق و معارف زندگی در طرح پنجره" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/pillar:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/95 via-brand-charcoal/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4 text-right z-10">
              <div className="flex items-center gap-1.5 text-white group-hover/pillar:text-brand-yellow transition-colors">
                <Users className="w-4 h-4 text-brand-yellow" />
                <h3 className="text-base font-black">معارف و اخلاق</h3>
              </div>
              <p className="text-xs text-white/90 mt-0.5 font-medium line-clamp-1">
                مهارت‌های فردی، اخلاق نیکو و هویت جمعی
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

