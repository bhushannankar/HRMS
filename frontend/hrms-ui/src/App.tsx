import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import Holidays from './pages/Holidays';
import Recruitment from './pages/Recruitment';
import Training from './pages/Training';
import Performance from './pages/Performance';
import Assets from './pages/Assets';
import Projects from './pages/Projects';
import Events from './pages/Events';
import Awards from './pages/Awards';
import Documents from './pages/Documents';
import Tickets from './pages/Tickets';
import Complaints from './pages/Complaints';
import Expenses from './pages/Expenses';
import Travel from './pages/Travel';
import Reports from './pages/Reports';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/holidays" element={<Holidays />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/training" element={<Training />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/events" element={<Events />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
