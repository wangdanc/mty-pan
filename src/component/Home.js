import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import HeaderBase from './HeaderBase';
import AsideBase from './AsideBase';
import ContentRouter from '../route/ContentRouter';
import {Layout} from 'antd';

const {Content} = Layout;
export default class Home extends Component {
    render() {
        return (
            <Layout className="mt-layout-content">
                <HeaderBase props={this.props}/>
                <Layout>
                    <AsideBase props={this.props}/>
                    <Layout className="layout-content">
                        <Content>
                            <Switch>
                                {ContentRouter.map((item, index) =>
                                    <Route path={item.path} component={item.component} key={index}/>
                                )}
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
