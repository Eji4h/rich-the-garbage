import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingGarbage from './applications/components/FloatingGarbage';
import HeroCarousel from './applications/components/HeroCarousel';
import GameSection from './applications/components/GameSection';
import GalleryHeader from './applications/components/GalleryHeader';
import GalleryTabs from './applications/components/GalleryTabs';
import Hacktoberfest from './applications/components/Hacktoberfest';
import Footer from './applications/components/Footer';
import { DonateButton } from './applications/components/DonateButton';
import { DonateSuccess } from './applications/components/DonateSuccess';
import { DonateCancel } from './applications/components/DonateCancel';

type DonateStatus = 'success' | 'cancel' | null;

function App() {
  const [donateStatus, setDonateStatus] = useState<DonateStatus>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('donate');
    if (status === 'success' || status === 'cancel') {
      setDonateStatus(status);
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('donate');
      window.history.replaceState({}, '', url.pathname);
    }
  }, []);

  const handleCloseStatus = () => {
    setDonateStatus(null);
  };

  const handleRetryDonate = () => {
    setDonateStatus(null);
    // Small delay to allow modal to close before opening donate modal
    setTimeout(() => {
      const donateButton = document.querySelector(
        '[aria-label="Donate"]',
      ) as HTMLButtonElement;
      donateButton?.click();
    }, 100);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-linear-to-br from-pink-200 via-purple-200 to-blue-200 text-slate-800 font-['Outfit',sans-serif] antialiased selection:bg-purple-500/30">
      <FloatingGarbage />
      <div className="relative z-10">
        <HeroCarousel />

        {/* Game Section */}
        <div className="relative z-20">
          <GameSection />
        </div>

        <div className="relative z-10 pb-20 bg-linear-to-b from-transparent to-white/30 backdrop-blur-[2px]">
          <GalleryHeader />
          <GalleryTabs />
        </div>

        {/* Hacktoberfest / Contribute Section */}
        <Hacktoberfest />

        <Footer />
      </div>

      {/* Floating Donate Button */}
      <DonateButton />

      {/* Donate Status Modals */}
      <AnimatePresence>
        {donateStatus === 'success' && (
          <DonateSuccess onClose={handleCloseStatus} />
        )}
        {donateStatus === 'cancel' && (
          <DonateCancel
            onClose={handleCloseStatus}
            onRetry={handleRetryDonate}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
