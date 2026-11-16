import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Building2,
} from 'lucide-react';
import { CATALOG_PRODUCTS, COMPANY_INFO } from '../data/products';
import { ContactInquiryInput, validateContactInquiry } from '../utils/calculator';

interface LoggedContactInquiry extends ContactInquiryInput {
  referenceId: string;
  submittedAt: string;
}

interface ContactPageProps {
  preselectedProduct: string;
  preselectedQuantity: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  preselectedProduct,
  preselectedQuantity,
}) => {
  const [formData, setFormData] = useState<ContactInquiryInput>({
    fullName: '',
    phone: '',
    cityOrDistrict: '',
    buildingSegment: 'नया घर (New Home)',
    selectedPuttyGrade: preselectedProduct || CATALOG_PRODUCTS[0].name,
    bagsQuantity: preselectedQuantity || '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactInquiryInput, string>>>({});
  const [submittedList, setSubmittedList] = useState<LoggedContactInquiry[]>([]);
  const [latestSuccess, setLatestSuccess] = useState<LoggedContactInquiry | null>(null);

  useEffect(() => {
    if (preselectedProduct) {
      setFormData((prev) => ({ ...prev, selectedPuttyGrade: preselectedProduct }));
    }
  }, [preselectedProduct]);

  useEffect(() => {
    if (preselectedQuantity) {
      setFormData((prev) => ({ ...prev, bagsQuantity: preselectedQuantity }));
    }
  }, [preselectedQuantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactInquiry(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const entry: LoggedContactInquiry = {
      ...formData,
      referenceId: `JV-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSubmittedList((prev) => [entry, ...prev]);
    setLatestSuccess(entry);
    setFormData((prev) => ({
      ...prev,
      fullName: '',
      phone: '',
      cityOrDistrict: '',
      bagsQuantity: '',
      message: '',
    }));
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 lg:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 5 Columns: Official Contact & Plant Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#06686B] dark:text-teal-400">
                <span>Direct Plant Contact &amp; Order Desk</span>
                <span aria-hidden="true">·</span>
                <span>Pin: 221303</span>
              </div>
              <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Contact {COMPANY_INFO.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Reach out to our Gopiganj, Bhadohi factory for direct 40 kg J.V. Wall Putty orders,
                rate inquiries, or dispatch gate passes.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 border border-teal-100 dark:border-teal-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-[#06686B] dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Manufactured &amp; Marketed By
                  </p>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {COMPANY_INFO.name}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                    {COMPANY_INFO.hindiName} — {COMPANY_INFO.hindiTagline}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 border border-teal-100 dark:border-teal-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#06686B] dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Business &amp; Factory Address
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5 leading-relaxed">
                    {COMPANY_INFO.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Official Contact Number
                  </p>
                  <a
                    href={`tel:+91${COMPANY_INFO.phone}`}
                    className="text-base font-bold font-mono-tabular text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 mt-0.5 inline-block"
                  >
                    {COMPANY_INFO.phoneFormatted} ({COMPANY_INFO.phone})
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 border border-teal-100 dark:border-teal-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#06686B] dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Official Catalog Emails
                  </p>
                  <a
                    href={`mailto:${COMPANY_INFO.emailPrimary}`}
                    className="text-sm font-mono-tabular font-semibold text-slate-900 dark:text-white hover:underline block mt-0.5"
                  >
                    {COMPANY_INFO.emailPrimary}
                  </a>
                  <a
                    href={`mailto:${COMPANY_INFO.emailSecondary}`}
                    className="text-xs font-mono-tabular text-slate-500 dark:text-slate-400 hover:underline block"
                  >
                    {COMPANY_INFO.emailSecondary}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Dispatch &amp; Office Hours
                  </p>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                    Monday – Saturday: 8:00 AM – 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Customer / Contractor Inquiry Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Send a Wall Putty Order or Price Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Select your building type and required 40 kg J.V. Wall Putty pack variant below.
              </p>
            </div>

            {latestSuccess && (
              <div
                role="status"
                aria-live="polite"
                className="p-4 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-lg space-y-1.5"
              >
                <div className="flex items-center justify-between text-sm font-bold text-teal-950 dark:text-teal-200">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span>Inquiry Registered — Ref #{latestSuccess.referenceId}</span>
                  </span>
                  <span className="text-xs font-mono-tabular">{latestSuccess.submittedAt}</span>
                </div>
                <p className="text-xs text-teal-900 dark:text-teal-300">
                  Thank you, <strong>{latestSuccess.fullName}</strong> (
                  {latestSuccess.cityOrDistrict}). Your inquiry for{' '}
                  <strong>{latestSuccess.selectedPuttyGrade}</strong> ({latestSuccess.bagsQuantity})
                  has been logged for our Gopiganj dispatch desk.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Building Segment Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Building Segment
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      'नया घर (New Home)',
                      'पुराना घर (Old Home)',
                      'कमर्शियल बिल्डिंग (Commercial)',
                    ] as const
                  ).map((seg) => {
                    const active = formData.buildingSegment === seg;
                    return (
                      <button
                        key={seg}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, buildingSegment: seg }))
                        }
                        className={`py-2.5 px-3 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#06686B] text-white border-[#06686B]'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {seg}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Your Name / Contractor Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="Enter full name"
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-city"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Site Location / City <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="contact-city"
                    type="text"
                    value={formData.cityOrDistrict}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, cityOrDistrict: e.target.value }))
                    }
                    placeholder="e.g., Gopiganj, Bhadohi"
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  {errors.cityOrDistrict && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.cityOrDistrict}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-putty"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Select J.V. Wall Putty Variant <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="contact-putty"
                    value={formData.selectedPuttyGrade}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, selectedPuttyGrade: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {CATALOG_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                    <option value="Both Blue Waterproof & Teal Extra Fine 40 kg Packs">
                      Both Blue Waterproof &amp; Teal Extra Fine 40 kg Packs
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-bags"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Required Quantity (40 kg Bags) <span className="text-red-600">*</span>
                </label>
                <input
                  id="contact-bags"
                  type="text"
                  value={formData.bagsQuantity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bagsQuantity: e.target.value }))
                  }
                  placeholder="e.g., 50 Bags (40 kg each)"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                {errors.bagsQuantity && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.bagsQuantity}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-msg"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  id="contact-msg"
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Any specific delivery date or site landmark..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#06686B] hover:bg-[#055255] dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Wall Putty Order Inquiry</span>
              </button>
            </form>

            {submittedList.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Logged Order Inquiries ({submittedList.length})
                </h4>
                {submittedList.map((item) => (
                  <div
                    key={item.referenceId}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-mono-tabular font-bold text-[#06686B] dark:text-teal-400">
                        {item.referenceId}
                      </span>
                      <span className="mx-1.5 text-slate-400">·</span>
                      <strong>{item.selectedPuttyGrade}</strong> ({item.bagsQuantity})
                    </div>
                    <span className="text-slate-500 font-mono-tabular">
                      {item.cityOrDistrict} · {item.submittedAt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
