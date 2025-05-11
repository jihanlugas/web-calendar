import { Field, ErrorMessage } from 'formik';
import { NextPage } from 'next';

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
	name: string;
}


const TextAreaField: NextPage<Props> = ({ name, ...props }) => {
	return (
		<div className={'flex flex-col w-full'}>
			{props.label && (
				<div className={'mb-1'}>
					<span>{props.label}</span>
					{props.required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<Field
				as={'textarea'}
				className={'w-full rounded h-20 px-2 py-1'}
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

export default TextAreaField;