import { isObject } from "./utils";

function normalizeHeaderName(headers: any, normalizedName: string): void {
    if (!headers) {
        return
    }
    Object.keys(headers).forEach(name => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders(headers: any, data: any) {
    normalizeHeaderName(headers, 'Content-Type')
    if (isObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8' //默认json
        }
    }
    return headers
}


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