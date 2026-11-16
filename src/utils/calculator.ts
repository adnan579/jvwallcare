import { WallPuttyProduct } from '../data/products';

export type PuttyGradeSelection = 'jv-waterproof-wall-putty-blue' | 'jv-extra-fine-wall-putty-teal';
export type BuildingCondition = 'new-home' | 'old-home' | 'commercial-building';

export interface PuttyEstimateInput {
  areaSqFt: number;
  puttyGrade: PuttyGradeSelection;
  buildingCondition: BuildingCondition;
  coats: 2 | 3;
}

export interface PuttyEstimateResult {
  totalKg: number;
  bags40KgRequired: number;
  waterLitersRequired: number;
  wastageFactorPercent: number;
  effectiveCoveragePerKg: number;
  selectedGradeName: string;
  summaryNote: string;
}

/**
 * Pure calculation for J.V. Wall Putty 40 kg bags and water mixing requirements.
 */
export function calculateMaterialEstimate(input: PuttyEstimateInput): PuttyEstimateResult {
  const safeArea = Number.isFinite(input.areaSqFt) && input.areaSqFt > 0 ? input.areaSqFt : 0;

  const conditionMultiplierMap: Record<BuildingCondition, { factor: number; wastagePercent: number }> = {
    'new-home': { factor: 1.05, wastagePercent: 5 },
    'old-home': { factor: 1.15, wastagePercent: 15 },
    'commercial-building': { factor: 1.08, wastagePercent: 8 },
  };

  const { factor, wastagePercent } =
    conditionMultiplierMap[input.buildingCondition] || conditionMultiplierMap['new-home'];

  const baseCoverage =
    input.puttyGrade === 'jv-extra-fine-wall-putty-teal'
      ? input.coats === 2
        ? 15
        : 11
      : input.coats === 2
        ? 14
        : 10;

  const selectedGradeName =
    input.puttyGrade === 'jv-extra-fine-wall-putty-teal'
      ? 'J.V. Wall Putty — Extra Fine (Teal Pack, 40 kg)'
      : 'J.V. Water Proof Wall Putty (Blue Pack, 40 kg)';

  if (safeArea === 0) {
    return {
      totalKg: 0,
      bags40KgRequired: 0,
      waterLitersRequired: 0,
      wastageFactorPercent: wastagePercent,
      effectiveCoveragePerKg: baseCoverage,
      selectedGradeName,
      summaryNote: 'Enter a valid wall area in sq. ft. to calculate 40 kg J.V. Wall Putty bags.',
    };
  }

  const effectiveArea = safeArea * factor;
  const totalKg = Math.ceil(effectiveArea / baseCoverage);
  const bags40KgRequired = Math.ceil(totalKg / 40);
  const waterLitersRequired = Math.round(totalKg * 0.38 * 10) / 10;

  return {
    totalKg,
    bags40KgRequired,
    waterLitersRequired,
    wastageFactorPercent: wastagePercent,
    effectiveCoveragePerKg: baseCoverage,
    selectedGradeName,
    summaryNote: `${bags40KgRequired} bags (40 kg each) of ${selectedGradeName} for ${safeArea.toLocaleString()} sq. ft. (${input.coats} coats, +${wastagePercent}% porosity buffer).`,
  };
}

/**
 * Filter J.V. Wall Putty catalog products by pack variant or search keyword.
 */
export function filterCatalogProducts(
  products: WallPuttyProduct[],
  variantFilter: 'all' | 'blue-navy' | 'teal-green',
  searchQuery: string
): WallPuttyProduct[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return products.filter((item) => {
    const matchesVariant = variantFilter === 'all' || item.packVariant === variantFilter;
    if (!matchesVariant) return false;
    if (!normalizedQuery) return true;

    const hay = [
      item.name,
      item.hindiName,
      item.code,
      item.tagline,
      item.shortDescription,
      item.detailedDescription,
      ...item.bagBadges,
      ...item.sideIcons.map((s) => `${s.title} ${s.detail}`),
    ]
      .join(' ')
      .toLowerCase();

    return hay.includes(normalizedQuery);
  });
}

export interface ContactInquiryInput {
  fullName: string;
  phone: string;
  cityOrDistrict: string;
  buildingSegment: 'नया घर (New Home)' | 'पुराना घर (Old Home)' | 'कमर्शियल बिल्डिंग (Commercial)';
  selectedPuttyGrade: string;
  bagsQuantity: string;
  message?: string;
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
}

export function validateContactInquiry(
  input: ContactInquiryInput
): ValidationResult<ContactInquiryInput> {
  const errors: Partial<Record<keyof ContactInquiryInput, string>> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name or contractor/firm name.';
  }

  const cleanedPhone = (input.phone || '').replace(/[\s\-+()]/g, '');
  if (!/^(?:91)?[6-9]\d{9}$/.test(cleanedPhone)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
  }

  if (!input.cityOrDistrict || input.cityOrDistrict.trim().length < 2) {
    errors.cityOrDistrict = 'Please enter your delivery city, town, or district.';
  }

  if (!input.selectedPuttyGrade || input.selectedPuttyGrade.trim().length === 0) {
    errors.selectedPuttyGrade = 'Please select a J.V. Wall Putty pack variant.';
  }

  if (!input.bagsQuantity || input.bagsQuantity.trim().length < 1) {
    errors.bagsQuantity = 'Please specify the number of 40 kg bags required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface DealershipAffiliationInput {
  firmName: string;
  proprietorName: string;
  phone: string;
  email?: string;
  districtAndState: string;
  affiliationTier: 'Authorized Retail Dealer' | 'District Wholesale Distributor' | 'Project Bulk Partner';
  godownAreaSqFt: string;
  monthlyTargetBags: string;
  existingTradeExperience?: string;
}

export function validateDealershipAffiliation(
  input: DealershipAffiliationInput
): ValidationResult<DealershipAffiliationInput> {
  const errors: Partial<Record<keyof DealershipAffiliationInput, string>> = {};

  if (!input.firmName || input.firmName.trim().length < 2) {
    errors.firmName = 'Please enter your registered hardware/paint store or firm name.';
  }

  if (!input.proprietorName || input.proprietorName.trim().length < 2) {
    errors.proprietorName = 'Please enter the proprietor or partner full name.';
  }

  const cleanedPhone = (input.phone || '').replace(/[\s\-+()]/g, '');
  if (!/^(?:91)?[6-9]\d{9}$/.test(cleanedPhone)) {
    errors.phone = 'Please enter a valid 10-digit mobile number for dealer verification.';
  }

  if (input.email && input.email.trim().length > 0) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
      errors.email = 'Please enter a valid email address or leave optional field blank.';
    }
  }

  if (!input.districtAndState || input.districtAndState.trim().length < 2) {
    errors.districtAndState = 'Please specify the target city/district for dealership territory.';
  }

  const godownNum = Number(input.godownAreaSqFt);
  if (!input.godownAreaSqFt || !Number.isFinite(godownNum) || godownNum < 100) {
    errors.godownAreaSqFt = 'Minimum 100 sq. ft. dry storage / shop space is required.';
  }

  if (!input.monthlyTargetBags || input.monthlyTargetBags.trim().length < 1) {
    errors.monthlyTargetBags = 'Please specify estimated monthly volume in 40 kg bags.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
