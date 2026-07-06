import { Routes, Route } from "react-router-dom";
import Layout from "./components/site/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Fleet from "./pages/Fleet";
import Standards from "./pages/Standards";
import Corporate from "./pages/Corporate";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="fleet" element={<Fleet />} />
        <Route path="standards" element={<Standards />} />
        <Route path="corporate" element={<Corporate />} />
        <Route path="contact" element={<Contact />} />
        {/* Unknown paths fall back to the homepage. */}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
