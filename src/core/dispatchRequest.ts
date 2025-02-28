import type { AxiosPromise, AxiosReqeustConfig, AxiosResponse } from "../types"
import { buildURL } from "../helpers/url"
import xhr from "./xhr"
import { trasnformRequest, trasnformResponse } from "../helpers/data"
import { processHeaders } from "../helpers/headers"


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



