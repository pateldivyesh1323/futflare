import { Route, Routes } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar'
import { useUserAuth } from './providers/UserAuthProvider';
import Home from './pages/Home';
import Introduction from './pages/Introduction';

function App() {

  const { getAccessToken } = useUserAuth();

  const handleGetToken = async () => {
    const token = await getAccessToken();
    console.log(token);
  }

  return (
    <main>
      <Navbar />
      <button onClick={handleGetToken}>Get token</button>
      <Routes>
        <Route path='/' element={<Introduction />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </main>
  )
}

export default App
