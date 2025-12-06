import { Field, ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
	name: string;
}


const TextAreaField: NextPage<Props> = ({ name, ...props }) => {
	const [, meta] = useField(name);
	const hasError = meta.touched && meta.error;

	const className = [
  'w-full',
  'h-24',
  'px-2',
  'py-1',
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
			<Field
				as={'textarea'}
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

export default TextAreaField;