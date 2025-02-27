import { isObject } from "./utils";
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