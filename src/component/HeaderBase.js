import React, {Component} from 'react'
import {Modal, Row, Col, Button, Input, message, Upload, Avatar, Layout} from 'antd';
import Reche from 'reche';

const {Header} = Layout;

export default class HeaderBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            visibleName: false,
            nickName: localStorage.getItem("nickName") || '新用户',
            modifyName: '',
        };
        this.uploadFileConfig = {
            showUploadList: false,
            multiple: false,
            accept: 'png,jpg,jpeg',
            beforeUpload: (file, fileList) => {
                this.upload(fileList)
            },
        };
        this.state.fr = new Reche({
            path: React.api.userInfoPic,
            headers: {
                'token': localStorage.getItem("token"),
            },
            fdKey: {
                fileKey: 'file',
                chunkKey: 'chunk',
                chunksKey: 'chunks',
                indexKey: 'index.js',
                fileName: "fileName",
            },
        }).on('fileAppend', (e) => {
        }).on('fileCompleteAll', (e) => {
            localStorage.setItem('userImg', JSON.parse(e.response).data.header);
            message.success('头像更改成功~');
            this.setState({visible: false})
        });
    }

    /*修改昵称*/
    changeName = () => {
        this.setState({
            visibleName: true,
            nickName: localStorage.getItem("nickName"),
            modifyName: localStorage.getItem("nickName")
        })
    };

    changeNameValue = (e) => {
        this.setState({modifyName: e.target.value})
    };

    /*更改昵称提交*/
    changeNameOk = () => {
        React.api.userHeaderSetInfo({nickName: this.state.modifyName}).then((res) => {
            if (res.data.status === 200) {
                localStorage.setItem('nickName', res.data.data.nickName);
                message.success('更改昵称成功~');
                this.setState({visibleName: false, nickName: this.state.modifyName})
            }
        }).catch((err) => {
            console.log(err);
        })
    };

    /*修改头像*/
    changePic = () => {
        this.setState({visible: true})
    };

    /*上传头像*/
    upload = (fileList) => {
        this.state.fr.reche({
            files: fileList
        });
        this.setState({visible: true})
    };

    handleOk = () => {
        message.warning('请选择头像上传！')
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            visibleName: false,
            nickName: localStorage.getItem("nickName"),
        });
    };

    clientDownloads = () => {
        window.open('https://app.mtfs.top/down/pan-down/downpage.html');
    };

    /*退出登录*/
    signOut = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        sessionStorage.removeItem('dataType');
        this.props.props.history.push({pathname: '/login'})
    };

    render() {
        let {visible, visibleName, nickName, modifyName} = this.state;
        let userImg = localStorage.getItem('userImg') || require("../assets/img/user-mrtx.png");
        /*处理 Input 动态添加或者删除suffix时，React重新创建DOM结构而导致input失去焦点*/
        let suffix = nickName && nickName.length !== 0 ? nickName.length + '/15' : <span/>;
        return (
            <Header className="layout-header">
                <div>
                    <img src={require("../assets/img/index-logo.png")} alt=""/>
                </div>
                <div className="layout-header-content">
                    <div className="layout-header-title">
                        <div><span className={'nav-active'}>云盘</span></div>
                        <div style={{marginLeft: 47, cursor: 'pointer'}} onClick={() => {
                            this.clientDownloads()
                        }}><span>客户端下载</span></div>
                    </div>
                    <div className={'layout-header-user'}>
                        <div className={'layout-user-header'}>
                            <Avatar style={{cursor: 'pointer'}} className={'user-header-avatar'}
                                    onClick={() => this.changePic()} src={userImg}/>
                        </div>
                        <div className={'layout-user-profile'}>
                            <span className={'layout-user-name'} onClick={() => this.changeName()}>{nickName}</span>
                            <div className="nav-user-dropdown-wrap" onClick={() => this.signOut()}>退出登录</div>
                        </div>
                    </div>
                </div>
                <Modal
                    title="更换头像"
                    visible={visible}
                    centered
                    width={650}
                    footer={null}
                    maskClosable={false}
                    onCancel={() => this.handleCancel()}>
                    <div className={'header-upload-modal'}>
                        <Row className={'header-upload-item'}>
                            <Col span={12}>
                                <Row className={'header-upload-itema'}>
                                    <Col className={'header-upload-itema-a'} span={7}>
                                        <Upload {...this.uploadFileConfig}>上传头像</Upload>
                                    </Col>
                                    <Col span={17} className={'header-upload-itema-b'}>支持jpg,png,bmp格式,且小于5M</Col>
                                </Row>
                                <Upload {...this.uploadFileConfig}>
                                    <Row className={'header-upload-itemb'}>
                                        <Col span={24} className={'header-upload-itemb-a'}>
                                            <img src={require("../assets/img/b-upload.png")} alt="pic"/>
                                            <span>选择一张本地图片然后再上传</span>
                                        </Col>
                                    </Row>
                                </Upload>
                            </Col>
                            <Col span={12} className={'header-upload-pic'}>
                                <Row className={'header-upload-pic-title'}>头像预览</Row>
                                <Row className={'header-upload-pic-big'}>
                                    <Avatar src={userImg}/>
                                </Row>
                                <Row className={'header-upload-pic-content'}>大尺寸头像(120×120像素)</Row>
                                <Row className={'header-upload-pic-small'}>
                                    <Avatar src={userImg}/>
                                </Row>
                                <Row className={'header-upload-pic-content'}>小尺寸头像(60×60像素)</Row>
                            </Col>
                        </Row>
                        <Row className={'header-upload-itemc'} style={{marginRight: 15}}>
                            <Col span={2} offset={17}>
                                <Button
                                    style={{background: '#eee', color: '#fff'}}
                                    className={'header-upload-itemc-btn'}
                                    onClick={() => this.handleCancel()}>取消</Button>
                            </Col>
                            <Col span={2} offset={3}>
                                <Button type="primary" onClick={() => this.handleOk()}>保存</Button>
                            </Col>
                        </Row>
                    </div>
                </Modal>
                <Modal
                    title="修改昵称"
                    visible={visibleName}
                    centered
                    width={650}
                    footer={null}
                    maskClosable={false}
                    onCancel={() => this.handleCancel()}>
                    <div className={'header-modifyName-modal'}>
                        <Avatar className={'header-modifyName-userImg'}
                                src={userImg || require("../assets/img/user-mrtx.png")}/>
                        <Input onChange={(e) => this.changeNameValue(e)}
                               value={modifyName}
                               maxLength={15}
                               suffix={suffix}
                               placeholder={'请输入新的昵称'}
                               className={'header-modifyName-input'}
                        />
                    </div>
                    <div className={'header-modifyName-btn'}>
                        <Button className={'header-modifyName-cancel'}
                                style={{color: '#fff'}}
                                onClick={() => this.handleCancel()}>取消</Button>
                        <Button type="primary" onClick={() => this.changeNameOk()}>保存</Button>
                    </div>
                </Modal>
            </Header>
        )
    }
}
