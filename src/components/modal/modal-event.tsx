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
import { QueryObserverResult, RefetchOptions, useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useEffect, useState } from "react";
import { displayDateTime, displayDuration, displayMoney } from "@/utils/formater";
import { PriceWatcher } from "./modal-create-event";
import DateField from "../formik/date-field";
import TextFieldNumber from "../formik/text-field-number";
import notif from "@/utils/notif";
import { ImSpinner2 } from 'react-icons/im';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CreateOrderpayment } from "@/types/orderpayment";
import { CompanypaymentmethodView, PageCompanypaymentmethod } from "@/types/companypaymentmethod";
import { PageCompany } from "@/types/company";
import { LuLayoutList, LuPencil, LuWallet } from "react-icons/lu";
import { MdOutlineCalendarToday, MdOutlineShoppingCart, MdOutlineTimelapse } from "react-icons/md";
import { IoMdPricetags } from "react-icons/io";

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

const schemaOrderpayment = Yup.object().shape({
  companypaymentmethodId: Yup.string().required('Required'),
  name: Yup.string().required('Required'),
  total: Yup.number().required('Required'),
});


const ModalEvent: NextPage<Props> = ({ show, onClickOverlay, property, eventId }) => {

  const [event, setEvent] = useState<EventView>(null)
  const [companypaymentmethods, setCompanypaymentmethods] = useState<CompanypaymentmethodView[]>([])

  const preloads = 'Company,Order,Order.Orderevents,Order.Orderproducts,Order.Orderpayments'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['event', eventId, preloads],
    queryFn: ({ queryKey }) => {
      const [, eventId] = queryKey;
      return eventId ? Api.get('/event/' + eventId, { preloads }) : null
    },
  })

  const [pageRequest, setPageRequest] = useState<PageCompanypaymentmethod>({
    limit: 100,
    page: 1,
    preloads: "",
  });

  const { data: dataCompanypaymentmethod, isLoading: isLoadingCompanypaymentmethod, refetch: refetchCompanypaymentmethod } = useQuery({
    queryKey: ['companypaymentmethod', pageRequest],
    queryFn: ({ queryKey }) => {
      return Api.get('/companypaymentmethod', queryKey[1] as object)
    },
  })

  useEffect(() => {
    if (data?.status) {
      setEvent(data.payload);
    }
  }, [data])

  useEffect(() => {
    setCompanypaymentmethods(dataCompanypaymentmethod?.payload?.list || [])
  }, [dataCompanypaymentmethod])


  const [tab, setTab] = useState<'summary' | 'edit' | 'payment'>('summary')

  useEffect(() => {
    if (!show) {
      setTab('summary')
    } else {
      refetchCompanypaymentmethod()
    }
  }, [show])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-4xl'}>
      <div className="p-4">
        <div className="mb-2 flex justify-between">
          <div>
            <div className="text-xl font-bold">{event?.name}</div>
            <div className="flex items-center text-sm text-gray-700 gap-2 mb-1">
              <div>{event?.propertyName}</div>
              <div className="text-gray-500">•</div>
              <div>{event?.unitName}</div>
            </div>
            <div className="flex">
              {event?.status === EVENT_STATUS_CONFIRM && (
                <div className={'py-1 px-2 rounded-lg text-xs mr-4 font-bold bg-blue-200 text-blue-500'}>{EVENT_STATUS_CONFIRM}</div>
              )}
              {event?.status === EVENT_STATUS_HOLD && (
                <div className={'py-1 px-2 rounded-lg text-xs mr-4 font-bold bg-gray-200 text-gray-500'}>{EVENT_STATUS_HOLD}</div>
              )}
              {event?.order && (
                <>
                  {event?.order?.outstanding > 0 ? (
                    <div className={'py-1 px-2 rounded-lg text-xs mr-4 font-bold bg-rose-200 text-rose-500'}>{"UNPAID"}</div>
                  ) : (
                    <div className={'py-1 px-2 rounded-lg text-xs mr-4 font-bold bg-green-200 text-green-500'}>{"PAID"}</div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="">
            <button type="button" onClick={onClickOverlay} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
              <IoClose size={'1.5rem'} className="text-rose-500" />
            </button>
          </div>
        </div>
        <div className={' mb-4 flex justify-start items-center border-b text-base font-bold'}>
          <button
            onClick={() => setTab('summary')}
            className={
              tab === 'summary'
                ? 'p-2 pb-4 px-8 border-b-2 border-primary-500 text-primary-500'
                : 'p-2 pb-4 px-8 border-b-2 border-transparent hover:border-primary-400 hover:text-primary-400'
            }
          >
            <div className="flex items-center">
              <LuLayoutList className="mr-2" size={"1.0em"} />
              <span>Summary</span>
            </div>
          </button>
          <button
            onClick={() => setTab('edit')}
            className={
              tab === 'edit'
                ? 'p-2 pb-4 px-8 border-b-2 border-primary-500 text-primary-500'
                : 'p-2 pb-4 px-8 border-b-2 border-transparent hover:border-primary-400 hover:text-primary-400'
            }
          >
            <div className="flex items-center">
              <LuPencil className="mr-2" size={"1.0em"} />
              <span>Edit Event</span>
            </div>

          </button>
          <button
            onClick={() => setTab('payment')}
            className={
              tab === 'payment'
                ? 'p-2 pb-4 px-8 border-b-2 border-primary-500 text-primary-500'
                : 'p-2 pb-4 px-8 border-b-2 border-transparent hover:border-primary-400 hover:text-primary-400'
            }
          >
            <div className="flex items-center">
              <LuWallet className="mr-2" size={"1.0em"} />
              <span>Payment</span>
            </div>
          </button>
        </div>
        <div className='h-[70vh] overflow-y-auto px-4 -mx-4'>
          {isLoading ? (
            <div className="h-full flex justify-center items-center m-auto">
              <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
            </div>
          ) : event ? (
            <>
              {tab === 'summary' && <SummaryTab event={event} setTab={setTab} refetch={refetch} />}
              {tab === 'edit' && <EditTab event={event} property={property} onClickOverlay={onClickOverlay} setTab={setTab} refetch={refetch} />}
              {tab === 'payment' && <PaymentTab event={event} property={property} onClickOverlay={onClickOverlay} setTab={setTab} refetch={refetch} companypaymentmethods={companypaymentmethods} />}
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
  setTab?: (tab: 'summary' | 'edit' | 'payment') => void
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
}

const SummaryTab: NextPage<SummaryTabProps> = ({ event, refetch, setTab }) => {
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['event', event.id, 'confirm'],
    mutationFn: () => Api.post(`/event/${event.id}/confirm`),
  });

  const handleSetStatusConfirm = () => {
    mutateUpdate(null, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          refetch();
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      }
    });
  }

  const handlePayment = () => {
    setTab('payment')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4 flex">
          <div className="flex-none w-10 h-10 flex justify-center items-center mr-2 bg-blue-200 text-blue-500 rounded">
            <MdOutlineCalendarToday className="" size={"1.5em"} />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="h-10 min-h-10 flex-none flex items-center mb-2">
              <div className="font-bold">Event Information</div>
            </div>
            <div className="h-full flex flex-col">
              <div className="mb-2">
                <div className="text-gray-500">Event Name</div>
                <div className="text-gray-700">{event.name}</div>
              </div>
              <div className="mb-2">
                <div className="text-gray-500">Description</div>
                <div className="text-gray-700">{event.description || '-'}</div>
              </div>
              <div className="mb-2">
                <div className="text-gray-500">Status</div>
                <div className="flex items-center">
                  {event.status === EVENT_STATUS_CONFIRM && (
                    <span className="h-3 w-3 mr-2 rounded-full bg-blue-500"></span>
                  )}
                  {event.status === EVENT_STATUS_HOLD && (
                    <span className="h-3 w-3 mr-2 rounded-full bg-gray-500"></span>
                  )}
                  <span className="lowercase first-letter:uppercase">{event.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded p-4 flex">
          <div className="flex-none w-10 h-10 flex justify-center items-center mr-2 bg-blue-200 text-blue-500 rounded">
            <MdOutlineTimelapse className="" size={"1.5em"} />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="h-10 min-h-10 flex-none flex items-center mb-2">
              <div className="font-bold">Schedule</div>
            </div>
            <div className="h-full flex flex-col">
              <div className="mb-2">
                <div className="text-gray-500">Start Date</div>
                <div className="text-gray-700">{displayDateTime(event.startDt)}</div>
              </div>
              <div className="mb-2">
                <div className="text-gray-500">End Date</div>
                <div className="text-gray-700">{displayDateTime(event.endDt)}</div>
              </div>
              <div className="mt-auto flex justify-between px-1 py-2 -mx-1 font-bold">
                <div className="">Duration</div>
                <div className="">{displayDuration(event.startDt, event.endDt)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded p-4 flex">
          <div className="flex-none w-10 h-10 flex justify-center items-center mr-2 bg-green-200 text-green-500 rounded">
            <MdOutlineShoppingCart className="" size={"1.5em"} />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="h-10 min-h-10 flex-none flex items-center mb-2">
              <div className="font-bold">Order Summary</div>
            </div>
            <div className="h-full flex flex-col">
              {event.order.orderevents?.map((orderevent) => {
                return (
                  <div key={orderevent.id} className="mb-2 flex justify-between">
                    <div className="text-gray-500">{orderevent.unitName}</div>
                    <div className="text-gray-700">{displayMoney(orderevent.total)}</div>
                  </div>
                )
              })}
              {event.order.orderproducts?.map((orderproduct) => {
                return (
                  <div key={orderproduct.id} className="mb-2 flex justify-between">
                    <div className="text-gray-500">{orderproduct.productName}</div>
                    <div className="text-gray-700">{displayMoney(orderproduct.total)}</div>
                  </div>
                )
              })}
              <hr className="mb-2" />
              <div className="mb-2 flex justify-between">
                <div className="text-gray-500">Subtotal</div>
                <div className="text-gray-700">{displayMoney(event.order.subtotal)}</div>
              </div>
              {/* {event.order.orderdiscounts?.map((orderdiscount) => {
              return (
                <div key={orderdiscount.id} className="mb-2 flex justify-between">
                  <div className="text-gray-500">{orderdiscount.discountName}</div>
                  <div className="text-gray-700">{displayMoney(orderdiscount.total)}</div>
                </div>
              )
            })}
            {event.order.discount > 0 && (
              <div className="mb-2 flex justify-between">
                <div className="text-gray-500">Discount</div>
                <div className="text-gray-700">{displayMoney(event.order.discount)}</div>
              </div>
            )}
            {event.order.ordertaxes?.map((ordertax) => {
              return (
                <div key={ordertax.id} className="mb-2 flex justify-between">
                  <div className="text-gray-500">{ordertax.taxName}</div>
                  <div className="text-gray-700">{displayMoney(ordertax.total)}</div>
                </div>
              )
            })}
            {event.order.tax > 0 && (
              <div className="mb-2 flex justify-between">
                <div className="text-gray-500">Tax</div>
                <div className="text-gray-700">{displayMoney(event.order.tax)}</div>
              </div>
            )} */}
              <div className="mt-auto flex justify-between px-1 py-2 -mx-1 bg-rounded font-bold">
                <div className="">Total Order</div>
                <div className="">{displayMoney(event.order.total)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded p-4 flex">
          <div className="flex-none w-10 h-10 flex justify-center items-center mr-2 bg-rose-200 text-rose-500 rounded">
            <LuWallet className="" size={"1.5em"} />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="h-10 min-h-10 flex-none flex items-center mb-2">
              <div className="font-bold">Payment</div>
            </div>
            <div className="h-full flex flex-col">
              <div className="mb-2 flex justify-between">
                <div className="text-gray-500">Total Order</div>
                <div className="text-gray-700">{displayMoney(event.order.total)}</div>
              </div>
              <hr className="mb-2" />
              {event.order.orderpayments?.map((orderpayment) => {
                return (
                  <div key={orderpayment.id} className="mb-2 flex justify-between">
                    <div className="text-gray-500">{orderpayment.name}</div>
                    <div className="text-gray-700">{displayMoney(orderpayment.total)}</div>
                  </div>
                )
              })}
              <div className="mb-2 flex justify-between text-green-500">
                <div className="">Total Payment</div>
                <div className="">{displayMoney(event.order.payment)}</div>
              </div>
              {event.order.outstanding > 0 && (
                <div className="mb-2 flex justify-between text-rose-500">
                  <div className="">Outstanding</div>
                  <div className="">{displayMoney(event.order.payment)}</div>
                </div>
              )}
              {event.order.outstanding > 0 ? (
                <div className="mt-auto flex justify-between px-1 py-2 -mx-1 bg-rounded font-bold text-rose-500">
                  <div className={''}>{''}</div>
                  <div className={''}>{'UNPAID'}</div>
                </div>
              ) : (
                <div className="mt-auto flex justify-between px-1 py-2 -mx-1 bg-rounded font-bold text-green-500">
                  <div className={''}>{''}</div>
                  <div className={''}>{'PAID'}</div>
                </div>
              )}
            </div>
          </div>
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
                {isPendingUpdate ? <ImSpinner2 className={'animate-spin'} size={'1.5rem'} /> : 'Confirm event'}
              </div>
            </button>
          </div>
        </div>
      )}
      {event.status === EVENT_STATUS_CONFIRM && event.order.outstanding > 0 && (
        <div className="mt-auto">
          <div className="my-2">
            <button
              className={'duration-300 bg-primary-500 border-primary-500 hover:bg-primary-600 hover:border-primary-600 focus:border-primary-600 h-10 rounded-md text-gray-50 font-semibold px-4 w-full shadow-lg shadow-primary-600/20'}
              type="button"
              onClick={handlePayment}
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
  setTab?: (tab: 'summary' | 'edit' | 'payment') => void
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
}

const EditTab: NextPage<EditTabProps> = ({ property, event, onClickOverlay, setTab, refetch }) => {

  const [initFormikValue, setInitFormikValue] = useState(event)

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['event', 'update', event.id],
    mutationFn: (val: FormikValues) => Api.put(`/event/${event.id}`, val),
  });

  const { mutate: mutateGetPrice } = useMutation({
    mutationKey: ['property', 'get-price'],
    mutationFn: (payload: { propertyId: string; startDt: string; endDt: string }) =>
      Api.post('/property/get-price', payload)
  });

  const handleSubmit = (values: any, { setSubmitting, setErrors }: any) => {
    mutateUpdate(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          setSubmitting(false);
          notif.success(message);
          onClickOverlay();
          setTab('summary');
          refetch();
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
                {/* Event Information */}
                <div>
                  <div className="flex">
                    <div className="flex-none w-10 h-10 flex justify-center items-center mr-2 bg-blue-200 text-blue-500 rounded">
                      <MdOutlineCalendarToday className="" size={"1.5em"} />
                    </div>
                    <div className="h-10 min-h-10 flex-none flex items-center mb-2">
                      <div className="font-bold">Event Information</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="">
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
                    </div>
                    <div className="">
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
                          disabled={values.status === EVENT_STATUS_CONFIRM}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="mb-4" />
                {/* Schedule */}
                <div>
                  <div className="flex">
                    <div className="flex-none w-10 h-10 flex justify-center items-center mr-2 bg-blue-200 text-blue-500 rounded">
                      <MdOutlineTimelapse className="" size={"1.5em"} />
                    </div>
                    <div className="h-10 min-h-10 flex-none flex items-center mb-2">
                      <div className="font-bold">Schedule</div>
                    </div>
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
                </div>
                <hr className="mb-4" />
                {/* Pricing */}
                <div>
                  <div className="flex">
                    <div className="flex-none w-10 h-10 flex justify-center items-center mr-2 bg-green-200 text-green-500 rounded">
                      <IoMdPricetags className="" size={"1.5em"} />
                    </div>
                    <div className="h-10 min-h-10 flex-none flex items-center mb-2">
                      <div className="font-bold">Pricing</div>
                    </div>
                  </div>
                  <div className="">
                    <TextFieldNumber
                      label={'Price'}
                      name={`price`}
                      placeholder={'1000...'}
                      required
                    />
                  </div>
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

interface PaymentTabProps {
  property: PropertyView
  event: EventView
  onClickOverlay: () => void;
  setTab?: (tab: 'summary' | 'edit' | 'payment') => void
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
  companypaymentmethods: CompanypaymentmethodView[]
}

const PaymentTab: NextPage<PaymentTabProps> = ({ property, event, onClickOverlay, setTab, refetch, companypaymentmethods }) => {

  const defaultFormikValue: CreateOrderpayment = {
    companyId: property.companyId,
    orderId: event.orderId,
    companypaymentmethodId: '',
    name: '',
    total: ''
  }

  const [initFormikValue, setInitFormikValue] = useState<CreateOrderpayment>(defaultFormikValue)

  const { mutate: mutateCreatePayment, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['orderpayment', 'create'],
    mutationFn: (val: FormikValues) => Api.post(`/orderpayment`, val),
  });

  // const { mutate: mutateGetPrice } = useMutation({
  //   mutationKey: ['property', 'get-price'],
  //   mutationFn: (payload: { propertyId: string; startDt: string; endDt: string }) =>
  //     Api.post('/property/get-price', payload)
  // });


  const handleSubmit = (values: any, { setSubmitting, setErrors, resetForm }: any) => {
    console.log('values', values)
    mutateCreatePayment(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          setSubmitting(false);
          notif.success(message);
          // onClickOverlay();
          resetForm();
          refetch();
        } else if (payload?.listError) {
          setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: (error: any) => {
        setSubmitting(false);
        notif.error(error.message || 'An error occurred while create payment');
      }
    });
  }

  if (event.order == null) {
    return (
      <div className="flex justify-center items-center h-full m-auto">
        <div className="text-gray-500 text-3xl font-bold">No order found</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <DisplayOrderPayment event={event} />

      {event.order.outstanding > 0 && (
        <>
          <hr className="mb-2" />
          <Formik
            initialValues={initFormikValue}
            validationSchema={schemaOrderpayment}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({ values }) => {
              return (
                <Form className="flex flex-col h-full" noValidate={true}>
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div className="text-xl">Create Payment</div>
                    <div className="col-span-2">
                      <div className="">
                        <DropdownField
                          label={"Payment Method"}
                          name={"companypaymentmethodId"}
                          items={companypaymentmethods}
                          keyValue={"id"}
                          keyLabel={"paymentmethodName"}
                          placeholder="Select Payment Method"
                          placeholderValue={""}
                          required
                        />
                      </div>
                      <div className="">
                        <TextField
                          label={'Payment Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'DP, Pelunasan ...'}
                          required
                        />
                      </div>
                      <div className="">
                        <TextFieldNumber
                          label={'Amount'}
                          name={`total`}
                          placeholder={'1...'}
                          required
                        />
                      </div>
                      <div className="my-2">
                        <ButtonSubmit
                          label={'Save'}
                          disabled={isPendingUpdate}
                          loading={isPendingUpdate}
                        />
                      </div>

                      {process.env.DEBUG === 'true' && (
                        <div>
                          <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                            {JSON.stringify(values, null, 4)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </>
      )}

    </div>
  )
}

interface DisplayOrderPaymentProps {
  event: EventView
}

const DisplayOrderPayment: NextPage<DisplayOrderPaymentProps> = ({ event }) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div className="text-xl">Order</div>
        <div className="col-span-2">
          {event.order.orderevents?.map((orderevent) => {
            return (
              <div key={orderevent.id} className="flex justify-between mb-2">
                <div className={''}>{orderevent.unitName}</div>
                <div className={''}>{displayMoney(orderevent.total)}</div>
              </div>
            )
          })}
          {event.order.orderproducts?.map((orderproduct) => {
            return (
              <div key={orderproduct.id} className="flex justify-between mb-2">
                <div className={''}>{orderproduct.productName}</div>
                <div className={''}>{displayMoney(orderproduct.price)}</div>
                <div className={''}>{displayMoney(orderproduct.total)}</div>
              </div>
            )
          })}
          <hr className="mb-2" />
          <div className="flex justify-between mb-2">
            <div className={''}>{'Subtotal'}</div>
            <div className={''}>{displayMoney(event.order.subtotal)}</div>
          </div>
          {event.order.tax > 0 && (
            <div className="flex justify-between mb-2">
              <div className={''}>{'Tax'}</div>
              <div className={''}>{displayMoney(event.order.tax)}</div>
            </div>
          )}
          {event.order.discount > 0 && (
            <div className="flex justify-between mb-2">
              <div className={''}>{'Discount'}</div>
              <div className={''}>{displayMoney(event.order.discount)}</div>
            </div>
          )}
          {event.order.rounding > 0 && (
            <div className="flex justify-between mb-2">
              <div className={''}>{'Rounding'}</div>
              <div className={''}>{displayMoney(event.order.rounding)}</div>
            </div>
          )}
          <hr className="mb-2" />
          <div className="flex justify-between mb-2">
            <div className={''}>{'Total Order'}</div>
            <div className={''}>{displayMoney(event.order.total)}</div>
          </div>
        </div>

      </div>
      <hr className="mb-2" />
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div className="text-xl">Payment</div>
        <div className="col-span-2">
          {event.order.orderpayments && event.order.orderpayments.length > 0 && (
            <>
              {event.order.orderpayments?.map((orderpayment) => {
                return (
                  <div key={orderpayment.id} className="flex justify-between mb-2">
                    <div className={''}>{orderpayment.name}</div>
                    <div className={'text-green-500'}>{displayMoney(orderpayment.total)}</div>
                  </div>
                )
              })}
              <hr className="mb-2" />
            </>
          )}
          <div className="flex justify-between mb-2">
            <div className={''}>{'Total Payment'}</div>
            <div className={'text-green-500'}>{displayMoney(event.order.payment)}</div>
          </div>

          {event.order.outstanding > 0 && (
            <div className="flex justify-between mb-2">
              <div className={''}>{'Outstanding'}</div>
              <div className={'text-red-500'}>{displayMoney(event.order.outstanding)}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ModalEvent;