const toString = Object.prototype.toString //代码优化

// 判断是否是日期类型
// 类型守卫 val is Date 因为ts只能做静态检测，静态检测他不会动态的去运行的代码，下面的代码是运行时的代码，要运行完之后才能知道结果，而ts是静态检测它不会去运行代码所以它不会知道结果是什么。
// 类型守卫就是说 这个条件返回为true的时候，那么这个val一定是Date类型
export const isDate = (val: any): val is Date => {
    return toString.call(val) === '[object Date]'
}

// 判断是否是对象类型
export const isObject = (val: any): val is Object => {
    return toString.call(val) === '[object Object]'
}



export const extend = <T, U>(to: T, form: U): T & U => {
    const keys = Object.getOwnPropertyNames(form)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (key != 'constructor') {
            // @ts-ignore
            to[key] = form[key]
        }
    }
    return to as T & U
}