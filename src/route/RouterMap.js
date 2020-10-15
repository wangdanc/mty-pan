import Login from "../page/Login";
import Home from "../component/Home";
import ErrorPage from "../page/404";

export default [
    {path: "/login", name: "Login", component: Login},
    {path: "/", name: "Home", component: Home, auth: true},
    {path: "/index", name: "Home", component: Home, auth: true},
    {path: "/image", name: "Home", component: Home, auth: true},
    {path: "/video", name: "Home", component: Home, auth: true},
    {path: "/text", name: "Home", component: Home, auth: true},
    {path: "/other", name: "Home", component: Home, auth: true},
    {path: "/task", name: "Home", component: Home, auth: true},
    {path: "/404", name: "404", component: ErrorPage},
];
