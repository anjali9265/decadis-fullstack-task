import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserList from "./pages/users/UserList";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

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
