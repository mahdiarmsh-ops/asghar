import React, { useState } from "react";
import { Student, ClassLog } from "../types";
import { Shield, Sparkles, CheckCircle2, School, Loader2, Calendar, FileText } from "lucide-react";

interface AdminPanelProps {
  students: Student[];
  classLogs: ClassLog[];
  isSubmittingSession: boolean;
  onConductSession: (payload: {
    student_id: string;
    teacher_name: string;
    topic: string;
    notes: string;
  }) => Promise<void>;
  toFaNum: (num: number | string) => string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  students,
  classLogs,
  isSubmittingSession,
  onConductSession,
  toFaNum
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "");
  const [teacherName, setTeacherName] = useState<string>("استاد مریم موسوی");
  const [topic, setTopic] = useState<string>("آموزش طراحی چهره و سایه‌روشن در طبیعت");
  const [notes, setNotes] = useState<string>("کودک اشتیاق فوق‌العاده‌ای نشان داد و ابزار رنگ را با دقت استفاده نمود.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    await onConductSession({
      student_id: selectedStudentId,
      teacher_name: teacherName,
      topic,
      notes
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-right">
      
      {/* Header Banner */}
      <div className="bg-brand-deep rounded-3xl p-6 sm:p-8 text-white space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-yellow text-xs font-extrabold border border-white/20">
          <Shield className="w-3.5 h-3.5" />
          <span>پنل مدیریت و ثبت جلسات کلاسی معلمان پنجره</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">ثبت عملکرد و برگزاری زنگ‌های درسی</h2>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans max-w-2xl">
          معلمان و مربیان اعزامی پس از پایان هر جلسه کلاسی، سرفصل تدریس و گزارش پیشرفت را در این بخش ثبت می‌نمایند تا بلافاصله به داشبورد حامیان متصل شود.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form: ثبت جلسه کلاسی جدید */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-black text-brand-deep border-b border-brand-light/50 pb-3 flex items-center gap-2">
            <School className="w-5 h-5 text-brand-deep" />
            <span>ثبت زنگ کلاس برگزار شده</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            
            <div className="space-y-1.5">
              <label className="block font-bold text-brand-charcoal">انتخاب دانش‌آموز:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-light/90 bg-brand-light/10 text-brand-charcoal text-xs font-semibold focus:outline-none focus:border-brand-deep"
              >
                {students.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.school_name}) - {st.subject} - {st.sessions_held}/24 زنگ
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-brand-charcoal">نام مربی / استاد اعزامی:</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-light/90 bg-white text-brand-charcoal text-xs font-semibold focus:outline-none focus:border-brand-deep"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-brand-charcoal">سرفصل و موضوع تدریس شده:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-light/90 bg-white text-brand-charcoal text-xs font-semibold focus:outline-none focus:border-brand-deep"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-brand-charcoal">توضیحات و گزارش پیشرفت مربی:</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-light/90 bg-white text-brand-charcoal text-xs font-semibold focus:outline-none focus:border-brand-deep"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingSession}
              className="w-full py-3.5 bg-brand-deep hover:bg-[#232573] text-white font-black text-xs sm:text-sm rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingSession ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ذخیره و به‌روزرسانی زنده...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
                  <span>ثبت قطعی جلسه در سامانه ملی پنجره</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* List of Recent Class Logs */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-brand-light/80 p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-base font-black text-brand-deep border-b border-brand-light/50 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-deep" />
            <span>آخرین گزارش‌های ثبت‌شده کلاسی ({toFaNum(classLogs.length)})</span>
          </h3>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {classLogs.length === 0 ? (
              <p className="text-xs text-brand-charcoal/60">هنوز گزارشی ثبت نشده است.</p>
            ) : (
              classLogs.map(log => {
                const matchedStudent = students.find(s => s.id === log.student_id);
                return (
                  <div key={log.id} className="p-4 rounded-2xl bg-brand-light/15 border border-brand-light/60 space-y-2 text-xs text-right">
                    <div className="flex items-center justify-between">
                      <strong className="text-brand-deep font-black">
                        {matchedStudent?.name || log.student_id} ({matchedStudent?.grade || "کلاس هدف"})
                      </strong>
                      <span className="text-2xs font-mono text-brand-charcoal/60 bg-white px-2 py-0.5 rounded border border-brand-light">
                        {log.created_at}
                      </span>
                    </div>
                    <p className="text-brand-charcoal font-bold">موضوع: {log.topic}</p>
                    <p className="text-brand-charcoal/80 text-[11px] leading-relaxed">{log.notes}</p>
                    <div className="text-2xs text-brand-deep font-semibold flex items-center gap-1">
                      <span>مربی: {log.teacher_name}</span>
                      <span>•</span>
                      <span>مدرسه: {matchedStudent?.school_name}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
