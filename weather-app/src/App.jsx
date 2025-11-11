import { Routes, Route } from "react-router-dom";
import WeatherLookup from './pages/WeatherLookup';
import WeatherDisplay from './pages/WeatherDisplay';
import Header from "./components/Header";
import Footer from "./components/Footer";
import './assets/css/App.css'

function App() {

  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<WeatherLookup/>}></Route>
        <Route path="/weather" element={<WeatherDisplay/>}></Route>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
