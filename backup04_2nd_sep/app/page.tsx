import Navbar from '@/components/navigation/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import CurrentAdventureSection from '@/components/sections/CurrentAdventureSection';
import QuickCards from '@/components/sections/QuickCards';
import LatestArticles from '@/components/sections/LatestArticles';
import LatestVideos from '@/components/sections/LatestVideos';
import SunsetFooter from '@/components/footer/SunsetFooter';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <CurrentAdventureSection />
        <QuickCards />
        <LatestArticles />
        <LatestVideos />
      </main>
      <SunsetFooter />
    </>
  );
}
