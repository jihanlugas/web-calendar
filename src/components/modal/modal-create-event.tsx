import { NextPage } from "next/types";
import { IoClose } from "react-icons/io5";
import Modal from "./modal";
import { PropertyView } from "@/types/property";
import { EventNew } from "@/types/event";
import { Form, Formik, FormikValues, useFormikContext } from "formik";
import * as Yup from 'yup';
import TextField from "@/components/formik/text-field";
import DateField from "@/components/formik/date-field";
import { EVENT_STATUS } from "@/utils/constant";
import DropdownField from "@/components/formik/dropdown-field";
import TextAreaField from "@/components/formik/text-area-field";
import ButtonSubmit from "@/components/formik/button-submit";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import notif from "@/utils/notif";
import TextFieldNumber from "@/components/formik/text-field-number";

type Props = {
  show: boolean;
  onClickOverlay: () => void;
  property: PropertyView
  eventNew: EventNew
}


type PriceWatcherProps = {
  propertyId: string;
  mutateGetPrice: UseMutateFunction<any, unknown, { propertyId: string; startDt: string; endDt: string }, unknown>;
  skipInitialUpdate?: boolean; // Optional flag to skip initial update
};


const schema = Yup.object().shape({
  customerId: Yup.string(),
  customerName: Yup.string().when("customerId", {
    is: (customerId) => !customerId || customerId.trim() === "",
    then: (schema) => schema.required("Nama customer wajib diisi"),
    otherwise: (schema) => schema.notRequired(),
  }),
  customerPhoneNumber: Yup.string(),
  unitId: Yup.string().required('Required'),
  startDt: Yup.string().required('Required'),
  endDt: Yup.string()
    .required('Required')
    .test(
      'is-after-start',
      'End date harus lebih besar dari start date',
      function (value) {
        const { startDt } = this.parent;
        if (!startDt || !value) return true;

        return new Date(value) > new Date(startDt);
      }
    ),
  price: Yup.number().required('Required'),
});



export function PriceWatcher({ propertyId, mutateGetPrice, skipInitialUpdate = false }: PriceWatcherProps) {
  const { values, setFieldValue, initialValues } = useFormikContext<any>();

  useEffect(() => {
    if (!values) return;

    const { startDt, endDt } = values;

    // Jika skipInitialUpdate true, skip jika tanggal sama dengan initial
    if (skipInitialUpdate && initialValues) {
      if (startDt === initialValues.startDt && endDt === initialValues.endDt) {
        return;
      }
    }

    if (!propertyId || !startDt || !endDt) return;

    const start = new Date(startDt);
    const end = new Date(endDt);

    if (end <= start) return;

    mutateGetPrice(
      {
        propertyId,
        startDt: start.toISOString(),
        endDt: end.toISOString(),
      },
      {
        onSuccess: (res: any) => {
          if (res.status) {
            setFieldValue("price", res.payload || null);
          }
        },
        onError: (error: any) => {
          notif.error(error.message || 'An error occurred while fetching price');
        }
      }
    );
  }, [propertyId, values?.startDt, values?.endDt, skipInitialUpdate]);

  return null;
}


const ModalCreateEvent: NextPage<Props> = ({ show, onClickOverlay, property, eventNew }) => {

  const [initFormikValue, setInitFormikValue] = useState(eventNew)

  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationKey: ['event', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/event', val),
  });

  const { mutate: mutateGetPrice } = useMutation({
    mutationKey: ['property', 'get-price'],
    mutationFn: (payload: { propertyId: string; startDt: string; endDt: string }) =>
      Api.post('/property/get-price', payload)
    // onSuccess: (res) => {
    //   if (res.status) {
    //     formRef.current.setFieldValue('price', (res.payload || null));
    //   } else {
    //     notif.error(res.message || 'Failed to get price');
    //   }
    // },
    // onError: (error: any) => {
    //   notif.error(error.message || 'An error occurred while fetching price');
    // }
  });

  const handleSubmit = (values: any, { setSubmitting, setErrors }: any) => {
    // Prepare values for API submission
    const submitValues = {
      ...values,
      propertyId: property.id,
    };

    mutateCreate(submitValues, {
      onSuccess: (res) => {
        setSubmitting(false);
        if (res.status) {
          notif.success(res.message || 'Event created successfully');
          onClickOverlay();
        } else {
          if (res.payload?.listError) {
            setErrors(res.payload.listError);
          }
          notif.error(res.message || 'Failed to create event');
        }
      },
      onError: (error: any) => {
        setSubmitting(false);
        notif.error(error.message || 'An error occurred while creating the event');
      }
    });
  };

  useEffect(() => {
    if (show) {
      setInitFormikValue(eventNew)
    } else {
      setInitFormikValue(null)
    }
  }, [show])


  return (
    <Modal show={show && initFormikValue !== null} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-lg mb-4 flex justify-between items-center'}>
          <div>Create Event</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr />
        <div className='h-[70vh] overflow-y-auto px-4 -mx-4'>
          <Formik
            initialValues={initFormikValue}
            validationSchema={schema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => {
              return (
                <>
                  <PriceWatcher
                    propertyId={property.id}
                    mutateGetPrice={mutateGetPrice}
                  />
                  <Form className="flex flex-col h-full" noValidate={true}>
                    <div className='my-4'>
                      {/* <div className="">
                        <TextField
                          label={'Event Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Event Name'}
                          required
                        />
                      </div>
                      <div className="">
                        <TextAreaField
                          label={'Description'}
                          name={'description'}
                          placeholder={'Description'}
                        />
                      </div> */}
                      <div className="">
                        <DropdownField
                          label={"Unit"}
                          name={"unitId"}
                          items={property.units}
                          keyValue={"id"}
                          keyLabel={"name"}
                          placeholder="Select Unit"
                          placeholderValue={""}
                          required
                        />
                      </div>
                      <div className="">
                        <DropdownField
                          label={"Status"}
                          name={"status"}
                          items={EVENT_STATUS}
                          keyValue={"value"}
                          keyLabel={"label"}
                          placeholder="Select Status"
                          placeholderValue={""}
                          required
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
                        <DateField
                          label='End Date'
                          name='endDt'
                          required
                        />
                      </div>
                      <div className="">
                        <TextFieldNumber
                          label={'Price'}
                          name={`price`}
                          placeholder={'1...'}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="my-2">
                        <ButtonSubmit
                          label={'Save'}
                          disabled={isPendingCreate}
                          loading={isPendingCreate}
                        />
                      </div>
                    </div>
                    {process.env.DEBUG === 'true' && (
                      <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                        {JSON.stringify(values, null, 4)}
                      </div>
                    )}
                  </Form>
                </>
              );
            }}
          </Formik>
        </div>
      </div>
    </Modal>
  )
}

export default ModalCreateEvent;