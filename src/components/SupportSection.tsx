import React from "react";
import { 
  Check, 
  ArrowLeft, 
  Users, 
  School, 
  Coins, 
  ShieldCheck, 
  AlertCircle,
  Plus,
  Minus
} from "lucide-react";

interface SupportSectionProps {
  sponsorType: "student" | "session" | "custom";
  setSponsorType: (type: "student" | "session" | "custom") => void;
  sponsorQuantity: number;
  setSponsorQuantity: (qty: number) => void;
  customSessions: number;
  setCustomSessions: (sessions: number) => void;
  customAmount: number;
  setCustomAmount: (amount: number) => void;
  sessionCost: number;
  fullPackageCost: number;
  getCalculateCurrentPrice: () => number;
  onOpenCheckout: () => void;
  formatToman: (num: number) => string;
  toFaNum: (num: number | string) => string;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  sponsorType,
  setSponsorType,
  sponsorQuantity,
  setSponsorQuantity,
  customSessions,
  setCustomSessions,
  customAmount,
  setCustomAmount,
  sessionCost,
  fullPackageCost,
  getCalculateCurrentPrice,
  onOpenCheckout,
  formatToman,
  toFaNum
}) => {
  const currentTotal = getCalculateCurrentPrice();
  
  // Calculate equivalent sessions
  let equivalentSessions = 0;
  if (sponsorType === "student") {
    equivalentSessions = sponsorQuantity * 24;
  } else if (sponsorType === "session") {
    equivalentSessions = customSessions;
  } else {
    equivalentSessions = Math.max(1, Math.floor(customAmount / sessionCost));
  }

  // Predefined student quantities
  const studentPresets = [1, 2, 3, 5, 10];
  
  // Predefined session quantities
  const sessionPresets = [1, 3, 6, 12, 24];

  // Predefined custom amounts (Tomans)
  const customAmountPresets = [100000, 300000, 500000, 1000000, 2000000, 5000000];

  // Custom amount error validation
  const isCustomAmountInvalid = sponsorType === "custom" && (customAmount < 50000 || isNaN(customAmount));

  // Handle custom amount manual typing
  const handleCustomAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^\d]/g, "");
    const num = parseInt(rawVal, 10);
    setCustomAmount(isNaN(num) ? 0 : num);
  };

  return (
    <section 
      id="sponsorship-selector" 
      className="bg-brand-light/25 rounded-3xl border-2 border-brand-light/90 p-6 sm:p-8 md:p-10 space-y-7 scroll-mt-20 text-right shadow-sm"
    >
      {/* 1. Header: Clear, Prominent, and Direct */}
      <div className="border-b border-brand-deep/15 pb-4 sm:pb-5">
        <h2 className="text-2xl sm:text-3xl font-black text-brand-deep tracking-tight">
          مشارکت در طرح پنجره
        </h2>
        <p className="text-xs sm:text-sm text-brand-charcoal/80 mt-1">
          تأمین دستمزد مدرسان و ملزومات آموزشی برای دانش‌آموزان مناطق کم‌برخوردار
        </p>
      </div>

      {/* 2. Step 1: Support Model Cards (Clear selected state with #2E3192 & #AEE2FA) */}
      <div className="space-y-2.5">
        <label className="text-xs sm:text-sm font-extrabold text-brand-deep flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-brand-deep text-white text-2xs flex items-center justify-center font-mono">۱</span>
          <span>الگوی حمایت:</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          
          {/* Option 1: کفالت سالانه دانش‌آموز */}
          <button
            type="button"
            id="sponsor-option-student"
            onClick={() => setSponsorType("student")}
            className={`cursor-pointer p-4 sm:p-5 rounded-2xl border-2 text-right transition-all flex flex-col justify-between h-full gap-3 ${
              sponsorType === "student"
                ? "border-brand-deep bg-white shadow-md ring-2 ring-brand-deep/20"
                : "border-brand-light bg-white/70 hover:bg-white hover:border-brand-deep/40 shadow-2xs"
            }`}
          >
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between">
                <span className="font-black text-brand-deep text-base sm:text-lg flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-deep shrink-0" />
                  <span>کفالت سالانه دانش‌آموز</span>
                </span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs transition ${
                  sponsorType === "student" 
                    ? "bg-brand-deep border-brand-deep text-white" 
                    : "border-brand-light bg-white text-transparent"
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <p className="text-xs text-brand-charcoal/75 leading-relaxed">
                تأمین تمام ۲۴ زنگ کلاسی یک سال کامل، نوشت‌افزار کارگاهی و تردد مربی.
              </p>
            </div>

            <div className="pt-2 border-t border-brand-light/80 flex items-center justify-between w-full text-xs">
              <span className="text-brand-charcoal/70">سرمایه‌گذاری ۱ سال:</span>
              <strong className="text-sm font-black text-brand-deep font-mono">
                {formatToman(fullPackageCost)}
              </strong>
            </div>
          </button>

          {/* Option 2: زنگ‌های آموزشی */}
          <button
            type="button"
            id="sponsor-option-session"
            onClick={() => setSponsorType("session")}
            className={`cursor-pointer p-4 sm:p-5 rounded-2xl border-2 text-right transition-all flex flex-col justify-between h-full gap-3 ${
              sponsorType === "session"
                ? "border-brand-deep bg-white shadow-md ring-2 ring-brand-deep/20"
                : "border-brand-light bg-white/70 hover:bg-white hover:border-brand-deep/40 shadow-2xs"
            }`}
          >
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between">
                <span className="font-black text-brand-deep text-base sm:text-lg flex items-center gap-2">
                  <School className="w-4 h-4 text-brand-deep shrink-0" />
                  <span>زنگ‌های آموزشی</span>
                </span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs transition ${
                  sponsorType === "session" 
                    ? "bg-brand-deep border-brand-deep text-white" 
                    : "border-brand-light bg-white text-transparent"
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <p className="text-xs text-brand-charcoal/75 leading-relaxed">
                تأمین جلسات درسی ۴۵ دقیقه‌ای برای کلاس‌های هنر، قرآن و اخلاق.
              </p>
            </div>

            <div className="pt-2 border-t border-brand-light/80 flex items-center justify-between w-full text-xs">
              <span className="text-brand-charcoal/70">پایه هر جلسه:</span>
              <strong className="text-sm font-black text-brand-deep font-mono">
                {formatToman(sessionCost)}
              </strong>
            </div>
          </button>

          {/* Option 3: مبلغ دلخواه */}
          <button
            type="button"
            id="sponsor-option-custom"
            onClick={() => setSponsorType("custom")}
            className={`cursor-pointer p-4 sm:p-5 rounded-2xl border-2 text-right transition-all flex flex-col justify-between h-full gap-3 ${
              sponsorType === "custom"
                ? "border-brand-deep bg-white shadow-md ring-2 ring-brand-deep/20"
                : "border-brand-light bg-white/70 hover:bg-white hover:border-brand-deep/40 shadow-2xs"
            }`}
          >
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between">
                <span className="font-black text-brand-deep text-base sm:text-lg flex items-center gap-2">
                  <Coins className="w-4 h-4 text-brand-deep shrink-0" />
                  <span>مبلغ دلخواه</span>
                </span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs transition ${
                  sponsorType === "custom" 
                    ? "bg-brand-deep border-brand-deep text-white" 
                    : "border-brand-light bg-white text-transparent"
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <p className="text-xs text-brand-charcoal/75 leading-relaxed">
                مشارکت با هر رقم؛ معادل جلسات و نوشت‌افزار کلاسی هوشمند محاسبه می‌شود.
              </p>
            </div>

            <div className="pt-2 border-t border-brand-light/80 flex items-center justify-between w-full text-xs">
              <span className="text-brand-charcoal/70">حداقل مبلغ:</span>
              <strong className="text-sm font-black text-brand-deep font-mono">
                {formatToman(50000)}
              </strong>
            </div>
          </button>

        </div>
      </div>

      {/* 3. Step 2: Amount / Quantity Control (Clean, Linear & Accessible) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-light/90 shadow-2xs space-y-4">
        
        {/* SUB-FLOW A: Student Sponsorship Quantity */}
        {sponsorType === "student" && (
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-xs sm:text-sm font-extrabold text-brand-deep flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-brand-deep text-white text-2xs flex items-center justify-center font-mono">۲</span>
                <span>تعداد دانش‌آموزان تحت پوشش:</span>
              </label>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSponsorQuantity(Math.max(1, sponsorQuantity - 1))}
                  className="w-8 h-8 rounded-xl bg-brand-light/30 border border-brand-light flex items-center justify-center text-brand-deep hover:bg-brand-light transition cursor-pointer"
                  aria-label="کاهش تعداد"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-base sm:text-lg text-brand-deep px-4 py-1 rounded-xl bg-brand-light/20 border border-brand-light font-mono min-w-[90px] text-center">
                  {toFaNum(sponsorQuantity)} کودک
                </span>
                <button
                  type="button"
                  onClick={() => setSponsorQuantity(Math.min(15, sponsorQuantity + 1))}
                  className="w-8 h-8 rounded-xl bg-brand-light/30 border border-brand-light flex items-center justify-center text-brand-deep hover:bg-brand-light transition cursor-pointer"
                  aria-label="افزایش تعداد"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-2xs text-brand-charcoal/70 font-bold">انتخاب سریع:</span>
              {studentPresets.map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setSponsorQuantity(qty)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    sponsorQuantity === qty
                      ? "bg-brand-deep text-white border-brand-deep shadow-2xs"
                      : "bg-white text-brand-charcoal border-brand-light/80 hover:border-brand-deep/40 hover:bg-brand-light/20"
                  }`}
                >
                  {toFaNum(qty)} کودک ({formatToman(fullPackageCost * qty)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SUB-FLOW B: Session Count Quantity */}
        {sponsorType === "session" && (
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-xs sm:text-sm font-extrabold text-brand-deep flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-brand-deep text-white text-2xs flex items-center justify-center font-mono">۲</span>
                <span>تعداد زنگ‌های آموزشی (۴۵ دقیقه‌ای):</span>
              </label>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCustomSessions(Math.max(1, customSessions - 1))}
                  className="w-8 h-8 rounded-xl bg-brand-light/30 border border-brand-light flex items-center justify-center text-brand-deep hover:bg-brand-light transition cursor-pointer"
                  aria-label="کاهش تعداد زنگ"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-base sm:text-lg text-brand-deep px-4 py-1 rounded-xl bg-brand-light/20 border border-brand-light font-mono min-w-[90px] text-center">
                  {toFaNum(customSessions)} زنگ
                </span>
                <button
                  type="button"
                  onClick={() => setCustomSessions(Math.min(100, customSessions + 1))}
                  className="w-8 h-8 rounded-xl bg-brand-light/30 border border-brand-light flex items-center justify-center text-brand-deep hover:bg-brand-light transition cursor-pointer"
                  aria-label="افزایش تعداد زنگ"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-2xs text-brand-charcoal/70 font-bold">انتخاب سریع:</span>
              {sessionPresets.map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setCustomSessions(qty)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    customSessions === qty
                      ? "bg-brand-deep text-white border-brand-deep shadow-2xs"
                      : "bg-white text-brand-charcoal border-brand-light/80 hover:border-brand-deep/40 hover:bg-brand-light/20"
                  }`}
                >
                  {toFaNum(qty)} زنگ ({formatToman(sessionCost * qty)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SUB-FLOW C: Custom Amount */}
        {sponsorType === "custom" && (
          <div className="space-y-3.5">
            <label className="text-xs sm:text-sm font-extrabold text-brand-deep flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-deep text-white text-2xs flex items-center justify-center font-mono">۲</span>
              <span>مبلغ مورد نظر خود را وارد فرمایید (حداقل ۵۰,۰۰۰ تومان):</span>
            </label>
            
            <div className="relative max-w-md">
              <input
                type="text"
                value={customAmount > 0 ? customAmount.toLocaleString("fa-IR") : ""}
                onChange={handleCustomAmountInput}
                placeholder="مثال: ۱,۰۰۰,۰۰۰"
                className={`w-full p-3.5 pl-16 rounded-xl border text-base font-mono font-bold bg-white text-brand-charcoal focus:outline-none focus:ring-2 ${
                  isCustomAmountInvalid 
                    ? "border-rose-500 focus:ring-rose-200" 
                    : "border-brand-light/90 focus:border-brand-deep focus:ring-brand-deep/15"
                }`}
                dir="ltr"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-charcoal/60 pointer-events-none">
                تومان
              </span>
            </div>

            {isCustomAmountInvalid && (
              <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>حداقل مبلغ حمایت ۵۰,۰۰۰ تومان است.</span>
              </p>
            )}

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-2xs text-brand-charcoal/70 font-bold">مبالغ پیشنهادی:</span>
              {customAmountPresets.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCustomAmount(amt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    customAmount === amt
                      ? "bg-brand-deep text-white border-brand-deep shadow-2xs"
                      : "bg-white text-brand-charcoal border-brand-light/80 hover:border-brand-deep/40 hover:bg-brand-light/20"
                  }`}
                >
                  {formatToman(amt)}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 4. Steps 3 & 4: Resulting Support & Primary Action (ادامه و پرداخت) */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border-2 border-brand-deep/15 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Resulting Impact & Total Amount */}
        <div className="space-y-2 text-right">
          <div className="text-xs font-extrabold text-brand-deep flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-deep text-white text-2xs flex items-center justify-center font-mono">۳</span>
            <span>مبلغ پرداختی و اثر حمایت شما:</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-brand-deep font-mono tracking-tight">
              {formatToman(currentTotal)}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-brand-deep bg-brand-light/40 px-3 py-1 rounded-xl border border-brand-light/80">
              معادل {toFaNum(equivalentSessions)} زنگ کلاسی با مربی متخصص
            </span>
          </div>

          <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-sans max-w-xl">
            {sponsorType === "student" ? (
              <>تأمین کامل <strong className="text-brand-deep font-black">{toFaNum(sponsorQuantity * 24)} زنگ کلاسی</strong>، ملزومات کارگاهی و هزینه اعزام مربی برای <strong className="text-brand-deep font-black">{toFaNum(sponsorQuantity)} دانش‌آموز</strong> به مدت یک سال تحصیلی کامل.</>
            ) : sponsorType === "session" ? (
              <>پوشش کامل هزینه تدریس <strong className="text-brand-deep font-black">{toFaNum(customSessions)} زنگ درسی ۴۵ دقیقه‌ای</strong> هنر، قرآن یا اخلاق همراه با وسایل کارگاهی در مناطق مرزی.</>
            ) : (
              <>معادل برگزاری <strong className="text-brand-deep font-black">{toFaNum(equivalentSessions)} جلسه آموزشی حضوری</strong> همراه با تهیه اقلام کارگاهی برای کودکان در مدارس کم‌برخوردار.</>
            )}
          </p>
        </div>

        {/* Primary Action Button (Yellow #E3D634) */}
        <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2">
          <button
            id="proceed-to-checkout-btn"
            type="button"
            disabled={isCustomAmountInvalid}
            onClick={onOpenCheckout}
            className="w-full sm:w-auto px-9 py-4 bg-brand-yellow hover:bg-[#d8cc2c] active:scale-98 text-brand-charcoal font-black text-base sm:text-lg rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-brand-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span>ادامه و پرداخت</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-brand-charcoal/60">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-deep" />
            <span>پرداخت امن شتابی از طریق درگاه بانکی شاپرک</span>
          </div>
        </div>

      </div>

    </section>
  );
};

