import React, {Component} from 'react';
import {Layout, Menu, Progress} from 'antd';
import Store from '../store/index';
import CommonUtil from "../util/CommonUtil";

const {Sider} = Layout;

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: Store.getState().userInfo,
            isActiveMenu: localStorage.getItem('dataType') || 'index'
        };
        Store.subscribe(this.handleStoreUpdate.bind(this))/*订阅数据的修改*/
    }

    handleStoreUpdate = () => {
        this.setState(Store.getState())
    };

    handleClick = (e) => {
        localStorage.setItem('dataType', e.key);
        this.setState({isActiveMenu: e.key});
        this.props.props.history.push({pathname: '/' + e.key})
    };

    render() {
        let category = [
            {name: '全部文件', key: 'index', className: ' sub-menu-icon1'},
            {name: '图片', key: 'image', className: ' sub-menu-item'},
            {name: '视频', key: 'video', className: ' sub-menu-item'},
            {name: '文档', key: 'text', className: ' sub-menu-item'},
            {name: '其他', key: 'other', className: ' sub-menu-item'},
            {name: '任务记录', key: 'task', className: ' sub-menu-icon2'},
        ];
        let {userInfo, isActiveMenu} = this.state;
        let percent = userInfo && (userInfo.used) / (userInfo.capacity) * 100;
        percent = percent < 1 ? 0.5 : percent;

        return (
            <Sider width={220} className="site-layout-sider">
                <div className={'mt-yp-asides'}>
                    <div className={'nav-category'}>
                        <Menu
                            onClick={this.handleClick}
                            mode="inline"
                            selectedKeys={[isActiveMenu]}>
                            {category.map((item) =>
                                <Menu.Item
                                    key={item.key}
                                    className={isActiveMenu === item.key ? isActiveMenu + item.className : item.className}>
                                    {item.name}
                                </Menu.Item>)}
                        </Menu>
                    </div>
                    <div className={'aside-footer'}>
                        <Progress percent={percent} showInfo={false} strokeWidth={12}/>
                        <div className={'mem-info'}>
                            <span>已用</span>
                            <span
                                className={'color-0182FE'}>{CommonUtil.getfilesize(userInfo && userInfo.used)}</span>
                            <span>/共{CommonUtil.getfilesize(userInfo && userInfo.capacity)}</span>
                        </div>
                    </div>
                </div>
            </Sider>
        )
    }
}
