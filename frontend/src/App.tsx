import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import CreatePostPage from "./pages/CreatePostPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="profile">
        <Route index element={<ProfilePage />} />
        <Route path="setting" element={<SettingPage />} />
      </Route>
      <Route path="create-post" element={<CreatePostPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
