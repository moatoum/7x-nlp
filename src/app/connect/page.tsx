'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, CheckCircle2, Loader2 } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 7) return false;
  if (/^(\d)\1+$/.test(digitsOnly)) return false;
  return true;
}

export default function ConnectPage() {
  const [form, setForm] = useState({
    contactName: '',
    businessEmail: '',
    phone: '',
    businessWebsite: '',
    uaeRegistered: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.contactName.trim()) errs.contactName = 'Name is required';
    if (!form.businessEmail.trim()) errs.businessEmail = 'Email is required';
    else if (!EMAIL_REGEX.test(form.businessEmail)) errs.businessEmail = 'Invalid email format';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!isValidPhone(form.phone)) errs.phone = 'Invalid phone number (at least 7 digits)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrors({ form: data.error || 'Something went wrong' });
        return;
      }
      const data = await res.json();
      setRefNumber(data.referenceNumber);
      setSubmitted(true);
    } catch {
      setErrors({ form: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm border border-gray-100"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted</h2>
          <p className="text-sm text-gray-500 mb-4">
            Your reference number is <span className="font-mono font-medium text-gray-900">{refNumber}</span>
          </p>
          <p className="text-sm text-gray-400 mb-6">
            One of our logistics experts will reach out to you within 2 business hours.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="ml-auto text-sm font-semibold text-gray-900">7X</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Connect to an Expert</h1>
              <p className="text-[13px] text-gray-400">We will match you with a logistics specialist</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                placeholder="Your full name"
                className={`w-full h-11 px-4 rounded-xl border ${errors.contactName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors`}
              />
              {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Email *</label>
              <input
                type="email"
                value={form.businessEmail}
                onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
                placeholder="you@company.com"
                className={`w-full h-11 px-4 rounded-xl border ${errors.businessEmail ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors`}
              />
              {errors.businessEmail && <p className="text-xs text-red-500 mt-1">{errors.businessEmail}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+971 XX XXX XXXX"
                className={`w-full h-11 px-4 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Website</label>
              <input
                type="url"
                value={form.businessWebsite}
                onChange={(e) => setForm({ ...form, businessWebsite: e.target.value })}
                placeholder="https://yourcompany.com"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
              />
            </div>

            {/* UAE Registration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Is your company registered in the UAE? *</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, uaeRegistered: true })}
                  className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all ${form.uaeRegistered ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, uaeRegistered: false })}
                  className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all ${!form.uaeRegistered ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                >
                  No
                </button>
              </div>
            </div>

            {errors.form && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{errors.form}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
