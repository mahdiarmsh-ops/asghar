import React from "react";
import { BookOpen, ShieldCheck, CheckCircle2 } from "lucide-react";

interface TransparencySectionProps {
  sessionCost: number;
  formatToman: (num: number) => string;
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({
  sessionCost,
  formatToman
}) => {
  return (
    <section id="financial-transparency-section" className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 md:p-10 space-y-6 shadow-sm">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-brand-light/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-deep" />
            <h2 className="text-xl sm:text-2xl font-black text-brand-deep tracking-tight">
              شفافیت مالی: نحوه تخصیص هر زنگ آموزشی
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-charcoal/80">
            محاسبه هزینه هر جلسه کلاسی معادل {formatToman(sessionCost)}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-brand-light/30 px-3.5 py-1.5 rounded-xl text-brand-deep text-xs font-bold border border-brand-light/70 shrink-0 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-brand-deep" />
          <span>تضمین ۱۰۰٪ هزینه برای دانش‌آموزان</span>
        </div>
      </div>

      {/* 3 Core Breakdown Cards (مبلغ حمایت → نحوه مصرف → نتیجه) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Breakdown Item 1: ۷۰٪ سهم مستقیم حق‌الزحمه مدرس */}
        <div className="p-5 sm:p-6 rounded-2xl bg-brand-light/15 border border-brand-light/60 space-y-3.5 flex flex-col justify-between hover:shadow-xs transition">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-11 h-11 rounded-xl bg-brand-deep text-white flex items-center justify-center font-black text-base shadow-2xs">
                ۷۰٪
              </span>
              <span className="text-xs font-extrabold text-brand-deep bg-white px-2.5 py-1 rounded-lg border border-brand-light/60">
                {formatToman(sessionCost * 0.7)}
              </span>
            </div>
            
            <h3 className="font-extrabold text-brand-charcoal text-base">حق‌الزحمه مدرس</h3>
            
            <p className="text-xs sm:text-sm text-brand-charcoal/85 leading-relaxed font-sans">
              پرداخت دستمزد عادلانه به معلمان متخصص بابت ۴۵ دقیقه تدریس حضوری در مدارس روستایی.
            </p>
          </div>

          <div className="pt-2.5 border-t border-brand-light/50 flex items-center gap-1.5 text-xs font-bold text-brand-deep">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-deep shrink-0" />
            <span>حضور منظم و پایدار معلم در کلاس</span>
          </div>
        </div>

        {/* Breakdown Item 2: ۱۵٪ لوازم و ملزومات کارگاهی */}
        <div className="p-5 sm:p-6 rounded-2xl bg-brand-light/15 border border-brand-light/60 space-y-3.5 flex flex-col justify-between hover:shadow-xs transition">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-11 h-11 rounded-xl bg-brand-yellow text-brand-charcoal flex items-center justify-center font-black text-base shadow-2xs">
                ۱۵٪
              </span>
              <span className="text-xs font-extrabold text-brand-charcoal bg-white px-2.5 py-1 rounded-lg border border-brand-light/60">
                {formatToman(sessionCost * 0.15)}
              </span>
            </div>
            
            <h3 className="font-extrabold text-brand-charcoal text-base">ملزومات کارگاهی</h3>
            
            <p className="text-xs sm:text-sm text-brand-charcoal/85 leading-relaxed font-sans">
              تهیه بسته‌های نقاشی، کتب مصور، نوشت‌افزار پایه‌ای و ابزار کارگاهی برای هر کودک.
            </p>
          </div>

          <div className="pt-2.5 border-t border-brand-light/50 flex items-center gap-1.5 text-xs font-bold text-brand-charcoal">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-charcoal shrink-0" />
            <span>ابزار کار رایگان در دستان دانش‌آموز</span>
          </div>
        </div>

        {/* Breakdown Item 3: ۱۵٪ سوخت و ترانزیت */}
        <div className="p-5 sm:p-6 rounded-2xl bg-brand-light/15 border border-brand-light/60 space-y-3.5 flex flex-col justify-between hover:shadow-xs transition">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-11 h-11 rounded-xl bg-brand-light/50 text-brand-deep flex items-center justify-center font-black text-base border border-brand-light">
                ۱۵٪
              </span>
              <span className="text-xs font-extrabold text-brand-deep bg-white px-2.5 py-1 rounded-lg border border-brand-light/60">
                {formatToman(sessionCost * 0.15)}
              </span>
            </div>
            
            <h3 className="font-extrabold text-brand-charcoal text-base">سوخت و ترانزیت</h3>
            
            <p className="text-xs sm:text-sm text-brand-charcoal/85 leading-relaxed font-sans">
              پوشش هزینه تردد مربیان در جاده‌های کوهستانی، خاکی و صعب‌العبور میان روستاها.
            </p>
          </div>

          <div className="pt-2.5 border-t border-brand-light/50 flex items-center gap-1.5 text-xs font-bold text-brand-deep">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-deep shrink-0" />
            <span>دسترسی به دورافتاده‌ترین روستاها</span>
          </div>
        </div>

      </div>

    </section>
  );
};

