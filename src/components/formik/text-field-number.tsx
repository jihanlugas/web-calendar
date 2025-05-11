import { ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';
import {HTMLProps, useEffect, useState} from 'react';

interface Props extends HTMLProps<HTMLInputElement> {
	name: string;
	field?: boolean;
}

const TextFieldNumber: NextPage<Props> = ({ name, className='', ...props }) => {
	const [field, , helpers] = useField(name);
  const [displayValue, setDisplayValue] = useState(field.value || '');

  const formatNumber = (value) => {
    return value === '' ? value : new Intl.NumberFormat('id-ID').format(value);
  };

  const handleChange = (e) => {
    const rawValue = isNaN(parseInt(e.target.value.replace(/\D/g, ''))) ? '' : parseInt(e.target.value.replace(/\D/g, ''));
    helpers.setValue(rawValue);
		props.onChange?.(e);
  };

	useEffect(() => {
		setDisplayValue(formatNumber(field.value));
	}, [field.value]);
	
	return (
		<div className={'flex flex-col w-full'}>
			{props.label && (
				<div className={'mb-1'}>
					<span>{props.label}</span>
					{props.required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<input
				className={'w-full h-10 px-2 select-all ' + className}
				type="text"
        {...field}
        {...props}
        value={displayValue}
        onChange={handleChange}
			/>
			<ErrorMessage name={name}>
				{(msg) => {
					return (
						<div className={'text-rose-600 text-sm normal-case'}>{msg}</div>
					);
				}}
			</ErrorMessage>
		</div>
	);
};

export default TextFieldNumber;