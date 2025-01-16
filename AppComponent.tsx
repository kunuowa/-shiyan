import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.tsx';
import TesterDashboard from './pages/TesterDashboard.tsx';
import SubjectInterface from './pages/SubjectInterface.tsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to the Evaluation System</h1>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/tester" element={<TesterDashboard />} />
        <Route path="/subject" element={<SubjectInterface />} />
      </Routes>
    </Router>
  );
};

export default App;
