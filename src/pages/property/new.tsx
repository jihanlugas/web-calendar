import Breadcrumb from "@/components/breadcrumb";
import ButtonSubmit from "@/components/formik/button-submit";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import TextFieldNumber from "@/components/formik/text-field-number";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { CreateProperty } from "@/types/property";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FieldArray, Form, Formik, FormikHelpers, FormikValues } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import * as Yup from 'yup';


type Props = object

const schemaPropertygroup = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string(),
});

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string(),
  price: Yup.number().nullable().required('Required field'),
  propertygroups: Yup
    .array()
    .of(schemaPropertygroup)
    .min(1, 'At least one property group is required')
    .required('Property groups are required'),
});


const initFormikValue: CreateProperty = {
  companyId: '',
  name: '',
  description: '',
  price: '',
  propertygroups: [{
    name: "",
    description: "",
  }],
}


const New: NextPage<Props> = () => {

  const router = useRouter();

  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['property', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/property', val),
  });

  const handleSubmit = async (values: CreateProperty, formikHelpers: FormikHelpers<CreateProperty>) => {
    values.companyId = loginUser?.payload?.user?.company?.id

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/property')
        } else if (payload?.listError) {
          formikHelpers.setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      }
    });
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Create Property'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Property', path: '/property' },
            { name: 'Create Property', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Create Property</div>
          </div>
          <div className='max-w-xl'>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4">
                      <div className="text-lg">Property</div>
                      <hr className="my-4" />
                      <div className="">
                        <TextField
                          label={'Property Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Property Name'}
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
                      <div className="">
                        <TextFieldNumber
                          label={'Price'}
                          name={'price'}
                          placeholder={'Price'}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <FieldArray name="propertygroups">
                        {({ insert, remove, push }) => {
                          return (
                            <div>
                              <div className="flex justify-between items-center">
                                <div className="text-lg">Property Group</div>
                                <button type="button" className="h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 shadow hover:scale-105 text-primary-500 hover:text-primary-600" onClick={() => push({ name: "", description: "" })}>
                                  <BiPlus className='' size={'1.5rem'} />
                                </button>
                              </div>
                              <hr className="my-4" />
                              {values.propertygroups.map((propertygroup, key) => (
                                <div key={key}>
                                  <div className="flex">
                                    <TextField
                                      label={'Group Name'}
                                      name={`propertygroups.${key}.name`}
                                      type={'text'}
                                      placeholder={'Group Name'}
                                      required
                                    />
                                    <button type="button" disabled={values.propertygroups.length === 1} className="mt-auto mb-6 h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 text-rose-500 hover:text-rose-600 disabled:text-gray-500 cursor-not-allowed" onClick={() => remove(key)}>
                                      <IoClose className='' size={'1.5rem'} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        }}
                      </FieldArray>
                    </div>
                    <div className="my-4">
                      <ButtonSubmit
                        label={'Save'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div>
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(errors, null, 4)}
                    </div> */}
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}

(New as PageWithLayoutType).layout = MainAuth;

export default New;