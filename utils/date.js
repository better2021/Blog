// 日期转 string  2018-10-10
export function formatDateToString(date) {
	const y = date.getFullYear()
	const m = date.getMonth() + 1
	const d = date.getDate()
	return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`
}
// 日期转string  2018-10-10 00:00:00
export function formatDateTimeToString(date) {
	if (typeof date === "string") return date
	const y = date.getFullYear()
	const m = date.getMonth() + 1
	const d = date.getDate()
	const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
	const minute =
		date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
	const second =
		date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
	return `${y}-${m < 10 ? "0" + m : m}-${
		d < 10 ? "0" + d : d
	} ${hour}:${minute}:${second}`
}

// 日期转string   00:00:00
export function formatDateMinuteToString(date) {
	const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
	const minute =
		date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
	const second =
		date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()

	return `${hour}:${minute}:${second}`
}

// 补0操作
function getzf(num) {
	if (parseInt(num) < 10) {
		num = "0" + num
	}
	return num
}

export const formatTime = (str) => {
	var oDate = new Date(str),
		oYear = oDate.getFullYear(),
		oMonth = oDate.getMonth() + 1,
		oDay = oDate.getDate(),
		oHour = oDate.getHours(),
		oMin = oDate.getMinutes(),
		oSen = oDate.getSeconds(),
		oTime =
			oYear +
			"-" +
			getzf(oMonth) +
			"-" +
			getzf(oDay) +
			" " +
			getzf(oHour) +
			":" +
			getzf(oMin) +
			":" +
			getzf(oSen) //最后拼接时间
	return oTime
}

/**
 * 时间格式过滤
 * @param {*} time
 * time 单位为秒的时间戳
 */

export function getFormatDate(time) {
	if (isNaN(time)) return
	time = +time * 1000
	const d = new Date(time)
	const now = Date.now()
	const diff = (now - d) / 1000

	if (diff < 30) {
		return "刚刚"
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + "分钟前"
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + "小时前"
	} else if (diff < 3600 * 24 * 2) {
		return "1天前"
	}
	return `${d.getFullYear()}年${
		d.getMonth() + 1
	}月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`
}
