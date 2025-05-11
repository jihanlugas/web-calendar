import { Field, FastField,  ErrorMessage } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

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
	return (
		<div className={'flex flex-col w-full'}>
			{label && (
				<div className={''}>
					<span>{label}</span>
					{required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<div className='relative'>
				<FieldComponent
					className={'w-full h-10 px-2 '}
					name={name}
					as={'select'}
					{...props}
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
				{isLoading && <AiOutlineLoading3Quarters className={'animate-spin absolute top-3 right-8'} size={'1.2rem'} />}
			</div>
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

export default DropdownField;