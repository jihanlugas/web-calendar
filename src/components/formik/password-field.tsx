import { Field, ErrorMessage } from 'formik';
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

	return (
		<div className={'flex flex-col w-full'}>
			{label && (
				<div className={'mb-1'}>
					<span>{label}</span>
					{required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<div className='relative w-full'>
				<Field
					className={'h-10 w-full px-2 '}
					type={show ? 'text' : 'password'}
					name={name}
					{...props}
				/>
				<div className='absolute h-10 w-10 right-0 top-0 flex justify-center items-center hover:text-blue-500 select-none' onClick={(e) => handleChange(e)}>
					{show ? <IoEyeOffOutline size={'1.2rem'} /> : <IoEyeOutline size={'1.2rem'} />}
				</div>
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

export default PasswordField;