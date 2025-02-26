import type { AxiosReqeustConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn } from "../types";

import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./interceptorManager";
interface Interceptors {
    request: InterceptorManager<AxiosReqeustConfig>
    response: InterceptorManager<AxiosResponse>
}
interface PromiseChain<T> {
    resolved: ResolvedFn<T> | ((config: AxiosReqeustConfig) => AxiosPromise)
    rejected?: RejectedFn
}
export default class Axios {
    public interceptors: Interceptors
    constructor() {
        this.interceptors = {
            request: new InterceptorManager<AxiosReqeustConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }
    public request(config: AxiosReqeustConfig): AxiosPromise {
        //中间件
        //axios()
        //axios.reuqest()
        //axios.get() post()
        
        const chain: PromiseChain<any>[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]
        //后添加的先执行 unshift
        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)
        })
        //先添加的先执行 push
        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })

        let promise = Promise.resolve(config)
        //[] 2
        while (chain.length) {
            const { resolved, rejected } = chain.shift()!
            promise = promise.then(resolved, rejected)
        }

        return promise as unknown as AxiosPromise
    }

    public get(url: string, config?: AxiosReqeustConfig): AxiosPromise {
        return this._requestMethodWithOutData('get', url, config)
    }

    public delete(url: string, config?: AxiosReqeustConfig): AxiosPromise {
        return this._requestMethodWithOutData('delete', url, config)
    }

    public head(url: string, config?: AxiosReqeustConfig): AxiosPromise {
        return this._requestMethodWithOutData('head', url, config)
    }

    public options(url: string, config?: AxiosReqeustConfig): AxiosPromise {
        return this._requestMethodWithOutData('options', url, config)
    }

    public post(url: string, data?: any, config?: AxiosReqeustConfig): AxiosPromise {
        return this._requestMethodWithData('post', url, data, config)
    }

    public put(url: string, data?: any, config?: AxiosReqeustConfig): AxiosPromise {
        return this._requestMethodWithData('put', url, data, config)
    }

    public patch(url: string, data?: any, config?: AxiosReqeustConfig): AxiosPromise {
        return this._requestMethodWithData('patch', url, data, config)
    }

    private _requestMethodWithOutData(method: Method, url: string, config?: AxiosReqeustConfig): AxiosPromise {
        return this.request({ ...config, method, url })
    }

    private _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosReqeustConfig): AxiosPromise {
        return this.request({ ...config, method, url, data })
    }
}