import Login from "../page/Login";
import Index from "../page/Index";
import Pic from '../page/Pic';
import Video from '../page/Video';
import Text from '../page/Text';
import Other from '../page/Other';
import Task from "../page/Task";
import RecycleBin from '../page/RecycleBin';
import Test from '../page/Test';

export default [
    {path: "/login", component: Login},
    {path: "/image", component: Pic},
    {path: "/video", component: Video},
    {path: "/text", component: Text},
    {path: "/other", component: Other},
    {path: "/task", component: Task},
    {path: "/test", component: Test},
    {path: "/recycleBin", component: RecycleBin},
    {path: "/index", component: Index},
    {path: "/", component: Index},
];
