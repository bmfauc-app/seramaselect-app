
import TopToolBar from '../components/TopToolBar'
import Footer from '../components/Footer'

export default function ComingSoon({ label }) {
  return (
    <div>
      <TopToolBar />
      <main>
        <h1>{label}</h1>
        <p>Coming Soon! This feature is under development.</p>
      </main>
      <Footer />
    </div>
  )
}
