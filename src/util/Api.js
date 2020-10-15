import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';

/**API接口类*/
export default class ApiUtil {
    constructor(ctx) {
        if (process.env.NODE_ENV === 'development') {
            // this.baseUrl = 'http://192.168.1.32:8001/v1';
            // this.baseUrl = 'http://47.96.116.7:8001/v1';/*正式服*/
            this.baseUrl = 'http://api.pan.qianyu.pro:8082/v1';/*测试服*/
        } else {
            this.baseUrl = 'http://47.96.116.7:8001/v1';/*正式服*/
            // this.baseUrl = 'http://api.pan.qianyu.pro:8082/v1';/*测试服*/
        }
        this.tokenUploadKey = this.baseUrl + '/token/upload?';/*获取文件上传凭证*/
        // this.uploadUrl = this.baseUrl + '/user/file/upload';/*小文件上传*/
        // this.uploadChunkFileUrl = this.baseUrl + '/user/file/uploadChunkFile';/*大文件上传*/
        this.filecoinUpload = "http://101.206.156.202:8520/uploadfile"; /*filecoin文件上传接口*/
        this.userInfoPic = this.baseUrl + '/user/header/upload';/*用户头像上传*/
        this.userFileDownloadUrl = this.baseUrl + '/user/file/download?';/*文件下载*/

        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': localStorage.getItem("token"),
            }
        });
        // 对响应数据做点什么
        this.axiosInstance.interceptors.response.use((response) => {
            message.destroy();
            if (response.data.status === 200) {
                return response;
            } else if (response.data.status === 401) {
                message.error(response.data.message);
                localStorage.removeItem('token');
                sessionStorage.removeItem('dataType');
                localStorage.setItem("isUpload", 'no');
                return window.location.hash = "#/login";
            } else if (response.data.status === 500) {
                return message.error(response.data.message)
            } else if (response.data.status === 502) {
                return message.error(response.data.message)
            } else {
                return message.error(response.data.message)
            }
        }, (error) => {
            message.destroy();
            return message.error(error.message)
        });
    }

    /**
     * 单例模式
     * ctx为传入的 vue-->this
     * @param ctx
     * @returns {ApiUtil}
     */
    static getInstance(ctx) {
        return ApiUtil.instance ? ApiUtil.instance : ApiUtil.instance = new ApiUtil(ctx);
    }

    /**刷新token*/
    refreshToken() {
        let token = localStorage.getItem("token");
        this.axiosInstance.defaults.headers.token = token ? token : "";
    }

    /** 获取用户信息*/
    userGetinfo(params) {
        return this.axiosInstance.get(`/user/getInfo`, { params: params });
    }

    // /*** 用户手机号登录 */
    // userLoginCode(params) {
    //     return this.axiosInstance.post(`/user/login/code`, qs.stringify(params));
    // }
    //
    // /*** 用户邮箱登录 */
    // userLoginMailCode(params) {
    //     return this.axiosInstance.post(`/user/login/mailCode`, qs.stringify(params));
    // }

    /**用户登录(邮箱/手机号)* */
    userLoginCodeAll(params) {
        return this.axiosInstance.post(`/user/login/all`, qs.stringify(params));
    }

    /**获取手机号验证码* */
    userVerifyCode(params) {
        return this.axiosInstance.get(`/user/verifyCode?`, { params: params });
    }

    /**获取邮箱验证码* */
    userMailVerifyCode(params) {
        return this.axiosInstance.get(`/user/mail/verifyCode?`, { params: params });
    }

    /** 创建文件夹*/
    folderCreate(params) {
        return this.axiosInstance.get(`/file/folder/create`, { params: params });
    }

    /*** 获取文件列表 */
    getFileList(params) {
        return this.axiosInstance.get(`/file/list`, { params: params });
    }

    /**文件分类获取**/
    fileCategorylist(params) {
        return this.axiosInstance.get(`/file/category/list?`, { params: params });
    }

    /***昵称修改*/
    userHeaderSetInfo(params) {
        return this.axiosInstance.get(`/user/setInfo?`, { params: params });
    }

    /***单个删除文件或者文件夹*/
    userfileOrFolderDeleteForever(params) {
        return this.axiosInstance.get(`/user/fileOrFolder/deleteForever?`, { params: params });
    }

    /***最近操作记录*/
    userRecordList(params) {
        return this.axiosInstance.get(`/user/record/list`, { params: params });
    }

    /***多个删除文件或者文件夹*/
    userfileOrFolderDeleteList(params) {
        return this.axiosInstance.post(`/file/deleteList`, qs.stringify(params));
    }

    /**文件搜索**/
    userFileSearch(params) {
        return this.axiosInstance.get(`/user/file/search`, { params: params });
    }

    /**文件操作**/
    userFileManager(params) {
        return this.axiosInstance.get(`/file/rename`, { params: params });
    }

    /**获取所有文件夹**/
    userFolderList(params) {
        return this.axiosInstance.get(`/file/folder/list`, { params: params });
    }

    /**获取文件上传凭证**/
    tokenUpload(params) {
        return this.axiosInstance.get(`/token/upload`, { params: params });
    }

    /**获取文件下载链接**/
    fileDownloadUrl(params) {
        return this.axiosInstance.get(`/file/download/url`, { params: params });
    }

    /**刪除最近記錄**/
    userRecordDeleteList(params) {
        return this.axiosInstance.post(`/user/record/deleteList`, qs.stringify(params));
    }

}
