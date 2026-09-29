import React from "react";
import { Heart, Compass, ShieldCheck, Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  onGoToAbout: () => void;
  onGoToSupport: () => void;
  onGoToDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onGoToAbout,
  onGoToSupport,
  onGoToDashboard
}) => {
  return (
    <footer className="bg-white border-t border-brand-light/70 text-right mt-16 text-xs text-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-deep text-white flex items-center justify-center shadow-sm">
                <span className="font-black text-xl leading-none text-brand-yellow font-sans">پ</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-brand-deep">پَـنـجَـره</h3>
                <p className="text-xs text-brand-charcoal/70">پلتفرم مردمی کفالت فرهنگی و برقراری عدالت آموزشی</p>
              </div>
            </div>

            <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans max-w-md">
              پنجره با هدف تأمین معلمان متخصص برای دروس هنر، قرآن و اخلاق در مناطق کم‌برخوردار مرزی فعالیت می‌کند. همراهی شما تضمین‌کننده تداوم کلاس‌های درس و ساختن آینده‌ای پرامید برای فرزندان این سرزمین است.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-extrabold text-brand-deep text-sm">دسترسی سریع</h4>
            <ul className="space-y-2 text-xs text-brand-charcoal/80 font-medium">
              <li>
                <button 
                  onClick={onGoToAbout}
                  className="hover:text-brand-deep transition cursor-pointer"
                >
                  درباره پنجره و مدل کفالت فرهنگی
                </button>
              </li>
              <li>
                <button 
                  onClick={onGoToSupport}
                  className="hover:text-brand-deep transition cursor-pointer"
                >
                  بخش حمایت و انتخاب پکیج
                </button>
              </li>
              <li>
                <button 
                  onClick={onGoToDashboard}
                  className="hover:text-brand-deep transition cursor-pointer"
                >
                  داشبورد گزارش‌های پیشرفت حامیان
                </button>
              </li>
              <li>
                <a href="#financial-transparency-section" className="hover:text-brand-deep transition">
                  گزارش شفافیت مالی و مصرف وجوه
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-extrabold text-brand-deep text-sm">ارتباط و پشتیبانی حامیان</h4>
            <div className="space-y-2 text-xs text-brand-charcoal/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-deep shrink-0" />
                <span>دبیرخانه مرکزی: تهران / دفاتر استانی: زاهدان، بندرعباس</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-deep shrink-0" />
                <span dir="ltr">۰۲۱-۸۸۰۰۰۰۰۰</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-deep shrink-0" />
                <span dir="ltr">info@penjereh.ir</span>
              </div>
            </div>
            
            <div className="pt-2 flex items-center gap-2 text-2xs text-brand-deep bg-brand-light/20 p-2.5 rounded-xl border border-brand-light/60">
              <ShieldCheck className="w-4 h-4 text-brand-deep shrink-0" />
              <span>تمام گزارش‌ها بر پایه کلاس‌های فعال و مستندات رسمی ثبت می‌گردد.</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-brand-light/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-brand-charcoal/60">
          <p>© تمامی حقوق برای پلتفرم کفالت فرهنگی «پنجره» محفوظ است.</p>
          <div className="flex items-center gap-1.5 font-medium">
            <span>طراحی شده با مهر برای کودکان ایران</span>
            <Heart className="w-3 h-3 text-brand-deep fill-brand-deep" />
          </div>
        </div>

      </div>
    </footer>
  );
};
