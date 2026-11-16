import React from 'react';
import { X, Check, ArrowRight, Phone } from 'lucide-react';
import { COMPANY_INFO, WallPuttyProduct } from '../data/products';

interface ProductModalProps {
  product: WallPuttyProduct | null;
  onClose: () => void;
  onOrderProduct: (productName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onOrderProduct,
}) => {
  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-xl space-y-6 my-8 text-slate-900 dark:text-slate-100">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-teal-800 dark:text-teal-400">
                {product.packColorLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">Code: {product.code}</span>
              <span aria-hidden="true">·</span>
              <span>{product.netWeight}</span>
            </div>
            <h2
              id="modal-product-title"
              className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1"
            >
              {product.name}
            </h2>
            <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
              {product.hindiName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close catalog specification modal"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed Overview */}
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.detailedDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">2-Coat Coverage</span>
              <strong className="text-slate-900 dark:text-white font-mono-tabular mt-0.5 block">
                {product.coverageRate}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Water Mixing Ratio</span>
              <strong className="text-slate-900 dark:text-white font-mono-tabular mt-0.5 block">
                {product.waterMixingRatio}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Pot Life</span>
              <strong className="text-slate-900 dark:text-white font-mono-tabular mt-0.5 block">
                {product.potLife}
              </strong>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Official Bag &amp; Laboratory Specifications
          </h3>
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  <th className="py-2.5 px-4 font-semibold">Parameter</th>
                  <th className="py-2.5 px-4 font-semibold">Catalog Value</th>
                  <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {product.technicalSpecs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {spec.parameter}
                    </td>
                    <td className="py-2.5 px-4 font-mono-tabular text-slate-700 dark:text-slate-300">
                      {spec.value}
                    </td>
                    <td className="py-2.5 px-4 font-mono-tabular text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      {spec.standard || 'J.V. QC'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bag Callout Icons */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Printed Packaging Performance Callouts
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {product.sideIcons.map((icon, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
              >
                <Check className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">{icon.title}</strong>
                  <span className="text-slate-600 dark:text-slate-400">{icon.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer CTAs */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`tel:+91${COMPANY_INFO.phone}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-400"
          >
            <Phone className="w-3.5 h-3.5 text-orange-600" />
            <span>Direct Factory Line: {COMPANY_INFO.phoneFormatted}</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onOrderProduct(product.name);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#06686B] hover:bg-[#055255] dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors cursor-pointer"
            >
              <span>Inquire for This 40 kg Pack</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
