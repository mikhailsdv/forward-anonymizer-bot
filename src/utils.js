const trimMessage = str => str.replace(/\t+/gm, "")

const zeroFirst = s => {
	return `0${s}`.substr(-2)
}

const arrEnd = arr => arr.length === 0 ? null : arr[arr.length - 1]

const getDateString = () => {
	let d = new Date()
	return `${zeroFirst(d.getDate())}.${zeroFirst(d.getMonth() + 1)}.${d.getFullYear()} ${zeroFirst(d.getHours())}:${zeroFirst(d.getMinutes())}:${zeroFirst(d.getSeconds())}`
}

const log = (...args) => console.log(getDateString(), ...args)

const shouldByAnonymized = message => {
	return Boolean(
		message.via_bot ||
		message.forward_from ||
		message.forward_from_chat ||
		message.forward_from_message_id ||
		message.forward_sender_name
	)
}

module.exports = {
	trimMessage,
	zeroFirst,
	getDateString,
	arrEnd,
	log,
	shouldByAnonymized,
}
