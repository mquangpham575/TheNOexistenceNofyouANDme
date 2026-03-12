import { Routes, Route } from "react-router-dom";
import MainMenu from "#components/MainMenu";
import BookNote from "#components/menu-button/continue/BookNote";
import RootLayout from "#layouts/RootLayout";
import LoginPage from "#pages/LoginPage";
import RegisterPage from "#pages/RegisterPage";
import ProfilePage from "#pages/ProfilePage";
import ProtectedRoute from "#components/ProtectedRoute";

function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/book-note" element={<BookNote />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </RootLayout>
  );
}
export default App;
