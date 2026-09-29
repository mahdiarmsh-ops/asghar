import React from "react";
import { Heart, Menu, Sparkles, BookOpen, User as UserIcon, Shield, Compass } from "lucide-react";
import { User as UserType } from "../types";

interface HeaderProps {
  activeTab: "home" | "about" | "sponsor" | "admin";
  setActiveTab: (tab: "home" | "about" | "sponsor" | "admin") => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  currentUser: UserType | null;
  onScrollToSupport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMenuOpen,
  setIsMenuOpen,
  currentUser,
  onScrollToSupport
}) => {
  return (
    <header className="bg-white/95 border-b border-brand-light/60 sticky top-0 z-40 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <button 
          id="header-logo-btn"
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-3 text-right group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-deep text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="font-black text-xl leading-none text-brand-yellow font-sans">پ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-brand-deep tracking-tight leading-none">پَـنـجَـره</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-light/30 text-brand-deep border border-brand-light/60 hidden sm:inline-block">
                کفالت فرهنگی
              </span>
            </div>
            <p className="text-xs text-brand-charcoal/75 mt-1 font-medium">پلتفرم حامی‌گری و عدالت آموزشی کودکان ایران</p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            id="nav-link-home"
            onClick={() => setActiveTab("home")}
            className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition cursor-pointer ${
              activeTab === "home"
                ? "bg-brand-light/30 text-brand-deep"
                : "text-brand-charcoal/80 hover:text-brand-deep hover:bg-brand-light/15"
            }`}
          >
            صفحه اصلی
          </button>
          <button
            id="nav-link-about"
            onClick={() => setActiveTab("about")}
            className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "about"
                ? "bg-brand-light/30 text-brand-deep"
                : "text-brand-charcoal/80 hover:text-brand-deep hover:bg-brand-light/15"
            }`}
          >
            <BookOpen className="w-4 h-4 text-brand-deep/80" />
            <span>درباره پنجره</span>
          </button>
          <button
            id="nav-link-sponsor"
            onClick={() => setActiveTab("sponsor")}
            className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "sponsor"
                ? "bg-brand-light/30 text-brand-deep"
                : "text-brand-charcoal/80 hover:text-brand-deep hover:bg-brand-light/15"
            }`}
          >
            <UserIcon className="w-4 h-4 text-brand-deep/80" />
            <span>داشبورد حامیان</span>
          </button>
          <button
            id="nav-link-admin"
            onClick={() => setActiveTab("admin")}
            className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "admin"
                ? "bg-brand-light/30 text-brand-deep"
                : "text-brand-charcoal/80 hover:text-brand-deep hover:bg-brand-light/15"
            }`}
          >
            <Shield className="w-4 h-4 text-brand-deep/80" />
            <span>پنل مدیریت کلاس‌ها</span>
          </button>
        </nav>

        {/* Action Elements */}
        <div className="flex items-center gap-2.5">
          {/* Support CTA button */}
          <button
            id="header-sponsor-btn"
            onClick={onScrollToSupport}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-brand-yellow text-brand-charcoal hover:bg-[#d8cc2c] active:scale-98 font-black text-xs sm:text-sm shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer border border-brand-yellow/60"
          >
            <Heart className="w-4 h-4 fill-brand-charcoal text-brand-charcoal" />
            <span>حامی شوید</span>
          </button>

          {/* Navigation Dropdown (Mobile Menu button) */}
          <div className="relative md:hidden">
            <button
              id="menu-toggle-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl bg-brand-light/25 border border-brand-light/70 text-brand-deep hover:bg-brand-light/50 transition flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-deep/20"
              aria-label="منوی سایت"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMenuOpen(false)} 
                />
                
                <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-white border border-brand-light/80 shadow-xl py-2 z-50 origin-top-left transition-all duration-200">
                  <button
                    id="mobile-nav-home"
                    onClick={() => {
                      setActiveTab("home");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 text-sm font-semibold transition flex items-center justify-between ${
                      activeTab === "home" 
                      ? "bg-brand-light/30 text-brand-deep border-r-4 border-brand-deep" 
                      : "text-brand-charcoal hover:bg-brand-light/20 hover:text-brand-deep"
                    }`}
                  >
                    <span>صفحه اصلی</span>
                    {activeTab === "home" && <span className="w-1.5 h-1.5 rounded-full bg-brand-deep" />}
                  </button>

                  <button
                    id="mobile-nav-about"
                    onClick={() => {
                      setActiveTab("about");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 text-sm font-semibold transition flex items-center justify-between ${
                      activeTab === "about" 
                      ? "bg-brand-light/30 text-brand-deep border-r-4 border-brand-deep" 
                      : "text-brand-charcoal hover:bg-brand-light/20 hover:text-brand-deep"
                    }`}
                  >
                    <span>درباره پنجره (معرفی و اهداف)</span>
                    {activeTab === "about" && <span className="w-1.5 h-1.5 rounded-full bg-brand-deep" />}
                  </button>

                  <button
                    id="mobile-nav-sponsor"
                    onClick={() => {
                      setActiveTab("sponsor");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 text-sm font-semibold transition flex items-center justify-between ${
                      activeTab === "sponsor" 
                      ? "bg-brand-light/30 text-brand-deep border-r-4 border-brand-deep" 
                      : "text-brand-charcoal hover:bg-brand-light/20 hover:text-brand-deep"
                    }`}
                  >
                    <span>داشبورد حامیان</span>
                    {activeTab === "sponsor" && <span className="w-1.5 h-1.5 rounded-full bg-brand-deep" />}
                  </button>

                  <button
                    id="mobile-nav-admin"
                    onClick={() => {
                      setActiveTab("admin");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 text-sm font-semibold transition flex items-center justify-between ${
                      activeTab === "admin" 
                      ? "bg-brand-light/30 text-brand-deep border-r-4 border-brand-deep" 
                      : "text-brand-charcoal hover:bg-brand-light/20 hover:text-brand-deep"
                    }`}
                  >
                    <span>پنل مدیریت کلاس‌ها</span>
                    {activeTab === "admin" && <span className="w-1.5 h-1.5 rounded-full bg-brand-deep" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
