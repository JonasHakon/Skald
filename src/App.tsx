// src/App.tsx
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home} from './pages/Home'
import {AboutUs} from './pages/AboutUs'
import {PeopleList} from './pages/PeopleList'
import {WorkList} from './pages/WorkList'
import {WorkDetailed} from './pages/WorkDetailed'
import {PeopleDetailed} from './pages/PeopleDetailed' // (rename from "PeapleDetailed" if needed)
import './styles/App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* basic */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/people" element={<PeopleList />} />
        <Route path="/works" element={<WorkList />} />

        {/* detailed */}
        <Route path="/works/:slug" element={<WorkDetailed />} />
        <Route path="/people/:slug" element={<PeopleDetailed />} />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
