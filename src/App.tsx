import FloatingGarbage from './components/FloatingGarbage';
import HeroCarousel from './components/HeroCarousel';
import GameSection from './components/GameSection';
import GalleryHeader from './components/GalleryHeader';
import GalleryTabs from './components/GalleryTabs';
import Hacktoberfest from './components/Hacktoberfest';
import Footer from './components/Footer';

function App() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 text-slate-800 font-['Outfit',sans-serif] antialiased selection:bg-purple-500/30">
      <FloatingGarbage />
      <div className="relative z-10">
        <HeroCarousel />

        {/* Game Section */}
        <div className="relative z-20">
          <GameSection />
        </div>

        <div className="relative z-10 pb-20 bg-gradient-to-b from-transparent to-white/30 backdrop-blur-[2px]">
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
