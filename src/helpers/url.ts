
import { isDate, isObject } from "./utils"

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