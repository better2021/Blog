/**
 * @param {string} key
 * @param {string} value
 */
export const localSave = (key, value) => {
	localStorage.setItem(key, value)
}

/**
 * @param {string} key
 * @param {string} defaultValue
 */
export const localRead = (key, defaultValue = "") => {
	return localStorage.getItem(key) || defaultValue
}

/**
 * @param {*} time
 */
export const delay = (time) => new Promise((r) => setTimeout(r, time))

/**
 * 表单生成器
 * @param {*} obj 待转换的数据对象
 */
export const formBuilder = (obj) => {
	const formData = new FormData()
	Object.keys(obj).forEach((k) => {
		formData.append(k, obj[k])
	})
	return formData
}

/**
 * 获取文件扩展名
 * @param {*} filename
 */
export const getFileExt = (filename) => {
	return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}

/**
 * 换行符转换
 * @param {*} str
 */
export const transferString = (str) => {
	if (!str) return
	try {
		str = str.replace(/\r\n/g, "<br>").replace(/\n/g, "<br/>")
	} catch (e) {
		throw new Error(e.message)
	}
	return str
}

/**
 * 下载图片
 * @param {*} url
 */
export const downloadImg = (url, name) => {
	const a = document.createElement("a")
	a.href = url
	a.download = name
	a.click()
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
	const search = url.split("?")[1]
	if (!search) {
		return {}
	}
	return JSON.parse(
		'{"' +
			decodeURIComponent(search)
				.replace(/"/g, '\\"')
				.replace(/&/g, '","')
				.replace(/=/g, '":"')
				.replace(/\+/g, " ") +
			'"}'
	)
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result

	const later = function () {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp

		// 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last)
		} else {
			timeout = null
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args)
				if (!timeout) context = args = null
			}
		}
	}

	return function (...args) {
		context = this
		timestamp = +new Date()
		const callNow = immediate && !timeout
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait)
		if (callNow) {
			result = func.apply(context, args)
			context = args = null
		}

		return result
	}
}
