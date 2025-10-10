// src/App.tsx
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home} from './pages/Home'
import {About} from './pages/About'
import {Contact} from './pages/Contact'
import {ArtistsList} from './pages/ArtistsList'
import {WorkList} from './pages/WorkList'
import {WorkDetailed} from './pages/WorkDetailed'
import {ArtistDetailed} from './pages/ArtistDetailed'
import './styles/App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* basic */}
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<ArtistsList />} />
        <Route path="/works" element={<WorkList />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* detailed */}
        <Route path="/works/:slug" element={<WorkDetailed />} />
        <Route path="/people/:slug" element={<ArtistDetailed />} />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
