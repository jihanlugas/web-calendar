import Breadcrumb from "@/components/breadcrumb";
import ButtonSubmit from "@/components/formik/button-submit";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import TextFieldNumber from "@/components/formik/text-field-number";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { CreateProduct } from "@/types/product";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import * as Yup from 'yup';


type Props = object

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string(),
  price: Yup.number().nullable().required('Required field'),
});


const initFormikValue: CreateProduct = {
  companyId: '',
  name: '',
  description: '',
  price: '',
}


const New: NextPage<Props> = () => {

  const router = useRouter();

  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['product', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/product', val),
  });

  const handleSubmit = async (values: CreateProduct, formikHelpers: FormikHelpers<CreateProduct>) => {
    values.companyId = loginUser?.payload?.user?.company?.id

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/product')
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
        <title>{process.env.APP_NAME + ' - Create Product'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Product', path: '/product' },
            { name: 'Create Product', path: '' },
          ]}
        />
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
              {({ values }) => {
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
                      <div className="">
                        <TextFieldNumber
                          label={'Price'}
                          name={'price'}
                          placeholder={'Price'}
                          required
                        />
                      </div>
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