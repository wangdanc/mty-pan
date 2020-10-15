import React, {Component} from 'react';
import PicImg from '../assets/img/wtp.png';
import DocImg from '../assets/img/wwd.png';
import VidImg from '../assets/img/wsp.png';
import TaskImg from '../assets/img/wrw.png';
import RecImg from '../assets/img/sjz.png';
import SearchNo from '../assets/img/seaechno.png';

export default class NoData extends Component {/*缺省页*/
    render() {
        let {type} = this.props;
        let itemStyle = {
            position: 'relative',
        };
        let imgDivStyle = {
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, 15%)',
        };
        let imgStyle = {
            width: '100%',
            verticalAlign: 'middle'
        };
        let titleStyle = {
            fontSize: 24,
            fontFamily: 'Microsoft YaHei',
            margin: '0 auto',
            fontWeight: 400,
            color: 'rgba(1, 130, 254, 1)',
            paddingTop: 25,
            paddingBottom: 5,
        };
        let contentStyle = {
            fontSize: 16,
            fontFamily: 'Microsoft YaHei',
            fontWeight: 400,
            color: 'rgba(204, 204, 204, 1)',
        };
        let imgUrl = '';
        let title = '';
        let content = '';
        if (type === 'image') {//图片
            imgUrl = PicImg;
            title = '您暂时还未上传图片~';
            content = '赶紧去上传吧!';
        }
        if (type === 'other' || type === 'all' || !type) {//图片
            imgUrl = DocImg;
            title = '暂无文件';
            content = '赶紧去上传吧!';
        }
        if (type === 'text') {//文档
            imgUrl = DocImg;
            title = '您暂时还未上传文档~';
            content = '赶紧去上传吧!';
        }
        if (type === 'video') {//视频
            imgUrl = VidImg;
            title = '您暂时还未上传视频~';
            content = '赶紧去上传吧!';
        }
        if (type === 'task') {//任务记录
            imgUrl = TaskImg;
            title = '您暂时还没有传输任务~';
            content = '赶紧去添加吧!';
        }
        if (type === 'trash') {//回收站
            imgUrl = RecImg;
            title = '您的回收站为空哦~';
            content = '回收站为您保存10天内删除的文件';
        }
        if (type === 'searchNo') {
            imgUrl = SearchNo;
            title = '没有搜索到相应的内容~';
            content = '';
        }
        return (
            <div style={itemStyle}>
                <div style={imgDivStyle}>
                    <img style={imgStyle} src={imgUrl} alt="alt"/>
                    <div style={titleStyle}>{title}</div>
                    <div style={contentStyle}>{content}</div>
                </div>
            </div>
        );
    }
}
