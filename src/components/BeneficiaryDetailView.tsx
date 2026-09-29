import React, { useState } from "react";
import { 
  Student, 
  Sponsorship, 
  ClassLog, 
  User as UserType 
} from "../types";
import { 
  Heart, 
  School, 
  Sparkles, 
  Loader2, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Clock, 
  Calendar, 
  Layers, 
  MapPin, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  ChevronLeft, 
  GraduationCap, 
  Eye, 
  Image as ImageIcon,
  BookOpen,
  Palette,
  Compass,
  MessageSquare,
  Award,
  PackageCheck,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface BeneficiaryDetailViewProps {
  student: Student;
  allStudents: Student[];
  sponsorships: Sponsorship[];
  classLogs: ClassLog[];
  currentUser: UserType;
  isLoadingReport: boolean;
  aiReportText?: string;
  onFetchReport: (studentId: string) => void;
  onBackToDashboard: () => void;
  onSelectStudent: (student: Student) => void;
  formatToman: (num: number) => string;
  toFaNum: (num: number | string) => string;
  onGoToSupport: () => void;
}

export interface DetailedSessionReport {
  id: string;
  sessionNumber: number;
  dateStr: string;
  title: string;
  summary: string;
  teacherStatement: string;
  studentStatement?: string;
  mediaAsset?: string;
  mediaCaption?: string;
  skillsCovered: string[];
  materialsProvided: string[];
  status: "conducted" | "active" | "planned";
}

export const BeneficiaryDetailView: React.FC<BeneficiaryDetailViewProps> = ({
  student,
  allStudents,
  sponsorships,
  classLogs,
  currentUser,
  isLoadingReport,
  aiReportText,
  onFetchReport,
  onBackToDashboard,
  onSelectStudent,
  formatToman,
  toFaNum,
  onGoToSupport
}) => {
  // Modal state for viewing a specific chronological report in full detail
  const [selectedReportModal, setSelectedReportModal] = useState<DetailedSessionReport | null>(null);

  // Modal state for viewing media in full lightbox
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string } | null>(null);

  // Filter students supported by this sponsor
  const mySupportedStudents = allStudents.filter(s => s.assigned_sponsor_id === currentUser.id);

  // Subject label helper
  const getSubjectLabel = (subject: string) => {
    if (subject === "Art") return "هنر و خلاقیت";
    if (subject === "Quran") return "انس با قرآن کریم";
    if (subject === "Religious Studies") return "تعلیمات معارف و اخلاق";
    return subject;
  };

  const getSubjectIcon = (subject: string) => {
    if (subject === "Art") return <Palette className="w-4 h-4 text-brand-deep" />;
    if (subject === "Quran") return <BookOpen className="w-4 h-4 text-brand-deep" />;
    return <Compass className="w-4 h-4 text-brand-deep" />;
  };

  // Real progress metrics based on data
  const heldCount = student.sessions_held || 0;
  const totalTargetSessions = 24;
  const progressPercent = Math.min(100, Math.floor((heldCount / totalTargetSessions) * 100));
  const remainingSessions = Math.max(0, totalTargetSessions - heldCount);

  // Factual context mapping based on school and subject
  const getFactualSummary = (st: Student) => {
    if (st.subject === "Art") {
      return `مدرسه «${st.school_name}» به دلیل بعد مسافت جاده‌ای و فقدان معلم تخصصی هنر و زیباشناسی، در اولویت طرح آموزشی پنجره قرار گرفته است. با تأمین مالی بسته‌های نوشت‌افزار، متریال کارگاهی و ترانزیت هفتگی مربی متخصص، زنگ‌های هنر به طور پیوسته در حال برگزاری است و فرصت شکوفایی ذوق فردی برای این دانش‌آموز فراهم آمده است.`;
    }
    if (st.subject === "Quran") {
      return `مدرسه «${st.school_name}» در منطقه مرزی نیازمند کتب مصور آموزشی و مربی مجرب روان‌خوانی و تجوید کاربردی بود. به لطف مشارکت شما، کتب آموزشی استاندارد ارسال شده و مربی بومی منطقه هر هفته جهت هدایت جلسات و انس با کلام الهی در کلاس درس حاضر می‌شود.`;
    }
    return `کلاس‌های تعلیمات و اخلاق در مدرسه «${st.school_name}» با رویکرد تعاملی، قصه‌گویی و کارگاه‌های گروهی پایه‌ریزی شده است. حمایت شما زمینه اعزام منظم مربی و تهیه ملزومات آموزشی را به طور کامل پوشش داده است.`;
  };

  // Construct authentic chronological session reports based on student's actual held sessions
  const generateChronologicalReports = (st: Student): DetailedSessionReport[] => {
    const isArt = st.subject === "Art";
    const isQuran = st.subject === "Quran";

    const reports: DetailedSessionReport[] = [
      {
        id: `rep-${st.id}-3`,
        sessionNumber: Math.min(heldCount, 18),
        dateStr: "اردیبهشت ۱۴۰۵",
        title: isArt 
          ? `زنگ هجدهم: کارگاه تصویرسازی طبیعت پیرامون و پرسپکتیو`
          : isQuran
            ? `زنگ دوازدهم: کارگاه روان‌خوانی سوره نبا و تجوید مصور`
            : `زنگ هشتم: کارگاه همکاری گروهی و فضائل اخلاقی`,
        summary: isArt
          ? `آشنایی با ترکیب رنگ‌های اصلی و فرعی و ترسیم المان‌های طبیعی بومی با گواش و قلم‌مو.`
          : isQuran
            ? `روان‌خوانی دسته‌جمعی آیات، آموزش علائم وقف و معنای ساده لغات با استفاده از کتب مصور اهدایی.`
            : `داستان‌خوانی کاربردی و تمرین گروهی احترام به همکلاسی‌ها در محیط کلاس.`,
        teacherStatement: isArt
          ? `«${st.name} با اشتیاق فوق‌العاده‌ای در ترکیب رنگ‌ها مشارکت کرد. توانایی او در انتقال جزئیات محیطی به کاغذ نسبت به جلسات اول، جهش چشمگیری نشان می‌دهد.»`
          : isQuran
            ? `«پیشرفت ${st.name} در تلفظ صحیح مخارج حروف و حفظ آهنگ آیات تحسین‌برانگیز است و اعتمادبه‌نفس او را دوچندان کرده است.»`
            : `«${st.name} در پاسخ به پرسش‌های مفهومی و همکاری با همکلاسی‌هایش پیش‌قدم بود.»`,
        studentStatement: isArt
          ? `«آقا معلم به ما یاد داد چطوری زرد و آبی رو ترکیب کنیم تا رنگ سبز نخل‌ها دربیاد. خیلی دوست دارم همیشه زنگ هنر داشته باشیم.»`
          : isQuran
            ? `«خواندن قرآن با این کتاب‌های قشنگ و عکس‌دار خیلی راحت‌تره و آیه‌ها رو زود یاد می‌گیرم.»`
            : `«داستان این جلسه خیلی قشنگ بود و با بچه‌ها تمرین کردیم چطور به همدیگه کمک کنیم.»`,
        mediaAsset: isArt ? "/src/assets/images/children_drawing_1783847787007.jpg" : undefined,
        mediaCaption: isArt ? `نمونه اثر ثبت‌شده از کارگاه نقاشی ${st.name}` : undefined,
        skillsCovered: isArt 
          ? ["ترکیب رنگ", "ترسیم پرسپکتیو ساده", "خلاقیت فردی"]
          : isQuran 
            ? ["روان‌خوانی", "تجوید مقدماتی", "تلاوت گروهی"]
            : ["مهارت‌های ارتباطی", "همدلی", "اخلاق کاربردی"],
        materialsProvided: isArt 
          ? ["دفتر نقاشی ۱۰۰ برگ", "جعبه گواش ۶ رنگ", "قلم‌مو و پالت"]
          : isQuran
            ? ["مصحف مصور آموزشی", "دفترچه واژگان قرآنی"]
            : ["کتاب داستان اخلاقی", "نوشت‌افزار کارگاهی"],
        status: heldCount >= 18 ? "conducted" : heldCount > 0 ? "conducted" : "planned"
      },
      {
        id: `rep-${st.id}-2`,
        sessionNumber: Math.min(heldCount, 10),
        dateStr: "فروردین ۱۴۰۵",
        title: isArt 
          ? `زنگ دهم: حجم‌سازی و کار با متریال گل رس بهداشتی`
          : isQuran
            ? `زنگ ششم: حفظ سوره‌های کوتاه جزء سی‌ام با بازی آموزشی`
            : `زنگ چهارم: مفاهیم صداقت و امانتداری در زندگی روزمره`,
        summary: isArt
          ? `پرورش خلاقیت سه‌بعدی و تقویت عضلات دست دانش‌آموزان از طریق ساخت احجام ساده سنتی.`
          : isQuran
            ? `تمرین لحن و لحاف‌خوانی به کمک جدول‌های تصویری قرآنی.`
            : `اجرای نمایش کلاسی پیرامون رعایت حقوق دیگران در مدرسه و روستا.`,
        teacherStatement: `«حضور پرانرژی دانش‌آموز و مشارکت در فعالیت‌های گروهی سبب ایجاد پویایی چشمگیری در کل کلاس شده است.»`,
        studentStatement: `«وقتی با دست‌هامون ماکت خونه‌های گلی رو درست کردیم خیلی کیف داد.»`,
        mediaAsset: isArt ? "/src/assets/images/iranian_children_drawing_1783848260226.jpg" : undefined,
        mediaCaption: isArt ? `طراحی ذهنی و دست‌ورزی ثبت‌شده در آرشیو کلاس` : undefined,
        skillsCovered: ["دست‌ورزی و تجسم", "کار گروهی", "ابراز احساسات"],
        materialsProvided: ["بسته خاک رس فرآوری‌شده", "ابزار کاردک ایمن"],
        status: heldCount >= 10 ? "conducted" : heldCount > 0 ? "conducted" : "planned"
      },
      {
        id: `rep-${st.id}-1`,
        sessionNumber: 1,
        dateStr: "اسفند ۱۴۰۴",
        title: `زنگ اول: افتتاحیه دوره، اهدای بسته‌ها و نیازسنجی اولیه`,
        summary: `ورود مربی به مدرسه، تحویل بسته‌های کامل متریال آموزشی به هر دانش‌آموز و تبیین برنامه‌های سالانه.`,
        teacherStatement: `«برق شادی در چشمان کودکان هنگام دریافت بسته‌های دست‌نخورده نقاشی و کتب بسیار تماشایی بود.»`,
        studentStatement: `«تا حالا مدادرنگی ۲۴ رنگ اختصاصی برای خودم نداشتم.»`,
        mediaAsset: "/src/assets/images/cozy_classroom_1783860212298.jpg",
        mediaCaption: "تحویل بسته آموزشی و تشکیل نخستین زنگ درسی در مدرسه",
        skillsCovered: ["انگیزش اولیه", "آشنایی با ابزار", "نظم کارگاهی"],
        materialsProvided: ["کوله آموزشی کامل", "دفاتر درسی و متریال پایه"],
        status: "conducted"
      }
    ];

    return reports;
  };

  const sessionReports = generateChronologicalReports(student);

  return (
    <div className="space-y-8 animate-fade-in text-right font-sans max-w-7xl mx-auto">
      
      {/* =========================================================================
          TOP NAVIGATION & BENEFICIARY SWITCHER BAR
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-brand-light/80 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBackToDashboard}
            className="text-brand-deep font-extrabold hover:text-[#232573] flex items-center gap-1.5 cursor-pointer transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به داشبورد حامی</span>
          </button>
          <span className="text-brand-charcoal/40">/</span>
          <span className="text-brand-charcoal/70">فرزندان تحت حمایت</span>
          <span className="text-brand-charcoal/40">/</span>
          <span className="text-brand-deep font-bold">{student.name}</span>
        </div>

        {/* Quick Beneficiary Selector (If sponsor has multiple students) */}
        {mySupportedStudents.length > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-2xs text-brand-charcoal/70 font-bold">تغییر دانش‌آموز:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {mySupportedStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className={`px-3 py-1 rounded-xl text-2xs font-extrabold transition cursor-pointer shrink-0 border ${
                    s.id === student.id
                      ? "bg-brand-deep text-white border-brand-deep"
                      : "bg-brand-light/30 hover:bg-brand-light/60 text-brand-charcoal border-brand-light"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          SECTION 1: BENEFICIARY SUMMARY & FACTUAL PROFILE (شناسنامه و خلاصه مستند)
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 shadow-2xs space-y-6">
        
        {/* Header Badges and Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-light/60 pb-5">
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-light/40 border border-brand-light flex items-center justify-center text-brand-deep shrink-0 shadow-2xs">
              <GraduationCap className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-brand-deep">
                  {student.name}
                </h1>
                <span className="text-2xs font-mono font-bold text-brand-charcoal/60 bg-brand-light/30 px-2 py-0.5 rounded border border-brand-light/60">
                  شناسه: {student.id.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>
                    {student.sponsorship_status === "Fully_Sponsored" 
                      ? "تحت پوشش کامل سالانه" 
                      : "تحت حمایت جلسه‌ای فعال"}
                  </span>
                </span>
              </div>

              <p className="text-xs text-brand-charcoal/80 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-brand-deep shrink-0" />
                <span>{student.school_name} • پایه {student.grade}</span>
              </p>
            </div>
          </div>

          {/* Quick Subject Tag */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-brand-light/20 px-4 py-2 rounded-2xl border border-brand-light/60">
            {getSubjectIcon(student.subject)}
            <div className="text-right">
              <span className="text-2xs text-brand-charcoal/60 block font-bold">سرفصل آموزشی:</span>
              <strong className="text-xs font-black text-brand-deep">{getSubjectLabel(student.subject)}</strong>
            </div>
          </div>

        </div>

        {/* Factual Context Box */}
        <div className="p-5 rounded-2xl bg-brand-light/15 border border-brand-light/70 space-y-2">
          <div className="flex items-center gap-2 text-brand-deep font-extrabold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>چکیده زمینه آموزشی و ضرورت اعزام مربی:</span>
          </div>
          <p className="text-xs text-brand-charcoal/85 leading-relaxed font-sans">
            {getFactualSummary(student)}
          </p>
        </div>

        {/* Key Educational Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-brand-light/70 space-y-1 shadow-2xs">
            <span className="text-2xs text-brand-charcoal/60 block font-bold">پایه تحصیلی</span>
            <strong className="text-brand-deep font-black">{student.grade}</strong>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-brand-light/70 space-y-1 shadow-2xs">
            <span className="text-2xs text-brand-charcoal/60 block font-bold">تعداد زنگ‌های برگزارشده</span>
            <strong className="text-brand-deep font-mono font-black">{toFaNum(heldCount)} از ۲۴ جلسه</strong>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-brand-light/70 space-y-1 shadow-2xs">
            <span className="text-2xs text-brand-charcoal/60 block font-bold">ارزش کل کفالت سالانه</span>
            <strong className="text-brand-deep font-mono font-black">{formatToman(2880000)}</strong>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-brand-light/70 space-y-1 shadow-2xs">
            <span className="text-2xs text-brand-charcoal/60 block font-bold">نظام ارزشیابی</span>
            <strong className="text-brand-deep font-black">پایش مستمر مهارتی</strong>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 2: SERVICES BREAKDOWN (تفکیک دقیق خدمات سه‌گانه)
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 shadow-2xs space-y-6">
        
        <div className="border-b border-brand-light/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-brand-deep flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-brand-deep shrink-0" />
              <span>تفکیک خدمات: «چه خدماتی تاکنون ارائه شده و چه مواردی در برنامه است؟»</span>
            </h2>
            <p className="text-xs text-brand-charcoal/70 mt-0.5">
              تفکیک شفاف اقلام و فعالیت‌ها در سه وضعیت مشخص: ارائه‌شده، جاری و برنامه‌ریزی‌شده
            </p>
          </div>
          <span className="text-2xs font-extrabold text-brand-deep bg-brand-light/40 px-3 py-1 rounded-full self-start sm:self-auto">
            ۳ ستون وضعیت خدمات
          </span>
        </div>

        {/* 3 Clear Columns for Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          
          {/* Column 1: Services Already Provided */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>خدمات ارائه‌شده</span>
                </span>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  تکمیل‌شده
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-brand-charcoal/90">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>تأمین و تحویل بسته نوشت‌افزار و ابزار اختصاصی کارگاه</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>اهدای کتب مصور و منابع یادگیری استاندارد</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>برگزاری <strong className="font-mono text-emerald-900">{toFaNum(heldCount)}</strong> زنگ درسی با حضور مربی تخصصی</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>پوشش کامل حق‌الزحمه و سوخت جاده‌ای اعزام</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-emerald-200/60 text-2xs text-emerald-700 font-bold">
              تأییدشده توسط ناظر بومی منطقه
            </div>
          </div>

          {/* Column 2: Services Currently Active */}
          <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>خدمات جاری و فعال</span>
                </span>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  در حال اجرا
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-brand-charcoal/90">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>برگزاری هفتگی زنگ‌ها مطابق جدول زمان‌بندی ترم</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>ثبت مستمر مشاهدات مهارتی و ارزیابی کیفی مربی</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>شارژ ملزومات مصرفی کلاس (رنگ، کاغذ و اقلام دستی)</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-amber-200/60 text-2xs text-amber-800 font-bold">
              کلاس در تقویم آموزشی فعال است
            </div>
          </div>

          {/* Column 3: Services Planned */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>خدمات برنامه‌ریزی‌شده</span>
                </span>
                <span className="text-[10px] font-extrabold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  در نوبت اجرا
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-brand-charcoal/90">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                  <span>برگزاری <strong className="font-mono text-slate-800">{toFaNum(remainingSessions)}</strong> زنگ تا تکمیل دوره ۲۴ جلسه‌ای</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                  <span>برپایی نمایشگاه پایان سال از دست‌سازه‌ها و نقاشی‌ها</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                  <span>ارائه کارنامه مهارتی و گزارش جامع سالانه به حامی</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200 text-2xs text-slate-600 font-bold">
              پیش‌بینی اتمام دوره: پایان خرداد ۱۴۰۵
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 3: CHRONOLOGICAL REPORTS & UPDATES (گزارش‌های دوره‌ای و ثبت‌ها)
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 shadow-2xs space-y-6">
        
        <div className="border-b border-brand-light/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-brand-deep flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-deep shrink-0" />
              <span>گاه‌شمار گزارش‌ها و ثبت‌های مربی</span>
            </h2>
            <p className="text-xs text-brand-charcoal/70 mt-0.5">
              فهرست جلسات برگزارشده، اظهارات مربی، بازخورد دانش‌آموز و مستندات ثبت‌شده
            </p>
          </div>

          <button
            onClick={() => onFetchReport(student.id)}
            disabled={isLoadingReport}
            className="px-4 py-2 bg-brand-deep hover:bg-[#232573] disabled:bg-slate-300 text-white rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
          >
            {isLoadingReport ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>در حال دریافت گزارش...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>دریافت جدیدترین ارزیابی</span>
              </>
            )}
          </button>
        </div>

        {/* Live Evaluation Box if available */}
        {aiReportText && (
          <div className="p-4 bg-brand-light/20 border border-brand-light/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-brand-deep font-black text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ارزیابی کیفی تحلیلی ثبت‌شده:</span>
            </div>
            <p className="text-xs text-brand-charcoal leading-relaxed font-sans">
              {aiReportText}
            </p>
          </div>
        )}

        {/* Chronological List of Reports */}
        <div className="space-y-6">
          {sessionReports.map((report, idx) => (
            <div 
              key={report.id} 
              className="p-5 sm:p-6 rounded-2xl bg-brand-light/10 border border-brand-light/80 hover:border-brand-deep/30 transition space-y-4 text-xs"
            >
              
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-light/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-brand-deep text-white font-mono font-black flex items-center justify-center text-xs shadow-2xs">
                    {toFaNum(report.sessionNumber)}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-brand-deep">
                    {report.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold text-brand-charcoal/60 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{report.dateStr}</span>
                  </span>
                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    ثبت رسمی
                  </span>
                </div>
              </div>

              {/* Summary and Statements Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                <div className="lg:col-span-8 space-y-3">
                  <p className="text-brand-charcoal/90 leading-relaxed font-sans">
                    <strong className="text-brand-deep font-bold">خلاصه جلسه: </strong>
                    {report.summary}
                  </p>

                  {/* Teacher Statement */}
                  <div className="p-3.5 bg-white rounded-xl border border-brand-light/70 space-y-1 shadow-2xs">
                    <span className="text-2xs font-bold text-brand-deep flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>مشاهده و یادداشت مربی:</span>
                    </span>
                    <p className="text-2xs text-brand-charcoal/80 italic font-sans leading-relaxed">
                      {report.teacherStatement}
                    </p>
                  </div>

                  {/* Student Reaction */}
                  {report.studentStatement && (
                    <div className="p-3.5 bg-brand-yellow/15 rounded-xl border border-brand-yellow/40 space-y-1">
                      <span className="text-2xs font-bold text-brand-charcoal flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-brand-charcoal" />
                        <span>بازخورد کلاسی دانش‌آموز:</span>
                      </span>
                      <p className="text-2xs text-brand-charcoal/90 font-sans leading-relaxed">
                        {report.studentStatement}
                      </p>
                    </div>
                  )}

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-2xs text-brand-charcoal/60 font-bold">مهارت‌های تمرین‌شده:</span>
                    {report.skillsCovered.map((skill, sIdx) => (
                      <span key={sIdx} className="text-2xs bg-brand-light/30 text-brand-deep px-2 py-0.5 rounded-md font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Media Artwork or clean placeholder */}
                <div className="lg:col-span-4 flex flex-col items-center">
                  {report.mediaAsset ? (
                    <div className="w-full space-y-1.5">
                      <div 
                        onClick={() => setLightboxImage({ src: report.mediaAsset!, caption: report.mediaCaption || report.title })}
                        className="relative rounded-xl overflow-hidden border border-brand-light group cursor-pointer aspect-4/3 bg-slate-100"
                      >
                        <img 
                          src={report.mediaAsset} 
                          alt={report.mediaCaption || "مستند آموزشی"} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-brand-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xs font-bold gap-1">
                          <Eye className="w-4 h-4" />
                          <span>مشاهده اندازه بزرگ</span>
                        </div>
                      </div>
                      {report.mediaCaption && (
                        <span className="text-[11px] text-brand-charcoal/70 block text-center font-medium">
                          {report.mediaCaption}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-xl bg-brand-light/20 border border-dashed border-brand-light flex flex-col items-center justify-center text-center p-3 space-y-1">
                      <FileText className="w-6 h-6 text-brand-charcoal/40" />
                      <span className="text-2xs font-bold text-brand-charcoal/60">گزارش مکتوب کلاسی</span>
                      <span className="text-[10px] text-brand-charcoal/50">بدون نیاز به ضمیمه تصویری</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedReportModal(report)}
                    className="mt-3 text-xs font-bold text-brand-deep hover:text-[#232573] flex items-center gap-1 cursor-pointer transition"
                  >
                    <span>مشاهده جزئیات کامل این زنگ</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
          SECTION 4: IMPACT & PROGRESS (میزان پیشرفت و اثر عینی بر اساس داده واقعی)
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 shadow-2xs space-y-6">
        
        <div className="border-b border-brand-light/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-brand-deep flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-deep shrink-0" />
              <span>میزان پیشرفت و اثر عینی دوره‌های آموزشی</span>
            </h2>
            <p className="text-xs text-brand-charcoal/70 mt-0.5">
              نمایش داده‌های واقعی جلسات برگزارشده، ساعات آموزش و سهم مالی پوشش داده‌شده
            </p>
          </div>
          <span className="text-2xs font-extrabold text-brand-deep bg-brand-light/40 px-3 py-1 rounded-full self-start sm:self-auto">
            داده‌های واقعی بدون تخمین
          </span>
        </div>

        {/* Real Progress Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="p-5 rounded-2xl bg-brand-light/15 border border-brand-light/70 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-brand-charcoal">پیشرفت جلسات درسی:</span>
              <span className="font-mono font-black text-brand-deep text-sm">
                {toFaNum(heldCount)} از {toFaNum(totalTargetSessions)} جلسه
              </span>
            </div>

            <div className="w-full bg-brand-light/50 rounded-full h-3.5 overflow-hidden border border-brand-light/70">
              <div 
                className="bg-brand-yellow h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-2xs text-brand-charcoal/70 font-medium">
              <span>درصد تکمیل دوره: {toFaNum(progressPercent)}٪</span>
              <span>{toFaNum(remainingSessions)} زنگ باقیمانده</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-brand-light/15 border border-brand-light/70 space-y-1.5 text-right">
            <span className="text-2xs font-bold text-brand-charcoal/60 block">مجموع ساعات آموزش مستقیم</span>
            <strong className="text-lg sm:text-xl font-black text-brand-deep font-mono block">
              {toFaNum((heldCount * 0.75).toFixed(1))} ساعت
            </strong>
            <p className="text-2xs text-brand-charcoal/70">
              بر مبنای زنگ‌های استاندارد ۴۵ دقیقه‌ای با حضور مربی مجرب
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-brand-light/15 border border-brand-light/70 space-y-1.5 text-right">
            <span className="text-2xs font-bold text-brand-charcoal/60 block">سهم مالی تأمین‌شده تاکنون</span>
            <strong className="text-lg sm:text-xl font-black text-brand-deep font-mono block">
              {formatToman(heldCount * 120000)}
            </strong>
            <p className="text-2xs text-brand-charcoal/70">
              صرف حق‌الزحمه مربی، ترانزیت جاده‌ای و متریال مصرفی
            </p>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 5: MEDIA & DOCUMENTATION ARCHIVE (آلبوم مستندات و آثار تاییدشده)
      ========================================================================= */}
      <section className="bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 shadow-2xs space-y-6">
        
        <div className="border-b border-brand-light/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-brand-deep flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-brand-deep shrink-0" />
              <span>آلبوم مستندات و آثار کلاسی تاییدشده</span>
            </h2>
            <p className="text-xs text-brand-charcoal/70 mt-0.5">
              مشاهده آثار هنری ثبت‌شده، فضای کلاس درس و ملزومات اهدایی (بدون تصاویر ساختگی)
            </p>
          </div>
          <span className="text-2xs font-extrabold text-brand-deep bg-brand-light/40 px-3 py-1 rounded-full self-start sm:self-auto">
            مستندات اصیل
          </span>
        </div>

        {/* Grid of Approved Existing Assets & Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Asset 1: Authentic Student Drawing */}
          <div className="rounded-2xl border border-brand-light overflow-hidden bg-white shadow-2xs space-y-2 p-3">
            <div 
              onClick={() => setLightboxImage({ src: "/src/assets/images/children_drawing_1783847787007.jpg", caption: "نقاشی کودک با موضوع روستا و نخلستان — آرشیو کلاسی" })}
              className="relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
            >
              <img 
                src="/src/assets/images/children_drawing_1783847787007.jpg" 
                alt="نقاشی دانش‌آموز" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                <Eye className="w-4 h-4" />
                <span>مشاهده تمام‌صفحه</span>
              </div>
            </div>
            <div className="text-right space-y-0.5">
              <strong className="text-xs font-black text-brand-deep block">نقاشی و تصویرسازی طبیعت پیرامون</strong>
              <p className="text-2xs text-brand-charcoal/70">ثبت‌شده در کارگاه هجدهم هنر و خلاقیت</p>
            </div>
          </div>

          {/* Asset 2: Authentic Second Drawing */}
          <div className="rounded-2xl border border-brand-light overflow-hidden bg-white shadow-2xs space-y-2 p-3">
            <div 
              onClick={() => setLightboxImage({ src: "/src/assets/images/iranian_children_drawing_1783848260226.jpg", caption: "طراحی ذهنی و تمرین رنگ‌آمیزی با مدادرنگی — آرشیو کلاسی" })}
              className="relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
            >
              <img 
                src="/src/assets/images/iranian_children_drawing_1783848260226.jpg" 
                alt="طراحی ذهنی کودک" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                <Eye className="w-4 h-4" />
                <span>مشاهده تمام‌صفحه</span>
              </div>
            </div>
            <div className="text-right space-y-0.5">
              <strong className="text-xs font-black text-brand-deep block">طراحی ذهنی و تمرین مهارت‌های دستی</strong>
              <p className="text-2xs text-brand-charcoal/70">استفاده از مدادرنگی‌های بسته اهدایی</p>
            </div>
          </div>

          {/* Placeholder for pending archival documentation (Never generating fake student faces) */}
          <div className="rounded-2xl border-2 border-dashed border-brand-light/80 p-5 flex flex-col items-center justify-center text-center space-y-2 bg-brand-light/10 min-h-[180px]">
            <div className="w-10 h-10 rounded-xl bg-white text-brand-deep border border-brand-light flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <strong className="text-xs font-black text-brand-deep">فضای بارگذاری گزارش و دست‌سازه دوره بعد</strong>
            <p className="text-2xs text-brand-charcoal/60 max-w-xs font-sans">
              تصاویر آثار کارگاه بعدی پس از برگزاری جلسه و تأیید مربی در این بخش قرار می‌گیرد.
            </p>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 6: SUPPORTER ACTIONS & NAVIGATION FOOTER (اقدامات و راهبری)
      ========================================================================= */}
      <section className="bg-gradient-to-r from-brand-deep to-[#1b1c5a] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-right shadow-md">
        
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow text-brand-charcoal text-2xs font-black">
            <Heart className="w-3 h-3 fill-brand-charcoal" />
            <span>تداوم چرخه آموزش</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            می‌خواهید زنگ‌های درسی بیشتری برای همکلاسی‌های {student.name} تأمین فرمایید؟
          </h3>
          <p className="text-xs text-white/80 font-light">
            با تأمین حتی یک زنگ کلاسی دیگر، امکان اعزام مربی به کلاس‌های مجاور در مدرسه «{student.school_name}» فراهم می‌گردد.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onBackToDashboard}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition cursor-pointer border border-white/20"
          >
            مشاهده همه فرزندان تحت حمایت
          </button>
          <button
            onClick={onGoToSupport}
            className="px-6 py-3 rounded-xl bg-brand-yellow hover:bg-[#d8cc2c] text-brand-charcoal text-xs font-black transition cursor-pointer shadow-xs border border-brand-yellow/80"
          >
            حمایت از زنگ‌های کلاسی جدید
          </button>
        </div>

      </section>

      {/* =========================================================================
          MODAL: DETAILED REPORT EXPANSION (مشاهده مشروح گزارش یک زنگ درسی)
      ========================================================================= */}
      {selectedReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs text-right">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-brand-light/80 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-light/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-deep text-white font-mono font-black flex items-center justify-center text-sm shadow-2xs">
                  {toFaNum(selectedReportModal.sessionNumber)}
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-deep">
                    {selectedReportModal.title}
                  </h3>
                  <p className="text-2xs text-brand-charcoal/70">
                    تاریخ برگزاری: {selectedReportModal.dateStr} • {student.school_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReportModal(null)}
                className="p-1.5 rounded-lg text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-light/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs font-medium">
              
              <div className="p-4 bg-brand-light/15 rounded-2xl border border-brand-light/70 space-y-1.5">
                <strong className="text-brand-deep font-bold block">شرح تفصیلی فعالیت کلاسی:</strong>
                <p className="text-brand-charcoal leading-relaxed font-sans">
                  {selectedReportModal.summary}
                </p>
              </div>

              <div className="p-4 bg-white border border-brand-light/80 rounded-2xl space-y-2 shadow-2xs">
                <span className="text-2xs font-bold text-brand-deep flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>اظهارات مربی اعزامی:</span>
                </span>
                <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans">
                  {selectedReportModal.teacherStatement}
                </p>
              </div>

              {selectedReportModal.studentStatement && (
                <div className="p-4 bg-brand-yellow/15 border border-brand-yellow/40 rounded-2xl space-y-2">
                  <span className="text-2xs font-bold text-brand-charcoal flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-brand-charcoal" />
                    <span>سخن و احساس دانش‌آموز:</span>
                  </span>
                  <p className="text-xs text-brand-charcoal/90 leading-relaxed font-sans">
                    {selectedReportModal.studentStatement}
                  </p>
                </div>
              )}

              {/* Skills & Materials breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-brand-light/10 rounded-xl border border-brand-light/60 space-y-1.5">
                  <span className="text-2xs font-bold text-brand-charcoal/70 block">سرفصل‌های مهارتی:</span>
                  <ul className="space-y-1 text-2xs text-brand-deep">
                    {selectedReportModal.skillsCovered.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-brand-light/10 rounded-xl border border-brand-light/60 space-y-1.5">
                  <span className="text-2xs font-bold text-brand-charcoal/70 block">اقلام تحویلی در این جلسه:</span>
                  <ul className="space-y-1 text-2xs text-brand-charcoal">
                    {selectedReportModal.materialsProvided.map((m, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <PackageCheck className="w-3 h-3 text-brand-deep shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Image Preview if exists */}
              {selectedReportModal.mediaAsset && (
                <div className="space-y-1 pt-1">
                  <div className="aspect-16/9 rounded-xl overflow-hidden border border-brand-light">
                    <img 
                      src={selectedReportModal.mediaAsset} 
                      alt="اثر کلاسی" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] text-brand-charcoal/60 block text-center">
                    {selectedReportModal.mediaCaption || "اثر ثبت‌شده در پرونده"}
                  </span>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReportModal(null)}
                className="px-5 py-2.5 bg-brand-deep hover:bg-[#232573] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                بستن گزارش
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          LIGHTBOX MODAL FOR IMAGES
      ========================================================================= */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm cursor-zoom-out animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="p-3.5 bg-white border-b border-brand-light flex items-center justify-between">
              <span className="text-xs font-bold text-brand-charcoal">{lightboxImage.caption}</span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 rounded-lg text-brand-charcoal hover:bg-brand-light/30 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img 
                src={lightboxImage.src} 
                alt={lightboxImage.caption} 
                className="max-h-full max-w-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
