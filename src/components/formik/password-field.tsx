import { Field, ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'

interface Props extends React.HTMLProps<HTMLInputElement> {
	label?: string;
	name: string;
	required?: boolean;
}

const PasswordField: NextPage<Props> = ({ label, name, required, ...props }) => {

	const [show, setShow] = useState(false);

	const handleChange = (e) => {
		e.preventDefault()
		setShow(!show)
	}

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
				<div className={'mb-1'}>
					<span>{label}</span>
					{required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<div className='relative w-full'>
				<Field
					type={show ? 'text' : 'password'}
					name={name}
					{...props}
					className={className}
				/>
				<div className='absolute h-10 w-10 right-0 top-0 flex justify-center items-center hover:text-primary-500 select-none' onClick={(e) => handleChange(e)}>
					{show ? <IoEyeOffOutline size={'1.2rem'} /> : <IoEyeOutline size={'1.2rem'} />}
				</div>
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

export default PasswordField;