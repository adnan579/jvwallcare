import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMaterialEstimate,
  filterCatalogProducts,
  validateContactInquiry,
  validateDealershipAffiliation,
} from './calculator';
import { CATALOG_PRODUCTS } from '../data/products';

test('CATALOG_PRODUCTS strictly contains only the provided J.V. Wall Putty catalog variants', () => {
  assert.equal(CATALOG_PRODUCTS.length, 2);
  assert.equal(CATALOG_PRODUCTS[0].id, 'jv-waterproof-wall-putty-blue');
  assert.equal(CATALOG_PRODUCTS[1].id, 'jv-extra-fine-wall-putty-teal');
});

test('calculateMaterialEstimate computes accurate 40kg wall putty bags for Blue Waterproof & Teal Extra Fine packs', () => {
  const blueResult = calculateMaterialEstimate({
    areaSqFt: 2800,
    puttyGrade: 'jv-waterproof-wall-putty-blue',
    buildingCondition: 'new-home',
    coats: 2,
  });

  // 2800 * 1.05 = 2940 / 14 = 210 kg -> 6 bags of 40kg
  assert.equal(blueResult.totalKg, 210);
  assert.equal(blueResult.bags40KgRequired, 6);
  assert.equal(blueResult.wastageFactorPercent, 5);

  const tealResult = calculateMaterialEstimate({
    areaSqFt: 3000,
    puttyGrade: 'jv-extra-fine-wall-putty-teal',
    buildingCondition: 'old-home',
    coats: 2,
  });

  // 3000 * 1.15 = 3450 / 15 = 230 kg -> 6 bags of 40kg
  assert.equal(tealResult.totalKg, 230);
  assert.equal(tealResult.bags40KgRequired, 6);
  assert.equal(tealResult.wastageFactorPercent, 15);
});

test('filterCatalogProducts filters by pack color variant and keyword', () => {
  const blueOnly = filterCatalogProducts(CATALOG_PRODUCTS, 'blue-navy', '');
  assert.equal(blueOnly.length, 1);
  assert.equal(blueOnly[0].code, 'JV-WP-40B');

  const bacterialSearch = filterCatalogProducts(CATALOG_PRODUCTS, 'all', 'anti-bacterial');
  assert.equal(bacterialSearch.length, 1);
  assert.equal(bacterialSearch[0].code, 'JV-EF-40T');
});

test('validateContactInquiry validates customer inquiry fields accurately', () => {
  const invalid = validateContactInquiry({
    fullName: '',
    phone: '123',
    cityOrDistrict: '',
    buildingSegment: 'नया घर (New Home)',
    selectedPuttyGrade: '',
    bagsQuantity: '',
  });
  assert.equal(invalid.isValid, false);

  const valid = validateContactInquiry({
    fullName: 'Anूप तिवारी',
    phone: '8896587151',
    cityOrDistrict: 'Gopiganj, Bhadohi',
    buildingSegment: 'नया घर (New Home)',
    selectedPuttyGrade: 'J.V. Water Proof Wall Putty (Blue & Orange Pack)',
    bagsQuantity: '50 Bags (40 kg)',
  });
  assert.equal(valid.isValid, true);
});

test('validateDealershipAffiliation validates dealer onboarding requirements including minimum godown space', () => {
  const invalidDealer = validateDealershipAffiliation({
    firmName: 'A',
    proprietorName: '',
    phone: '555',
    districtAndState: '',
    affiliationTier: 'Authorized Retail Dealer',
    godownAreaSqFt: '50',
    monthlyTargetBags: '',
  });
  assert.equal(invalidDealer.isValid, false);
  assert.ok(invalidDealer.errors.godownAreaSqFt);

  const validDealer = validateDealershipAffiliation({
    firmName: 'Kashi Vishwanath Paints & Hardware',
    proprietorName: 'Suresh Chandra Gupta',
    phone: '+91 9876543210',
    email: 'kashipaints@example.com',
    districtAndState: 'Bhadohi & Mirzapur, UP',
    affiliationTier: 'District Wholesale Distributor',
    godownAreaSqFt: '1200',
    monthlyTargetBags: '500 Bags (20 MT)',
  });
  assert.equal(validDealer.isValid, true);
});
