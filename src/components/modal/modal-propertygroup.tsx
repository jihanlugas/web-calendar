import { IoClose } from "react-icons/io5";
import Modal from "@/components/modal/modal";
import { NextPage } from "next";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import notif from "@/utils/notif";
import { Form, Formik, FormikValues } from "formik";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import ButtonSubmit from "@/components/formik/button-submit";
import { PropertyView } from "@/types/property";

type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string;
  property: PropertyView
}

const schema = Yup.object().shape({
  companyId: Yup.string(),
  propertyId: Yup.string(),
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
});

const defaultInitFormikValue = {
  companyId: '',
  propertyId: '',
  name: '',
  description: '',
}

const ModalEditProperty: NextPage<Props> = ({ show, onClickOverlay, id, property }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['propertygroup', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/propertygroup/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationKey: ['propertygroup', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/propertygroup', val),
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['propertygroup', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/propertygroup/' + selectedId, val),
  });

  const handleSubmit = async (values, formikHelpers) => {
    console.log('handleSubmit', handleSubmit)
    if (selectedId === '') {
      values.companyId = property.companyId
      values.propertyId = property.id
      mutateCreate(values, {
        onSuccess: ({ status, message, payload }) => {
          if (status) {
            formikHelpers.resetForm();
            notif.success(message);
            onClickOverlay('', true)
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
    } else {
      mutateUpdate(values, {
        onSuccess: ({ status, message, payload }) => {
          if (status) {
            formikHelpers.resetForm();
            notif.success(message);
            onClickOverlay('', true)
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

  }

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          companyId: data.payload.companyId,
          propertyId: data.payload.propertyId,
          name: data.payload.name,
          description: data.payload.description,
        })
      } else {
        setInitFormikValue(defaultInitFormikValue)
      }
    }
  }, [data])

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setInitFormikValue(defaultInitFormikValue)
      setSelectedId('')
    }
  }, [show, id])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>{selectedId === '' ? 'Create Property Group' : 'Update Property Group'}</div>
          <button type="button" onClick={() => onClickOverlay('', true)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4" />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="py-20">
              <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
            </div>
          </div>
        ) : (
          <div>
            <div className="ml-auto">
              <Formik
                initialValues={initFormikValue}
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
              >
                {({ }) => {
                  return (
                    <Form noValidate={true}>
                      <div className="mb-4">
                        <TextField
                          label={'Property Group Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Property Group Name'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextAreaField
                          label={'Description'}
                          name={'description'}
                          placeholder={'Description'}
                        />
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Save'}
                          disabled={isPendingCreate || isPendingUpdate}
                          loading={isPendingCreate || isPendingUpdate}
                        />
                      </div>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ModalEditProperty;
