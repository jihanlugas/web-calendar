import { NextPage } from 'next';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	disabled?: boolean;
	loading?: boolean;
	type?: "submit" | "reset" | "button";
}

const ButtonSubmit: NextPage<Props> = ({ label, disabled = false, loading = false, type = 'submit', ...props }) => {
	return (
		<button
			className={'duration-300 bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:border-blue-600 h-10 rounded-md text-gray-50 font-semibold px-4 w-full shadow-lg shadow-blue-600/20'}
			type={type}
			disabled={disabled}
			{...props}
		>
			<div className={'flex justify-center items-center'}>
				{loading ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.5rem'} /> : label}
			</div>
		</button>
	);
};

export default ButtonSubmit;