import FloatingGarbage from './applications/components/FloatingGarbage';
import HeroCarousel from './applications/components/HeroCarousel';
import GameSection from './applications/components/GameSection';
import GalleryHeader from './applications/components/GalleryHeader';
import GalleryTabs from './applications/components/GalleryTabs';
import Hacktoberfest from './applications/components/Hacktoberfest';
import Footer from './applications/components/Footer';

function App() {
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
    </main>
  );
}

export default App;
