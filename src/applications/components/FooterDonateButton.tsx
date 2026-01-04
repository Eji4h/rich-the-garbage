import { featureFlags } from '../../config/featureFlags';
import { DonateButton } from './DonateButton';

export function FooterDonateButton() {
  if (!featureFlags.donation) return null;

  return (
    <div id="footer-donate-button" className="mb-6">
      <DonateButton variant="default" />
    </div>
  );
}
