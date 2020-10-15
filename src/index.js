import 'antd/dist/antd.css'
import '../src/assets/css/base.css';
import '../src/assets/css/ant-cus.css';
import '../src/assets/css/asideBase.css';
import '../src/assets/css/headerBase.css';
import '../src/assets/css/contentTop.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Switch} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import FrontendAuth from './route/FrontendAuth';
import routerMap from './route/RouterMap';
import CommonUtil from './util/CommonUtil';
import Api from './util/Api';

React.api = Api.getInstance(React);
React.util = CommonUtil.getInstance(React);
localStorage.setItem('token', 'dsadsadfasdfa');
ReactDOM.render(
    <div className='mt-yp-app'>
        <Router>
            <Switch>
                <FrontendAuth routerConfig={routerMap}/>
            </Switch>
        </Router>
    </div>,
    document.getElementById('root')
);
serviceWorker.unregister();
