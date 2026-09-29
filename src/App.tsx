import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { IntroSection } from "./components/IntroSection";
import { AboutView } from "./components/AboutView";
import { ImpactStats } from "./components/ImpactStats";
import { SupportSection } from "./components/SupportSection";
import { TransparencySection } from "./components/TransparencySection";
import { SponsorDashboard } from "./components/SponsorDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { CheckoutModal } from "./components/CheckoutModal";
import { Footer } from "./components/Footer";
import { 
  User as UserType, 
  DashboardStats, 
  Student, 
  Sponsorship, 
  ClassLog 
} from "./types";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "sponsor" | "admin">("home");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserType>({
    id: "user_sponsor_1",
    name: "حامی نیکوکار",
    phone: "09123456789",
    role: "sponsor"
  });

  const [stats, setStats] = useState<DashboardStats>({
    total_funds_raised: 124000000,
    students_sponsored: 142,
    students_remaining: 358,
    sessions_conducted: 1040,
    sessions_remaining: 2560,
    total_sponsors_count: 86
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [classLogs, setClassLogs] = useState<ClassLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sponsorship selection state (نوع حمایت → مبلغ حمایت → اثر حمایت → ادامه پرداخت)
  const [sponsorType, setSponsorType] = useState<"student" | "session" | "custom">("student");
  const [sponsorQuantity, setSponsorQuantity] = useState<number>(1);
  const [customSessions, setCustomSessions] = useState<number>(24);
  const [customAmount, setCustomAmount] = useState<number>(2880000);

  // Cost constants
  const sessionCost = 120000; // 120,000 Tomans per 45 min lesson
  const fullPackageCost = 2880000; // 24 lessons = 2,880,000 Tomans

  // Checkout modal & action status
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);
  const [isSubmittingSession, setIsSubmittingSession] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // AI report states
  const [isLoadingReport, setIsLoadingReport] = useState<Record<string, boolean>>({});
  const [aiReportText, setAiReportText] = useState<Record<string, string>>({});

  // Helper functions
  const toFaNum = (n: number | string) => {
    const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
  };

  const formatToman = (amount: number) => {
    return `${toFaNum(amount.toLocaleString("fa-IR"))} تومان`;
  };

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const scrollToSupport = () => {
    if (activeTab !== "home") {
      setActiveTab("home");
      setTimeout(() => {
        const element = document.getElementById("sponsorship-selector");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById("sponsorship-selector");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Quick preset handler from Hero or Header
  const handleQuickSponsorPreset = (type: "student" | "session", quantity: number) => {
    setSponsorType(type);
    if (type === "student") {
      setSponsorQuantity(quantity);
    } else {
      setCustomSessions(quantity);
    }
    scrollToSupport();
  };

  // Initial Data Fetch
  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/init");
      if (!res.ok) throw new Error("Failed to load initial data");
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.students) setStudents(data.students);
      if (data.sponsorships) setSponsorships(data.sponsorships);
      if (data.classLogs) setClassLogs(data.classLogs);
    } catch (err) {
      console.error("Error fetching state:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCalculateCurrentPrice = () => {
    if (sponsorType === "student") {
      return fullPackageCost * sponsorQuantity;
    }
    if (sponsorType === "session") {
      return sessionCost * customSessions;
    }
    return customAmount;
  };

  // Handle Checkout / Sponsorship Submission
  const handleConfirmCheckout = async (sponsorInfo: { 
    name: string; 
    phone: string; 
    simulateFailure?: boolean 
  }) => {
    try {
      setIsProcessingCheckout(true);
      const amount = getCalculateCurrentPrice();
      const sessions = sponsorType === "student" ? sponsorQuantity * 24 : customSessions;

      const updatedUser = {
        ...currentUser,
        name: sponsorInfo.name,
        phone: sponsorInfo.phone
      };
      setCurrentUser(updatedUser);

      const res = await fetch("/api/sponsor/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedUser.name,
          phone: updatedUser.phone,
          sponsor_type: sponsorType,
          quantity_students: sponsorType === "student" ? sponsorQuantity : 0,
          quantity_sessions: sponsorType === "session" ? customSessions : 0,
          custom_amount: sponsorType === "custom" ? customAmount : 0,
          amount_paid: amount,
          simulate_failure: sponsorInfo.simulateFailure || false
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "خطا در برقراری ارتباط با درگاه پرداخت");
      }

      await fetchData();
      showToast(`حمایت شما با موفقیت ثبت گردید. شماره پیگیری: ${data.receipt_no}`, "success");
      return data;
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Handle Session Log Submission by Teacher
  const handleConductSession = async (payload: {
    student_id: string;
    teacher_name: string;
    topic: string;
    notes: string;
  }) => {
    try {
      setIsSubmittingSession(true);
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("خطا در ثبت جلسه");
      await fetchData();
      showToast("جلسه با موفقیت ثبت شد و آمار زنده به‌روزرسانی گردید.", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "خطا در ثبت جلسه", "error");
    } finally {
      setIsSubmittingSession(false);
    }
  };

  // Fetch AI Progress Report for a Student
  const fetchSingleReport = async (studentId: string) => {
    try {
      setIsLoadingReport((prev) => ({ ...prev, [studentId]: true }));
      const res = await fetch(`/api/report/${studentId}`);
      if (!res.ok) throw new Error("گزارش هوشمند در دسترس نیست.");
      const data = await res.json();
      setAiReportText((prev) => ({ ...prev, [studentId]: data.report }));
    } catch (err: any) {
      console.error(err);
      setAiReportText((prev) => ({
        ...prev,
        [studentId]: "دانش‌آموز با پشتکار بالا در جلسات مربی حاضر شده و پیشرفت ملموسی در مهارتهای فردی و کارگاهی نشان داده است."
      }));
    } finally {
      setIsLoadingReport((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-brand-charcoal font-sans antialiased selection:bg-brand-light selection:text-brand-deep">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className={`px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold ${
            toastMessage.type === "success" 
              ? "bg-brand-deep text-white border border-brand-light/40" 
              : "bg-rose-600 text-white"
          }`}>
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-white shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        currentUser={currentUser}
        onScrollToSupport={scrollToSupport}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        
        {/* VIEW 1: HOME PAGE */}
        {activeTab === "home" && (
          <div className="space-y-12 sm:space-y-16">
            
            {/* 1. Hero Section (Preserves Exact Visual Asset) */}
            <Hero
              onSponsorClick={scrollToSupport}
              onAboutClick={() => setActiveTab("about")}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
              
              {/* 2. Compact Clickable Introduction Section */}
              <IntroSection 
                onLearnMore={() => setActiveTab("about")} 
              />

              {/* 3. Impact & Trust Statistics (Live counters) */}
              <ImpactStats
                stats={stats}
                isRefreshing={isRefreshing}
                formatToman={formatToman}
                toFaNum={toFaNum}
              />

              {/* 4. Sponsorship Selector (Support Section: نوع حمایت → مبلغ حمایت → اثر حمایت → ادامه پرداخت) */}
              <SupportSection
                sponsorType={sponsorType}
                setSponsorType={setSponsorType}
                sponsorQuantity={sponsorQuantity}
                setSponsorQuantity={setSponsorQuantity}
                customSessions={customSessions}
                setCustomSessions={setCustomSessions}
                customAmount={customAmount}
                setCustomAmount={setCustomAmount}
                sessionCost={sessionCost}
                fullPackageCost={fullPackageCost}
                getCalculateCurrentPrice={getCalculateCurrentPrice}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                formatToman={formatToman}
                toFaNum={toFaNum}
              />

              {/* 5. Financial Transparency (مبلغ حمایت → نحوه مصرف → نتیجه) */}
              <TransparencySection
                sessionCost={sessionCost}
                formatToman={formatToman}
              />

            </div>

          </div>
        )}

        {/* VIEW 2: DEDICATED ABOUT VIEW (درباره پنجره و کفالت فرهنگی) */}
        {activeTab === "about" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AboutView
              onBackToHome={() => setActiveTab("home")}
              onGoToSupport={scrollToSupport}
            />
          </div>
        )}

        {/* VIEW 3: SPONSOR DASHBOARD & BENEFICIARY DETAIL */}
        {activeTab === "sponsor" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SponsorDashboard
              currentUser={currentUser}
              students={students}
              sponsorships={sponsorships}
              classLogs={classLogs}
              isLoadingReport={isLoadingReport}
              aiReportText={aiReportText}
              fetchSingleReport={fetchSingleReport}
              formatToman={formatToman}
              toFaNum={toFaNum}
              onGoToHome={() => setActiveTab("home")}
              onGoToSupport={scrollToSupport}
            />
          </div>
        )}

        {/* VIEW 4: ADMIN PANEL */}
        {activeTab === "admin" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminPanel
              students={students}
              classLogs={classLogs}
              isSubmittingSession={isSubmittingSession}
              onConductSession={handleConductSession}
              toFaNum={toFaNum}
            />
          </div>
        )}

      </main>

      {/* Enhanced Checkout Confirmation & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        sponsorType={sponsorType}
        sponsorQuantity={sponsorQuantity}
        customSessions={customSessions}
        sessionCost={sessionCost}
        fullPackageCost={fullPackageCost}
        totalAmount={getCalculateCurrentPrice()}
        isProcessing={isProcessingCheckout}
        onConfirmCheckout={handleConfirmCheckout}
        formatToman={formatToman}
        toFaNum={toFaNum}
        onGoToDashboard={() => setActiveTab("sponsor")}
      />

      {/* Footer */}
      <Footer
        onGoToAbout={() => setActiveTab("about")}
        onGoToSupport={scrollToSupport}
        onGoToDashboard={() => setActiveTab("sponsor")}
      />

    </div>
  );
}

export default App;
