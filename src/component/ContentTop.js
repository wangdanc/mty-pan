import React, {Component} from 'react';
import {Button, Modal, Input, Breadcrumb, Menu, Dropdown} from 'antd';

export default class ContentTop extends Component {
    constructor(props) {
        super(props);
    }

    multipartUpload = (id) => {
        debugger
    };

    /*新建文件夹*/
    startFolder = () => {
        this.props.startFolder();
    };

    onSearchEvent = (value) => {/*搜索*/
        debugger
    };

    getFileList = () => {/*数据列表*/
        debugger
    };

    render() {
        let {uploadBtn, downloadBtn, SearchInput, BreadcrumbsList, hasSelected, selectedRowKeys, searchName, fileList} = this.props;
        let dataType = localStorage.getItem('dataType');
        let titleName = (dataType === 'index' || !dataType) ? '全部文件' : dataType === 'image' ? '全部图片' : dataType === 'video' ? '全部视频' : dataType === 'text' ? '全部文档' : '其他文件';
        const menu = (<Menu className={'upload-menu-select'}>
            <Menu.Item key='1'>
                <label className={'upload-menu-select-item'} style={{cursor: "pointer"}} htmlFor="files-up">上传文件</label>
                <input type="file" multiple accept="*/*" style={{display: "none"}} id="files-up"
                       onChange={() => this.multipartUpload("files-up")}/>
            </Menu.Item>
            <Menu.Item key='2'>
                <label className={'upload-menu-select-item'} style={{cursor: "pointer"}}
                       htmlFor="folder-up">上传文件夹</label>
                <input type="file" multiple accept="*/*" style={{display: "none"}} id="folder-up" webkitdirectory="true"
                       onInput={() => this.multipartUpload("folder-up")}/>
            </Menu.Item>
        </Menu>);
        return (
            <div className='content-tool-bar'>
                <div className='tool-btn-wrap'>
                    <div className='tool-btn-left'>
                        {
                            uploadBtn ? <Dropdown overlay={menu} disabled={hasSelected}>
                                <Button
                                    className={'upload-btn'}
                                    type="primary"
                                    size={'large'}
                                    htmlFor="files-up"
                                    style={!hasSelected ? {cursor: "pointer"} : {cursor: "no-drop"}}>
                                    <img
                                        src={!hasSelected ? require('../assets/img/icon-upload.png') : require('../assets/img/icon-upload2.png')}
                                        alt=""/>上传
                                    <input className="plupload btn-upload-dss" value="" multiple={true}
                                           type={hasSelected ? '' : "file"} id="file"
                                           onChange={() => this.multipartUpload("file")}/>
                                </Button>
                            </Dropdown> : ''
                        }
                        {
                            downloadBtn ? <div
                                className={selectedRowKeys.length === 1 ? 'download-btn download-btn-active' : 'download-btn'}
                                onClick={selectedRowKeys.length === 1 ? () => this.download() : null}>
                                <img
                                    src={selectedRowKeys.length === 1 ? require('../assets/img/download2-d.png') : require('../assets/img/download-d.png')}
                                    alt=""/>下载
                            </div> : ''
                        }
                        {
                            selectedRowKeys.length === 0 && (dataType === 'index' || !dataType) ?
                                <div
                                    className={hasSelected ? 'btn-new-folder btn-new-folder-active' : 'btn-new-folder'}
                                    onClick={!hasSelected ? () => this.startFolder() : null}>
                                    <img src={require('../assets/img/new.png')} alt=""/>新建文件夹
                                </div> : ''
                        }
                        {
                            selectedRowKeys.length !== 0 ?
                                <div
                                    className={hasSelected ? 'btn-new-folder-delete btn-new-folder-delete-active' : 'btn-new-folder-delete'}
                                    onClick={() => this.delete()}>
                                    <img src={require('../assets/img/sc2-delete.png')} alt=""/>删除
                                </div> : ''
                        }
                    </div>
                    {
                        SearchInput ? <div className={'input-search'}>
                            <Input placeholder="通过Hash、文件名，搜索您的文件"
                                   onChange={(e) => {
                                       this.searchChange(e.target.value)
                                   }}
                                   style={{background: '#fafafa'}}
                                   onPressEnter={value => this.onSearchEvent(value.target.value)}
                                   className={'input-search-i'}/>
                            <img onClick={() => {
                                this.onSearchEvent(searchName)
                            }} src={require('../assets/img/search.png')} alt=""/>
                        </div> : ''
                    }
                </div>
                {
                    dataType === 'index' || !dataType ?
                        <Breadcrumb separator=">">
                            {BreadcrumbsList.map((item, index) =>
                                <Breadcrumb.Item
                                    style={BreadcrumbsList.length <= 2 ? {
                                        color: 'rgba(0, 0, 0, 0.45)'
                                    } : {
                                        color: '#0182FE',
                                        cursor: 'pointer'
                                    }}
                                    onClick={BreadcrumbsList.length <= 1 ? null : () => this.getFileList({parentId: item.parentId}, index)}
                                    key={index}>{item.name}</Breadcrumb.Item>
                            )}
                        </Breadcrumb> : ''
                }
                <div className={'tool-btn-wraps'}>
                    <span className={'title'}>{titleName}</span>
                    <span className={'content'}>共{fileList.length}个</span>
                    <span className={'content'}
                          style={{marginLeft: 8}}>{hasSelected ? `已选中 ${selectedRowKeys.length} 个` : ''}</span>
                </div>
            </div>
        )
    }
}
