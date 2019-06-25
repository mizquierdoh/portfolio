import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

//Estilos
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

//Componentes
import App from './components/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Router history={createBrowserHistory()}>
        <App />
        {/* <Switch>
            <Route exact path='/' render={() => <App />} />
            <Route path='/banda/:banda' component={<Header><Banda /></Header>} />
            <Route path="/now" render={() => <Now />} />
        </Switch> */}
    </Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
