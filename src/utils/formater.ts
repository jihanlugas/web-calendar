import moment from 'moment';
import 'moment/locale/id';


moment.locale('id');

export const displayDate = (value, format = 'DD MMM YYYY') => {
	if (value != null) {
		return moment(value).format(format);
	} else {
		return '';
	}
};

export const displayTIme = (value, format = 'HH:mm') => {
	if (value != null) {
		return moment(value).format(format);
	} else {
		return '';
	}
};

export const displayDateTime = (value, format = 'DD MMM YYYY HH:mm') => {
	if (value != null) {
		return moment(value).format(format);
	} else {
		return '';
	}
};

export const displayDateForm = (value) => {
	if (value != null) {
		return moment(value).format('YYYY-MM-DD');
	} else {
		return '';
	}
};

export const displayDateTimeForm = (value) => {
	if (value != null) {
		return moment(value).format('YYYY-MM-DDTHH:mm:ss');
	} else {
		return '';
	}
};

export const displayDuration = (startDt, endDt, locales: string = 'en') => {
	if (!startDt || !endDt) return '';

	moment.locale(locales);

	const start = moment(startDt);
	const end = moment(endDt);

	// We'll manually track the difference
	const years = end.diff(start, 'years');
	start.add(years, 'years');

	const months = end.diff(start, 'months');
	start.add(months, 'months');

	const days = end.diff(start, 'days');
	start.add(days, 'days');

	const hours = end.diff(start, 'hours');
	start.add(hours, 'hours');

	const minutes = end.diff(start, 'minutes');
	start.add(minutes, 'minutes');

	const seconds = end.diff(start, 'seconds');

	const parts: string[] = [];

	if (years) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
	if (months) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
	if (days) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
	if (hours) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
	if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
	if (seconds && parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

	return parts.join(' ');

}

export const displayBoolean = (val: boolean, trueLabel: string = 'Active', falseLabel: string = 'Not Active'): string => {
	return val ? trueLabel : falseLabel;
};

export const displayActive = (val: boolean): string => {
	return val ? 'Active' : 'Not Active';
};

export const displayYesNo = (val: boolean): string => {
	return val ? 'Yes' : 'No';
};

export const displayYaTidak = (val: boolean): string => {
	return val ? 'Ya' : 'Tidak';
};


export const displayPhoneNumber = (value: string): string => {
	const cleaned = ('' + value).replace(/\D/g, '');
	const match = cleaned.match(/^(62|)?(\d{3})(\d{4})(\d{3,6})$/);
	if (match) {
		const intlCode = (match[1] ? '+62 ' : '');
		return [intlCode, ' ', match[2], '-', match[3], '-', match[4]].join('');
	}
	return value;
}

export const displayNumber = (value: number, locales: string = 'in-ID'): string => {
	const numberFormatter = Intl.NumberFormat(locales);
	return numberFormatter.format(value);
}

export const displayMoney = (value: number, locales: string = 'in-ID'): string => {
	return 'Rp ' + displayNumber(value, locales);
}