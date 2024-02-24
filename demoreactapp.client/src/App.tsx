import "./App.css";
import { Provider } from "react-redux";
import { store } from "./ReduxStore/Store/RootStore";
import { BingSearch } from "./BingSearch/BingSearch";

function App() {
  return (
    <Provider store={store}>
      <div className="main">
        <BingSearch></BingSearch>
      </div>
    </Provider>
  );
}

export default App;
