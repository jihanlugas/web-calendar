import { ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';
import { HTMLProps, useEffect, useState } from 'react';

interface Props extends HTMLProps<HTMLInputElement> {
	name: string;
	field?: boolean;
}

const TextFieldNumber: NextPage<Props> = ({ name, ...props }) => {
	const [field, meta, helpers] = useField(name);
	const [displayValue, setDisplayValue] = useState(field.value || '');

	const hasError = meta.touched && meta.error;

	const className = [
  'w-full',
  'h-10',
  'px-2',
  'select-all',
  'text-right',
  hasError && '!border-rose-400',
  props.className || ''
].filter(Boolean).join(' ');

	const formatNumber = (value) => {
		return value === '' ? value : new Intl.NumberFormat('id-ID').format(value);
	};

	const handleChange = (e) => {
		const rawValue = isNaN(parseInt(e.target.value.replace(/[^\d-]/g, ''))) ? '' : parseInt(e.target.value.replace(/[^\d-]/g, ''));
		helpers.setValue(rawValue);
		props.onChange?.(e);
	};

	useEffect(() => {
		setDisplayValue(formatNumber(field.value));
	}, [field.value]);

	return (
		<div className={'flex flex-col w-full relative pb-6'}>
			{props.label && (
				<div className={'mb-1'}>
					<span>{props.label}</span>
					{props.required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<input
				type="text"
				{...field}
				{...props}
				value={displayValue}
				onChange={handleChange}
				className={className}
			/>
			<ErrorMessage name={name}>
				{(msg) => {
					return (
						<div className={'absolute bottom-0 text-rose-600 text-sm normal-case'}>{msg}</div>
					);
				}}
			</ErrorMessage>
		</div>
	);
};

export default TextFieldNumber;