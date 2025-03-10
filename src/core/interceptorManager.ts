import type { ResolvedFn, RejectedFn } from "../types";
interface Interceptors<T> {
    resolved: ResolvedFn<T>
    rejected?: RejectedFn
}
export default class InterceptorManager<T> {
    private interceptors: Array<Interceptors<T> | null>
    constructor() {
        this.interceptors = []
    }

    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
        this.interceptors.push({
            resolved,
            rejected
        })
        return this.interceptors.length - 1
    }

    eject(id: number): void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }

    forEach(fn: (interceptor: Interceptors<T>) => void): void {
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                fn(interceptor)
            }
        })
    }
}