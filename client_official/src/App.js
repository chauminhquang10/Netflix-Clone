import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import MainHeader from "./components/main_header/MainHeader";
import Pages from "./components/main_pages/Pages";
import Footer from "./components/Footer2/Footer";

function App() {
  return (
    <>
      <DataProvider>
        <Router>
          <div>
            <MainHeader></MainHeader>
            <Pages></Pages>
            <Footer />
          </div>
        </Router>
      </DataProvider>
    </>
  );
}

export default App;
