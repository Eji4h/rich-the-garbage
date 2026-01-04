import { DonateButton } from './DonateButton';
import { featureFlags } from '../../config/featureFlags';

export function GameDonateButton() {
  if (!featureFlags.donation) return null;

  return (
    <div id="game-donate-button" className="mt-2 text-center">
      <DonateButton variant="inline" />
    </div>
  );
}
