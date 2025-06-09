import ButtonSubmit from '@/components/formik/button-submit';
import TextField from '@/components/formik/text-field';
import PasswordField from '@/components/formik/password-field';
import { Form, Formik, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Api } from '@/lib/api';
import notif from '@/utils/notif';
import PageWithLayoutType from '@/types/layout';
import Main from '@/components/layout/main';
import { USER_ROLE_ADMIN } from '@/utils/constant';

type Props = object

const schema = Yup.object().shape({
  username: Yup.string().required("Required field"),
  passwd: Yup.string().required("Required field"),
});

const SingIn: NextPage<Props> = () => {

  const router = useRouter();

  const initFormikValue = {
    username: '',
    passwd: '',
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ['sign-in'],
    mutationFn: (val: FormikValues) => Api.post('/auth/sign-in', val)
  });

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutate(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            localStorage.setItem('token', res.payload.token)
            // if (router.query.redirect) {
            //   router.push(router.query.redirect as string);
            // } else {
            if (res.payload.userLogin?.role === USER_ROLE_ADMIN) {
              router.push('/admin/dashboard');
            } else {
              router.push('/dashboard');
            }
            // }
          } else {
            if (res.payload && res.payload.listError) {
              setErrors(res.payload.listError);
            } else {
              notif.error(res.message);
            }
          }
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      }
    });
  };


  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Login'}</title>
        <meta name="theme-color" content={'#FAF5FF'} />
      </Head>
      <div className={'h-dvh w-screen flex justify-center items-center'}>
        <div className={'px-4 w-full max-w-md'}>
          <div className={'w-full bg-white rounded-lg shadow p-4 mb-2'}>
            <div className={'flex justify-center mb-4'}>
              <span className={'text-xl'}>{'Login - ' + process.env.APP_NAME}</span>
            </div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
            >
              {() => {
                return (
                  <Form>
                    <div className={''}>
                      <div className="">
                        <TextField
                          label={'Username Atau Email'}
                          name={'username'}
                          type={'text'}
                          placeholder={'Username Atau Email'}
                          autoFocus
                        />
                      </div>
                      <div className="">
                        <PasswordField
                          label={'Password'}
                          name={'passwd'}
                          placeholder={'Password'}
                          autoComplete={'off'}
                        />
                      </div>
                      <div className={'mt-4'}>
                        <ButtonSubmit
                          label={'Login'}
                          disabled={isPending}
                          loading={isPending}
                        />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          {/* <div className={'flex'}>
            <div className={'mr-1'}>
              {'Don\'t have an account yet?'}
            </div>
            <Link href={'/sign-up'} passHref>
              <a className={'text-primary-500'}>
                <div>Register Now</div>
              </a>
            </Link>
          </div> */}
        </div>
        {/* <div className='absolute text-8xl -rotate-45'>Test</div> */}
      </div>

    </>
  );
};

(SingIn as PageWithLayoutType).layout = Main;

export default SingIn;