import { Routes, Route } from 'react-router-dom'
import Home from './routes/Home'
import Faqs from './routes/Faqs'
import Terms from './routes/Terms'
import Report from './routes/Report'
import {Masthead} from "./components/Masthead.tsx";
import {Footer} from "./components/Footer.tsx";
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
      <>
          <ScrollToTop />
          <Masthead/>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/reports/:id" element={<Report />} />
          </Routes>
          <Footer/>
      </>
  )
}

export default App
