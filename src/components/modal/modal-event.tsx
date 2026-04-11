import { NextPage } from "next/types";
import { IoClose } from "react-icons/io5";
import Modal from "./modal";
import { PropertyView } from "@/types/property";
import { EventView } from "@/types/event";
import { Form, Formik, FormikValues } from "formik";
import * as Yup from 'yup';
import TextField from "@/components/formik/text-field";
import { EVENT_STATUS, EVENT_STATUS_CONFIRM, EVENT_STATUS_HOLD } from "@/utils/constant";
import DropdownField from "@/components/formik/dropdown-field";
import TextAreaField from "@/components/formik/text-area-field";
import ButtonSubmit from "@/components/formik/button-submit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useEffect, useState } from "react";
import { displayDateTime, displayDuration, displayMoney } from "@/utils/formater";
import { PriceWatcher } from "./modal-create-event";
import DateField from "../formik/date-field";
import TextFieldNumber from "../formik/text-field-number";
import notif from "@/utils/notif";
import { ImSpinner2 } from 'react-icons/im';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = {
  show: boolean;
  onClickOverlay: () => void;
  property: PropertyView
  eventId: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
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


const ModalEvent: NextPage<Props> = ({ show, onClickOverlay, property, eventId }) => {

  const [event, setEvent] = useState<EventView>(null)

  const preloads = 'Company,Orderevent'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['event', eventId, preloads],
    queryFn: ({ queryKey }) => {
      const [, eventId] = queryKey;
      return eventId ? Api.get('/event/' + eventId, { preloads }) : null
    },
  })

  useEffect(() => {
    if (data?.status) {
      setEvent(data.payload);
    }
  }, [data])


  const [tab, setTab] = useState<'summary' | 'edit'>('summary')

  useEffect(() => {
    if (!show) {
      setTab('summary')
    }
  }, [show])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-lg mb-4 flex justify-between items-center border-b'}>
          <div className="flex">
            <button
              onClick={() => setTab('summary')}
              className={
                tab === 'summary'
                  ? 'p-2 pb-4 mr-4 border-b-2 border-primary-500 text-primary-500'
                  : 'p-2 pb-4 mr-4 border-b-2 border-transparent hover:border-primary-400'
              }
            >
              Summary
            </button>

            <button
              onClick={() => setTab('edit')}
              className={
                tab === 'edit'
                  ? 'p-2 pb-4 mr-4 border-b-2 border-primary-500 text-primary-500'
                  : 'p-2 pb-4 mr-4 border-b-2 border-transparent hover:border-primary-400'
              }
            >
              Edit Event
            </button>
          </div>
          <div className="">
            <button type="button" onClick={onClickOverlay} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
              <IoClose size={'1.5rem'} className="text-rose-500" />
            </button>
          </div>
        </div>
        <div className='h-[70vh] overflow-y-auto px-4 -mx-4'>
          {isLoading ? (
            <div className="h-full flex justify-center items-center m-auto">
              <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
            </div>
          ) : event ? (
            <>
              {tab === 'summary' && <SummaryTab event={event} />}
              {tab === 'edit' && <EditTab event={event} property={property} onClickOverlay={onClickOverlay} setTab={setTab} />}
            </>
          ) : (
            <div className="flex justify-center items-center h-full m-auto">
              <div className="text-gray-500 text-3xl font-bold">Event not found</div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

interface SummaryTabProps {
  event: EventView
}

const SummaryTab: NextPage<SummaryTabProps> = ({ event }) => {
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['event', 'update', event.id],
    mutationFn: (val: EventView) => Api.put(`/event/${event.id}`, val),
  });

  const handleSetStatusConfirm = () => {
    event.status = EVENT_STATUS_CONFIRM
    mutateUpdate(event, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
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
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-4 gap-4 mb-2">
        <div className={''}>{'Event'}</div>
        <div className={'col-span-3'}>{event.name}</div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-2">
        <div className={''}>{'Description'}</div>
        <div className={'col-span-3'}>{event.description || '-'}</div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-2">
        <div className={''}>{'Status'}</div>
        {event.status === EVENT_STATUS_HOLD && (
          <div className={'col-span-3 flex items-center'}>
            <div className="mr-2 h-5 w-8 border-2 border-gray-600 bg-gray-500"></div>
            <div className="font-bold text-base">{event.status || '-'}</div>
          </div>
        )}
        {event.status === EVENT_STATUS_CONFIRM && (
          <div className={'col-span-3 flex items-center'}>
            <div className="mr-2 h-5 w-8 border-2 border-blue-600 bg-blue-500"></div>
            <div className="font-bold text-base">{event.status || '-'}</div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4 mb-2">
        <div className={''}>{'Start Date'}</div>
        <div className={'col-span-3'}>{displayDateTime(event.startDt) || '-'}</div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-2">
        <div className={''}>{'End Date'}</div>
        <div className={'col-span-3'}>{displayDateTime(event.endDt) || '-'}</div>
      </div>
      <div className="mt-4">
        <div>Order Summary</div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{event.unitName}</div>
          <div className={'col-span-3'}>{displayMoney(event.price)}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Aqua 300ml'}</div>
          <div className={'col-span-3'}>{displayMoney(50000)}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Pocari Sweet 450ml'}</div>
          <div className={'col-span-3'}>{displayMoney(12000)}</div>
        </div>
      </div>
      {event.status === EVENT_STATUS_HOLD && (
        <div className="mt-auto">
          <div className="my-2">
            <button
              className={'duration-300 bg-primary-500 border-primary-500 hover:bg-primary-600 hover:border-primary-600 focus:border-primary-600 h-10 rounded-md text-gray-50 font-semibold px-4 w-full shadow-lg shadow-primary-600/20'}
              type="button"
              onClick={handleSetStatusConfirm}
              disabled={isPendingUpdate}
            >
              <div className={'flex justify-center items-center'}>
                {isPendingUpdate ? <ImSpinner2 className={'animate-spin'} size={'1.5rem'} /> : 'Set status confirm'}
              </div>
            </button>
          </div>
        </div>
      )}
      {event.status === EVENT_STATUS_CONFIRM && (
        <div className="mt-auto">
          <div className="my-2">
            <button
              className={'duration-300 bg-primary-500 border-primary-500 hover:bg-primary-600 hover:border-primary-600 focus:border-primary-600 h-10 rounded-md text-gray-50 font-semibold px-4 w-full shadow-lg shadow-primary-600/20'}
              type="button"
              onClick={handleSetStatusConfirm}
              disabled={isPendingUpdate}
            >
              <div className={'flex justify-center items-center'}>
                {isPendingUpdate ? <ImSpinner2 className={'animate-spin'} size={'1.5rem'} /> : 'Payment'}
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface EditTabProps {
  property: PropertyView
  event: EventView
  onClickOverlay: () => void;
  setTab?: (tab: 'summary' | 'edit') => void
}

const EditTab: NextPage<EditTabProps> = ({ property, event, onClickOverlay, setTab }) => {

  const [initFormikValue, setInitFormikValue] = useState(event)

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['event', 'update', event.id],
    mutationFn: (val: FormikValues) => Api.put(`/event/${event.id}`, val),
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
    mutateUpdate(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          setSubmitting(false);
          notif.success(message);
          onClickOverlay();
          setTab('summary');
        } else if (payload?.listError) {
          setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: (error: any) => {
        setSubmitting(false);
        notif.error(error.message || 'An error occurred while updating event');
      }
    });
  }

  return (
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
              skipInitialUpdate={true}
            />
            <Form className="flex flex-col h-full" noValidate={true}>
              <div className='mb-4'>
                <div className="">
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
                </div>
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
                    disabled={isPendingUpdate}
                    loading={isPendingUpdate}
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
  )
}

export default ModalEvent;