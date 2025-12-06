import { FastField, ErrorMessage, Field, useField } from 'formik';
import { NextPage } from 'next';
import React from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
	name: string;
	type: string;
	field?: boolean;
}

const TextField: NextPage<Props> = ({ name, type, field = false, ...props }) => {
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
			{props.label && (
				<div className={'mb-1'}>
					<span>{props.label}</span>
					{props.required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<FieldComponent
				type={type}
				name={name}
				{...props}
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

export default TextField;