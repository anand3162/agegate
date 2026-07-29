import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ScannerScreen from "./components/ScannerScreen";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/scanner"
          element={
            <ProtectedRoute>
              <ScannerScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
