import { IoClose } from "react-icons/io5";
import Modal from "./modal";
import { UpdateProperty } from "@/types/property";
import { NextPage } from "next";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import notif from "@/utils/notif";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TextField from "../formik/text-field";
import TextAreaField from "../formik/text-area-field";
import TextFieldNumber from "../formik/text-field-number";
import ButtonSubmit from "../formik/button-submit";

type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  price: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: UpdateProperty = {
  name: '',
  description: '',
  price: '',
}

const ModalEditProperty: NextPage<Props> = ({ show, onClickOverlay, id }) => {

const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState<UpdateProperty>(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['property', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/property/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['property', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/property/' + selectedId, val),
  });

  const handleSubmit = async (values: UpdateProperty, formikHelpers: FormikHelpers<UpdateProperty>) => {
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
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

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          name: data.payload.name,
          description: data.payload.description,
          price: data.payload.price,
        })
      }
    }
  }, [data])

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
    }
  }, [show, id])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Property</div>
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
                          label={'Property Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Property Name'}
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
                        <TextFieldNumber
                          label={'Price'}
                          name={'price'}
                          placeholder={'Price'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Save'}
                          disabled={isPending}
                          loading={isPending}
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
