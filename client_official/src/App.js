import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import MainHeader from "./components/main_header/MainHeader";
import Pages from "./components/main_pages/Pages";
import OfficialFooter from "./components/official_footer/OfficialFooter";

function App() {
  return (
    <>
      <DataProvider>
        <Router>
          <div>
            <MainHeader></MainHeader>
            <Pages></Pages>
            <OfficialFooter />
          </div>
        </Router>
      </DataProvider>
    </>
  );
}

export default App;
