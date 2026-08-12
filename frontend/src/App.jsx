import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ScannerScreen from "./components/ScannerScreen";
import ProtectedRoute from './components/ProtectedRoute';
import History from './components/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/scanner" element={
    <ProtectedRoute><ScannerScreen /></ProtectedRoute>
  } />
  <Route path="/history" element={
    <ProtectedRoute><History /></ProtectedRoute>
  } />
</Routes>

    </BrowserRouter>
  );
}

export default App;
