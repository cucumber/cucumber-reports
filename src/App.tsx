import { Route, Routes } from 'react-router-dom'

import { Footer } from './components/Footer.tsx'
import { Masthead } from './components/Masthead.tsx'
import ScrollToTop from './components/ScrollToTop'
import Faqs from './routes/Faqs'
import Home from './routes/Home'
import Report from './routes/Report'
import Terms from './routes/Terms'

function App() {
  return (
    <>
      <ScrollToTop />
      <Masthead />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/reports/:id" element={<Report />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
