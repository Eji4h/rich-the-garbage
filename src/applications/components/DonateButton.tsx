import { useDonateModal } from '../hooks/useDonateModal';

interface DonateButtonProps {
  variant?: 'default' | 'subtle' | 'inline' | 'sticky' | 'hero';
  className?: string;
}

export function DonateButton({
  variant = 'default',
  className = '',
}: DonateButtonProps) {
  const { openDonateModal, prefetchModal } = useDonateModal();

  // Variant-specific styling
  const getButtonClasses = () => {
    switch (variant) {
      case 'sticky':
        return 'inline-flex items-center justify-center w-14 h-14 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl animate-pulse';
      case 'hero':
        return 'inline-flex items-center gap-3 px-8 py-4 text-lg bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-purple-500/50 font-bold hover:scale-105 animate-pulse';
      case 'subtle':
        return 'text-slate-800 hover:text-purple-700 transition-colors inline-flex items-center gap-2';
      case 'inline':
        return 'text-purple-600 hover:text-purple-800 underline text-sm inline-flex items-center gap-1';
      default:
        return 'inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl font-semibold hover:scale-105';
    }
  };

  const getButtonText = () => {
    switch (variant) {
      case 'hero':
        return 'Support Us';
      default:
        return 'Donate';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={openDonateModal}
        onMouseEnter={prefetchModal}
        onFocus={prefetchModal}
        className={getButtonClasses()}
        aria-label={variant === 'sticky' ? 'Donate' : undefined}
      >
        {variant !== 'inline' && (
          <svg
            className={
              variant === 'hero'
                ? 'w-6 h-6'
                : variant === 'sticky'
                  ? 'w-7 h-7'
                  : 'w-5 h-5'
            }
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
        {variant !== 'sticky' && <span>{getButtonText()}</span>}
        {variant === 'hero' && (
          <span className="text-2xl animate-bounce">✨</span>
        )}
      </button>
    </div>
  );
}
