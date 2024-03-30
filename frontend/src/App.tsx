import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SettingPage from './pages/SettingPage';
import CreatePostPage from './pages/CreatePostPage';
import LoginPage from './pages/LoginPage';
import { AuthContextProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import GroupPage from './pages/GroupPage';
import UserPage from './pages/UserPage';
import CreateGroupPage from './pages/CreateGroupPage';
import FolderPage from './pages/FolderPage';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='register' element={<RegisterPage />} />
      <Route path='profile'>
        <Route
          index
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='setting'
          element={
            <ProtectedRoute>
              <SettingPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path='create-post'
        element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        }
      />

      <Route
        path='create-group'
        element={
          <ProtectedRoute>
            <CreateGroupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='post'
        element={
          <ProtectedRoute>
            <PostDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='group'
        element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='user'
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />

      <Route
        path='folder'
        element={
          <ProtectedRoute>
            <FolderPage />
          </ProtectedRoute>
        }
      />

      <Route path='/*' element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
