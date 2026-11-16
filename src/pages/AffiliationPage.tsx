import React, { useState } from 'react';
import {
  Handshake,
  CheckCircle2,
  AlertCircle,
  Truck,
  Store,
  Award,
  Phone,
  Send,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/products';
import {
  DealershipAffiliationInput,
  validateDealershipAffiliation,
} from '../utils/calculator';

interface LoggedAffiliation extends DealershipAffiliationInput {
  affiliationId: string;
  submittedAt: string;
}

export const AffiliationPage: React.FC = () => {
  const [formData, setFormData] = useState<DealershipAffiliationInput>({
    firmName: '',
    proprietorName: '',
    phone: '',
    email: '',
    districtAndState: '',
    affiliationTier: 'Authorized Retail Dealer',
    godownAreaSqFt: '500',
    monthlyTargetBags: '',
    existingTradeExperience: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof DealershipAffiliationInput, string>>
  >({});
  const [applications, setApplications] = useState<LoggedAffiliation[]>([]);
  const [latestApp, setLatestApp] = useState<LoggedAffiliation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateDealershipAffiliation(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const entry: LoggedAffiliation = {
      ...formData,
      affiliationId: `JV-DLR-${Math.floor(10000 + Math.random() * 90000)}`,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setApplications((prev) => [entry, ...prev]);
    setLatestApp(entry);
    setFormData((prev) => ({
      ...prev,
      firmName: '',
      proprietorName: '',
      phone: '',
      email: '',
      districtAndState: '',
      monthlyTargetBags: '',
      existingTradeExperience: '',
    }));
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
        {/* Page Header & 3 Affiliation Tiers */}
        <div className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#06686B] dark:text-teal-400">
              <Handshake className="w-4 h-4" />
              <span>Authorized Trade Network · J.V. Wall Care Udyog</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dealership &amp; District Stockist Affiliation Program
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Partner directly with our Saripur, Gopiganj, Bhadohi manufacturing plant to distribute{' '}
              <strong>J.V. Water Proof Wall Putty (Blue Pack)</strong> and{' '}
              <strong>J.V. Extra Fine Wall Putty (Teal Pack)</strong> in your city, block, or
              district.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                tier: 'Authorized Retail Dealer',
                minOrder: 'Min. 100 Bags (4 MT) Initial Load',
                icon: Store,
                perks: [
                  'Direct ex-factory Gopiganj dealer billing',
                  'Official Hindi shop board & catalog posters',
                  'Painter & contractor token reward support',
                ],
              },
              {
                tier: 'District Wholesale Distributor',
                minOrder: 'Min. 350 Bags (14 MT) Truckload',
                icon: Truck,
                perks: [
                  'Protected block / district distribution territory',
                  'Priority factory loading & volume slab rebates',
                  'Dedicated sales officer & sub-dealer supply rights',
                ],
              },
              {
                tier: 'Project Bulk Partner',
                minOrder: 'Custom Civil & Builder Rate Contract',
                icon: Award,
                perks: [
                  'Batch test certificates (ISO 9001:2015) with every lot',
                  'Scheduled direct-to-site delivery for apartments & complexes',
                  'Both Waterproof (Blue) & Extra Fine (Teal) 40 kg grades',
                ],
              },
            ].map((card, i) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-2 border-t-[#06686B] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tabular font-semibold text-orange-600 dark:text-orange-400">
                      {card.minOrder}
                    </span>
                    <IconComponent className="w-5 h-5 text-[#06686B] dark:text-teal-400" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {card.tier}
                  </h2>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {card.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#06686B] dark:text-teal-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Affiliation Application Form + Onboarding Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 5 Columns: Eligibility & Direct Dealership Helpline */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                3-Step Dealer Affiliation Process
              </h3>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <strong className="text-teal-800 dark:text-teal-400 block">
                    Step 01 · Submit Territory Application
                  </strong>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Provide your hardware/paint shop details, dry storage area (min. 100 sq. ft.),
                    and target monthly 40 kg bag volume.
                  </p>
                </div>
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <strong className="text-teal-800 dark:text-teal-400 block">
                    Step 02 · Territory &amp; GST Verification
                  </strong>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Our Bhadohi plant sales desk verifies pin-code availability and shares the
                    dealer price list and slab structure.
                  </p>
                </div>
                <div>
                  <strong className="text-teal-800 dark:text-teal-400 block">
                    Step 03 · First Dispatch &amp; Branding Kit
                  </strong>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Receive your opening consignment of J.V. Wall Putty 40 kg sacks along with
                    official dealer boards and promotional posters.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0B3B68] text-white space-y-3">
              <p className="text-xs font-semibold text-orange-300 uppercase tracking-wider">
                Direct Dealership Desk
              </p>
              <h4 className="font-display text-lg font-bold">
                Speak Directly with Plant Management
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Address: {COMPANY_INFO.address}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`tel:+91${COMPANY_INFO.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-mono-tabular">{COMPANY_INFO.phoneFormatted}</span>
                </a>
                <span className="text-xs font-mono-tabular text-teal-200">
                  {COMPANY_INFO.emailPrimary}
                </span>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Dealership Affiliation Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Official Dealership Affiliation Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Complete all required fields to apply for an authorized J.V. Wall Putty dealership.
              </p>
            </div>

            {latestApp && (
              <div
                role="status"
                aria-live="polite"
                className="p-4 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-sm font-bold text-teal-950 dark:text-teal-200">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span>Affiliation Logged — ID #{latestApp.affiliationId}</span>
                  </span>
                  <span className="text-xs font-mono-tabular">{latestApp.submittedAt}</span>
                </div>
                <p className="text-xs text-teal-900 dark:text-teal-300">
                  Application for <strong>{latestApp.firmName}</strong> ({latestApp.proprietorName})
                  in <strong>{latestApp.districtAndState}</strong> under{' '}
                  <strong>{latestApp.affiliationTier}</strong> has been registered.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Tier Selection */}
              <div className="space-y-1.5">
                <label
                  htmlFor="dealer-tier"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Select Affiliation Tier <span className="text-red-600">*</span>
                </label>
                <select
                  id="dealer-tier"
                  value={formData.affiliationTier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      affiliationTier:
                        e.target.value as DealershipAffiliationInput['affiliationTier'],
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Authorized Retail Dealer">
                    Authorized Retail Dealer (Hardware &amp; Paint Store)
                  </option>
                  <option value="District Wholesale Distributor">
                    District Wholesale Distributor (Block / District Stockist)
                  </option>
                  <option value="Project Bulk Partner">
                    Project Bulk Partner (Civil Contractor / Builder)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="dealer-firm"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Firm / Store Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="dealer-firm"
                    type="text"
                    value={formData.firmName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, firmName: e.target.value }))
                    }
                    placeholder="e.g., Maa Vindhyavasini Paints & Hardware"
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  {errors.firmName && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.firmName}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="dealer-owner"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Proprietor / Partner Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="dealer-owner"
                    type="text"
                    value={formData.proprietorName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, proprietorName: e.target.value }))
                    }
                    placeholder="e.g., Rajeshwar Prasad"
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  {errors.proprietorName && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.proprietorName}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="dealer-phone"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Mobile / WhatsApp Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="dealer-phone"
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

                <div className="space-y-1.5">
                  <label
                    htmlFor="dealer-district"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Target Town / District &amp; State <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="dealer-district"
                    type="text"
                    value={formData.districtAndState}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, districtAndState: e.target.value }))
                    }
                    placeholder="e.g., Gopiganj, Bhadohi (U.P.)"
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  {errors.districtAndState && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.districtAndState}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="dealer-godown"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Dry Godown / Shop Area (sq. ft.) <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="dealer-godown"
                    type="number"
                    min="100"
                    value={formData.godownAreaSqFt}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, godownAreaSqFt: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  {errors.godownAreaSqFt && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.godownAreaSqFt}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="dealer-target"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Estimated Monthly Volume (40 kg Bags) <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="dealer-target"
                    type="text"
                    value={formData.monthlyTargetBags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, monthlyTargetBags: e.target.value }))
                    }
                    placeholder="e.g., 300 Bags / Month"
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  {errors.monthlyTargetBags && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.monthlyTargetBags}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="dealer-experience"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  GSTIN / Current Brands Handled (Optional)
                </label>
                <input
                  id="dealer-experience"
                  type="text"
                  value={formData.existingTradeExperience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      existingTradeExperience: e.target.value,
                    }))
                  }
                  placeholder="Mention GST number or years in hardware/cement/paint trade..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#06686B] hover:bg-[#055255] dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Dealership Affiliation Application</span>
              </button>
            </form>

            {applications.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Submitted Dealership Applications ({applications.length})
                </h4>
                {applications.map((app) => (
                  <div
                    key={app.affiliationId}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-mono-tabular font-bold text-[#06686B] dark:text-teal-400">
                        {app.affiliationId}
                      </span>
                      <span className="mx-1.5 text-slate-400">·</span>
                      <strong>{app.firmName}</strong> ({app.districtAndState})
                    </div>
                    <span className="font-mono-tabular text-slate-500">
                      {app.monthlyTargetBags} · {app.affiliationTier}
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
