### axiso


get和post请求需要处理些什么东西 
```js
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
axios({
    url: 'http://localhost:3000/posts', 
    method: "POST",
    data: {
        id: 2, 
        foo: ['bar', '中文'], 
        obj: { key: 'value' },
        date: new Date(), 
        test: null
    }
})
```

封装xml
```js
export default function xhr(config: AxiosReqeustConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { url, method = 'GET', data = null, headers, timeout, withCredentials, responseType } = config
        const xhr = new XMLHttpRequest()
        xhr.open(method.toUpperCase(), url, true)

        if (responseType) {
            xhr.responseType = responseType
        }

        if (timeout) {
            xhr.timeout = timeout
        }

        if (withCredentials) {
            xhr.withCredentials = withCredentials
        }
        if (headers) {
            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]) //添加请求头
            })
        }
        xhr.onreadystatechange = function handleLoad() {
            //0 1 2 3 4
            if (xhr.readyState !== 4) {
                return
            }

            //超时和报错也是0
            if (xhr.status === 0) {
                return
            }

            const responseHeaders =  (xhr.getAllResponseHeaders())
            const responeData = responseType === 'text' ? xhr.responseText : xhr.response
            const respone: AxiosResponse = {
                data: responeData,
                status: xhr.status,
                statusText: xhr.statusText,
                headers: responseHeaders,
                config,
                request: xhr
            }
            headleResponse(respone)
        }

        xhr.send(data) //支持的格式有 text, arraybuffer, blob, document, stream

        const headleResponse = function handleResponse(response: AxiosResponse) {
            if (response.status >= 200 && response.status < 304) {
                resolve(response)
            } else {
                reject(new Error(`request failed with status code ${response.status}`))
            }
        }

    })
}
```


这里就是处理上面所说的url带参数，有hash，params有值的情况，还有转义问题
```js
// 初始化url
export function buildURL(url: string, params?: any) {
    //如果params为空,直接返回url
    if (!params) {
        return url
    }

    const parts: string[] = [] //存放结果

    //便利params 
    Object.keys(params).forEach(key => {
        const val = params[key]
        //判断值 null和undefined就去除空值
        if (val === null || typeof val === 'undefined') {
            return
        }
        //处理数组
        let values: any[] = []
        if (Array.isArray(val)) {
            values = val
            key += '[]' // 这里为什么要这么处理 是因为get请求如果是传递数组的话 a:[1,2] 是这样的格式 a[]=1&a[]=2，这是w3c规范
        } else {
            values = [val] // 把所有的值都放到数组里面 然后统一处理遍历
        }
        // 遍历数组
        values.forEach(val => {
            // 处理日期
            if (isDate(val)) {
                val = val.toISOString() // utc格式 世界统一格式
            } else if (isObject(val)) { // 处理对象
                val = JSON.stringify(val) // 对象转字符串
            }
            // 转义字符然后放到数组里面
            parts.push(`${encode(key)}=${encode(val)}`)
        })
    })

    // 格式化
    let serializedParams = parts.join('&') // a=2&b=3

    if (serializedParams) {
        //去掉#号
        const markIndex = url.indexOf('#')
        if (markIndex !== -1) {
            url = url.slice(0, markIndex)
        }
        //保留已有参数 ===-1 找不到?
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }

    return url
}

// 转义 特殊字符不能转义的字符
function encode(url: string) {
    return encodeURIComponent(url)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
```

这是一些辅助工具
```js
const toString = Object.prototype.toString //代码优化
// 判断是否是日期类型
// 类型守卫 val is Date 因为ts只能做静态检测，静态检测他不会动态的去运行的代码，下面的代码是运行时的代码，要运行完之后才能知道结果，而ts是静态检测它不会去运行代码所以它不会知道结果是什么。
// 类型守卫就是说 这个条件返回为true的时候，那么这个val一定是Date类型
export const isDate = (val: any): val is Date => {
    return toString.call(val) === '[object Date]'
}

// 判断是否是对象类型
export const isObject = (val: any): val is Object => {
    return toString.call(val) === '[object Object]'
}

```
这个是用来设置请求头的
```js
function normalizeHeaderName(headers: any, normalizedName: string): void {
    if (!headers) {
        return
    }
    // 遍历头部的name然后把他们都转成大写，如果name和normalizedName的值不相等并却 把name的值转大写后 和 normalizedName的值转成大写后相等
    // 那么把headers这个对象添加一个normalizedName属性，并且把name对应的value赋予它
    // 最后把 headers[name] 删掉, 只保留规范的。
    // content-type !== Content-Type true
    // CONTENT-TYPE === CONTENT-TYPE true
    // 用规范的头然后使用你传进来的值
    Object.keys(headers).forEach(name => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders(headers: any, data: any) {
    normalizeHeaderName(headers, 'Content-Type')
    if (isObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8' //默认json
        }
    }
    return headers
}
```


```js
//post请求的时候需要把对象转换成字符串
export function trasnformRequest(data: any): any {
    if (isObject(data)) {
        return JSON.stringify(data)
    }
}

//响应头的处理 如果是一个字符串那么转换成对象
export function trasnformResponse(data: any): any {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch (e) {
            // do nothing
        }
    }
    return data
}
```


```js
export default function dispatchRequest(config: AxiosReqeustConfig): AxiosPromise {
    processConfig(config) //初始化配置项
    return xhr(config).then(res => transformResposneData(res))
}

function processConfig(config: AxiosReqeustConfig) {
    config.url = trasnformURL(config)
    config.headers = trasnformHeaders(config) //注意顺序
    config.data = trasnformRequestData(config)
}

// 处理url
function trasnformURL(config: AxiosReqeustConfig): string {
    const { url, params } = config
    return buildURL(url, params)
}

// 处理post请求的data
function trasnformRequestData(config: AxiosReqeustConfig): any {
    return trasnformRequest(config.data)
}

// 处理头部
function trasnformHeaders(config: AxiosReqeustConfig): any {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
}

// 处理返回值
function transformResposneData(res: AxiosResponse): any {
    res.data = trasnformResponse(res.data)
    return res
}
```
