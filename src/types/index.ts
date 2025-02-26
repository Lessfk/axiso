// Method 类型 (联合类型)
export type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH";

// axiso 配置文件
export interface AxiosReqeustConfig {
   url: string //请求地址
   method?: Method //请求方法
   params?: any //get请求参数
   data?: any //post请求参数
   headers?: any //请求头
   timeout?: number //超时
   withCredentials?: boolean //携带cookie
   responseType?: XMLHttpRequestResponseType //响应类型
}

export interface AxiosResponse<T = any> {
   data: T
   status: number
   statusText: string
   headers: any
   config: AxiosReqeustConfig
   request?: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
}

export interface Axios {
   interceptors:{
      request: AxiosInterceptorManager<AxiosReqeustConfig>
      response: AxiosInterceptorManager<AxiosResponse>
   }
   request<T = any>(config: AxiosReqeustConfig): AxiosPromise<T>
   get<T = any>(url: string, config?: AxiosReqeustConfig): AxiosPromise<T>
   delete<T = any>(url: string, config?: AxiosReqeustConfig): AxiosPromise<T>
   head<T = any>(url: string, config?: AxiosReqeustConfig): AxiosPromise<T>
   options<T = any>(url: string, config?: AxiosReqeustConfig): AxiosPromise<T>
   post<T = any>(url: string, data?: any, config?: AxiosReqeustConfig): AxiosPromise<T>
   put<T = any>(url: string, data?: any, config?: AxiosReqeustConfig): AxiosPromise<T>
   patch<T = any>(url: string, data?: any, config?: AxiosReqeustConfig): AxiosPromise<T>
}

export interface AxiosInterceptorManager<T> {
   use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
   eject(id: number): void
}

export interface AxiosInstance extends Axios {
   <T = any>(config: AxiosReqeustConfig): AxiosPromise<T>
}

export interface ResolvedFn<T = any> {
   (val: T): T | Promise<T>
}

export interface RejectedFn {
   (error: any): any
}