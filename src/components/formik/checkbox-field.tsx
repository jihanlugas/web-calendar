import { FastField, ErrorMessage, Field } from 'formik';
import { NextPage } from 'next';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label: string;
	showError?: boolean;
	field?: boolean;
}

const CheckboxField: NextPage<Props> = ({ name, label, showError = true, field = false, ...props }) => {
	const FieldComponent = field ? Field : FastField;

	const className = [
		'select-none',
		'py-2',
		'flex',
		'items-center',
		'cursor-pointer',
		props.className || ''
	].filter(Boolean).join(' ');

	return (
		<span className={'flex flex-col w-full pl-1 relative'}>
			<span className='flex items-center'>
				<label className={className}>
					<FieldComponent
						type={'checkbox'}
						name={name}
						{...props}
						className={'mr-4 accent-current py-2 scale-150'}
					/>
					<span className='truncate'>{label}</span>
				</label>
			</span>
			{showError && (
				<ErrorMessage name={name}>
					{(msg) => {
						return (
							<div className={'absolute bottom-0text-rose-600 text-sm normal-case'}>{msg}</div>
						);
					}}
				</ErrorMessage>
			)}
		</span>
	);
};

export default CheckboxField;