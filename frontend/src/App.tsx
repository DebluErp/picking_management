import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'; // สมมุติคุณเก็บไว้ใน /pages/Login.jsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
