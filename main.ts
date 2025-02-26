import axios from "./src";

console.log(axios.interceptors)

axios.interceptors.request.use((config) => {
    console.log('第一个拦截器')
    return config
}, (error) => {
    return Promise.reject(error)
})


axios.interceptors.request.use((response) => {
    console.log('第二个拦截器')
    return response
}, (error) => {
    return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
    console.log('第三个拦截器')
    return response
}, (error) => {
    return Promise.reject(error)
})

const id = axios.interceptors.response.use((response) => {
    console.log('第四个拦截器')
    return response
}, (error) => {
    return Promise.reject(error)
})

axios.interceptors.response.eject(id)


// get请求有哪些情况
// url上带参数 http://localhost:3000/posts?a=1
// url上带hash http://localhost:3000/posts#?a=1
// url上带参数并且params有值
axios({
    url: 'http://localhost:3000/posts#?a=1', //保留已有参数 去掉hash符号
    method: "GET",
    params: {
        id: 2, //序列化参数
        foo: ['bar', '中文'], //序列化数组
        obj: { key: 'value' },//序列化对象
        date: new Date(), //utc格式 世界统一格式
        test: null //去除空值
    }
})



const btnGet = document.querySelector("#get-btn") as HTMLButtonElement;
const btnPost = document.querySelector("#post-btn") as HTMLButtonElement;

btnGet.addEventListener("click", () => {
    axios({
        url: 'http://localhost:3000/posts#?a=1', //保留已有参数 去掉hash符号
        method: "GET",
        params: {
            id: 2, //序列化参数
            foo: ['bar', '中文'], //序列化数组
            obj: { key: 'value' },//序列化对象
            date: new Date(), //utc格式 世界统一格式
            test: null //去除空值
        }
    })
});

btnPost.addEventListener("click", () => {
    axios.post<{ id: number }>('http://localhost:3000/posts', {
        id: 1
    }).then(res => {
        console.log(res.data.id)
    })
})


