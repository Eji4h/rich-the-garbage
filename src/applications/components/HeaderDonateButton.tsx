import { DonateButton } from './DonateButton';
import { featureFlags } from '../../config/featureFlags';

export function HeaderDonateButton() {
  if (!featureFlags.donation) return null;

  return (
    <div id="header-donate-button" className="fixed bottom-4 right-4 z-50">
      <DonateButton variant="sticky" />
    </div>
  );
}
