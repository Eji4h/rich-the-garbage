import { useState, useEffect } from 'react';
import FloatingGarbage from './applications/components/FloatingGarbage';
import HeroCarousel from './applications/components/HeroCarousel';
import GameSection from './applications/components/GameSection';
import GalleryHeader from './applications/components/GalleryHeader';
import GalleryTabs from './applications/components/GalleryTabs';
import Hacktoberfest from './applications/components/Hacktoberfest';
import Footer from './applications/components/Footer';
import { HeaderDonateButton } from './applications/components/HeaderDonateButton';
import { DonateSuccess } from './applications/components/DonateSuccess';
import { DonateCancel } from './applications/components/DonateCancel';
import { DonateModalProvider } from './applications/hooks/useDonateModal';

function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const hashPath = hash.split('?')[0];

  // Handle success/cancel pages
  if (hashPath === '#/donate-success') {
    return <DonateSuccess />;
  }

  if (hashPath === '#/donate-cancel') {
    return <DonateCancel />;
  }

  // Main app content

  return (
    <DonateModalProvider>
      <main className="min-h-screen relative overflow-hidden bg-linear-to-br from-pink-200 via-purple-200 to-blue-200 text-slate-800 font-['Outfit',sans-serif] antialiased selection:bg-purple-500/30">
        <HeaderDonateButton />
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
      </main>
    </DonateModalProvider>
  );
}

export default App;
