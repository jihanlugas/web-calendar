import { Field, FastField, ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

// interface item {
// 	label: string;
// 	value: string | number;
// }

interface Props extends React.HTMLProps<HTMLSelectElement> {
	label?: string;
	items: Array<unknown>;
	name: string;
	required?: boolean;
	placeholder?: string;
	placeholderValue?: string | number;
	keyValue?: string;
	keyLabel?: string;
	isLoading?: boolean;
	field?: boolean;
}


const DropdownField: NextPage<Props> = ({ label, name, items, required, placeholder = '', placeholderValue = '', keyValue = 'value', keyLabel = 'label', isLoading = false, field = false, ...props }) => {
	const FieldComponent = field ? Field : FastField;


	const [, meta] = useField(name);
	const hasError = meta.touched && meta.error;

	const className = [
		'w-full',
		'h-10',
		'px-2',
		'select-all',
		hasError && '!border-rose-400',
		props.className || ''
	].filter(Boolean).join(' ');

	return (
		<div className={'flex flex-col w-full relative pb-6'}>
			{label && (
				<div className={''}>
					<span>{label}</span>
					{required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<div className='relative'>
				<FieldComponent
					name={name}
					as={'select'}
					{...props}
					className={className}
				>
					{placeholder !== '' && (
						<option value={placeholderValue}>{placeholder}</option>
					)}
					{items.map((v, key) => {
						return (
							<option key={key} value={v[keyValue]}>{v[keyLabel]}</option>
						)
					})}
				</FieldComponent>
				{isLoading && <ImSpinner2 className={'animate-spin absolute top-3 right-8 text-blue-500'} size={'1.2rem'} />}
			</div>
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

export default DropdownField;