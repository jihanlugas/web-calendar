import { NextPage } from 'next';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import React from 'react';
import DatePicker from 'react-datepicker';
import { IoClose } from 'react-icons/io5';

interface Props {
  label?: string;
  name: string;
  required?: boolean;
  handleClear?: boolean;
  className?: string;
  showTimeSelect?: boolean;
}

const DateField: NextPage<Props> = ({
  label,
  name,
  required,
  handleClear,
  className,
  showTimeSelect = true,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext<any>();

  const hasError = meta.touched && meta.error;

  const inputClassName = [
		'w-full',
		'h-10',
		'px-2',
		hasError && 'border-rose-400',
		className || ''
	].filter(Boolean).join(' ');

  return (
    <div className="pb-6 relative">
      {label && (
        <div className="mb-1">
          <span>{label}</span>
          {required && <span className="text-rose-600">*</span>}
        </div>
      )}

      <div className="relative">
        <DatePicker
          selected={field.value ? new Date(field.value) : null}
          onChange={(date) => setFieldValue(name, date)}
          showTimeSelect={showTimeSelect}
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat={showTimeSelect ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
          className={inputClassName}
          wrapperClassName={'w-full'}
          placeholderText="Pilih tanggal"
        />

        {handleClear && field.value && (
          <button
            type="button"
            onClick={() => setFieldValue(name, null)}
            className="absolute h-6 w-6 flex justify-center items-center top-2 right-2"
            title="Clear Value"
          >
            <IoClose size="1.2rem" />
          </button>
        )}
      </div>

      <ErrorMessage name={name}>
        {(msg) => (
          <div className="absolute bottom-0 text-rose-600 text-sm">
            {msg}
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};

export default DateField;
