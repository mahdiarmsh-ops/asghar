import React from "react";
import { Loader2 } from "lucide-react";
import { DashboardStats } from "../types";

interface ImpactStatsProps {
  stats: DashboardStats;
  isRefreshing: boolean;
  formatToman: (num: number) => string;
  toFaNum: (num: number | string) => string;
}

export const ImpactStats: React.FC<ImpactStatsProps> = ({
  stats,
  isRefreshing,
  formatToman,
  toFaNum
}) => {
  return (
    <section id="impact-stats-section" className="space-y-4">
      
      {/* Section Header - Concise & Direct */}
      <div className="flex items-center justify-between gap-3 border-b border-brand-light/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-deep animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black text-brand-deep tracking-tight">
            شاخص‌های اثرگذاری
          </h2>
        </div>

        {isRefreshing && (
          <div className="text-xs text-brand-deep flex items-center gap-1.5 bg-brand-light/30 px-3 py-1 rounded-full border border-brand-light/60">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>همگام‌سازی...</span>
          </div>
        )}
      </div>

      {/* Main 4 Metric Cards - Numbers Visually Dominant, Zero Clutter */}
      <div className="bg-white border border-brand-light/80 rounded-3xl overflow-hidden shadow-sm divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-brand-light/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Metric 1: دانش‌آموزان تحت پوشش */}
        <div className="p-6 sm:p-7 text-center space-y-2 hover:bg-brand-light/10 transition-colors">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-deep tracking-tight font-sans">
            {toFaNum(stats.students_sponsored)}
          </p>
          <p className="text-sm sm:text-base font-extrabold text-brand-charcoal">
            دانش‌آموزان تحت پوشش
          </p>
        </div>

        {/* Metric 2: جلسات برگزار شده */}
        <div className="p-6 sm:p-7 text-center space-y-2 hover:bg-brand-light/10 transition-colors">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-charcoal tracking-tight font-sans">
            {toFaNum(stats.sessions_conducted)}
          </p>
          <p className="text-sm sm:text-base font-extrabold text-brand-charcoal">
            زنگ‌های آموزشی برگزارشده
          </p>
        </div>

        {/* Metric 3: دانش‌آموزان در انتظار */}
        <div className="p-6 sm:p-7 text-center space-y-2 hover:bg-brand-light/10 transition-colors">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-charcoal tracking-tight font-sans">
            {toFaNum(stats.students_remaining)}
          </p>
          <p className="text-sm sm:text-base font-extrabold text-brand-charcoal">
            دانش‌آموزان در انتظار حامی
          </p>
        </div>

        {/* Metric 4: جلسات در نوبت */}
        <div className="p-6 sm:p-7 text-center space-y-2 hover:bg-brand-light/10 transition-colors">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-charcoal/80 tracking-tight font-sans">
            {toFaNum(stats.sessions_remaining)}
          </p>
          <p className="text-sm sm:text-base font-extrabold text-brand-charcoal">
            جلسات برنامه‌ریزی‌شده سال
          </p>
        </div>

      </div>

      {/* Aggregate Bar: Clear & Scannable Totals */}
      <div className="bg-brand-light/15 border border-brand-light/80 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-around gap-4 text-xs sm:text-sm text-brand-charcoal/90 text-center sm:text-right">
        
        <div className="flex items-center gap-2">
          <span className="text-brand-charcoal/70">مجموع سرمایه جذب‌شده:</span>
          <strong className="text-brand-deep text-base sm:text-lg font-black font-sans">
            {formatToman(stats.total_funds_raised)}
          </strong>
        </div>

        <div className="hidden sm:block h-6 w-px bg-brand-light/80" />

        <div className="flex items-center gap-2">
          <span className="text-brand-charcoal/70">تعداد حامیان همراه:</span>
          <strong className="text-brand-deep text-base sm:text-lg font-black font-sans">
            {toFaNum(stats.total_sponsors_count)} نفر
          </strong>
        </div>

      </div>

    </section>
  );
};

