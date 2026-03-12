import { Routes, Route } from "react-router-dom";
import MainMenu from "#components/MainMenu";
import BookNote from "#components/menu-button/continue/BookNote";
import RootLayout from "#layouts/RootLayout";

function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/book-note" element={<BookNote />} />
      </Routes>
    </RootLayout>
  );
}
export default App;
