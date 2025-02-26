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

function trasnformURL(config: AxiosReqeustConfig): string {
    const { url, params } = config
    return buildURL(url, params)
}

function trasnformRequestData(config: AxiosReqeustConfig): any {
    return trasnformRequest(config.data)
}

function trasnformHeaders(config: AxiosReqeustConfig): any {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
}

function transformResposneData(res: AxiosResponse): any {
    res.data = trasnformResponse(res.data)
    return res
}



