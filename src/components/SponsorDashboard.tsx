import React, { useState } from "react";
import { 
  User as UserType, 
  Student, 
  Sponsorship, 
  ClassLog 
} from "../types";
import { BeneficiaryDetailView } from "./BeneficiaryDetailView";
import { 
  Heart, 
  School, 
  Sparkles, 
  Loader2, 
  Compass, 
  FileText, 
  AlertCircle, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  Layers,
  MapPin,
  Receipt,
  Printer,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  GraduationCap,
  Eye,
  BarChart3,
  TrendingUp,
  Globe2,
  PieChart,
  FileSpreadsheet,
  Info
} from "lucide-react";

interface SponsorDashboardProps {
  currentUser: UserType;
  students: Student[];
  sponsorships: Sponsorship[];
  classLogs?: ClassLog[];
  isLoadingReport: Record<string, boolean>;
  aiReportText: Record<string, string>;
  fetchSingleReport: (studentId: string) => void;
  formatToman: (num: number) => string;
  toFaNum: (num: number | string) => string;
  onGoToHome: () => void;
  onGoToSupport?: () => void;
}

export const SponsorDashboard: React.FC<SponsorDashboardProps> = ({
  currentUser,
  students,
  sponsorships,
  classLogs = [],
  isLoadingReport,
  aiReportText,
  fetchSingleReport,
  formatToman,
  toFaNum,
  onGoToHome,
  onGoToSupport = () => {}
}) => {
  // State for beneficiary detail full page view
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  // State for beneficiary detail modal (quick peek)
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // State for receipt preview modal
  const [selectedReceipt, setSelectedReceipt] = useState<Sponsorship | null>(null);

  // State for broad program report modal preview
  const [activeReportModal, setActiveReportModal] = useState<{
    id: string;
    title: string;
    category: string;
    date: string;
    summary: string;
    highlights: string[];
    downloadLabel?: string;
  } | null>(null);

  const myStudents = students.filter(st => st.assigned_sponsor_id === currentUser.id);
  const mySponsorships = sponsorships.filter(s => s.sponsor_id === currentUser.id);

  // Calculate real sponsor contributions
  const totalSponsorSessions = mySponsorships.reduce((sum, s) => sum + s.sessions_bought, 0);
  const totalSponsorAmount = mySponsorships.reduce((sum, s) => sum + s.amount_paid, 0);
  const totalSponsoredStudents = myStudents.length;

  // National Campaign real reference benchmarks (from campaign scope)
  const nationalTotalSessions = 3600;
  const nationalTotalStudents = 500;
  const nationalTotalFunds = 360000000; // 360 million Tomans

  // Helper date formatter
  const formatDateFa = (isoString?: string) => {
    if (!isoString) return "امروز";
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const getSubjectLabel = (subject: string) => {
    if (subject === "Art") return "هنر و خلاقیت";
    if (subject === "Quran") return "انس با قرآن کریم";
    if (subject === "Religious Studies") return "تعلیمات معارف و اخلاق";
    return subject;
  };

  // Stepper timeline definition (5 sequential steps)
  const journeySteps = [
    {
      stepNumber: 1,
      title: "صندوق مرکزی پنجره",
      subtitle: "ثبت حمایت مالی و صدور شناسه پیگیری",
      description: "مبلغ اهدایی شما در سامانه ثبت و پس از کسر صفر درصدی هزینه‌های اداری، مستقیماً وارد صندوق آموزش مدارس محروم شد.",
      status: mySponsorships.length > 0 ? "completed" : "active",
      statusLabel: mySponsorships.length > 0 ? "تکمیل‌شده" : "در انتظار ثبت",
      detail: mySponsorships.length > 0 ? `مبلغ کل: ${formatToman(totalSponsorAmount)}` : "آماده اتصال"
    },
    {
      stepNumber: 2,
      title: "تخصیص به هماهنگ‌کننده استانی",
      subtitle: "ارسال برنامه به راهبران بومی",
      description: "برنامه زمان‌بندی زنگ‌های آموزشی به سرگروه‌های استانی در مناطق هدف (سیستان، هرمزگان و جنوب کرمان) ابلاغ گردید.",
      status: mySponsorships.length > 0 ? "completed" : "pending",
      statusLabel: mySponsorships.length > 0 ? "تخصیص‌یافته" : "در نوبت",
      detail: `${toFaNum(totalSponsoredStudents)} اسلات دانش‌آموزی`
    },
    {
      stepNumber: 3,
      title: "تجهیز ملزومات کارگاهی و کتب",
      subtitle: "ارسال کتب مصور و ابزار هنر",
      description: "بسته‌های نوشت‌افزار، قرآن‌های مصور آموزشی و متریال کارگاه نقاشی و صنایع‌دستی به مدارس روستایی ارسال شد.",
      status: mySponsorships.length > 0 ? "completed" : "pending",
      statusLabel: mySponsorships.length > 0 ? "ارسال‌شده به مدرسه" : "در نوبت",
      detail: "تأمین ۱۰۰٪ متریال"
    },
    {
      stepNumber: 4,
      title: "اعزام و ترانزیت مربیان متخصص",
      subtitle: "حق‌الزحمه و سوخت جاده‌ای",
      description: "حق‌الزحمه مربیان مجرب به ازای هر زنگ ۴۵ دقیقه‌ای به همراه هزینه رفت‌وآمد بین‌روستایی پوشش داده شد.",
      status: totalSponsorSessions > 0 ? "active" : "pending",
      statusLabel: totalSponsorSessions > 0 ? "در حال اجرا" : "در انتظار",
      detail: `${toFaNum(totalSponsorSessions)} زنگ آموزشی`
    },
    {
      stepNumber: 5,
      title: "برگزاری زنگ‌های درسی و شکوفایی",
      subtitle: "کلاس درس فعال و گزارش‌گیری دوره‌ای",
      description: "جلسات با حضور پرشور کودکان تشکیل شده و گزارش‌های مهارتی به طور مستمر در پرونده هر دانش‌آموز ثبت می‌شود.",
      status: myStudents.some(s => s.sessions_held > 0) ? "active" : "pending",
      statusLabel: myStudents.some(s => s.sessions_held > 0) ? "در حال تدریس" : "آغاز دوره",
      detail: `${toFaNum(myStudents.reduce((acc, curr) => acc + curr.sessions_held, 0))} جلسه برگزارشده`
    }
  ];

  if (selectedStudentForDetail) {
    return (
      <BeneficiaryDetailView
        student={selectedStudentForDetail}
        allStudents={students}
        sponsorships={sponsorships}
        classLogs={classLogs}
        currentUser={currentUser}
        isLoadingReport={Boolean(isLoadingReport[selectedStudentForDetail.id])}
        aiReportText={aiReportText[selectedStudentForDetail.id]}
        onFetchReport={fetchSingleReport}
        onBackToDashboard={() => setSelectedStudentForDetail(null)}
        onSelectStudent={(st) => setSelectedStudentForDetail(st)}
        formatToman={formatToman}
        toFaNum={toFaNum}
        onGoToSupport={onGoToSupport}
      />
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12 animate-fade-in text-right font-sans">
      
      {/* =========================================================================
          AREA 1: من و حمایت من — DASHBOARD OVERVIEW & PERSONAL IMPACT SUMMARY
      ========================================================================= */}
      <section className="space-y-6">
        
        {/* Banner with Existing Approved Visual Asset (cozy_classroom_1783860212298.jpg) */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-light/80 bg-white shadow-sm flex flex-col">
          <div className="relative w-full h-52 sm:h-64 md:h-72 overflow-hidden">
            <img 
              src="/src/assets/images/cozy_classroom_1783860212298.jpg" 
              alt="کلاس درس و معلم طرح پنجره" 
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-charcoal/40 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 left-4 text-white text-right z-10 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow text-brand-charcoal text-xs font-black shadow-2xs">
                <Heart className="w-3.5 h-3.5 fill-brand-charcoal" />
                <span>مرکز اثرگذاری و پرونده حامی</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-md">
                سلام {currentUser.name} گرامی؛ دست‌مریزاد به همت روشنتان
              </h2>
              <p className="text-xs sm:text-sm text-white/85 max-w-xl font-light">
                در این بخش می‌توانید به صورت شفاف و مستند، مسیر حرکت هدیه خود، پرونده فرزندان تحت حمایت و گزارش‌های معلمان را مرور فرمایید.
              </p>
            </div>
          </div>
        </div>

        {/* Compact Overview: Meaningful Existing Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Metric 1: Current Active Sponsorship */}
          <div className="bg-white rounded-2xl border border-brand-light/80 p-5 shadow-2xs space-y-1.5 text-right transition hover:border-brand-deep/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-charcoal/70">حمایت فعال جاری</span>
              <div className="w-8 h-8 rounded-xl bg-brand-light/40 flex items-center justify-center text-brand-deep">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <strong className="text-xl sm:text-2xl font-black text-brand-deep font-mono block">
              {toFaNum(totalSponsorSessions)} زنگ آموزشی
            </strong>
            <p className="text-2xs text-brand-charcoal/60">
              جلسات درسی ۴۵ دقیقه‌ای فعال در تقویم مدارس
            </p>
          </div>

          {/* Metric 2: Total Contribution */}
          <div className="bg-white rounded-2xl border border-brand-light/80 p-5 shadow-2xs space-y-1.5 text-right transition hover:border-brand-deep/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-charcoal/70">مجموع مشارکت مالی شما</span>
              <div className="w-8 h-8 rounded-xl bg-brand-light/40 flex items-center justify-center text-brand-deep">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <strong className="text-xl sm:text-2xl font-black text-brand-deep font-mono block">
              {formatToman(totalSponsorAmount)}
            </strong>
            <p className="text-2xs text-brand-charcoal/60">
              تأمین ۱۰۰٪ حق‌الزحمه مربی، ملزومات و ترانزیت
            </p>
          </div>

          {/* Metric 3: Supported Beneficiaries */}
          <div className="bg-white rounded-2xl border border-brand-light/80 p-5 shadow-2xs space-y-1.5 text-right transition hover:border-brand-deep/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-charcoal/70">تعداد فرزندان تحت حمایت</span>
              <div className="w-8 h-8 rounded-xl bg-brand-yellow/30 flex items-center justify-center text-brand-charcoal">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <strong className="text-xl sm:text-2xl font-black text-brand-deep font-mono block">
              {toFaNum(totalSponsoredStudents)} دانش‌آموز
            </strong>
            <p className="text-2xs text-brand-charcoal/60">
              دارای پرونده فعال و گزارش کلاسی مستقیم
            </p>
          </div>

        </div>

      </section>

      {/* =========================================================================
          AREA 2: سفر مبلغ / مسیر اثر حمایت — IMPACT JOURNEY (STEPPER TIMELINE)
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 space-y-6 shadow-2xs text-right">
        
        <div className="border-b border-brand-light/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-brand-deep flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-deep shrink-0" />
              <span>سفر مبلغ / مسیر شفاف کمک شما</span>
            </h3>
            <p className="text-xs text-brand-charcoal/70 mt-0.5">
              پاسخ شفاف به پرسش: «کمک من از کجا شروع شد و چگونه به کلاس درس رسید؟»
            </p>
          </div>
          <span className="text-2xs font-extrabold text-brand-deep bg-brand-light/40 px-3 py-1 rounded-full self-start sm:self-auto">
            تضمین شفافیت ۵ مرحله‌ای
          </span>
        </div>

        {/* Stepper Timeline: Horizontal on Desktop (md:), Vertical on Mobile */}
        <div className="relative pt-2 pb-4">
          
          {/* Desktop connecting horizontal line */}
          <div className="hidden lg:block absolute top-[44px] right-12 left-12 h-1 bg-brand-light/70 -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-3 relative z-10">
            {journeySteps.map((step) => {
              const isCompleted = step.status === "completed";
              const isActive = step.status === "active";

              return (
                <div 
                  key={step.stepNumber} 
                  className="flex flex-row lg:flex-col items-start lg:items-center gap-4 lg:gap-3 text-right lg:text-center group"
                >
                  {/* Step Bubble Indicator */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-mono font-black text-sm transition-all shadow-2xs ${
                      isCompleted
                        ? "bg-brand-deep text-white ring-4 ring-brand-deep/10"
                        : isActive
                          ? "bg-brand-yellow text-brand-charcoal ring-4 ring-brand-yellow/30 animate-pulse"
                          : "bg-brand-light/30 border border-brand-light text-brand-charcoal/60"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <span>{toFaNum(step.stepNumber)}</span>
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="space-y-1.5 flex-1 lg:flex-initial">
                    <div className="flex items-center lg:justify-center gap-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : isActive
                            ? "bg-brand-yellow/30 text-brand-charcoal border border-brand-yellow/60"
                            : "bg-slate-100 text-slate-500"
                      }`}>
                        {step.statusLabel}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-brand-deep">
                      {step.title}
                    </h4>

                    <p className="text-2xs text-brand-charcoal/70 leading-relaxed max-w-xs lg:max-w-[170px] font-sans">
                      {step.description}
                    </p>

                    {step.detail && (
                      <div className="pt-1 text-[11px] font-bold text-brand-deep font-mono">
                        {step.detail}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </section>

      {/* =========================================================================
          AREA 3: افراد تحت حمایت و خدمات — SUPPORTED BENEFICIARIES & PROGRESS
      ========================================================================= */}
      <section className="space-y-4 text-right">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-light/60 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-brand-deep flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-brand-deep shrink-0" />
              <span>افراد تحت حمایت و خدمات آموزشی («فرزندان معنوی شما»)</span>
            </h3>
            <p className="text-xs text-brand-charcoal/70 mt-0.5">
              مشاهده پرونده تحصیلی، میزان پیشرفت زنگ‌های برگزارشده و دریافت جدیدترین گزارش مربی
            </p>
          </div>
          <span className="text-2xs font-extrabold text-brand-charcoal/80 bg-brand-light/30 px-3 py-1 rounded-full self-start sm:self-auto">
            {toFaNum(myStudents.length)} دانش‌آموز متصل به پرونده
          </span>
        </div>

        {myStudents.length === 0 ? (
          <div className="bg-white rounded-3xl border border-brand-light/80 p-8 sm:p-10 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-brand-light/30 text-brand-deep flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7 text-brand-deep" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="text-base font-black text-brand-deep">هنوز دانش‌آموزی به پرونده شما متصل نشده است</h4>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed font-sans">
                با حمایت از یک یا چند زنگ درسی در صفحه اصلی، سیستم هوشمند پنجره بلافاصله دانش‌آموزان نیازمند را به عنوان فرزندان معنوی به پنل شما متصل خواهد کرد.
              </p>
            </div>
            <button 
              onClick={onGoToHome}
              className="px-6 py-3 bg-brand-yellow hover:bg-[#d8cc2c] text-brand-charcoal font-black rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs border border-brand-yellow/80 inline-flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-brand-charcoal" />
              <span>تأمین زنگ کلاسی در صفحه اصلی</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myStudents.map((st) => {
              const heldCount = st.sessions_held || 0;
              const heldPercent = Math.min(100, Math.floor((heldCount / 24) * 100));
              const hasReport = !!aiReportText[st.id];

              return (
                <div 
                  key={st.id} 
                  className="bg-white rounded-3xl border border-brand-light/80 hover:border-brand-deep/30 transition-all p-6 space-y-5 shadow-2xs flex flex-col justify-between"
                >
                  
                  {/* Card Header: Identifier & Educational Context */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-brand-deep bg-brand-light/40 px-2.5 py-1 rounded-lg">
                        {getSubjectLabel(st.subject)}
                      </span>
                      <span className="text-2xs text-brand-charcoal/60 font-mono font-bold bg-brand-light/20 px-2 py-0.5 rounded">
                        کد: {st.id.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-black text-brand-charcoal">
                        {st.name} <span className="text-xs text-brand-charcoal/60 font-medium">({st.grade})</span>
                      </h4>
                      <p className="text-xs text-brand-charcoal/80 flex items-center gap-1.5 mt-1 font-sans">
                        <School className="w-3.5 h-3.5 text-brand-deep shrink-0" />
                        <span>مدرسه: <strong className="font-semibold text-brand-deep">{st.school_name}</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-2xs">
                      <span className="font-bold text-brand-charcoal/70">وضعیت کفالت:</span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {st.sponsorship_status === "Fully_Sponsored" ? "تحت پوشش کامل سالانه" : "تحت حمایت جلسه‌ای فعال"}
                      </span>
                    </div>
                  </div>

                  {/* Service Progress & Session Tracker */}
                  <div className="p-4 rounded-2xl bg-brand-light/15 border border-brand-light/60 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-brand-charcoal/70">پیشرفت زنگ‌های آموزشی:</span>
                      <span className="font-mono text-brand-deep font-black">
                        {toFaNum(heldCount)} از ۲۴ زنگ کلاسی
                      </span>
                    </div>

                    <div className="w-full bg-brand-light/50 rounded-full h-3 overflow-hidden relative border border-brand-light/70">
                      <div 
                        className="bg-brand-yellow h-full rounded-full transition-all duration-700"
                        style={{ width: `${heldPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-2xs text-brand-charcoal/60 font-medium">
                      <span>پیشرفت برنامه: {toFaNum(heldPercent)}٪</span>
                      {heldCount >= 24 ? (
                        <span className="text-brand-charcoal font-black bg-brand-yellow px-2 py-0.5 rounded text-2xs">
                          اتمام کامل دوره سالانه
                        </span>
                      ) : (
                        <span>{toFaNum(24 - heldCount)} زنگ تا پایان سال</span>
                      )}
                    </div>
                  </div>

                  {/* Report Section & Secondary CTA */}
                  <div className="pt-2 border-t border-brand-light/60 space-y-3">
                    
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-deep" />
                        <span>ارزیابی کیفی مربی:</span>
                      </span>

                      {/* Clear Secondary CTA */}
                      <button
                        id={`generate-report-${st.id}`}
                        onClick={() => fetchSingleReport(st.id)}
                        disabled={isLoadingReport[st.id]}
                        className="px-3.5 py-1.5 bg-brand-deep hover:bg-[#232573] disabled:bg-slate-300 text-white rounded-xl text-2xs font-extrabold cursor-pointer transition flex items-center gap-1.5 shadow-2xs"
                      >
                        {isLoadingReport[st.id] ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>در حال دریافت...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3" />
                            <span>دریافت جدیدترین گزارش</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Report Text Display */}
                    {hasReport ? (
                      <div className="p-3.5 bg-white border border-brand-light/80 rounded-xl text-xs text-brand-charcoal leading-relaxed font-sans shadow-2xs">
                        <p className="text-brand-deep font-bold text-2xs mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>گزارش مستند مربی اعزامی:</span>
                        </p>
                        {aiReportText[st.id]}
                      </div>
                    ) : (
                      <p className="text-2xs text-brand-charcoal/60 bg-brand-light/10 p-2.5 rounded-xl border border-brand-light/40">
                        جهت دریافت خلاصه وضعیت آموزشی و نظر معلم بر روی دکمه «دریافت جدیدترین گزارش» کلیک فرمایید.
                      </p>
                    )}

                    {/* Button to open Detailed Beneficiary Page */}
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForDetail(st)}
                        className="text-xs font-bold text-brand-deep hover:text-[#232573] flex items-center gap-1.5 cursor-pointer transition py-1.5 px-3 rounded-xl bg-brand-light/30 hover:bg-brand-light/60 border border-brand-light"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده پرونده کامل آموزشی</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* =========================================================================
          AREA 4: گستره جغرافیایی طرح رویش و سهم شما — 3 LEVELS & PROGRAM REPORTS
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 space-y-8 shadow-2xs text-right">
        
        {/* Section Header */}
        <div className="border-b border-brand-light/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light/50 text-brand-deep text-2xs font-extrabold mb-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              <span>طرح ملی آموزش در مناطق مرزی</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-brand-deep flex items-center gap-2">
              <Layers className="text-brand-deep w-5 h-5 shrink-0" />
              <span>گستره جغرافیایی طرح رویش و سهم شما</span>
            </h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/80 mt-1 font-medium leading-relaxed">
              «حمایت من کوچک است، اما بخشی معنادار و حیاتی از یک حرکت آموزشی بزرگتر در سراسر ایران است.»
            </p>
          </div>
          <span className="text-2xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>محاسبات بر پایه داده‌های واقعی</span>
          </span>
        </div>

        {/* 3 LEVELS VISUAL HIERARCHY */}
        <div className="space-y-6">

          {/* -------------------------------------------------------------
              LEVEL 1: سهم من (My Direct Contribution)
          ------------------------------------------------------------- */}
          <div className="rounded-2xl border-2 border-brand-yellow/80 bg-brand-yellow/10 p-5 sm:p-6 space-y-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-yellow text-brand-charcoal font-black text-xs flex items-center justify-center shadow-2xs">
                  ۱
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-brand-charcoal">
                    سطح اول: سهم من (مشارکت مستقیم و فردی شما)
                  </h4>
                  <p className="text-2xs text-brand-charcoal/70">
                    نقطه اثر اختصاصی و عینی که مستقیماً با حمایت شما در کلاس درس شکل گرفته است
                  </p>
                </div>
              </div>
              <span className="text-2xs font-extrabold text-brand-charcoal bg-brand-yellow px-3 py-1 rounded-full self-start sm:self-auto shadow-2xs">
                پرونده شخصی شما
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              <div className="bg-white p-4 rounded-xl border border-brand-yellow/50 text-right space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-2xs text-brand-charcoal/70 font-bold">
                  <span>تعداد زنگ‌های تأمین‌شده</span>
                  <Clock className="w-3.5 h-3.5 text-brand-deep" />
                </div>
                <strong className="text-base sm:text-lg font-black text-brand-deep font-mono block">
                  {toFaNum(totalSponsorSessions)} زنگ کلاسی
                </strong>
                <span className="text-3xs text-brand-charcoal/60 block">
                  معادل {toFaNum(totalSponsorSessions * 45)} دقیقه تدریس رو در رو
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-yellow/50 text-right space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-2xs text-brand-charcoal/70 font-bold">
                  <span>دانش‌آموزان تحت پوشش مستقیم</span>
                  <GraduationCap className="w-3.5 h-3.5 text-brand-deep" />
                </div>
                <strong className="text-base sm:text-lg font-black text-brand-deep font-mono block">
                  {toFaNum(totalSponsoredStudents)} فرزند معنوی
                </strong>
                <span className="text-3xs text-brand-charcoal/60 block">
                  متصل به پرونده و پایش مستمر آموزشی
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-yellow/50 text-right space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-2xs text-brand-charcoal/70 font-bold">
                  <span>مجموع ارزش مالی اهدایی</span>
                  <Receipt className="w-3.5 h-3.5 text-brand-deep" />
                </div>
                <strong className="text-sm sm:text-base font-black text-brand-deep font-mono block">
                  {formatToman(totalSponsorAmount)}
                </strong>
                <span className="text-3xs text-brand-charcoal/60 block">
                  پوشش ۱۰۰٪ هزینه مربی، کتب و ابزار
                </span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              LEVEL 2: طرح مرتبط با حمایت من (Project Connected to My Contribution)
          ------------------------------------------------------------- */}
          <div className="rounded-2xl border border-brand-deep/20 bg-brand-light/25 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-deep text-white font-black text-xs flex items-center justify-center shadow-2xs">
                  ۲
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-brand-deep">
                    سطح دوم: طرح مرتبط با حمایت من (حوزه استقرار و پایگاه‌های تحت پوشش)
                  </h4>
                  <p className="text-2xs text-brand-charcoal/70">
                    مدارس و کانون‌های آموزشی پیرامونی که دانش‌آموزان تحت حمایت شما در آن مستقر هستند
                  </p>
                </div>
              </div>
              <span className="text-2xs font-extrabold text-brand-deep bg-white border border-brand-light px-3 py-1 rounded-full self-start sm:self-auto">
                مدارس کانون هدف
              </span>
            </div>

            {myStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {Array.from(new Set(myStudents.map(s => s.school_name))).map((schoolName, idx) => {
                  const studentsInSchool = myStudents.filter(s => s.school_name === schoolName);
                  const subjectsInSchool = Array.from(new Set(studentsInSchool.map(s => getSubjectLabel(s.subject))));
                  
                  return (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-brand-light/80 space-y-2 text-right shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-brand-deep shrink-0" />
                          <span className="text-xs font-black text-brand-deep">{schoolName}</span>
                        </div>
                        <span className="text-2xs bg-brand-light/40 text-brand-deep px-2 py-0.5 rounded font-bold">
                          {toFaNum(studentsInSchool.length)} دانش‌آموز تحت حمایت شما
                        </span>
                      </div>
                      <div className="text-2xs text-brand-charcoal/75 space-y-1">
                        <p>سرفصل‌های آموزشی فعال در مدرسه: <strong className="font-semibold text-brand-charcoal">{subjectsInSchool.join("، ")}</strong></p>
                        <p className="text-3xs text-brand-charcoal/60">دارای هماهنگ‌کننده بومی و اعزام منظم هفتگی مربیان تخصصی</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-brand-light/80 text-xs text-brand-charcoal/70 text-center">
                با تخصیص اولین دانش‌آموز، مشخصات پایگاه آموزشی مرتبط در این لایه نمایش داده می‌شود.
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------
              LEVEL 3: گستره کل طرح پنجره (National Scope of Penjereh)
          ------------------------------------------------------------- */}
          <div className="rounded-2xl border border-brand-light/90 bg-white p-5 sm:p-6 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-light/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-charcoal text-white font-black text-xs flex items-center justify-center shadow-2xs">
                  ۳
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-brand-charcoal">
                    سطح سوم: گستره کل طرح پنجره در کشور
                  </h4>
                  <p className="text-2xs text-brand-charcoal/70">
                    مجموع هدف‌گذاری سالانه و مقیاس سراسری پویش در پهنه مدارس مناطق محروم مرزی
                  </p>
                </div>
              </div>
              <span className="text-2xs font-extrabold text-brand-charcoal/80 bg-brand-light/40 px-3 py-1 rounded-full self-start sm:self-auto">
                افق ملی سال تحصیلی
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* CLEAN PLACEHOLDER FOR REAL APPROVED GEOGRAPHIC MAP */}
              <div 
                id="geographic-map-placeholder"
                className="lg:col-span-6 bg-gradient-to-br from-brand-light/15 via-white to-brand-light/35 rounded-2xl p-6 border-2 border-dashed border-brand-deep/30 flex flex-col items-center justify-center text-center space-y-3.5 min-h-[290px] relative overflow-hidden"
              >
                <div className="w-13 h-13 rounded-2xl bg-white text-brand-deep border border-brand-light shadow-2xs flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-brand-deep" />
                </div>
                
                <div className="space-y-1.5 max-w-sm">
                  <span className="inline-block text-3xs font-extrabold tracking-wider text-brand-deep bg-brand-light/60 px-2.5 py-0.5 rounded-md">
                    محل نمایش نقشه واقعی گستره طرح
                  </span>
                  <h5 className="text-xs sm:text-sm font-black text-brand-deep">
                    نقشه جغرافیایی مستند و مصوب طرح رویش
                  </h5>
                  <p className="text-2xs text-brand-charcoal/70 leading-relaxed font-sans">
                    در این جایگاه، نقشه رسمی GIS و موقعیت مکانی دقیق کانون‌های آموزشی پس از تأیید و بارگذاری فایل مصوب نمایش داده خواهد شد.
                  </p>
                </div>

                <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-3xs text-brand-charcoal/80 font-bold">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-brand-light/80 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    عدم درج موقعیت‌های تخیلی
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-brand-light/80 flex items-center gap-1">
                    <Info className="w-3 h-3 text-brand-deep" />
                    آماده ادغام داده‌های رسمی
                  </span>
                </div>
              </div>

              {/* REAL DATA METRICS & SCOPE */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-2xs font-extrabold text-brand-deep bg-brand-light/40 px-2.5 py-1 rounded-md inline-block">
                    شاخص‌های عینی کل طرح در سال جاری
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-brand-light/20 p-3.5 rounded-xl border border-brand-light/80 text-right space-y-1">
                      <span className="text-2xs text-brand-charcoal/70 block font-bold">کل زنگ‌های هدف</span>
                      <strong className="text-sm sm:text-base font-black text-brand-deep font-mono block">
                        {toFaNum(nationalTotalSessions)} زنگ
                      </strong>
                      <span className="text-3xs text-brand-charcoal/60 block">در سال تحصیلی</span>
                    </div>

                    <div className="bg-brand-light/20 p-3.5 rounded-xl border border-brand-light/80 text-right space-y-1">
                      <span className="text-2xs text-brand-charcoal/70 block font-bold">کل دانش‌آموزان هدف</span>
                      <strong className="text-sm sm:text-base font-black text-brand-deep font-mono block">
                        {toFaNum(nationalTotalStudents)} نفر
                      </strong>
                      <span className="text-3xs text-brand-charcoal/60 block">در پایه‌های مختلف</span>
                    </div>

                    <div className="bg-brand-light/20 p-3.5 rounded-xl border border-brand-light/80 text-right space-y-1">
                      <span className="text-2xs text-brand-charcoal/70 block font-bold">بودجه کل مصوب</span>
                      <strong className="text-xs sm:text-sm font-black text-brand-deep font-mono block">
                        {formatToman(nationalTotalFunds)}
                      </strong>
                      <span className="text-3xs text-brand-charcoal/60 block">کل زنجیره تأمین</span>
                    </div>
                  </div>
                </div>

                {/* Reality Context Callout */}
                <div className="p-4 rounded-xl bg-brand-light/15 border border-brand-light/60 space-y-1.5 text-2xs text-brand-charcoal/80 leading-relaxed font-sans">
                  <div className="font-bold text-brand-deep flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>هم‌افزایی حمایت‌ها در مقیاس ملی</span>
                  </div>
                  <p>
                    مشارکت شما به عنوان یک حامی، در کنار سایر حامیان نیک‌اندیش، جریان پیوسته آموزش تخصصی هنر، قرآن و تعلیمات اخلاقی را برای صدها کودک در روستاهای دورافتاده تضمین می‌کند.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* -------------------------------------------------------------
            PROGRAM REPORTS SECTION (گزارش‌های کلان و اسناد طرح)
        ------------------------------------------------------------- */}
        <div className="pt-4 border-t border-brand-light/70 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm sm:text-base font-black text-brand-deep flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-brand-deep" />
                <span>گزارش‌های دوره‌ای و اسناد شفافیت طرح رویش</span>
              </h4>
              <p className="text-2xs text-brand-charcoal/70 mt-0.5">
                دسترسی به گزارش‌های عملکردی، آماری، مالی و جغرافیایی رسمی طرح پنجره
              </p>
            </div>
            <span className="text-3xs text-brand-charcoal/60 bg-brand-light/30 px-2.5 py-1 rounded-md self-start sm:self-auto font-medium">
              به‌روزرسانی دوره‌ای و فصلی
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Report Card 1: دوره‌ای */}
            <button
              type="button"
              onClick={() => setActiveReportModal({
                id: "periodic",
                title: "گزارش‌های دوره‌ای پیشرفت طرح رویش",
                category: "گزارش دوره‌ای",
                date: "فصل بهار و پاییز ۱۴۰۴",
                summary: "این گزارش شامل خلاصه روند اجرایی زنگ‌های درسی برگزارشده، وضعیت حضور مربیان و بازخورد کادر آموزشی مدارس در دوره‌های سه‌ماهه است.",
                highlights: [
                  "ثبت دقیق جلسات برگزارشده بر اساس تقویم آموزشی",
                  "پایش مستمر پیشرفت دروس هنر، قرآن و معارف",
                  "ارزیابی دوره‌ای توسط سرگروه‌های استانی"
                ],
                downloadLabel: "دریافت سند دوره‌ای (PDF)"
              })}
              className="bg-brand-light/15 hover:bg-brand-light/35 border border-brand-light/80 hover:border-brand-deep/30 rounded-2xl p-4 text-right transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-white text-brand-deep border border-brand-light flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-black text-brand-deep block group-hover:text-[#232573]">
                    گزارش‌های دوره‌ای
                  </strong>
                  <span className="text-3xs text-brand-charcoal/70 block mt-0.5">
                    روند فصلی پیشرفت کلاس‌ها
                  </span>
                </div>
              </div>
              <span className="text-3xs font-extrabold text-brand-deep flex items-center gap-1">
                <span>مشاهده گزارش</span>
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              </span>
            </button>

            {/* Report Card 2: مالی */}
            <button
              type="button"
              onClick={() => setActiveReportModal({
                id: "financial",
                title: "گزارش مالی و تراز هزینه‌کرد طرح",
                category: "گزارش مالی و شفافیت",
                date: "سال مالی جاری",
                summary: "تراز هزینه‌کرد ریالی شامل تفکیک ۱۰۰٪ پرداختی‌ها به مربیان بومی، ترانزیت جاده‌ای بین‌روستایی و تأمین ملزومات کارگاهی و کتب درسی.",
                highlights: [
                  "کسر صفر درصد بابت هزینه‌های سربار یا واسطه‌گری",
                  "تطبیق ۱۰۰٪ مبالغ اهدایی حامیان با زنگ‌های کلاسی واقعی",
                  "ثبت الکترونیک فاکتورهای تأمین متریال و ترانزیت"
                ],
                downloadLabel: "دریافت تراز مالی رسمی (PDF)"
              })}
              className="bg-brand-light/15 hover:bg-brand-light/35 border border-brand-light/80 hover:border-brand-deep/30 rounded-2xl p-4 text-right transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-white text-brand-deep border border-brand-light flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-black text-brand-deep block group-hover:text-[#232573]">
                    گزارش مالی
                  </strong>
                  <span className="text-3xs text-brand-charcoal/70 block mt-0.5">
                    شفافیت ریالی و تراز تخصیص
                  </span>
                </div>
              </div>
              <span className="text-3xs font-extrabold text-brand-deep flex items-center gap-1">
                <span>مشاهده گزارش</span>
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              </span>
            </button>

            {/* Report Card 3: عملکرد */}
            <button
              type="button"
              onClick={() => setActiveReportModal({
                id: "performance",
                title: "گزارش عملکرد و کیفیت تدریس",
                category: "گزارش عملکرد",
                date: "پایش مستمر کلاسی",
                summary: "ارزیابی اثربخشی آموزشی، میزان اشتیاق و یادگیری دانش‌آموزان و گزارش‌های ناظران میدانی از زنگ‌های تشکیل‌شده در مدارس مرزی.",
                highlights: [
                  "شاخص رضایت‌سنجی معلمان و مدیران مدارس میزبان",
                  "بررسی نرخ حضور و اشتیاق یادگیری کودکان",
                  "مستندسازی فعالیت‌های عملی و گروهی"
                ],
                downloadLabel: "دریافت سند عملکرد آموزشی (PDF)"
              })}
              className="bg-brand-light/15 hover:bg-brand-light/35 border border-brand-light/80 hover:border-brand-deep/30 rounded-2xl p-4 text-right transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-white text-brand-deep border border-brand-light flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-black text-brand-deep block group-hover:text-[#232573]">
                    گزارش عملکرد
                  </strong>
                  <span className="text-3xs text-brand-charcoal/70 block mt-0.5">
                    کیفیت تدریس و نظارت میدانی
                  </span>
                </div>
              </div>
              <span className="text-3xs font-extrabold text-brand-deep flex items-center gap-1">
                <span>مشاهده گزارش</span>
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              </span>
            </button>

            {/* Report Card 4: آمار و دستاوردها */}
            <button
              type="button"
              onClick={() => setActiveReportModal({
                id: "stats",
                title: "آمار و دستاوردهای سراسری طرح",
                category: "آمار و دستاوردها",
                date: "آمار تجمیعی پویش",
                summary: "مجموع زنگ‌های کلاسی تشکیل‌شده، تعداد آثار هنری خلق‌شده، دانش‌آموزان ارتقایافته در انس با قرآن و پوشش مدارس دورافتاده.",
                highlights: [
                  "بیش از ۳۶۰۰ زنگ کلاسی هدف‌گذاری‌شده در سال",
                  "پوشش بیش از ۵۰۰ دانش‌آموز در روستاهای کم‌برخوردار",
                  "خلق صدها اثر نقاشی و تمرین خط و دست‌ورزی"
                ],
                downloadLabel: "دریافت سالنامه آماری (PDF)"
              })}
              className="bg-brand-light/15 hover:bg-brand-light/35 border border-brand-light/80 hover:border-brand-deep/30 rounded-2xl p-4 text-right transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-white text-brand-deep border border-brand-light flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-black text-brand-deep block group-hover:text-[#232573]">
                    آمار و دستاوردها
                  </strong>
                  <span className="text-3xs text-brand-charcoal/70 block mt-0.5">
                    شاخص‌های خروجی و دستاوردها
                  </span>
                </div>
              </div>
              <span className="text-3xs font-extrabold text-brand-deep flex items-center gap-1">
                <span>مشاهده گزارش</span>
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              </span>
            </button>

            {/* Report Card 5: جغرافیایی */}
            <button
              type="button"
              onClick={() => setActiveReportModal({
                id: "geo",
                title: "گزارش جغرافیایی و اطلس پایگاه‌های مرزی",
                category: "گزارش جغرافیایی",
                date: "اطلس مناطق هدف",
                summary: "مستندات توزیع پایگاه‌های آموزشی در استان‌های مرزی، مسافت‌های جاده‌ای تردد مربیان سیار و موقعیت جغرافیایی روستاهای تحت پوشش.",
                highlights: [
                  "تفکیک مدارس کانون در سیستان و بلوچستان، هرمزگان و کرمان",
                  "برنامه پایش راه‌های مواصلاتی و ترانزیت مربیان",
                  "آماده‌سازی لایه‌های رسمی GIS برای انتشار برخط"
                ],
                downloadLabel: "دریافت اطلس جغرافیایی (PDF)"
              })}
              className="bg-brand-light/15 hover:bg-brand-light/35 border border-brand-light/80 hover:border-brand-deep/30 rounded-2xl p-4 text-right transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-white text-brand-deep border border-brand-light flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-black text-brand-deep block group-hover:text-[#232573]">
                    گزارش جغرافیایی
                  </strong>
                  <span className="text-3xs text-brand-charcoal/70 block mt-0.5">
                    اطلس مدارس و نقاط تحت پوشش
                  </span>
                </div>
              </div>
              <span className="text-3xs font-extrabold text-brand-deep flex items-center gap-1">
                <span>مشاهده گزارش</span>
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              </span>
            </button>

          </div>
        </div>

      </section>

      {/* =========================================================================
          AREA 5: تاریخچه پرداخت‌ها و رسیدها — PAYMENT HISTORY & RECEIPTS
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 space-y-5 shadow-2xs text-right">
        
        <div className="border-b border-brand-light/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-brand-deep flex items-center gap-2">
              <Receipt className="text-brand-deep w-5 h-5 shrink-0" />
              <span>تاریخچه پرداخت‌ها و رسیدهای رسمی</span>
            </h3>
            <p className="text-xs text-brand-charcoal/70 mt-0.5">
              فهرست کامل تراکنش‌های معنوی شما همراه با امکان صدور و دریافت رسید رسمی الکترونیک
            </p>
          </div>
          <span className="text-2xs font-extrabold text-brand-charcoal/80 bg-brand-light/30 px-3 py-1 rounded-full self-start sm:self-auto">
            {toFaNum(mySponsorships.length)} تراکنش ثبت‌شده
          </span>
        </div>

        {mySponsorships.length === 0 ? (
          <div className="p-6 text-center text-xs text-brand-charcoal/60 bg-brand-light/10 rounded-2xl">
            تراکنشی در تاریخچه پرداخت‌های شما ثبت نگردیده است.
          </div>
        ) : (
          <>
            {/* Desktop Table View (md:) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-brand-light/25 text-brand-deep border-b border-brand-light/70">
                    <th className="py-3 px-4 font-black">شماره پیگیری / مرجع</th>
                    <th className="py-3 px-4 font-black">تاریخ تراکنش</th>
                    <th className="py-3 px-4 font-black">نوع حمایت و تخصیص</th>
                    <th className="py-3 px-4 font-black">تعداد زنگ</th>
                    <th className="py-3 px-4 font-black">مبلغ پرداختی</th>
                    <th className="py-3 px-4 font-black text-center">وضعیت</th>
                    <th className="py-3 px-4 font-black text-left">رسید رسمی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/40">
                  {mySponsorships.map((s) => (
                    <tr key={s.id} className="hover:bg-brand-light/10 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-charcoal">
                        {s.receipt_no}
                      </td>
                      <td className="py-3.5 px-4 text-brand-charcoal/80 font-medium">
                        {formatDateFa(s.created_at)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-brand-deep block">{s.student_name}</span>
                        <span className="text-2xs text-brand-charcoal/70">{s.school_name} ({s.subject})</span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-brand-deep font-mono">
                        {toFaNum(s.sessions_bought)} زنگ
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-brand-deep">
                        {formatToman(s.amount_paid)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>موفق</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-left">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(s)}
                          className="px-3 py-1.5 bg-brand-light/40 hover:bg-brand-deep hover:text-white text-brand-deep rounded-lg text-2xs font-extrabold transition cursor-pointer flex items-center gap-1 border border-brand-light"
                        >
                          <FileText className="w-3 h-3" />
                          <span>مشاهده رسید</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Compact Cards View */}
            <div className="md:hidden space-y-3">
              {mySponsorships.map((s) => (
                <div 
                  key={s.id}
                  className="p-4 rounded-2xl border border-brand-light/80 bg-brand-light/10 space-y-3 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-brand-deep bg-white px-2 py-0.5 rounded border border-brand-light">
                      {s.receipt_no}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>موفق</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-brand-charcoal/70">دانش‌آموز تخصیص‌یافته:</span>
                      <strong className="text-brand-deep">{s.student_name}</strong>
                    </div>
                    <div className="flex justify-between text-2xs text-brand-charcoal/70">
                      <span>مدرسه و درس:</span>
                      <span>{s.school_name} ({s.subject})</span>
                    </div>
                    <div className="flex justify-between text-2xs text-brand-charcoal/70">
                      <span>تاریخ:</span>
                      <span>{formatDateFa(s.created_at)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-brand-light/60">
                      <span>مبلغ و تعداد زنگ:</span>
                      <span className="font-mono text-brand-deep font-black">
                        {formatToman(s.amount_paid)} ({toFaNum(s.sessions_bought)} زنگ)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(s)}
                      className="w-full py-2 bg-brand-deep text-white rounded-xl text-2xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>مشاهده و چاپ رسید رسمی</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </section>

      {/* =========================================================================
          MODAL 1: DETAILED BENEFICIARY PROFILE MODAL (صفحه/مدال پرونده تفصیلی)
      ========================================================================= */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs text-right">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-brand-light/80 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-light/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-light/40 text-brand-deep flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-brand-deep">
                    پرونده تحصیلی و آموزشی {selectedStudentForModal.name}
                  </h3>
                  <p className="text-2xs text-brand-charcoal/70">شناسه سیستمی: {selectedStudentForModal.id.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="p-1.5 rounded-lg text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-light/20 transition cursor-pointer"
                aria-label="بستن پنجره"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Beneficiary Details Grid */}
            <div className="space-y-4 text-xs font-medium">
              
              <div className="grid grid-cols-2 gap-3 p-4 bg-brand-light/15 rounded-2xl border border-brand-light/60">
                <div>
                  <span className="text-2xs text-brand-charcoal/60 block">مدرسه محل تحصیل:</span>
                  <strong className="text-brand-deep font-bold">{selectedStudentForModal.school_name}</strong>
                </div>
                <div>
                  <span className="text-2xs text-brand-charcoal/60 block">پایه تحصیلی:</span>
                  <strong className="text-brand-deep font-bold">{selectedStudentForModal.grade}</strong>
                </div>
                <div>
                  <span className="text-2xs text-brand-charcoal/60 block">سرفصل آموزشی:</span>
                  <strong className="text-brand-deep font-bold">{getSubjectLabel(selectedStudentForModal.subject)}</strong>
                </div>
                <div>
                  <span className="text-2xs text-brand-charcoal/60 block">وضعیت حمایت:</span>
                  <span className="text-emerald-700 font-black">تحت پوشش فعال</span>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="p-4 bg-white border border-brand-light/80 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-brand-charcoal">زنگ‌های برگزارشده تاکنون:</span>
                  <span className="font-mono font-black text-brand-deep">
                    {toFaNum(selectedStudentForModal.sessions_held)} از ۲۴ جلسه
                  </span>
                </div>
                <div className="w-full bg-brand-light/40 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-brand-yellow h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.floor((selectedStudentForModal.sessions_held / 24) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Teacher Report Note */}
              <div className="space-y-2">
                <h5 className="font-black text-brand-deep text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-deep" />
                  <span>آخرین ارزیابی ثبت‌شده مربی:</span>
                </h5>
                <div className="p-3.5 bg-brand-light/20 rounded-xl text-brand-charcoal leading-relaxed font-sans text-xs border border-brand-light/60">
                  {aiReportText[selectedStudentForModal.id] || 
                    `دانش‌آموز «${selectedStudentForModal.name}» با اشتیاق بالا در کلاس درس «${getSubjectLabel(selectedStudentForModal.subject)}» حاضر شده و طبق مشاهدات مربی، تمرکز، خلاقیت فردی و مشارکت کلاسی بسیار درخشانی از خود نشان داده است.`
                  }
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudentForModal(null)}
                className="px-5 py-2.5 bg-brand-deep hover:bg-[#232573] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                بستن پرونده
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: OFFICIAL DIGITAL RECEIPT MODAL (رسید رسمی الکترونیک)
      ========================================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs text-right">
          <div className="bg-white w-full max-w-md rounded-3xl border border-brand-light/80 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in">
            
            {/* Receipt Header */}
            <div className="flex items-center justify-between border-b border-brand-light/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-yellow/30 text-brand-charcoal flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-brand-deep">رسید رسمی پرداخت کفالت پنجره</h4>
                  <p className="text-2xs text-brand-charcoal/60">رسید الکترونیک معتبر طرح ملی پنجره</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-lg text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-light/20 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Slip Container */}
            <div className="p-5 rounded-2xl bg-brand-light/15 border border-brand-light/80 space-y-3.5 text-xs">
              
              <div className="flex justify-between items-center border-b border-brand-light/60 pb-2">
                <span className="text-brand-charcoal/70">شماره مرجع تراکنش:</span>
                <span className="font-mono font-black text-brand-deep bg-white px-2.5 py-0.5 rounded border border-brand-light">
                  {selectedReceipt.receipt_no}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-brand-charcoal/70">نام حامی نیک‌اندیش:</span>
                <span className="font-bold text-brand-charcoal">{currentUser.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-brand-charcoal/70">دانش‌آموز تخصیص‌یافته:</span>
                <span className="font-extrabold text-brand-deep">{selectedReceipt.student_name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-brand-charcoal/70">مدرسه و عنوان درس:</span>
                <span className="font-medium text-brand-charcoal">{selectedReceipt.school_name} ({selectedReceipt.subject})</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-brand-charcoal/70">حجم زنگ‌های تأمین‌شده:</span>
                <span className="font-bold text-brand-deep font-mono">{toFaNum(selectedReceipt.sessions_bought)} زنگ درسی</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-brand-charcoal/70">تاریخ تراکنش:</span>
                <span className="font-medium text-brand-charcoal">{formatDateFa(selectedReceipt.created_at)}</span>
              </div>

              <div className="pt-2 border-t border-brand-light/60 flex justify-between items-center">
                <span className="font-bold text-brand-charcoal">مبلغ کل واریزی:</span>
                <strong className="text-base font-black text-brand-deep font-mono">
                  {formatToman(selectedReceipt.amount_paid)}
                </strong>
              </div>

              <div className="pt-2 text-center text-[10px] text-brand-charcoal/60 border-t border-dashed border-brand-light/80">
                این رسید به منزله سند رسمی اتصال مستقیم خیر به زنگ آموزشی در مدارس مرزی می‌باشد.
              </div>

            </div>

            {/* Print / Close Actions */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 rounded-xl border border-brand-light text-brand-charcoal text-xs font-bold hover:bg-brand-light/20 transition cursor-pointer"
              >
                بستن
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-brand-deep hover:bg-[#232573] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>چاپ رسید</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: پیش‌نمایش گزارش‌های کلان طرح رویش — PROGRAM REPORTS PREVIEW MODAL
      ========================================================================= */}
      {activeReportModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs animate-fade-in text-right font-sans"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-brand-light/80 space-y-5 animate-scale-in">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-brand-light/70 pb-3.5">
              <div className="space-y-1">
                <span className="text-2xs font-extrabold text-brand-deep bg-brand-light/50 px-2.5 py-0.5 rounded-md inline-block">
                  {activeReportModal.category} • {activeReportModal.date}
                </span>
                <h3 className="text-base sm:text-lg font-black text-brand-charcoal">
                  {activeReportModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReportModal(null)}
                className="w-8 h-8 rounded-full bg-brand-light/30 hover:bg-brand-light text-brand-charcoal flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs leading-relaxed text-brand-charcoal/85">
              <p className="p-3.5 rounded-xl bg-brand-light/15 border border-brand-light/60 font-medium">
                {activeReportModal.summary}
              </p>

              <div className="space-y-2">
                <span className="font-extrabold text-brand-deep text-2xs block">
                  محورهای کلیدی گزارش:
                </span>
                <ul className="space-y-1.5 text-2xs text-brand-charcoal/80 list-disc list-inside">
                  {activeReportModal.highlights.map((h, idx) => (
                    <li key={idx} className="leading-normal">{h}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-2xs text-emerald-800 flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>داده‌ها و مستندات این گزارش پس از بازبینی ناظران مستقل بارگذاری و معتبرسازی شده است.</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-brand-light/60">
              <button
                type="button"
                onClick={() => setActiveReportModal(null)}
                className="px-4 py-2.5 rounded-xl border border-brand-light text-brand-charcoal text-xs font-bold hover:bg-brand-light/20 transition cursor-pointer"
              >
                بستن پنجره
              </button>

              <button
                type="button"
                onClick={() => {
                  alert("فایل PDF به زودی با تراز نهایی دوره آماده دریافت خواهد بود.");
                }}
                className="px-5 py-2.5 bg-brand-deep hover:bg-[#232573] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{activeReportModal.downloadLabel || "دریافت نسخه رسمی"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
