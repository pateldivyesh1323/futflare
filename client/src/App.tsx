import { Route, Routes } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <main>
      <Navbar />
      <Routes>
        <Route path='/' element={<Introduction />} />
        <Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
      </Routes>
    </main>
  )
}

export default App
