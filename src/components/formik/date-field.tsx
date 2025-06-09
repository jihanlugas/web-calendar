import { NextPage } from 'next';
import { FastField, ErrorMessage, useField } from 'formik';
import React from 'react';
import { IoClose } from 'react-icons/io5';

interface Props extends React.HTMLProps<HTMLInputElement> {
  label?: string
  name: string
  handleClear?: (setFieldValue) => void
}

const DateField: NextPage<Props> = ({ label, name, handleClear, ...props }) => {

  const [, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  const className = `w-full h-10 px-2 ${hasError ? 'border-rose-400' : ''} ${props.className}`;
  
  return (
    <>
      <div className='relative pb-6'>
        {label && (
          <div className={'mb-1'}>
            <span>{label}</span>
            {props.required && <span className={'text-rose-600'}>{'*'}</span>}
          </div>
        )}
        <div className='relative'>
          <FastField
            className={className}
            type={'datetime-local'}
            name={name}
            {...props}
          />
          {handleClear && (
            <button
              type="button"
              onClick={handleClear}
              className={'absolute h-6 w-6 flex justify-center items-center top-2 right-8 '}
              title={'Clear Value'}
            >
              <IoClose size={'1.2rem'} className="" />
            </button>
          )}
        </div>
        <ErrorMessage name={name}>
          {(msg) => {
            return (
              <div className={'absolute bottom-0 text-rose-600 text-sm normal-case'}>{msg}</div>
            );
          }}
        </ErrorMessage>
      </div>
    </>
  )
}

export default DateField;