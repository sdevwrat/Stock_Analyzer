import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Homepage from './containers/homepage';
import NavBar from './containers/navbar';
import ComparePage from './containers/compare';

function App() {
  return (
    <div style={{textAlign: "center"}}>
      <BrowserRouter>
        <NavBar />
          <Switch>
          <Route exact path="/" component={Homepage}/>
          <Route path="/compare" component={ComparePage}/>
        </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;
