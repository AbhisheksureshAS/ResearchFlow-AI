import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import CreateBlog from './pages/CreateBlog'
import Workflow from './pages/Workflow'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import NewBlog from './pages/NewBlog'
import Explore from './pages/Explore'
import PublicBlog from './pages/PublicBlog'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreateBlog />} />
          <Route path="workflow" element={<Workflow />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/new" element={<NewBlog />} />
          <Route path="blogs/:id" element={<BlogDetail />} />
          <Route path="explore" element={<Explore />} />
          <Route path="explore/:id" element={<PublicBlog />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
