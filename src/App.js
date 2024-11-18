import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./components/Home";
import { Information } from "./components/Information";

function App() {
  // this allows us to navigate to whatever url path we want by calling navigate('your-path') -> localhost:3000/your-path
  const navigate = useNavigate();

  return (
    <div>
      <h1>My App</h1>
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={() => navigate('/information')}>Information</button>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="information" element={<Information />} />
      </Routes>
    </div>
  );
}

export default App;
