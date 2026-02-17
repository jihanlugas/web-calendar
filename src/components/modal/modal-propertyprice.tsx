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
import { weekdays } from "moment";
import TextFieldNumber from "@/components/formik/text-field-number";
import CheckboxField from "@/components/formik/checkbox-field";
import { DAYMAP } from "@/utils/constant";
import DateField from "../formik/date-field";

type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string;
  property: PropertyView
}

const schema = Yup.object().shape({
  companyId: Yup.string(),
  propertyId: Yup.string(),
  price: Yup.number()
    .typeError('Field be a number')
    .required('Required field'),
  startTime: Yup.string(),
  endTime: Yup.string(),
  weekdays: Yup.array().of(Yup.number()),
});

const defaultInitFormikValue = {
  companyId: '',
  propertyId: '',
  price: '',
  startTime: null,
  endTime: null,
  weekdays: [],
}

const ModalPropertyprice: NextPage<Props> = ({ show, onClickOverlay, id, property }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['propertyprice', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/propertyprice/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationKey: ['propertyprice', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/propertyprice', val),
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['propertyprice', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/propertyprice/' + selectedId, val),
  });

  const handleSubmit = async (values, formikHelpers) => {
    values.price = parseFloat(values.price as string) || 0
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
          startTime: data.payload.startTime,
          endTime: data.payload.endTime,
          price: data.payload.price,
          weekdays: data.payload.weekdays,
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
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>{selectedId === '' ? 'Create Price' : 'Update Price'}</div>
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
                {({ values, setFieldValue }) => {
                  return (
                    <Form noValidate={true}>
                      <div className="mb-4">
                        <TextFieldNumber
                          label={'Price'}
                          name={`price`}
                          placeholder={'100...'}
                        />
                      </div>
                      <div className="mb-4">
                        <DateField
                          label='Start Time'
                          name='startTime'
                          dateFormat="HH:mm"
                          showTimeSelectOnly={true}
                          handleClear={true}
                        />
                      </div>
                      <div className="mb-4">
                        <DateField
                          label='End Time'
                          name='endTime'
                          dateFormat="HH:mm"
                          showTimeSelectOnly={true}
                          handleClear={true}
                        />
                      </div>
                      <div className="mb-4">
                        {DAYMAP.map((day, index) => (
                          <div key={index} className="mb-2">
                            <CheckboxField
                              label={day}
                              name="weekdays"
                              className="pb-2 pt-2"
                              value={index}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFieldValue('weekdays', [...values.weekdays, index].sort((a, b) => a - b));
                                } else {
                                  setFieldValue(
                                    'weekdays',
                                    values.weekdays.filter((v: number) => v !== index)
                                  );
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Save'}
                          disabled={isPendingCreate || isPendingUpdate}
                          loading={isPendingCreate || isPendingUpdate}
                        />
                      </div>
                      {process.env.DEBUG === 'true' && (
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(values, null, 4)}
                        </div>
                      )}
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

export default ModalPropertyprice;
