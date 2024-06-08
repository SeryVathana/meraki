import { Provider } from "react-redux";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import EmptyLayout from "./layouts/EmptyLayout";
import MainLayout from "./layouts/MainLayout";
import CreateGroupPage from "./pages/CreateGroupPage";
import CreatePostPage from "./pages/CreatePostPage";
import DashboardAdminPage from "./pages/DashboardAdminPage";
import DashboardGroupPage from "./pages/DashboardGroupPage";
import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardUserPage from "./pages/DashboardUserPage";
import DashboardReportPage from "./pages/DashboardReportPage";
import FolderPage from "./pages/FolderPage";
import GroupPage from "./pages/GroupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostDetailPage from "./pages/PostDetailPage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
import { store } from "./redux/store";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "./layouts/ProtectedLayout";
import PostsPage from "./pages/PostsPage";
import EditPostPage from "./pages/EditPostPage";
import UserSearchPage from "./pages/UserSearchPage";
import DashboardCategoriesPage from "./pages/DashboardCategoriesPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<EmptyLayout />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />

      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="users" element={<UserSearchPage />} />
          <Route path="tag/:tag" element={<PostsPage />} />
          <Route path="profile">
            <Route index element={<ProfilePage />} />
            <Route path="setting" element={<SettingPage />} />
          </Route>
          <Route path="create-post" element={<CreatePostPage />} />

          <Route path="create-group" element={<CreateGroupPage />} />
          <Route path="post/edit/:postId" element={<EditPostPage />} />
          <Route path="post/:postId" element={<PostDetailPage />} />
          <Route path="group/:groupId" element={<GroupPage />} />
          <Route path="user/:userId" element={<UserPage />} />

          <Route path="/folder/:id" element={<FolderPage />} />

          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="overview" element={<DashboardOverviewPage />} />
            <Route path="user" element={<DashboardUserPage />} />
            <Route path="report" element={<DashboardReportPage />} />
            <Route path="group" element={<DashboardGroupPage />} />
            <Route path="admin" element={<DashboardAdminPage />} />
            <Route path="categories" element={<DashboardCategoriesPage />} />
          </Route>
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  );
}

export default App;
