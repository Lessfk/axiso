import { AxiosPromise, AxiosReqeustConfig, AxiosResponse } from "../types";
import { parseHeaders } from "../helpers/headers";
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

        xhr.ontimeout = function handleTimeout() {
            reject(new Error(`Timeout of ${timeout} ms exceeded`))
        }

        xhr.onerror = function handleError() {
            reject(new Error('Network Error'))
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

            const responseHeaders = parseHeaders(xhr.getAllResponseHeaders())
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