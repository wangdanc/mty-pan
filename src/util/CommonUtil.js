//公用方法
import React from "react";
import Store from '../store/index';

export default class CommonUtil {
    /**
     * 单例模式
     * @param ctx
     * @returns {CommonUtil}
     */
    static getInstance(ctx) {
        return CommonUtil.instance ? CommonUtil.instance : CommonUtil.instance = new CommonUtil(ctx);
    }

    /**
     * 获取url后面?及其以后的参数
     * ?param1='1'&param2='2'
     * @param search
     * @param name
     * @returns {any}
     */
    getSearchParam(search, name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = search.substr(1).match(reg);
        return r !== null ? decodeURI(r[2]) : null;
    }

    /**
     * 获取url中后参数
     * @param name
     * @returns {any}
     */
    getUrlParam(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        return r !== null ? decodeURI(r[2]) : null;
    }

    /**
     * 文件大小单位标准化
     * size：字节大小 KB/M/G
     * @param size
     * @returns {string}
     */
    static sizeFormat(size) {
        if (size <= 0) {
            return '--'
        }
        //转为基础Kb
        size = (size / 1024).toFixed(1);
        if (size < 1024) {//kb
            return size + 'KB'
        } else if (size >= 1024 && size < 1024 * 1024) {
            return (size / 1024).toFixed(1) + 'M'
        } else {
            return (size / 1024 / 1024).toFixed(1) + 'G'
        }
    }

    /**单位大小换算**/
    static getfilesize(size) {
        if (size <= 0)
            return '--';
        var num = 1024.00; //byte
        if (size < num)
            return size + "B";
        if (size < Math.pow(num, 2))
            return (size / num).toFixed(1) + "K";
        if (size < Math.pow(num, 3))
            return (size / Math.pow(num, 2)).toFixed(1) + "M";
        if (size < Math.pow(num, 4))
            return (size / Math.pow(num, 3)).toFixed(1) + "G";
        return (size / Math.pow(num, 4)).toFixed(1) + "T";
    }

    /**创建随机字符串**/
    randomString = (len, list) => {
        let str = "";
        let range = len;
        let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
            'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
            'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
            'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        for (let i = 0; i < range; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        if (list.length > 0) {
            let newArr = list.some((item) => {
                return item.id === str;
            });
            if (newArr) {
                this.randomString(len)
            } else {
                return str;
            }
        } else {
            return str;
        }
    };

    /**点击复制内容**/
    copyText = (params) => {
        let input = document.createElement('input');
        input.setAttribute('readonly', 'readonly'); // 防止手机上弹出软键盘
        input.setAttribute('value', params.hash);
        document.body.appendChild(input);
        input.select();
        let res = document.execCommand('copy');
        document.body.removeChild(input);
        return res;
    };

    /**文件下载**/
    downloadFile = (href, downloadName) => {
        // const oa = document.createElement('a');
        // let e = document.createEvent("MouseEvents");
        // e.initEvent("click", false, false); //初始化事件对象
        // oa.href = href; //设置下载地址
        // oa.download = ''; //设置下载文件名
        // oa.target = "_blank";
        // oa.dispatchEvent(e); //给指定的元素，执行事件click事件
        let xhr = new XMLHttpRequest();
        xhr.open("get", href, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
            if (this.status === 200) {
                const blob = new Blob([this.response], { type: this.response.type });
                let url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = downloadName;
                link.click();
                URL.revokeObjectURL(url);
            }
        };
        xhr.send();
    };

    userGetinfo() {
        React.api.userGetinfo().then((res) => {
            Store.dispatch({
                type: 'USER_INFO',
                userInfo: res.data.data
            });
            localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        }).catch((err) => {
        });
    };
};
