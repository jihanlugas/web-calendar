import { NextPage } from 'next';
import { FastField, ErrorMessage } from 'formik';
import React from 'react';
import { IoClose } from 'react-icons/io5';

interface Props extends React.HTMLProps<HTMLInputElement> {
  label?: string
  name: string
  handleClear?: (setFieldValue) => void
}

const DateField: NextPage<Props> = ({ label, name, handleClear, ...props }) => {

  return (
    <>
      <div className=''>
        {label && (
          <div className={'mb-1'}>
            <span>{label}</span>
            {props.required && <span className={'text-rose-600'}>{'*'}</span>}
          </div>
        )}
        <div className='relative'>
          <FastField
            className={'w-full h-10 px-2'}
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
              <div className={'text-rose-600 text-sm normal-case'}>{msg}</div>
            );
          }}
        </ErrorMessage>
      </div>
    </>
  )
}

export default DateField;