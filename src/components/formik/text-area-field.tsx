import { Field, ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
	name: string;
}


const TextAreaField: NextPage<Props> = ({ name, ...props }) => {
	const [, meta] = useField(name);
	const hasError = meta.touched && meta.error;

	const className = `w-full rounded h-20 px-2 py-1 ${hasError ? 'border-rose-400' : ''} ${props.className}`;

	return (
		<div className={'flex flex-col w-full relative pb-6'}>
			{props.label && (
				<div className={'mb-1'}>
					<span>{props.label}</span>
					{props.required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<Field
				as={'textarea'}
				className={className}
				name={name}
				{...props}
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

export default TextAreaField;