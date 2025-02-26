import { isObject } from "./utils";
export function trasnformRequest(data: any): any {
    if (isObject(data)) {
        return JSON.stringify(data)
    }
}

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