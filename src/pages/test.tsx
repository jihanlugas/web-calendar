'use client'

import ButtonSubmit from '@/components/formik/button-submit';
import OldDateField from '@/components/formik/old-date-field';
import DateField from '@/components/formik/date-field';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import TextFieldNumber from '@/components/formik/text-field-number';
import { displayDateTimeForm } from '@/utils/formater';
import { Form, Formik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup';


const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string(),
  price: Yup.number().nullable().required('Required field'),
  startDt: Yup.string().nullable().required('Required field'),
  endDt: Yup.string().nullable().required('Required field'),
});


const initFormikValue = {
  companyId: '',
  name: '',
  description: '',
  price: '',
  startDt: null,
  endDt: displayDateTimeForm("2026-02-07T12:07:41.709086+07:00"),
}

const handleSubmit = async (values, formikHelpers) => {

  const startDt = values.startDt
  const endDt = new Date(values.endDt).toISOString()

  console.log('startDt', startDt)
  console.log('endDt', endDt)
}

export default function SortableVertical() {

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-3">
      <div className='bg-white mb-4 p-4 rounded shadow'>
        <div className='mb-4'>
          <div className='text-xl'>Create Product</div>
        </div>
        <div className='max-w-xl'>
          <Formik
            initialValues={initFormikValue}
            validationSchema={schema}
            enableReinitialize={true}
            onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
          >
            {({ values, errors }) => {
              return (
                <Form noValidate={true}>
                  <div className="mb-4">
                    <div className="text-lg">Product</div>
                    <hr className="my-4" />
                    <div className="">
                      <TextField
                        label={'Product Name'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Product Name'}
                        required
                      />
                    </div>
                    <div className="">
                      <TextAreaField
                        label={'Description'}
                        name={'description'}
                        placeholder={'Description'}
                      />
                    </div>
                    <div className=''>
                      <DateField
                        label='Start Date'
                        name='startDt'
                        required
                      />
                    </div>
                    <div className=''>
                      <OldDateField
                        label='End Date'
                        name='endDt'
                        required
                      />
                    </div>
                    <div className="">
                      <TextFieldNumber
                        label={'Price'}
                        name={'price'}
                        placeholder={'1000xx'}
                        required
                      />
                    </div>
                  </div>
                  <div className="my-4">
                    <ButtonSubmit
                      label={'Save'}
                    />
                  </div>
                  {process.env.DEBUG === 'true' && (
                    <div>
                      <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                        {JSON.stringify(values, null, 4)}
                      </div>
                      <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                        {JSON.stringify(errors, null, 4)}
                      </div>
                    </div>
                  )}
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>
    </div>
  )
}
