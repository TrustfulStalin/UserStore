import { Routes, Route } from 'react-router-dom';
import AddGameForm from './Addform';
import DisplayData from './Display';
import Login from './Login';
import Register from './Registar';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/add" element={<AddGameForm />} />
      <Route path="/formdata" element={<DisplayData />} />
    </Routes>
  );
};

export default App;