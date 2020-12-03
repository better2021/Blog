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
 * 函数防抖
 * @param {Function} func
 * @param {number} wait 单位秒 s
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

/**
 * 函数节流
 */
// 定时器方式
let throttle = function (fn, delayTime) {
	let flag
	return function () {
		let context = this,
			args = arguments
		if (!flag) {
			flag = setTimeout(function () {
				fn.apply(context, args)
				flag = false
			}, delayTime)
		}
	}
}

// 获取数组中的最大值与最小值
let arr = [2, 3, 9, 6, 5]

// 获取最大值
Math.max.apply(Math, arr) //9

// 获取最小值
Math.min.apply(Math, arr) //2

/**
 * 深拷贝
 * @param {object} source
 */
const deepCopy = (source) => {
	if (!source || typeof source !== "object") {
		throw new Error("error arguments", "shallowClone")
	}
	const targetObj = source.constructor === Array ? [] : {}
	for (let keys in source) {
		if (source.hasOwnProperty(keys)) {
			if (source[keys] && typeof source[keys] === "object") {
				targetObj[keys] = deepCopy(source[keys])
			} else {
				targetObj[keys] = source[keys]
			}
		}
	}
	return targetObj
}

/**
 * 获取范围内的随机数
 * @param {number} min
 * @param {number} max
 */
function randNum(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min))
}
randNum(0, 10) // 生成0-10的随机数

/**
 * 金额转换为千分位
 * @param {number} num
 */
function replaceMoney(num) {
	return String(num).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,")
}
replaceMoney(1236.36) //"1,236.36"

/**
 * 判断类型
 * @param {*}
 */
function typeFn(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1)
}

let a = "add"
typeFn(a) // String

/**
 * 用 promise 实现 sleep 函数
 * @param {*} time
 */
function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time))
}

const t1 = +new Date()
sleep(3000).then(() => {
	const t2 = +new Date()
	console.log(t2 - t1)
})

/**
 * File对象转ArrayBuffer
 * @param {*} event
 */
file.onchange = function (event) {
	var file = event.target.files[0]
	// 开始识别
	var reader = new FileReader()
	reader.onload = function (event) {
		var arrBuffer = event.target.result
		// arrBuffer就是包含音频数据的ArrayBuffer对象
	}
	reader.readAsArrayBuffer(file)
}

/**
 * 获取随机颜色值
 */
function color() {
	return "#" + ((Math.random() * 0xffffff) << 0).toString(16)
}

/**
 * sort() 方法用于对数组的元素进行排序
 * arrayObject.sort(sortby)
 * sortby 可选。规定排序顺序。必须是函数。
 */

const arr = [3, 1, 16, 34, 30]
arr.sort((m, n) => m - n) // [1, 3, 16, 30, 34]
arr.sort((m, n) => n - m) // [34, 30, 16, 3, 1]

/**
 * 使用Boolean过滤数组中的所有假值
 * false，null，0，""，undefined，NaN，怎样把数组中的假值快速过滤呢，可以使用Boolean构造函数来进行一次转换
 * @param {*} arr
 */
const compact = (arr) => arr.filter(Boolean)
compact([0, 1, false, 2, "", 3, "a", "e" * 23, NaN, "s", 34]) // [1, 2, 3, "a", "s", 34]
