/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { User, Student, Sponsorship, ClassLog, DashboardStats, SponsorshipStatus } from "./src/types";

// Constant rates
const SESSION_COST_TOMANS = 120000; // 120,000 Tomans per session (~$3)
const FULL_SPONSORSHIP_SESSIONS = 24;
const STUDENT_COST_TOMANS = SESSION_COST_TOMANS * FULL_SPONSORSHIP_SESSIONS; // 2,880,000 Tomans per year

const DB_FILE = path.join(process.cwd(), "db.json");

// Lazy Gemini AI initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Initial seed data
const initialSponsors: User[] = [
  { id: "sp-1", name: "محمدرضا سلیمانی", email: "m.soleimani@example.com", phone: "09121111111", role: "Sponsor" },
  { id: "sp-2", name: "زهرا حسینی", email: "z.hosseini@example.com", phone: "09122222222", role: "Sponsor" },
  { id: "admin-1", name: "مدیر پلتفرم کفالت", email: "admin@kafalat.ir", phone: "09120000000", role: "Admin" }
];

const initialStudents: Student[] = [
  {
    id: "st-1",
    name: "امیررضا براهویی",
    school_name: "دبستان ابوذر دشتیاری",
    grade: "چهارم ابتدایی",
    subject: "Art",
    sponsorship_status: "Fully_Sponsored",
    sessions_held: 18,
    assigned_sponsor_id: "sp-1",
    assigned_sponsor_name: "محمدرضا سلیمانی",
    amount_needed: 0,
    amount_sponsored: STUDENT_COST_TOMANS
  },
  {
    id: "st-2",
    name: "فاطمه رئیسی",
    school_name: "دبستان دخترانه زینبیه بشاگرد",
    grade: "پنجم ابتدایی",
    subject: "Quran",
    sponsorship_status: "Partially_Sponsored",
    sessions_held: 12,
    assigned_sponsor_id: "sp-2",
    assigned_sponsor_name: "زهرا حسینی",
    amount_needed: 1200000, // Needs 10 more sessions
    amount_sponsored: 1680000 // Sponsored 14 sessions
  },
  {
    id: "st-3",
    name: "سمیه قلعه‌گنجی",
    school_name: "مدرسه حضرت رقیه قلعه‌گنج",
    grade: "سوم ابتدایی",
    subject: "Religious Studies",
    sponsorship_status: "Unsponsored",
    sessions_held: 0,
    assigned_sponsor_id: null,
    amount_needed: STUDENT_COST_TOMANS,
    amount_sponsored: 0
  },
  {
    id: "st-4",
    name: "محمد جلال میربلوچ",
    school_name: "دبستان عشایری شهید همت ریگان",
    grade: "ششم ابتدایی",
    subject: "Art",
    sponsorship_status: "Unsponsored",
    sessions_held: 0,
    assigned_sponsor_id: null,
    amount_needed: STUDENT_COST_TOMANS,
    amount_sponsored: 0
  },
  {
    id: "st-5",
    name: "یسنا جهانشاهی",
    school_name: "دبستان کوثر دشتیاری",
    grade: "دوم ابتدایی",
    subject: "Quran",
    sponsorship_status: "Unsponsored",
    sessions_held: 0,
    assigned_sponsor_id: null,
    amount_needed: STUDENT_COST_TOMANS,
    amount_sponsored: 0
  },
  {
    id: "st-6",
    name: "یوسف دورقی",
    school_name: "مدرسه شهید رجایی شادگان",
    grade: "پنجم ابتدایی",
    subject: "Art",
    sponsorship_status: "Partially_Sponsored",
    sessions_held: 8,
    assigned_sponsor_id: "sp-1",
    assigned_sponsor_name: "محمدرضا سلیمانی",
    amount_needed: 1920000, // needs 16 sessions
    amount_sponsored: 960000 // 8 sessions sponsored
  },
  {
    id: "st-7",
    name: "نازنین زهرا حیدری",
    school_name: "دبستان تلاش فارسان کوهرنگ",
    grade: "چهارم ابتدایی",
    subject: "Religious Studies",
    sponsorship_status: "Unsponsored",
    sessions_held: 0,
    assigned_sponsor_id: null,
    amount_needed: STUDENT_COST_TOMANS,
    amount_sponsored: 0
  },
  {
    id: "st-8",
    name: "مریم نارویی",
    school_name: "دبستان توحید سرباز",
    grade: "اول ابتدایی",
    subject: "Quran",
    sponsorship_status: "Unsponsored",
    sessions_held: 0,
    assigned_sponsor_id: null,
    amount_needed: STUDENT_COST_TOMANS,
    amount_sponsored: 0
  }
];

const initialSponsorships: Sponsorship[] = [
  {
    id: "spon-1",
    sponsor_id: "sp-1",
    sponsor_name: "محمدرضا سلیمانی",
    student_id: "st-1",
    student_name: "امیررضا براهویی",
    school_name: "دبستان ابوذر دشتیاری",
    grade: "چهارم ابتدایی",
    subject: "هنر و زیباشناسی",
    amount_paid: STUDENT_COST_TOMANS,
    sessions_bought: FULL_SPONSORSHIP_SESSIONS,
    created_at: "2026-05-15T09:30:00Z",
    receipt_no: "TRX-101482"
  },
  {
    id: "spon-2",
    sponsor_id: "sp-2",
    sponsor_name: "زهرا حسینی",
    student_id: "st-2",
    student_name: "فاطمه رئیسی",
    school_name: "دبستان دخترانه زینبیه بشاگرد",
    grade: "پنجم ابتدایی",
    subject: "انس با قرآن کریم",
    amount_paid: SESSION_COST_TOMANS * 14,
    sessions_bought: 14,
    created_at: "2026-05-20T14:45:00Z",
    receipt_no: "TRX-101483"
  },
  {
    id: "spon-3",
    sponsor_id: "sp-1",
    sponsor_name: "محمدرضا سلیمانی",
    student_id: "st-6",
    student_name: "یوسف دورقی",
    school_name: "مدرسه شهید رجایی شادگان",
    grade: "پنجم ابتدایی",
    subject: "هنر و خلاقیت",
    amount_paid: SESSION_COST_TOMANS * 8,
    sessions_bought: 8,
    created_at: "2026-05-22T11:20:00Z",
    receipt_no: "TRX-101484"
  }
];

const initialClassLogs: ClassLog[] = [
  // Class logs for st-1 (sessions_held: 18)
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: `log-st1-${i + 1}`,
    school_name: "دبستان ابوذر دشتیاری",
    grade: "چهارم ابتدایی",
    subject: "Art" as const,
    status: "Held" as const,
    date_conducted: `2026-04-${Math.min(30, 10 + i)}T09:00:00Z`,
    student_id: "st-1",
    session_number: i + 1
  })),
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `log-st1-${i + 19}`,
    school_name: "دبستان ابوذر دشتیاری",
    grade: "چهارم ابتدایی",
    subject: "Art" as const,
    status: "Pending" as const,
    date_conducted: null,
    student_id: "st-1",
    session_number: i + 19
  })),

  // Class logs for st-2 (sessions_held: 12)
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `log-st2-${i + 1}`,
    school_name: "دبستان دخترانه زینبیه بشاگرد",
    grade: "پنجم ابتدایی",
    subject: "Quran" as const,
    status: "Held" as const,
    date_conducted: `2026-05-${Math.min(30, 2 + i)}T10:30:00Z`,
    student_id: "st-2",
    session_number: i + 1
  })),
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `log-st2-${i + 13}`,
    school_name: "دبستان دخترانه زینبیه بشاگرد",
    grade: "پنجم ابتدایی",
    subject: "Quran" as const,
    status: "Pending" as const,
    date_conducted: null,
    student_id: "st-2",
    session_number: i + 13
  })),

  // Class logs for st-6 (sessions_held: 8)
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `log-st6-${i + 1}`,
    school_name: "مدرسه شهید رجایی شادگان",
    grade: "پنجم ابتدایی",
    subject: "Art" as const,
    status: "Held" as const,
    date_conducted: `2026-05-${Math.min(30, 12 + i)}T13:00:00Z`,
    student_id: "st-6",
    session_number: i + 1
  })),
  ...Array.from({ length: 16 }).map((_, i) => ({
    id: `log-st6-${i + 9}`,
    school_name: "مدرسه شهید رجایی شادگان",
    grade: "پنجم ابتدایی",
    subject: "Art" as const,
    status: "Pending" as const,
    date_conducted: null,
    student_id: "st-6",
    session_number: i + 9
  })),

  // Class logs for st-3 (unsponsored, all pending)
  ...Array.from({ length: 24 }).map((_, i) => ({
    id: `log-st3-${i + 1}`,
    school_name: "مدرسه حضرت رقیه قلعه‌گنج",
    grade: "سوم ابتدایی",
    subject: "Religious Studies" as const,
    status: "Pending" as const,
    date_conducted: null,
    student_id: "st-3",
    session_number: i + 1
  })),

  // Class logs for st-4 (unsponsored, all pending)
  ...Array.from({ length: 24 }).map((_, i) => ({
    id: `log-st4-${i + 1}`,
    school_name: "دبستان عشایری شهید همت ریگان",
    grade: "ششم ابتدایی",
    subject: "Art" as const,
    status: "Pending" as const,
    date_conducted: null,
    student_id: "st-4",
    session_number: i + 1
  }))
];

// Read DB file
function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const data = {
      sponsors: initialSponsors,
      students: initialStudents,
      sponsorships: initialSponsorships,
      classLogs: initialClassLogs,
      currentUser: { id: "sp-1", name: "محمدرضا سلیمانی", role: "Sponsor" }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading database file, returning seeds.", err);
    return {
      sponsors: initialSponsors,
      students: initialStudents,
      sponsorships: initialSponsorships,
      classLogs: initialClassLogs,
      currentUser: { id: "sp-1", name: "محمدرضا سلیمانی", role: "Sponsor" }
    };
  }
}

// Write DB file
function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Calculate Stats dynamically
function calculateStats(dbState: any): DashboardStats {
  const students: Student[] = dbState.students;
  const classLogs: ClassLog[] = dbState.classLogs;
  const sponsorships: Sponsorship[] = dbState.sponsorships;

  const total_students = students.length;
  
  // Total students fully covered
  const students_sponsored = students.filter(
    s => s.sponsorship_status === "Fully_Sponsored"
  ).length;

  // Remaining list (Unsponsored or Partially sponsored)
  const students_remaining = students.filter(
    s => s.sponsorship_status !== "Fully_Sponsored"
  ).length;

  // Conducted classes
  const sessions_conducted = classLogs.filter(log => log.status === "Held").length;
  // Total planned classes (24 classes per student)
  const total_possible_sessions = total_students * FULL_SPONSORSHIP_SESSIONS;
  const sessions_remaining = total_possible_sessions - sessions_conducted;

  // Count total unique donors
  const sponsor_ids = new Set(sponsorships.map(s => s.sponsor_id));
  const total_sponsors_count = sponsor_ids.size;

  // Total funds
  const total_funds_raised = sponsorships.reduce((sum, s) => sum + s.amount_paid, 0);

  return {
    students_remaining,
    students_sponsored,
    sessions_conducted,
    sessions_remaining,
    total_sponsors_count,
    total_funds_raised
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup DB on initialization if not exists
  readDb();

  // API 1: Fetch overall data (handles both /api/data and /api/init)
  const handleGetData = (req: express.Request, res: express.Response) => {
    const db = readDb();
    const stats = calculateStats(db);
    res.json({
      ...db,
      stats,
      session_cost: SESSION_COST_TOMANS,
      full_package_cost: STUDENT_COST_TOMANS,
      sessions_per_year: FULL_SPONSORSHIP_SESSIONS
    });
  };
  app.get("/api/data", handleGetData);
  app.get("/api/init", handleGetData);

  // API 2: Switch context user (between sponsor and admin for demo purpose)
  app.post("/api/user/switch", (req, res) => {
    const { role } = req.body;
    const db = readDb();
    if (role === "Admin") {
      db.currentUser = { id: "admin-1", name: "مدیر سیستم", role: "Admin" };
    } else {
      db.currentUser = { id: "sp-1", name: "محمدرضا سلیمانی", role: "Sponsor" };
    }
    writeDb(db);
    res.json({ success: true, currentUser: db.currentUser });
  });

  // API 3: Reset database
  app.post("/api/admin/reset", (req, res) => {
    const freshDb = {
      sponsors: initialSponsors,
      students: initialStudents,
      sponsorships: initialSponsorships,
      classLogs: initialClassLogs,
      currentUser: { id: "sp-1", name: "محمدرضا سلیمانی", role: "Sponsor" }
    };
    writeDb(freshDb);
    const stats = calculateStats(freshDb);
    res.json({ success: true, ...freshDb, stats });
  });

  // API 4: Sponsor Checkout Flow (handles both /api/sponsor/checkout and /api/sponsor)
  const handleSponsorCheckout = (req: express.Request, res: express.Response) => {
    const { 
      name, 
      email, 
      phone, 
      sponsor_name, 
      sponsor_phone, 
      sponsor_type, 
      quantity_students, 
      quantity_sessions, 
      sessions_bought, 
      custom_amount, 
      amount_paid,
      simulate_failure 
    } = req.body;

    // Simulate payment gateway failure if requested
    if (simulate_failure) {
      return res.status(402).json({ 
        error: "تراکنش توسط بانک پذیرنده رد شد. لطفاً موجودی یا اطلاعات کارت را بررسی کرده و مجدداً تلاش فرمایید." 
      });
    }

    const effectiveName = (name || sponsor_name || "حامی نیکوکار").trim();
    const effectivePhone = (phone || sponsor_phone || "09123456789").trim();
    const effectiveEmail = email || `user-${Date.now()}@kafalat.ir`;

    const db = readDb();
    
    // 1. Find or create sponsor
    let sponsor = db.sponsors.find((s: User) => s.phone === effectivePhone || s.email === effectiveEmail);
    if (!sponsor) {
      sponsor = {
        id: `sp-${Date.now()}`,
        name: effectiveName,
        email: effectiveEmail,
        phone: effectivePhone,
        role: "Sponsor" as const
      };
      db.sponsors.push(sponsor);
    } else {
      sponsor.name = effectiveName;
    }

    // Allocate total sessions based on user choice
    let totalSessionsBought = 0;
    let totalPayment = 0;

    if (quantity_students && quantity_students > 0) {
      totalSessionsBought = quantity_students * FULL_SPONSORSHIP_SESSIONS;
      totalPayment = quantity_students * STUDENT_COST_TOMANS;
    } else if (quantity_sessions && quantity_sessions > 0) {
      totalSessionsBought = quantity_sessions;
      totalPayment = quantity_sessions * SESSION_COST_TOMANS;
    } else if (sessions_bought && sessions_bought > 0) {
      totalSessionsBought = sessions_bought;
      totalPayment = amount_paid || (sessions_bought * SESSION_COST_TOMANS);
    } else if (custom_amount && custom_amount > 0) {
      totalPayment = custom_amount;
      totalSessionsBought = Math.max(1, Math.floor(custom_amount / SESSION_COST_TOMANS));
    } else if (amount_paid && amount_paid > 0) {
      totalPayment = amount_paid;
      totalSessionsBought = Math.max(1, Math.floor(amount_paid / SESSION_COST_TOMANS));
    } else {
      return res.status(400).json({ error: "لطفاً مبلغ یا تعداد جلسات معتبر وارد نمایید." });
    }

    // Validate minimum payment
    if (totalPayment < 50000) {
      return res.status(400).json({ error: "حداقل مبلغ حمایت ۵۰,۰۰۰ تومان می‌باشد." });
    }

    // Generated Receipt Number
    const receiptNo = `TRX-${Math.floor(100000 + Math.random() * 900000).toString()}`;
    const dateStr = new Date().toISOString();

    // 2. Relational assignment: distribute purchased sessions to students pool
    let remainingSessionsToDistribute = totalSessionsBought;
    const assignedSponsorships: Sponsorship[] = [];

    let attempts = 0;
    while (remainingSessionsToDistribute > 0 && attempts < 50) {
      attempts++;
      
      const eligibleStudents = db.students.filter(
        (st: Student) => st.sponsorship_status !== "Fully_Sponsored"
      ).sort((a: Student, b: Student) => {
        if (a.sponsorship_status === "Partially_Sponsored" && b.sponsorship_status !== "Partially_Sponsored") return -1;
        if (a.sponsorship_status !== "Partially_Sponsored" && b.sponsorship_status === "Partially_Sponsored") return 1;
        return 0;
      });

      if (eligibleStudents.length === 0) {
        const subjects: Array<"Art" | "Quran" | "Religious Studies"> = ["Art", "Quran", "Religious Studies"];
        const placeholderSchools = ["دبستان عشایری توحید", "مدرسه سردار جنگل قلعه‌گنج", "دبستان ابوریحان بیرجند", "مدرسه صائب تبریزی بم‌پور"];
        const placeholderGrades = ["دوم ابتدایی", "سوم ابتدایی", "چهارم ابتدایی", "پنجم ابتدایی"];
        const placeholderNames = ["نگار میرزایی", "عدنان مکرانی", "حدیثه سارانی", "حسام ریگی", "زینب بامری"];

        const newSt: Student = {
          id: `st-gen-${Date.now()}-${attempts}`,
          name: placeholderNames[Math.floor(Math.random() * placeholderNames.length)],
          school_name: placeholderSchools[Math.floor(Math.random() * placeholderSchools.length)],
          grade: placeholderGrades[Math.floor(Math.random() * placeholderGrades.length)],
          subject: subjects[Math.floor(Math.random() * subjects.length)],
          sponsorship_status: "Unsponsored",
          sessions_held: 0,
          assigned_sponsor_id: null,
          amount_needed: STUDENT_COST_TOMANS,
          amount_sponsored: 0
        };
        db.students.push(newSt);
        
        const newLogs = Array.from({ length: 24 }).map((_, i) => ({
          id: `log-${newSt.id}-${i + 1}`,
          school_name: newSt.school_name,
          grade: newSt.grade,
          subject: newSt.subject,
          status: "Pending" as const,
          date_conducted: null,
          student_id: newSt.id,
          session_number: i + 1
        }));
        db.classLogs.push(...newLogs);
        continue;
      }

      const targetStudent = eligibleStudents[0];
      const maxNeededSessions = FULL_SPONSORSHIP_SESSIONS - Math.floor(targetStudent.amount_sponsored / SESSION_COST_TOMANS);
      
      if (maxNeededSessions <= 0) {
        targetStudent.sponsorship_status = "Fully_Sponsored";
        continue;
      }

      const sessionsToGive = Math.min(remainingSessionsToDistribute, maxNeededSessions);
      const paidForTheseSessions = sessionsToGive * SESSION_COST_TOMANS;

      targetStudent.amount_sponsored += paidForTheseSessions;
      targetStudent.amount_needed = Math.max(0, STUDENT_COST_TOMANS - targetStudent.amount_sponsored);
      
      if (targetStudent.amount_sponsored >= STUDENT_COST_TOMANS) {
        targetStudent.sponsorship_status = "Fully_Sponsored";
      } else {
        targetStudent.sponsorship_status = "Partially_Sponsored";
      }

      if (!targetStudent.assigned_sponsor_id) {
        targetStudent.assigned_sponsor_id = sponsor.id;
        targetStudent.assigned_sponsor_name = sponsor.name;
      }

      const sponRecord: Sponsorship = {
        id: `spon-${Date.now()}-${remainingSessionsToDistribute}`,
        sponsor_id: sponsor.id,
        sponsor_name: sponsor.name,
        student_id: targetStudent.id,
        student_name: targetStudent.name,
        school_name: targetStudent.school_name,
        grade: targetStudent.grade,
        subject: targetStudent.subject === "Art" ? "هنر و خلاقیت" : targetStudent.subject === "Quran" ? "انس با قرآن کریم" : "تعلیمات معارف و اخلاق",
        amount_paid: paidForTheseSessions,
        sessions_bought: sessionsToGive,
        created_at: dateStr,
        receipt_no: receiptNo
      };

      db.sponsorships.push(sponRecord);
      assignedSponsorships.push(sponRecord);

      remainingSessionsToDistribute -= sessionsToGive;
    }

    db.currentUser = { id: sponsor.id, name: sponsor.name, phone: sponsor.phone, role: "Sponsor" };

    writeDb(db);
    const updatedStats = calculateStats(db);

    res.json({
      success: true,
      receipt_no: receiptNo,
      receipt: {
        receipt_no: receiptNo,
        sponsor_name: sponsor.name,
        sponsor_phone: sponsor.phone,
        date: dateStr,
        amount_paid: totalPayment,
        sessions_bought: totalSessionsBought,
        sponsorships_assigned: assignedSponsorships
      },
      currentUser: db.currentUser,
      stats: updatedStats
    });
  };

  app.post("/api/sponsor/checkout", handleSponsorCheckout);
  app.post("/api/sponsor", handleSponsorCheckout);

  // API: Record Teacher Session
  app.post("/api/session", (req, res) => {
    const { student_id, teacher_name, topic, notes } = req.body;
    const db = readDb();
    const student = db.students.find((s: Student) => s.id === student_id);
    if (!student) {
      return res.status(404).json({ error: "دانش‌آموز یافت نشد" });
    }

    student.sessions_held = Math.min(24, (student.sessions_held || 0) + 1);
    const pendingLog = db.classLogs.find((l: ClassLog) => l.student_id === student_id && l.status === "Pending");
    if (pendingLog) {
      pendingLog.status = "Held";
      pendingLog.date_conducted = new Date().toISOString();
    }

    writeDb(db);
    res.json({ success: true, student, stats: calculateStats(db) });
  });

  // API: Get Progress Report for a Student
  app.get("/api/report/:studentId", async (req, res) => {
    const { studentId } = req.params;
    const db = readDb();
    const student = db.students.find((s: Student) => s.id === studentId);
    if (!student) {
      return res.status(404).json({ error: "دانش‌آموز یافت نشد" });
    }

    const subjectFarsi = student.subject === "Art" ? "هنر" : student.subject === "Quran" ? "قرآن" : "دینی و معارف";
    const heldCount = student.sessions_held;
    const fallback = `حامی ارجمند، سلام و دعای خیر ما را از قلب مدارس محروم پذیرا باشید. به پشتیبانی شما از جلسات آموزشی «${student.name}» در «${student.school_name}»، تاکنون ${heldCount} زنگ هدفمند ${subjectFarsi} برگزار شده و انگیزه و مهارت‌های فردی دانش‌آموز با رشد چشمگیری همراه بوده است.`;
    res.json({ report: fallback, isAiGenerated: false });
  });
  // API 5: Admin - Register a new batch/student slot
  app.post("/api/admin/students/add", (req, res) => {
    const { name, school_name, grade, subject } = req.body;
    if (!name || !school_name || !grade || !subject) {
      return res.status(400).json({ error: "کلیه فیلدها الزامی هستند" });
    }

    const db = readDb();
    const newStudent: Student = {
      id: `st-${Date.now()}`,
      name,
      school_name,
      grade,
      subject,
      sponsorship_status: "Unsponsored",
      sessions_held: 0,
      assigned_sponsor_id: null,
      amount_needed: STUDENT_COST_TOMANS,
      amount_sponsored: 0
    };

    db.students.unshift(newStudent);

    // Create 24 pending class logs for this student
    const logs = Array.from({ length: 24 }).map((_, i) => ({
      id: `log-${newStudent.id}-${i + 1}`,
      school_name: newStudent.school_name,
      grade: newStudent.grade,
      subject: newStudent.subject,
      status: "Pending" as const,
      date_conducted: null,
      student_id: newStudent.id,
      session_number: i + 1
    }));
    db.classLogs.push(...logs);

    writeDb(db);
    res.json({ success: true, student: newStudent });
  });

  // API 6: Admin - Mark Class Log as Held / Conducted
  app.post("/api/admin/classes/conduct", (req, res) => {
    const { logId } = req.body;
    if (!logId) {
      return res.status(400).json({ error: "کد کلاس نامعتبر است" });
    }

    const db = readDb();
    const foundLogIndex = db.classLogs.findIndex((l: ClassLog) => l.id === logId);
    if (foundLogIndex === -1) {
      return res.status(404).json({ error: "کلاس یافت نشد" });
    }

    const log = db.classLogs[foundLogIndex];
    if (log.status === "Held") {
      return res.json({ success: true, message: "این کلاس قبلا برگزار شده است." });
    }

    // Mark held
    log.status = "Held";
    log.date_conducted = new Date().toISOString();

    // Increment corresponding student's held session count
    const student = db.students.find((s: Student) => s.id === log.student_id);
    if (student) {
      student.sessions_held = Math.min(24, (student.sessions_held || 0) + 1);
    }

    writeDb(db);
    res.json({ success: true, log, student });
  });

  // API 7: Admin - Quick check-in of a class loop (bypassing specific logs)
  app.post("/api/admin/students/conduct-any", (req, res) => {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "کد دانش‌آموز الزامی است" });
    }

    const db = readDb();
    const student = db.students.find((s: Student) => s.id === studentId);
    if (!student) {
      return res.status(404).json({ error: "دانش‌آموز یافت نشد" });
    }

    if (student.sessions_held >= 24) {
      return res.status(400).json({ error: "تمام کلاس‌های این دوره قبلا ثبت شده‌اند." });
    }

    // Increment
    student.sessions_held += 1;

    // Find first pending class log for this student and mark it Held
    const pendingLog = db.classLogs.find((l: ClassLog) => l.student_id === studentId && l.status === "Pending");
    if (pendingLog) {
      pendingLog.status = "Held";
      pendingLog.date_conducted = new Date().toISOString();
    }

    writeDb(db);
    res.json({ success: true, student });
  });

  // API 8: ChatGPT/Gemini AI progress report generator for a sponsored student's classroom
  app.post("/api/gemini/progress-report", async (req, res) => {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "شناسه دانش‌آموز معتبر نیست" });
    }

    const db = readDb();
    const student = db.students.find((s: Student) => s.id === studentId);
    if (!student) {
      return res.status(404).json({ error: "دانش‌آموز یافت نشد" });
    }

    const subjectFarsi = student.subject === "Art" ? "هنر" : student.subject === "Quran" ? "قرآن" : "دینی و معارف";
    const heldCount = student.sessions_held;

    // Define mock teacher feedback prompt
    const prompt = `
      شما یک معلم متخصص دلسوز هستید که به مناطق محروم سیستان و بلوچستان و کرمان اعزام شده‌اید تا دروس تخصصی مثل ${subjectFarsi} را تدریس کنید.
      حامی مالی این دانش‌آموز یعنی "${student.name}" در مدرسه "${student.school_name}"، هزینه ارسال معلم را متقبل شده است.
      کل جلسات سال تحصیلی ۲۴ جلسه است و تا کنون ${heldCount} جلسه برگزار شده است.
      لطفا یک گزارش صمیمانه، واقعی و بسیار انگیزه‌بخش به زبان فارسی بنویسید که معلم برای خیر/حامی خود ارسال می‌کند.
      گزارش باید شامل:
      ۱. سلام گرم و دعای خیر برای حامی گرانقدر.
      ۲. پیشرفت عینی و ملموس این دانش‌آموز در کلاس ${subjectFarsi} (مثلا کشیدن نقاشی‌های زیبا، روان‌خوانی آیات یا یادگیری مفاهیم اخلاقی با مثال‌های محلی).
      ۳. شرحی کوتاه و تاثیرگذار از اشتیاق بچه‌های کلاس هنگامی که معلم وارد روستای دورافتاده می‌شود.
      ۴. تشکر صمیمانه و متواضعانه بابت اینکه امکان آموختن را برای این فرزند ایران فراهم کرده‌اند.

      لحن صمیمی، متواضع، باکیفیت و سرشار از عشق باشد. به متغیرهای محلی مدرسه (مثل ${student.school_name}) ارجاع دهید. هیچ کد یا توضیح فنی ندهید.
    `;

    const ai = getGeminiClient();
    if (!ai) {
      // Return a heartwarming, highly customized template mock fallback indicating to configure key for live AI
      const mockReports: Record<string, string> = {
        Art: `حامی گرانقدر و نیک‌اندیش، سلام و دعای خیر ما از بلوچستان زیبا تقدیم شما باد.
امروز به لطف یاری دستان پرمهر شما، هجدهمین زنگ هنر خلاقیت را در مدرسه برگزار کردیم. امیررضا براهویی امروز با ذوق فراوان تصویر زیبایی از دشت و کپرها کشید و کنارش خورشید درخشانی نقاشی کرد. ذوق یادگیری عجیبی در چهره این پسرک بااستعداد موج می‌زند. بچه‌های کلاس هروقت موتور معلم سیار را دور روستا می‌بینند، پایکوبان به پیشواز زنگ هنر می‌آیند. از اعماق وجودمان برای شما خیر و برکت آرزومندیم زنگ آموختن کماکان در بلوچستان جاری است.`,
        Quran: `سلام و درود حامی دلسوز زنگ بندگی و انس با قرآن.
خوشحالیم به استحضارتان برسانیم فاطمه رئیسی تا کنون ۱۲ زنگ نورانی قرآن را با حمایت شما به پایان رسانده است. او اکنون سوره نبا را با صوتی بسیار زیبا و دلنشین، روان‌خوانی می‌کند. بچه‌های بشاگرد هروقت کتاب‌های جذاب قرآنی را در دست می‌گیرند به پهنای صورت لبخند می‌زنند و این نور و معنویت به خانه تک‌تک آن‌ها بازمی‌گردد. از پشتیبانی و عاطفه پاک شما برای زنده نگه‌داشتن کلام الهی در کپرها سپاسگزاریم.`,
        "Religious Studies": `خیر نیکوکار و گرامی، صمیمانه‌ترین درودها را از دل زوزه‌های صموران بشاگرد و کوهرنگ پذیرا باشید.
جلسات اخلاق و تعلیمات دینی به بچه‌ها یاد داده است چطور با مهربانی دست یکدیگر را بگیرند. نازنین‌زهرا حیدری در کارهای تیمی کلاس پیش‌قدم است. حمایت مستمر شما بارقه‌های امید و نور را در چشمان معصوم این دختر نجیب روشن کرده است. معلم سیار با انرژی و انگیزه بالایی کار تدریس را ادامه می‌دهد و بانی این شور معنوی شما هستید.`
      };

      const fallbackText = mockReports[student.subject] || `حامی ارجمند، سلام و دعای خیر ما را از قلب مدارس محروم ایران پذیرا باشید. به لطف حمایت شما از زنگ‌های آموزشی "${student.name}" در "${student.school_name}"، زنگ تربیت و هنر به‌طور منظم برگزار شده و اکنون ${heldCount} جلسه ثبت شده است. دانش‌آموز ما با انگیزه بالایی درس‌ها را فرا می‌گیرد. (برای گزارش‌های پویا و هوشمند، کلید Gemini API را در بخش Secrets تنظیم فرمایید)`;
      
      return res.json({
        report: fallbackText,
        isAiGenerated: false
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({
        report: response.text,
        isAiGenerated: true
      });
    } catch (error: any) {
      console.error("Gemini invocation failed, returning elegant template instead", error);
      res.json({
        report: `حامی گرانقدر، سلام و سپاس قلبی ما از روستاهای محروم. به پشتیبانی گرانقدر شما، زنگ‌های هدفمند تدریس برای "${student.name}" در حال اجرا است و دانش‌آموز با پشتکار بالا در جلسات شرکت می‌کند. معلم کلاس بابت همت بلندتان تندرستی روزافزون برای شما آرزو دارد.`,
        isAiGenerated: false
      });
    }
  });

  // Serve static UI through Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
