import { NextPage } from 'next';
import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	disabled?: boolean;
	loading?: boolean;
	type?: "submit" | "reset" | "button";
}

const ButtonSubmit: NextPage<Props> = ({ label, disabled = false, loading = false, type = 'submit', ...props }) => {
	return (
		<button
			className={'duration-300 bg-primary-500 border-primary-500 hover:bg-primary-600 hover:border-primary-600 focus:border-primary-600 h-10 rounded-md text-gray-50 font-semibold px-4 w-full shadow-lg shadow-primary-600/20'}
			type={type}
			disabled={disabled}
			{...props}
		>
			<div className={'flex justify-center items-center'}>
				{loading ? <ImSpinner2 className={'animate-spin'} size={'1.5rem'} /> : label}
			</div>
		</button>
	);
};

export default ButtonSubmit;