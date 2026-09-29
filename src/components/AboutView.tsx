import React from "react";
import { 
  Heart, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Palette, 
  BookMarked, 
  Users, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  School 
} from "lucide-react";

interface AboutViewProps {
  onBackToHome: () => void;
  onGoToSupport: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBackToHome, onGoToSupport }) => {
  return (
    <div className="space-y-12 animate-fade-in text-right max-w-5xl mx-auto py-4">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-brand-light/60 pb-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-deep hover:text-brand-deep/80 transition cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به صفحه اصلی</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xs font-bold text-brand-charcoal/60">پلتفرم پنجره</span>
          <span className="text-2xs text-brand-charcoal/40">/</span>
          <span className="text-2xs font-extrabold text-brand-deep">درباره پنجره و کفالت فرهنگی</span>
        </div>
      </div>

      {/* Hero Banner for About */}
      <div className="bg-gradient-to-br from-brand-deep via-[#232573] to-brand-charcoal rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden space-y-6">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/30 text-brand-yellow text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>پنجره؛ روایتی از پیوند مهر و مهارت</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight">
            درباره پلتفرم کفالت فرهنگی «پنجره»
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            «پنجره» تلاشی است مردمی و سازمان‌یافته برای رساندن نسیم دانایی و هنر به دورافتاده‌ترین کلاس‌های درس کشور؛ جایی که استعدادهای ناب کودکان به دلیل فقدان معلمان تخصصی مغفول نماند.
          </p>
        </div>
      </div>

      {/* Section 1: مسئله چیست؟ (The Core Problem) */}
      <div className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-brand-light/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-light/40 text-brand-deep flex items-center justify-center font-black">
            ۱
          </div>
          <div>
            <span className="text-2xs font-bold text-brand-charcoal/60 block">ریشه شکل‌گیری طرح</span>
            <h3 className="text-lg sm:text-xl font-black text-brand-deep">چه مسئله‌ای را در «پنجره» دنبال می‌کنیم؟</h3>
          </div>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-brand-charcoal/85 leading-relaxed font-sans">
          <p>
            در بسیاری از مدارس مناطق مرزی، روستایی و عشایری کشور (نظیر سیستان و بلوچستان، بشاگرد هرمزگان، جنوب کرمان، خوزستان و مناطق کوهستانی)، به دلیل محدودیت منابع و پراکندگی جغرافیایی، معلمان رسمی بیشتر بر دروس پایه متمرکز هستند.
          </p>
          <p className="p-4 bg-brand-light/15 rounded-2xl border border-brand-light/60 text-brand-charcoal font-medium text-xs sm:text-sm">
            دروس حیاتی رشد شخصیتی و هویتی مانند <strong className="text-brand-deep">زنگ هنر و کاردستی</strong>، <strong className="text-brand-deep">انس با قرآن مجید</strong> و <strong className="text-brand-deep">تعلیمات اخلاق و مهارتی</strong> معمولاً کادر تخصصی ندارند و جای خالی مربیان کارآزموده در شکوفایی استعدادهای پنهان این کودکان به شدت احساس می‌شود.
          </p>
        </div>
      </div>

      {/* Section 2: کفالت فرهنگی چیست؟ (What is Cultural Sponsorship) */}
      <div className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-brand-light/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow/30 text-brand-charcoal flex items-center justify-center font-black">
            ۲
          </div>
          <div>
            <span className="text-2xs font-bold text-brand-charcoal/60 block">مفهوم‌شناسی و سازوکار</span>
            <h3 className="text-lg sm:text-xl font-black text-brand-deep">«کفالت فرهنگی» چیست و چگونه کار می‌کند؟</h3>
          </div>
        </div>

        <div className="space-y-5 text-sm sm:text-base text-brand-charcoal/85 leading-relaxed font-sans">
          <p>
            بر خلاف مدل‌های سنتی خیریه که صرفاً به توزیع اقلام مادی یا ساخت ابنیه می‌پردازند، <strong>کفالت فرهنگی</strong> بر روی <strong className="text-brand-deep">«نیروی انسانی متخصص و فرآیند یادگیری مستمر»</strong> سرمایه‌گذاری می‌کند.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-brand-light/20 border border-brand-light/60 space-y-2">
              <h4 className="font-extrabold text-brand-deep text-sm">۱. پوشش زنگ‌به‌زنگ</h4>
              <p className="text-xs text-brand-charcoal/80 leading-relaxed">
                هر سال تحصیلی شامل ۲۴ زنگ آموزشی تخصصی برای هر دانش‌آموز است. حامی می‌تواند یک یا چند زنگ را تقبل کند.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-light/20 border border-brand-light/60 space-y-2">
              <h4 className="font-extrabold text-brand-deep text-sm">۲. اعزام اساتید متخصص</h4>
              <p className="text-xs text-brand-charcoal/80 leading-relaxed">
                معلمان نخبه و دوره‌دیده با تجهیزات آموزشی و نوشت‌افزار تخصصی به صورت سیار به روستاهای هدف اعزام می‌شوند.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-light/20 border border-brand-light/60 space-y-2">
              <h4 className="font-extrabold text-brand-deep text-sm">۳. شفافیت و گزارش بازخورد</h4>
              <p className="text-xs text-brand-charcoal/80 leading-relaxed">
                حامی به صورت برخط در داشبورد خود گزارش پیشرفت تحصیلی فرزند معنوی و گزارش جلسات برگزار شده را مشاهده می‌کند.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: سه محور اصلی */}
      <div className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-brand-light/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-light/40 text-brand-deep flex items-center justify-center font-black">
            ۳
          </div>
          <div>
            <span className="text-2xs font-bold text-brand-charcoal/60 block">دروس تحت پوشش</span>
            <h3 className="text-lg sm:text-xl font-black text-brand-deep">سه محور آموزشی و پرورشی در پنجره</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-brand-light/15 border border-brand-light/50 space-y-3">
            <div className="flex items-center gap-2 text-brand-deep">
              <Palette className="w-5 h-5" />
              <h4 className="font-extrabold text-base">۱. زنگ هنر و زیباشناسی</h4>
            </div>
            <p className="text-xs text-brand-charcoal/80 leading-relaxed">
              آموزش نقاشی، خطاطی، تصویرگری، صنایع دستی بومی و خلاقیت بصری با هدف کشف استعدادهای هنری نهفته در مناطق محروم.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-light/15 border border-brand-light/50 space-y-3">
            <div className="flex items-center gap-2 text-brand-deep">
              <BookMarked className="w-5 h-5" />
              <h4 className="font-extrabold text-base">۲. انس با کلام وحی</h4>
            </div>
            <p className="text-xs text-brand-charcoal/80 leading-relaxed">
              آموزش تجوید و روان‌خوانی با شیوه‌های نوین و جذاب، داستان‌های پندآموز قرآنی و تقویت روحی و معنوی کودکان.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-light/15 border border-brand-light/50 space-y-3">
            <div className="flex items-center gap-2 text-brand-deep">
              <Users className="w-5 h-5" />
              <h4 className="font-extrabold text-base">۳. تعلیمات اخلاق و معارف</h4>
            </div>
            <p className="text-xs text-brand-charcoal/80 leading-relaxed">
              مهارت‌های فردی و اجتماعی، کار تیمی، تقویت اعتمادبه‌نفس، احترام متقابل و تقویت پیوندهای فرهنگی و هویتی.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom CTA Block */}
      <div className="bg-gradient-to-r from-[#AEE2FA]/40 via-white to-[#AEE2FA]/20 border border-brand-light/80 rounded-3xl p-8 text-center space-y-5">
        <Heart className="w-12 h-12 text-brand-deep fill-brand-light mx-auto" />
        <div className="space-y-2 max-w-xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-brand-deep">شما هم می‌توانید پنجره‌ای به سوی آینده باشید</h3>
          <p className="text-xs sm:text-sm text-brand-charcoal/80">
            با حمایت حتی از ۱ زنگ آموزشی، چراغ کلاسی را در دورترین نقاط وطن روشن نگاه دارید.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onGoToSupport}
            className="px-8 py-3.5 bg-brand-yellow hover:bg-[#d8cc2c] text-brand-charcoal font-black text-sm rounded-xl shadow-md transition cursor-pointer"
          >
            ورود به بخش حمایت آنلاین
          </button>
          <button
            onClick={onBackToHome}
            className="px-6 py-3.5 bg-white border border-brand-light text-brand-deep font-bold text-sm rounded-xl hover:bg-brand-light/20 transition cursor-pointer"
          >
            مشاهده شاخص‌ها در صفحه اصلی
          </button>
        </div>
      </div>

    </div>
  );
};
