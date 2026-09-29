/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Sponsor' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export type SponsorshipStatus = 'Unsponsored' | 'Partially_Sponsored' | 'Fully_Sponsored';

export interface Student {
  id: string;
  name: string; // Dynamic pseudonym or general student slot representation
  school_name: string;
  grade: string;
  subject: 'Art' | 'Quran' | 'Religious Studies';
  sponsorship_status: SponsorshipStatus;
  sessions_held: number; // Max 24
  assigned_sponsor_id: string | null;
  assigned_sponsor_name?: string | null;
  amount_needed: number; // Cost remaining to complete 24 sessions
  amount_sponsored: number; // Paid so far for this student
}

export interface Sponsorship {
  id: string;
  sponsor_id: string;
  sponsor_name: string;
  student_id: string;
  student_name: string;
  school_name: string;
  grade: string;
  subject: string;
  amount_paid: number;
  sessions_bought: number;
  created_at: string;
  receipt_no: string;
}

export interface ClassLog {
  id: string;
  school_name: string;
  grade: string;
  subject: 'Art' | 'Quran' | 'Religious Studies';
  status: 'Held' | 'Pending';
  date_conducted: string | null;
  student_id: string; // The specific student class loop this log affects
  session_number: number; // Which of the 24 sessions is this
}

export interface DashboardStats {
  students_remaining: number;
  students_sponsored: number;
  sessions_conducted: number;
  sessions_remaining: number;
  total_sponsors_count: number;
  total_funds_raised: number;
}
