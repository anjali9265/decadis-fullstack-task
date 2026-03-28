import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UserList from "./pages/users/UsersList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
