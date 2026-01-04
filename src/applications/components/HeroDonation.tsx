import { motion } from 'framer-motion';

import { DonateButton } from './DonateButton';
import { featureFlags } from '../../config/featureFlags';

interface HeroDonationProps {
  duration?: number;
}

export default function HeroDonationButton({ duration }: HeroDonationProps) {
  if (!featureFlags.donation) return null;

  return (
    <motion.div
      id="hero-donation-button"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7, duration }}
      className="mb-8"
    >
      <DonateButton variant="hero" />
    </motion.div>
  );
}
