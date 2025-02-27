import { isObject } from "./utils";

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

// content-type: 'application/json;charset=utf-8'
// 用来处理请求头的
export function processHeaders(headers: any, data: any) {
    normalizeHeaderName(headers, 'Content-Type')
    if (isObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8' //默认json
        }
    }
    return headers
}

// 用来处理自己包装一层请求返回值的headers 把它转成对象
export function parseHeaders(headers: string): any {
    let parsed = Object.create(null)
    if (!headers) {
        return parsed
    }
    headers.split('\r\n').forEach(line => {
        let [key, val] = line.split(':')
        key = key.trim().toLowerCase()
        if (!key) {
            return
        }
        if (val) {
            val = val.trim()
        }
        parsed[key] = val
    })
    return parsed
}   