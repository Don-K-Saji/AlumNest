import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import ViewAlumni from './pages/student/ViewAlumni';
import PublicAlumniProfile from './pages/student/PublicAlumniProfile';
import CreateQuery from './pages/student/CreateQuery';
import StudentQueries from './pages/student/StudentQueries';
import QueryDetails from './pages/student/QueryDetails';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentProfile from './pages/student/StudentProfile';

import AlumniLayout from './pages/alumni/AlumniLayout';
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import QueryFeed from './pages/alumni/QueryFeed';
import AlumniProfile from './pages/alumni/AlumniProfile';
import AlumniNotifications from './pages/alumni/AlumniNotifications';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyUsers from './pages/admin/VerifyUsers';
import ManageUsers from './pages/admin/ManageUsers';
import AdminSettings from './pages/admin/AdminSettings';

import Leaderboard from './pages/common/Leaderboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="alumni" element={<ViewAlumni />} />
          <Route path="alumni/:id" element={<PublicAlumniProfile />} />
          <Route path="create-query" element={<CreateQuery />} />
          <Route path="queries" element={<StudentQueries />} />
          <Route path="queries/:id" element={<QueryDetails />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>

        {/* Alumni Routes */}
        <Route path="/alumni" element={<AlumniLayout />}>
          <Route path="dashboard" element={<AlumniDashboard />} />
          <Route path="feed" element={<QueryFeed />} />
          <Route path="profile" element={<AlumniProfile />} />
          <Route path="notifications" element={<AlumniNotifications />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="verify-users" element={<VerifyUsers />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
