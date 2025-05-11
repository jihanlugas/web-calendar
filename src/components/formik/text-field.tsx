import { FastField, ErrorMessage, Field } from 'formik';
import { NextPage } from 'next';
import React from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
	name: string;
	type: string;
	field?: boolean;
}

const TextField: NextPage<Props> = ({ name, type, className='', field = false, ...props }) => {
	const FieldComponent = field ? Field : FastField;
	return (
		<div className={'flex flex-col w-full'}>
			{props.label && (
				<div className={'mb-1'}>
					<span>{props.label}</span>
					{props.required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<FieldComponent
				className={'w-full h-10 px-2 select-all ' + className}
				type={type}
				name={name}
				{...props}
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

export default TextField;