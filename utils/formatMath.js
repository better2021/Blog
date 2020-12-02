//浮点数相加
export const MathAdd = (a, b) => {
	a = a ? a : 0
	b = b ? b : 0
	var c, d, e
	try {
		c = a.toString().split(".")[1].length
	} catch (f) {
		c = 0
	}
	try {
		d = b.toString().split(".")[1].length
	} catch (f) {
		d = 0
	}
	return (
		(e = Math.pow(10, Math.max(c, d))), (MathMul(a, e) + MathMul(b, e)) / e
	)
}

// 浮点数相减
export const MathSub = (a, b) => {
	a = a ? a : 0
	b = b ? b : 0
	var c, d, e
	try {
		c = a.toString().split(".")[1].length
	} catch (f) {
		c = 0
	}
	try {
		d = b.toString().split(".")[1].length
	} catch (f) {
		d = 0
	}
	return (
		(e = Math.pow(10, Math.max(c, d))), (MathMul(a, e) - MathMul(b, e)) / e
	)
}

// 浮点数相乘
export const MathMul = (a, b) => {
	a = a ? a : 0
	b = b ? b : 0
	var c = 0,
		d = a.toString(),
		e = b.toString()
	try {
		c += d.split(".")[1].length
	} catch (f) {}
	try {
		c += e.split(".")[1].length
	} catch (f) {}
	return (
		(Number(d.replace(".", "")) * Number(e.replace(".", ""))) /
		Math.pow(10, c)
	)
}

// 浮点数相除
export const MathDiv = (a, b) => {
	a = a ? a : 0
	b = b ? b : 0
	var c,
		d,
		e = 0,
		f = 0
	try {
		e = a.toString().split(".")[1].length
	} catch (g) {}
	try {
		f = b.toString().split(".")[1].length
	} catch (g) {}
	return (
		(c = Number(a.toString().replace(".", ""))),
		(d = Number(b.toString().replace(".", ""))),
		MathMul(c / d, Math.pow(10, f - e))
	)
}
