import { NextPage } from "next";
import { IoClose } from "react-icons/io5";
import Modal from "@/components/modal/modal"
import { Form, Formik, FormikValues } from "formik";
import TextField from "../formik/text-field";
import DropdownField from "../formik/dropdown-field";
import DateField from "../formik/date-field";
import ButtonSubmit from "../formik/button-submit";
import { Dispatch, useEffect, useState } from "react";
import * as Yup from 'yup';
import { displayDateTime, displayDateTimeForm, displayDuration, displayMoney } from "@/utils/formater";
import TextAreaField from "../formik/text-area-field";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import notif from "@/utils/notif";
import ModalDeleteVerify from "./modal-delete-verify";
import moment from "moment";
import { PageProduct, ProductView } from "@/types/product";

type Props = {
  show: boolean;
  onClickOverlay: (refresh?: boolean) => void;
  newEvent: any;
  setItems: Dispatch<any[]>;
  property: any
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  propertyId: Yup.string().required('Required'),
  propertygroupId: Yup.string().required('Required'),
  startDt: Yup.string().required('Required'),
  endDt: Yup.string().required('Required'),
});

const ModalEvent: NextPage<Props> = ({ show, onClickOverlay, newEvent, property, setItems }) => {

  const [newData, setNewData] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("1");

  const tabs = [
    { id: "1", label: "Summary" },
    { id: "2", label: "Product" },
    { id: "3", label: "Edit" },
  ];

  useEffect(() => {
    setNewData(newEvent && newEvent.id !== '' ? false : true);
  }, [newEvent]);

  const { data: dataEvent, isLoading } = useQuery({
    queryKey: ['event', newEvent?.id],
    queryFn: () => Api.get('/event/' + newEvent?.id),
  })

  useEffect(() => {
    if (dataEvent) {
      if (dataEvent?.status) {
        setEvent(dataEvent.payload)
      } else {
        setEvent(null)
      }
    } else {
      setEvent(null)
    }
  }, [dataEvent])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Event</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        {newData ? (
          <ModalEventForm
            onClickOverlay={onClickOverlay}
            event={newEvent}
            propertygroups={property.propertygroups}
            setItems={setItems}
          />
        ) : (
          <>
            {isLoading ? (
              <div>Loading</div>
            ) : (
              <>
                <div className="flex space-x-2 border-b border-gray-300 -my-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-blue-500"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="mt-6 h-[70vh] overflow-y-auto">
                  {activeTab === "1" && (
                    <ModalEventSummary
                      event={event}
                      property={property}
                    />
                  )}
                  {activeTab === "2" && (
                    <ModalEventProduct
                      event={event}
                    />
                  )}
                  {activeTab === "3" && (
                    <ModalEventForm
                      onClickOverlay={onClickOverlay}
                      event={event}
                      propertygroups={property.propertygroups}
                      setItems={setItems}
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}

const ModalEventSummary = ({ event, property }) => {
  const getBilledHour = (
    startDt: string | Date,
    endDt: string | Date
  ): number => {
    if (!startDt || !endDt) return 0;

    const start = moment(startDt);
    const end = moment(endDt);

    const durationInMinutes = end.diff(start, 'minutes');
    if (durationInMinutes <= 0) return 0;

    // Round up to the nearest 30 minutes
    const roundedMinutes = Math.ceil(durationInMinutes / 30) * 30;
    const hours = roundedMinutes / 60;

    return hours;
  };

  const getTotalPrice = (
    pricePerHour: number,
    startDt: string | Date,
    endDt: string | Date
  ): number => {
    return getBilledHour(startDt, endDt) * pricePerHour;
  };

  if (!event) return null;

  return (
    <div>
      <div>
        <div className="text-lg py-4">Property</div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Property'}</div>
          <div className={'col-span-3'}>{event.propertyName || '-'}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Property Group'}</div>
          <div className={'col-span-3'}>{event.propertygroupName || '-'}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Price'}</div>
          <div className={'col-span-3'}>{displayMoney(property.price) || '-'}</div>
        </div>
      </div>
      <hr className="mb-4" />
      <div>
        <div className="text-lg py-4">Event</div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Event'}</div>
          <div className={'col-span-3'}>{event.name}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Description'}</div>
          <div className={'col-span-3'}>{event.description || '-'}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Start Date'}</div>
          <div className={'col-span-3'}>{displayDateTime(event.startDt) || '-'}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'End Date'}</div>
          <div className={'col-span-3'}>{displayDateTime(event.endDt) || '-'}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Duration'}</div>
          <div className={'col-span-3'}>{displayDuration(event.startDt, event.endDt) || '-'}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Billed'}</div>
          <div className={'col-span-3'}>{getBilledHour(event.startDt, event.endDt) + ' hour' || '-'}</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className={''}>{'Price'}</div>
          <div className={'col-span-3'}>{displayMoney(getTotalPrice(property.price, event.startDt, event.endDt)) || '-'}</div>
        </div>
      </div>
      <hr className="mb-4" />
      <div>
        <div className="text-lg py-4">Product</div>
      </div>
      <hr className="mb-4" />
    </div>
  )
}
const ModalEventProduct = ({ event }) => {
  const [product, setProduct] = useState<ProductView[]>([]);

  const [pageRequest, setPageRequest] = useState<PageProduct>({
    limit: -1,
    page: 1,
    companyId: event.companyId,
    preloads: "",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['product', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/product', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setProduct(data.payload.list);
    }
  }, [data]);

  if (!event) return null;

  return (
    <div>
      <div className="text-lg py-4">Product</div>
      <div className="grid grid-cols-4 gap-4">
        {product.map((item, key) => (
          <div key={key} className="rounded overflow-hidden shadow">
            <div className="h-28 bg-red-400"></div>
            <div className="p-2 text-center">
              <div className="text-sm h-12">{item.name}</div>
              <div className="text-primary-500">{displayMoney(item.price)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



const ModalEventForm = ({ onClickOverlay, event, propertygroups, setItems }) => {

  const [initFormikValue, setInitFormikValue] = useState(event)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationKey: ['event', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/event', val),
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['event', event.id, 'update'],
    mutationFn: (val: FormikValues) => Api.put('/event/' + event.id, val),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['event', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/event/' + id)
  });

  useEffect(() => {
    if (event) {
      setInitFormikValue({
        ...event,
        startDt: displayDateTimeForm(event.startDt),
        endDt: displayDateTimeForm(event.endDt),
      })
    }
  }, [event])

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
  };

  const handleSubmit = (values, formikHelpers) => {
    values.startDt = (values.startDt ? new Date(values.startDt as string).toISOString() : null)
    values.endDt = (values.endDt ? new Date(values.endDt as string).toISOString() : null)

    if (values.id !== '') {
      mutateUpdate(values, {
        onSuccess: ({ status, message, payload }) => {
          if (status) {
            setItems([])
            onClickOverlay(true)
            notif.success(message);
          } else if (payload?.listError) {
            values.startDt = values.startDt ? displayDateTimeForm(values.startDt) : ''
            values.endDt = values.endDt ? displayDateTimeForm(values.endDt) : ''
            formikHelpers.setErrors(payload.listError);
          } else {
            notif.error(message);
          }
        },
        onError: () => {
          notif.error('Please cek you connection');
        }
      })
    } else {
      mutateCreate(values, {
        onSuccess: ({ status, message, payload }) => {
          if (status) {
            onClickOverlay(true)
            notif.success(message);
          } else if (payload?.listError) {
            values.startDt = values.startDt ? displayDateTimeForm(values.startDt) : ''
            values.endDt = values.endDt ? displayDateTimeForm(values.endDt) : ''
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

  const handleDelete = () => {
    mutateDelete(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDelete();
          onClickOverlay(true)
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    });
  };

  const handleClickDelete = (id, name) => {
    toggleModalDelete(id, name)
  }

  if (!event) return null;

  return (
    <div className='h-[70vh]'>
      <ModalDeleteVerify
        show={showModalDelete}
        onClickOverlay={toggleModalDelete}
        onDelete={handleDelete}
        verify={deleteVerify}
        isLoading={isPendingDelete}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDeleteVerify>
      <Formik
        initialValues={initFormikValue}
        validationSchema={schema}
        enableReinitialize={true}
        onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
      >
        {({ values }) => {
          return (
            <Form noValidate={true} className="h-[70vh] flex flex-col">
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
                    label={"Property Group"}
                    name={"propertygroupId"}
                    items={propertygroups}
                    keyValue={"id"}
                    keyLabel={"name"}
                    placeholder="Select Property Group"
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
              </div>
              <div className="mt-auto">
                <div className={''}>
                  <ButtonSubmit
                    label={'Save'}
                    disabled={isPendingCreate || isPendingUpdate}
                    loading={isPendingCreate || isPendingUpdate}
                  />
                </div>
                {event && event.id && (
                  <div className="mt-4">
                    <button
                      className={'duration-300 bg-rose-500 border-rose-500 hover:bg-rose-600 hover:border-rose-600 focus:border-rose-600 h-10 rounded-md text-gray-50 font-semibold px-4 w-full shadow-lg shadow-rose-600/20'}
                      type="button"
                      onClick={() => handleClickDelete(event.id, event.name)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(values, null, 4)}
              </div> */}
            </Form>
          );
        }}
      </Formik>
    </div>
  )
}

export default ModalEvent;