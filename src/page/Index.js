import React, {Component} from 'react';
import moment from 'moment'
import {Table, message, Input, Menu,} from 'antd';
import NoData from "../component/NoData";
import Carousel, {Modal as ModalImage, ModalGateway} from 'react-images';
import ContentTop from '../component/ContentTop';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            images: [],
            fileMap: [],
            treeData: [],
            fileList: [],
            selectedKeys: [],
            selectedRowKeys: [],
            uploadCompletedArr: [],
            isOk: true,
            isSave: false,
            visible: false,
            isNextNew: false,
            showResults: false,
            renameStatus: false,
            fileListStatus: false,
            fileCopyAndMoveModal: false,
            path: '',
            menuData: {},
            pathName: '',
            menuStyle: {},
            searchNo: '',
            renameId: '',
            filesData: [],
            searchName: '',
            modalTitle: '',
            totalPages: '',
            totalElements: '',
            folderName: '新建文件夹',
            scrollerHeight: window.innerHeight - 235,
            BreadcrumbsList: [{name: '全部文件', parentId: 'all'}],
        };
    }

    getFileList = () => {
        console.log('列表接口');
    };

    onScrollHandle = () => {
        const scrollTop = this.scrollRef.scrollTop;
        const clientHeight = this.scrollRef.clientHeight;
        const scrollHeight = this.scrollRef.scrollHeight;
        const isBottom = scrollTop + clientHeight === scrollHeight;
        let {totalElements, fileList, path, page} = this.state;
        let dataType = sessionStorage.getItem('dataType');
        if (isBottom && fileList.length < totalElements && (dataType === 'index' || !dataType)) {
            this.getFileList({page: page + 1, size: 100, parentId: path || '0'});
        }
    };

    onSelectChange = selectedRowKeys => {
        if (typeof (selectedRowKeys[0]) !== "undefined") {
            this.setState({selectedRowKeys});
        } else {
            this.setState({selectedRowKeys: []});
        }
    };

    /*创建文件夹输入值*/
    onInputChange = (e) => {
        this.setState({folderName: e.target.value})
    };

    /*新建文件夹输入*/
    startFolder = () => {
        const {fileList, page, isNextNew} = this.state;
        if (isNextNew) {
            return
        }
        this.scrollRef.scrollTop = 0;
        this.setState({isNextNew: true});
        const newData = {
            fileName: <div style={{display: 'inline-block'}} key={'addFolder'}>
                <Input
                    className={'folder-input'}
                    placeholder="新建文件夹"
                    onChange={(e) => this.onInputChange(e)}
                />
                <img alt="img" className={'folderNameSave'} src={require(`../assets/img/save.png`)}
                     onClick={() => this.addFolderNameSave()}/>
                <img alt="img" className={'folderNameDelete'} src={require(`../assets/img/deletew.png`)}
                     onClick={() => this.addFolderNameCancel()}/>
            </div>
        };
        newData.suffixType = 'folder';
        this.setState({fileList: [newData, ...fileList], fileListStatus: false,});
    };

    /*创建文件夹保存*/
    addFolderNameSave = () => {
        let {folderName, path, isSave} = this.state;
        let dataType = sessionStorage.getItem('dataType');
        if (isSave) {
            return
        }
        this.setState({isSave: true});
        React.api.folderCreate({
            folderName: folderName.replace(new RegExp("/", "gm"), "") || '新建文件夹',
            parentId: path ? path : '0'
        }).then((res) => {
            if (res.data.status === 200) {
                this.setState({isNextNew: false, isSave: false});
                message.success({content: '创建成功!', duration: .3});
                if (dataType === 'all' || !dataType) {
                    typeof path !== "undefined" ? this.getFileList({
                        parentId: path,
                        page: 0,
                        size: 100
                    }) : this.getFileList();
                } else {
                    this.fileCategoryList({category: dataType, page: 0, size: 100});
                }
            }
        }).catch(() => {
        })
    };

    /*取消创建文件夹*/
    addFolderNameCancel = (id) => {
        let {pathName, path} = this.state;
        this.setState({isNextNew: false});
        this.getFileList(pathName !== '全部文件' ? {parentId: path, page: 0, size: 100} : null);
    };

    /*重命名保存*/
    renameSave = (obj) => {
        let name = this.state.folderName;
        let dataType = sessionStorage.getItem('dataType');
        let params = {indexId: obj.key, newName: name};
        React.api.userFileManager(params).then((res) => {
            if (dataType === 'all' || !dataType) {
                this.getFileList(this.state.pathName ? {parentId: this.state.path, page: 0, size: 100} : null);
            } else {
                this.fileCategoryList({category: dataType, page: 0, size: 100});
            }
        }).catch(() => {
        })
    };

    /*右键表格弹窗事件*/
    menuChange = ({key}, params) => {
        switch (key) {
            case '1':
            case params.contentType === 'folder':
                this.getFileList({parentId: params.id, name: params.fileName, page: 0, size: 100})
                break;
            case '2':
                if (params.contentType === 'folder') {
                    return message.warning('暂不支持文件夹下载！');
                }
                React.api.fileDownloadUrl({indexIds: params.id}).then((res) => {
                    React.util.downloadFile(res.data.data.ipfsUrlList[0], params.fileName);
                }).catch(() => {
                });
                break;
            case '3':
                this.setState({fileCopyAndMoveModal: true, modalTitle: '复制到', path: params.id});
                break;
            case '4':
                this.setState({fileCopyAndMoveModal: true, modalTitle: '移动到', path: params.id});
                break;
            case '5':
                this.setState({renameStatus: true, folderName: params.fileName, renameId: params.id});/*文件重命名*/
                break;
            case '6':
                let selectedRowKeys = this.state.selectedRowKeys;/*文件删除*/
                selectedRowKeys.push(params.id);
                this.setState({selectedRowKeys});
                this.delete();
                break;
            case '7':
                React.util.copyText(params);/*复制Hash*/
                break;
        }
    };

    /*查看图片*/
    viewImages = (id) => {
        let that = this;
        var t = null;
        /*连续触发点击事件, 在一定延迟内只执行一次*/
        if (t != null) {
            clearTimeout(t)
        }
        t = setTimeout(function () {
            React.api.fileDownloadUrl({indexIds: id}).then((res) => {
                let arr = [{source: res.data.data && res.data.data.ipfsUrlList && res.data.data.ipfsUrlList[0]}];
                that.setState({images: arr})
            }).catch(() => {
            });
        }, 100)
    };

    /*视频下载查看*/
    viewVideo = (obj) => {
        React.api.fileDownloadUrl({indexIds: obj.id}).then((res) => {
            res.data.data && res.data.data.ipfsUrlList.map((item) => {
                return React.util.downloadFile(item, obj.fileName);
            });
        }).catch(() => {
        });
        this.setState({selectedRowKeys: []})
    };

    /*关闭图片查看弹窗*/
    toggleModal = () => {
        this.setState({images: []});
    };

    render() {
        let {
            hasSelected, folderName, renameId,
            selectedRowKeys, searchName, BreadcrumbsList, fileList, fileListStatus, scrollerHeight, menuStyle, images, menuData, searchNo, renameStatus
        } = this.state;
        let PictureTyp = ['audio', 'folder', 'image', 'pdf', 'picture', 'ppt', 'text', 'video', 'word', 'zip', 'excel', 'png', 'xlxs', 'mp4', 'txt', 'doc'];
        const columns = [
            {
                title: '文件名',
                dataIndex: 'fileName',
                ellipsis: true,
                width: '30%',
                key: 'key',
                showSorterTooltip: false,
                sorter: (a, b) => {
                    let stringA = a.fileName.toUpperCase();
                    let stringB = b.fileName.toUpperCase();
                    if (stringA < stringB) {
                        return -1
                    }
                    if (stringA > stringB) {
                        return 1
                    }
                    return 0;
                },
                render: (text, obj) => {
                    let contentType = '';
                    for (let key in PictureTyp) {
                        if (PictureTyp[key] === obj.suffixType) {
                            contentType = PictureTyp[key];
                            break;
                        } else if (!obj.suffixType) {
                            contentType = 'folder'
                        } else {
                            contentType = 'other'
                        }
                    }
                    if (renameStatus && renameId === obj.id) {
                        return <div style={{display: 'inline-block'}} key={'addFolder'}>
                            <img alt={text} className={contentType === 'folder' ? 'folder-img file-type' : 'file-type'}
                                 src={require(`../assets/img/${contentType}.png`)}/>
                            <Input
                                className={'folder-input'}
                                value={folderName}
                                placeholder={text}
                                onChange={(e) => this.onInputChange(e)}/>
                            <img alt="img" className={'folderNameSave'} src={require(`../assets/img/save.png`)}
                                 onClick={() => this.renameSave(obj)}/>
                            <img alt="img" className={'folderNameDelete'} src={require(`../assets/img/deletew.png`)}
                                 onClick={() => this.addFolderNameCancel(obj.id)}/>
                        </div>
                    } else {
                        return <div style={{display: 'flex', alignItems: 'center'}}
                                    className={'site-dropdown-context-menu sortTitle'}>
                            <img alt={text}
                                 className={contentType === 'folder' ? 'folder-img file-type' : 'file-type'}
                                 src={require(`../assets/img/${contentType}.png`)}/>
                            <div>
                                <div className={'file-name'}>
                                <span className={'tableTitle'}
                                      onClick={obj.contentType === 'folder' ? () => this.getFileList({
                                          parentId: obj.id,
                                          name: obj.fileName,
                                          page: 0,
                                          size: 100
                                      }) : obj.category === 'image' ? () => {
                                          this.viewImages(obj.id)
                                      } : obj.category === 'video' ? () => {
                                          this.viewVideo(obj)
                                      } : null}>{text}</span></div>
                            </div>
                        </div>
                    }
                }
            },
            {
                title: 'HASH',
                dataIndex: 'hash',
                ellipsis: true,
                width: '35%',
                key: 'hash',
                showSorterTooltip: false,
                className: 'table-hash',
                sorter: (a, b) => {
                    return a.size - b.size
                },
                render: (text) => {
                    return <div><span className={'file-size'}>{text}</span></div>
                }
            },
            {
                title: '文件大小',
                dataIndex: 'size',
                ellipsis: true,
                key: 'size',
                showSorterTooltip: false,
                sorter: (a, b) => {
                    return a.size - b.size
                },
                render: (text) => {
                    return <div><span className={'file-size'}>{text ? React.util.sizeFormat(text) : '--'}</span></div>
                }
            },
            {
                title: '创建日期',
                dataIndex: 'createdTime',
                ellipsis: true,
                key: 'createdTime',
                showSorterTooltip: false,
                sorter: (a, b) => {
                    return new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
                },
                render: (text) => {
                    return <div><span className={'file-ctime'}>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span></div>
                }
            },
        ];
        let dataType = localStorage.getItem('dataType');
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className='mty-container'>
                <ContentTop
                    uploadBtn={true}
                    downloadBtn={true}
                    SearchInput={true}
                    allFiles={true}
                    fileList={fileList}
                    getFileList={this.getFileList}
                    startFolder={this.startFolder}
                    BreadcrumbsList={BreadcrumbsList}
                    searchName={searchName}
                    selectedRowKeys={selectedRowKeys}
                    hasSelected={hasSelected}
                />
                {!fileListStatus ?
                    <div className={'main-content'} key={'main-content'}
                         style={{height: scrollerHeight, overflowY: 'scroll'}}
                         ref={c => {
                             this.scrollRef = c;
                         }}
                         onScrollCapture={() => this.onScrollHandle()}
                    >
                        <Table
                            onRow={record => {
                                return {
                                    onClick: (e) => this.onSelectChange([record.id]),
                                    onDoubleClick: (e) => {
                                        if (record.contentType === 'folder') {
                                            return this.getFileList({
                                                parentId: record.id,
                                                name: record.fileName,
                                                page: 0,
                                                size: 100
                                            })
                                        } else {
                                            return this.viewImages(record.id);
                                        }
                                    },
                                    onContextMenu: (e) => this.onContextMenu(e, record),
                                };
                            }}
                            rowSelection={rowSelection}
                            pagination={false}
                            columns={columns}
                            dataSource={fileList}/>
                        <ModalGateway>
                            {images.length !== 0 ? (
                                <ModalImage onClose={this.toggleModal}>
                                    <Carousel views={images}/>
                                </ModalImage>
                            ) : null}
                        </ModalGateway>
                        <Menu style={menuStyle} id="menu"
                              onClick={({key}) => this.menuChange({key}, menuData)}>
                            <Menu.Item key="1"
                                       disabled={menuData.contentType !== 'folder'}>打开</Menu.Item>
                            <Menu.Item key="2">下载</Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="3" disabled={true}>复制到</Menu.Item>
                            <Menu.Item key="4" disabled={true}>移动到</Menu.Item>
                            <Menu.Item key="7">复制Hash</Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="5">重命名</Menu.Item>
                            <Menu.Item key="6">删除</Menu.Item>
                        </Menu>
                    </div> : <NoData type={searchNo ? 'searchNo' : dataType}/>}
            </div>
        )
    }
}
