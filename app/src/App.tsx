import { Routes, Route } from 'react-router'
import Landing from './pages/Landing'
import Menu from './pages/Menu'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/menu/:qrToken" element={<Menu />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/:tab" element={<Admin />} />
    </Routes>
  )
}
