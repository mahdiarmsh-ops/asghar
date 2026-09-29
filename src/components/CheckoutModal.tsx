import React, { useState } from "react";
import { 
  X, 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  School, 
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Receipt,
  User as UserIcon,
  Phone,
  Clock,
  ExternalLink
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorType: "student" | "session" | "custom";
  sponsorQuantity: number;
  customSessions: number;
  sessionCost: number;
  fullPackageCost: number;
  totalAmount: number;
  isProcessing: boolean;
  onConfirmCheckout: (sponsorInfo: { name: string; phone: string; simulateFailure?: boolean }) => Promise<any>;
  formatToman: (num: number) => string;
  toFaNum: (num: number | string) => string;
  onGoToDashboard?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  sponsorType,
  sponsorQuantity,
  customSessions,
  sessionCost,
  fullPackageCost,
  totalAmount,
  isProcessing,
  onConfirmCheckout,
  formatToman,
  toFaNum,
  onGoToDashboard
}) => {
  const [sponsorName, setSponsorName] = useState<string>("حامی نیکوکار");
  const [phone, setPhone] = useState<string>("09123456789");
  const [formError, setFormError] = useState<string | null>(null);
  
  // Modal internal flow states: 'confirm' | 'processing' | 'success' | 'failed'
  const [modalState, setModalState] = useState<"confirm" | "gateway_redirect" | "success" | "failed">("confirm");
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!isOpen) return null;

  const totalSessions = sponsorType === "student" 
    ? sponsorQuantity * 24 
    : sponsorType === "session" 
      ? customSessions 
      : Math.max(1, Math.floor(totalAmount / sessionCost));

  const frequencyLabel = sponsorType === "student" 
    ? "سالانه (یک سال کامل تحصیلی)" 
    : sponsorType === "session" 
      ? "جلسه‌ای (بر اساس تعداد زنگ)" 
      : "یک‌باره / دلخواه";

  const supportTypeTitle = sponsorType === "student"
    ? `کفالت سالانه ${toFaNum(sponsorQuantity)} دانش‌آموز`
    : sponsorType === "session"
      ? `تأمین ${toFaNum(customSessions)} زنگ درسی ۴۵ دقیقه‌ای`
      : `حمایت با مبلغ دلخواه (${toFaNum(totalSessions)} جلسه)`;

  const handleStartPayment = async (simulateFailure = false) => {
    // Validate inputs
    if (!sponsorName.trim()) {
      setFormError("لطفاً نام یا عنوان مستعار خود را وارد فرمایید.");
      return;
    }
    
    const cleanPhone = phone.trim().replace(/[^\d]/g, "");
    if (cleanPhone.length < 10) {
      setFormError("لطفاً شماره همراه ۱۱ رقمی معتبر وارد نمایید.");
      return;
    }

    if (totalAmount < 50000) {
      setFormError("حداقل مبلغ قابل پرداخت ۵۰,۰۰۰ تومان می‌باشد.");
      return;
    }

    setFormError(null);
    setModalState("gateway_redirect");

    try {
      // Simulate real bank gateway roundtrip
      const result = await onConfirmCheckout({
        name: sponsorName.trim(),
        phone: cleanPhone,
        simulateFailure
      });

      if (result && result.receipt) {
        setLastReceipt(result.receipt);
        setModalState("success");
      } else if (result && result.receipt_no) {
        setLastReceipt({
          receipt_no: result.receipt_no,
          sponsor_name: sponsorName,
          amount_paid: totalAmount,
          sessions_bought: totalSessions,
          date: new Date().toISOString()
        });
        setModalState("success");
      } else {
        setLastReceipt({
          receipt_no: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
          sponsor_name: sponsorName,
          amount_paid: totalAmount,
          sessions_bought: totalSessions,
          date: new Date().toISOString()
        });
        setModalState("success");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "تراکنش بانکی به دلیل اختلال ارتباطی یا انصراف لغو گردید.");
      setModalState("failed");
    }
  };

  const handleCloseAndReset = () => {
    setModalState("confirm");
    setFormError(null);
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs text-right">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-brand-light/80 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in">
        
        {/* 1. Header */}
        <div className="flex items-center justify-between border-b border-brand-light/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-yellow/30 flex items-center justify-center text-brand-charcoal">
              <Heart className="w-4 h-4 fill-brand-charcoal" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-brand-deep">
                {modalState === "confirm" && "تأیید نهایی و ادامه پرداخت"}
                {modalState === "gateway_redirect" && "اتصال به درگاه امن شاپرک"}
                {modalState === "success" && "پرداخت موفق و صدور رسید"}
                {modalState === "failed" && "تراکنش ناموفق"}
              </h3>
              <p className="text-2xs text-brand-charcoal/70">سامانه پرداخت کفالت فرهنگی پنجره</p>
            </div>
          </div>
          <button
            onClick={handleCloseAndReset}
            className="p-1.5 rounded-lg text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-light/20 transition cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= STATE 1: CONFIRMATION & INPUT ================= */}
        {modalState === "confirm" && (
          <div className="space-y-5">
            
            {/* Concise Breakdown Card */}
            <div className="p-4 rounded-2xl bg-brand-light/20 border border-brand-light/70 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-charcoal/70 font-medium">نوع حمایت:</span>
                <span className="font-extrabold text-brand-deep">{supportTypeTitle}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-charcoal/70 font-medium">دوره زمانی / تکرار:</span>
                <span className="font-bold text-brand-charcoal">{frequencyLabel}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-charcoal/70 font-medium">تعداد زنگ‌های تخصصی فعال‌شده:</span>
                <span className="font-mono font-bold text-brand-deep">{toFaNum(totalSessions)} زنگ کلاسی</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-charcoal/70 font-medium">نحوه تخصیص:</span>
                <span className="font-bold text-brand-charcoal/80">حق‌الزحمه مربی (۷۰٪) + ملزومات و ترانزیت (۳۰٪)</span>
              </div>

              <div className="pt-2 border-t border-brand-light/60 flex justify-between items-center">
                <span className="text-xs font-bold text-brand-charcoal">مبلغ کل قابل پرداخت:</span>
                <strong className="text-lg font-black text-brand-deep font-mono">
                  {formatToman(totalAmount)}
                </strong>
              </div>
            </div>

            {/* Sponsor Info Form */}
            <div className="space-y-3.5 text-xs font-medium">
              
              <div className="space-y-1.5">
                <label className="block font-bold text-brand-charcoal flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-brand-deep" />
                  <span>نام و نام‌خانوادگی حامی (یا نام مستعار):</span>
                </label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-light/90 bg-white text-brand-charcoal text-xs font-semibold focus:outline-none focus:border-brand-deep"
                  placeholder="مثال: دکتر علی رضایی یا حامی نیکوکار"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-brand-charcoal flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-deep" />
                  <span>شماره تلفن همراه (جهت پیامک رسید و گزارش پیشرفت):</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-brand-light/90 bg-white text-brand-charcoal text-xs font-semibold focus:outline-none focus:border-brand-deep text-left font-mono"
                  placeholder="09123456789"
                  dir="ltr"
                  required
                />
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Security Badge */}
              <div className="flex items-center gap-2 p-3 bg-brand-light/15 rounded-xl text-2xs text-brand-charcoal/80">
                <ShieldCheck className="w-4 h-4 text-brand-deep shrink-0" />
                <span>اتصال رمزگذاری‌شده به درگاه پرداخت رسمی؛ بلافاصله پس از پرداخت رسید صادر می‌گردد.</span>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-brand-light text-brand-charcoal text-xs font-bold hover:bg-brand-light/20 transition cursor-pointer order-2 sm:order-1"
              >
                انصراف و بازگشت
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2 order-1 sm:order-2">
                <button
                  type="button"
                  id="confirm-pay-btn"
                  onClick={() => handleStartPayment(false)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-brand-yellow hover:bg-[#d8cc2c] text-brand-charcoal font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-brand-yellow/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-charcoal" />
                  <span>اتصال به درگاه و پرداخت {formatToman(totalAmount)}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= STATE 2: GATEWAY REDIRECT SIMULATION ================= */}
        {modalState === "gateway_redirect" && (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-light/30 border-2 border-brand-deep flex items-center justify-center mx-auto text-brand-deep">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-black text-base text-brand-deep">در حال برقراری ارتباط با شبکه پرداخت شاپرک...</h4>
              <p className="text-xs text-brand-charcoal/70">لطفاً شکیبا باشید؛ در حال ثبت شناسه و تخصیص اسلات معلم</p>
            </div>
            <div className="pt-4 flex justify-center gap-2 text-2xs text-brand-charcoal/50 font-mono">
              <span>SSL 256-Bit</span> • <span>SHEPABANK</span> • <span>SHAPARAK SECURE</span>
            </div>
          </div>
        )}

        {/* ================= STATE 3: PAYMENT SUCCESS ================= */}
        {modalState === "success" && (
          <div className="space-y-5 animate-fade-in">
            
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-black text-base text-emerald-800">حمایت شما با موفقیت ثبت و پرداخت گردید!</h4>
              <p className="text-xs text-emerald-700">
                از همت و نیت پاک شما سپاسگزاریم؛ اسلات آموزشی بلافاصله به کلاس متصل شد.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-4 rounded-2xl bg-brand-light/15 border border-brand-light/70 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-brand-charcoal/70">شماره پیگیری تراکنش:</span>
                <span className="font-mono font-bold text-brand-deep bg-white px-2 py-0.5 rounded border border-brand-light">
                  {lastReceipt?.receipt_no || "TRX-101489"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-charcoal/70">نام حامی:</span>
                <span className="font-bold text-brand-charcoal">{sponsorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-charcoal/70">مبلغ پرداخت‌شده:</span>
                <span className="font-mono font-black text-brand-deep">{formatToman(totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-charcoal/70">تعداد زنگ‌های تأمین‌شده:</span>
                <span className="font-bold text-brand-deep">{toFaNum(totalSessions)} زنگ کلاس</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-brand-light text-brand-charcoal text-xs font-bold hover:bg-brand-light/20 transition cursor-pointer"
              >
                بستن پنجره
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCloseAndReset();
                  if (onGoToDashboard) onGoToDashboard();
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-deep hover:bg-brand-deep/90 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>مشاهده پرونده در داشبورد حامیان</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ================= STATE 4: PAYMENT FAILED ================= */}
        {modalState === "failed" && (
          <div className="space-y-5 animate-fade-in">
            
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h4 className="font-black text-base text-rose-800">تراکنش پرداخت تکمیل نشد</h4>
              <p className="text-xs text-rose-700">
                {errorMessage || "فرآیند پرداخت به دلیل عدم پاسخ بانک یا انصراف کاربر لغو گردید."}
              </p>
            </div>

            <div className="p-3 bg-brand-light/15 rounded-xl text-xs text-brand-charcoal/80">
              اطلاعات فرم شما بدون تغییر حفظ شده است. می‌توانید مجدداً تلاش فرمایید.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-brand-light text-brand-charcoal text-xs font-bold hover:bg-brand-light/20 transition cursor-pointer"
              >
                انصراف و بازگشت به سایت
              </button>

              <button
                type="button"
                onClick={() => setModalState("confirm")}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-yellow hover:bg-[#d8cc2c] text-brand-charcoal font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-brand-yellow/80"
              >
                <RefreshCw className="w-4 h-4" />
                <span>تلاش مجدد جهت پرداخت</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
