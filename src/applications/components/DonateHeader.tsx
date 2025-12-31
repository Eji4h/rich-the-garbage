import { DonateButton } from './DonateButton';

export function DonateHeader() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <DonateButton variant="sticky" />
    </div>
  );
}
