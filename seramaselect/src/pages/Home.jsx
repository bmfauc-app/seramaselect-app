
import TopToolBar from '../components/TopToolBar'
import TitleSection from '../components/TitleSection'
import DashboardOverview from '../components/DashboardOverview'
import QuickActions from '../components/QuickActions'
import DailyFunFact from '../components/DailyFunFact'
import ClosingStatement from '../components/ClosingStatement'
import Footer from '../components/Footer'
import { useTraitData } from '../contexts/TraitContext'

export default function Home() {
  const { records } = useTraitData();

  // Calculate real stats from records
  const calculateStats = () => {
    if (!records || records.length === 0) {
      return {
        totalBirds: 0,
        traditionalCount: 0,
        ayamCount: 0,
        modernCount: 0,
        undeterminedCount: 0,
        chicks: 0,
        growouts: 0,
        breeders: 0,
        broodHens: 0,
        exhibition: 0,
        activeOther: 0,
        activeTotal: 0,
        inactiveBirds: 0,
        hatches: 0,
        likes: 0,
        views: 0
      };
    }

    // Count by classification type (CT) - default to Undetermined if no CT
    const traditionalCount = records.filter(r => r.ct === 'Traditional/American').length;
    const ayamCount = records.filter(r => r.ct === 'Ayam' || r.ct === 'Ayam (Malaysian)').length;
    const modernCount = records.filter(r => r.ct === 'Modern' || r.ct === 'Modern Malaysian').length;
    const undeterminedCount = records.filter(r => !r.ct || r.ct === 'Undetermined' || r.ct === '').length;

    // Helper function to determine if status is active
    const isActiveStatus = (record) => {
      const activeStatuses = ['Breeder', 'Growout', 'Chick', 'Brood Hen', 'Exhibition', 'Active'];
      if (activeStatuses.includes(record.status)) return true;
      if (record.status === 'Other' && record.otherCategory === 'active') return true;
      return false;
    };

    // Count by status categories
    const chicks = records.filter(r => r.status === 'Chick').length;
    const growouts = records.filter(r => r.status === 'Growout').length;
    const breeders = records.filter(r => r.status === 'Breeder').length;
    const broodHens = records.filter(r => r.status === 'Brood Hen').length;
    const exhibition = records.filter(r => r.status === 'Exhibition').length;
    const activeOther = records.filter(r => 
      (r.status === 'Active') || 
      (r.status === 'Other' && r.otherCategory === 'active')
    ).length;
    
    const activeTotal = records.filter(r => isActiveStatus(r)).length;
    const inactiveBirds = records.filter(r => !isActiveStatus(r)).length;

    return {
      totalBirds: records.length, // Total count of all birds in records
      traditionalCount,
      ayamCount,
      modernCount,
      undeterminedCount,
      chicks,
      growouts,
      breeders,
      broodHens,
      exhibition,
      activeOther,
      activeTotal,
      inactiveBirds,
      hatches: 0, // Coming soon feature
      likes: 0,   // Coming soon feature
      views: 0    // Coming soon feature
    };
  };

  const stats = calculateStats();

  return (
    <div>
      <TopToolBar />
      <main>
        <TitleSection />
        <DashboardOverview stats={stats} />
        <QuickActions />
        <DailyFunFact />
        <ClosingStatement />
      </main>
      <Footer />
    </div>
  )
}
