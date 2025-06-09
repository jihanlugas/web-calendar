import { FastField, ErrorMessage, Field } from 'formik';
import { NextPage } from 'next';

interface Props extends React.HTMLProps<HTMLInputElement> {
	name: string;
	showError?: boolean;
	field?: boolean;
}

const CheckboxField: NextPage<Props> = ({ name, showError = true, field = false, ...props }) => {
	const FieldComponent = field ? Field : FastField;
	return (
		<span className={'flex flex-col w-full pl-1 relative pb-6'}>
			<span className='flex items-center'>
				{props.label && (
					<label className={'select-none py-2 flex items-center cursor-pointer'} >
						<FieldComponent
							className={'mr-4 accent-current py-2 scale-150'}
							type={'checkbox'}
							name={name}
							{...props}
						/>
						<span className='truncate'>{props.label}</span>
					</label>
				)}
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