import Breadcrumb from '@/components/component/breadcrumb';;
import ButtonSubmit from "@/components/formik/button-submit";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import TextFieldNumber from "@/components/formik/text-field-number";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import { LoginUser } from "@/types/auth";
import PageWithLayoutType from "@/types/layout";
import { CreateProperty, CreatePropertyprice } from "@/types/property";
import { displayDays, displayMoney } from '@/utils/formater';
import notif from "@/utils/notif";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FieldArray, Form, Formik, FormikHelpers, FormikValues } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { BiMove, BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { PiFolderOpenDuotone } from 'react-icons/pi';
import { RiPencilLine } from 'react-icons/ri';
import * as Yup from 'yup';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { useRef, useState } from 'react';
import ModalCreatePropertyPropertyprice from '@/components/modal/modal-create-property-propertyprice';
import { getUuid } from '@/utils/helper';
import { error } from 'console';


type Props = {
  loginUser: LoginUser
}

const schemaPrice = Yup.object().shape({
  companyId: Yup.string(),
  propertyId: Yup.string(),
  price: Yup.number()
    .typeError('Price field be a number')
    .required('Price required field'),
  weekdays: Yup.array().of(Yup.number()).min(1, 'Weekdays at least one day').required('Weekdays required field'),
});

const schemaUnit = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string(),
});

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string(),
  units: Yup
    .array()
    .of(schemaUnit)
    .min(1, 'At least one Unit is required')
    .required('Units are required'),
  propertyprices: Yup
    .array()
    .of(schemaPrice)
    .min(1, 'At least one Price is required')
    .required('Prices are required'),
});


const initFormikValue: CreateProperty = {
  companyId: '',
  name: '',
  description: '',
  units: [{
    name: "",
    description: "",
  }],
  propertyprices: [
    {
      id: getUuid(),
      priority: 1,
      price: 0,
      weekdays: [0, 1, 2, 3, 4, 5, 6],
    }
  ],
}


const New: NextPage<Props> = ({ loginUser }) => {
  const queryClient = useQueryClient()
  const router = useRouter();

  const [showModalPropertyprice, setShowModalPropertyprice] = useState<boolean>(false);
  const [propertyprice, setPropertyprice] = useState<CreatePropertyprice>(null);
  const [dataindex, setDataindex] = useState<number>(null);
  const formRef = useRef(null);

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['property', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/property', val),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 🔥 penting untuk mobile
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const handleDragStart = () => {
    // document.body.style.overflow = 'hidden';
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const prices: CreatePropertyprice[] =
      formRef.current.values.propertyprices;

    // hanya yang bisa di-drag
    const draggable = prices.filter(p => p.priority !== 1);
    const fixed = prices.filter(p => p.priority === 1);

    const oldIndex = draggable.findIndex(
      p => p.id === active.id
    );
    const newIndex = draggable.findIndex(
      p => p.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(draggable, oldIndex, newIndex);

    formRef.current.setFieldValue('propertyprices', [
      ...reordered,
      ...fixed,
    ]);
  };



  const toggleModalPropertyprice = (propertyprice?: CreatePropertyprice, index?: number) => {
    setPropertyprice(propertyprice);
    setDataindex(index);
    setShowModalPropertyprice(!showModalPropertyprice);
  };

  const handleSubmit = async (values: CreateProperty, formikHelpers: FormikHelpers<CreateProperty>) => {
    values.companyId = loginUser.user.company.id

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          console.log('fetch init')
          queryClient.invalidateQueries({ queryKey: ['init'] })
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

  const handleSubmitPropertyprice = (values: CreatePropertyprice) => {
    if (dataindex !== null) {
      formRef.current.setFieldValue(`propertyprices.${dataindex}`, values);
    } else {
      const currentPropertyprices = formRef.current.values.propertyprices || []
      formRef.current.setFieldValue(`propertyprices`, [values, ...currentPropertyprices]);
    }
    // formRef.current.setFieldValue(`propertyprices.${dataindex ?? formRef.current.values.propertyprices.length}`, values);
    // setShowModalPropertyprice(false);
  }

  const SortablePriceItem = ({ propertyprice, index, remove }: { propertyprice: CreatePropertyprice, index: number, remove: (index: number) => void }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: propertyprice.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center border-2 p-2 mb-2 ${isDragging
          ? 'opacity-75 shadow-lg z-10 bg-white'
          : 'opacity-100'
          }`}
      >
        <div className="flex-1">{displayDays(propertyprice.weekdays)}</div>
        <div className="flex-1">{displayMoney(propertyprice.price as number)}</div>
        <div className="ml-auto flex">
          <div
            {...attributes}
            {...listeners}
            className="w-10 h-10 flex justify-center items-center cursor-grab active:cursor-grabbing touch-none text-gray-500 hover:text-gray-700"
            title='Drag to reorder'
          >
            <BiMove className='' size={'1.5rem'} />
          </div>
          <button
            className='w-10 h-10 rounded text-amber-500 hover:text-amber-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
            type="button"
            title='Update Price'
            onClick={() => toggleModalPropertyprice(propertyprice, index)}
          >
            <RiPencilLine className='' size={'1.5rem'} />
          </button>
          <button
            className='w-10 h-10 rounded text-rose-500 hover:text-rose-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
            type="button"
            title='Delete Price'
            onClick={() => remove(index)}
          >
            <IoClose className='' size={'1.5rem'} />
          </button>
        </div>
      </div>
    );
  };


  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Create Property'}</title>
      </Head>
      <ModalCreatePropertyPropertyprice
        show={showModalPropertyprice}
        onClickOverlay={toggleModalPropertyprice}
        propertyprice={propertyprice}
        setPropertyprice={setPropertyprice}
        dataindex={dataindex}
        handleSubmitPropertyprice={handleSubmitPropertyprice}
      />
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
          <div className=''>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              innerRef={formRef}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values, errors }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4">
                      <div className="text-lg">Property</div>
                      <hr className="my-4" />
                      <div className="mb-4 max-w-xl">
                        <TextField
                          label={'Property Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Property Name'}
                          required
                        />
                      </div>
                      <div className="mb-4 max-w-xl">
                        <TextAreaField
                          label={'Description'}
                          name={'description'}
                          placeholder={'Description'}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <FieldArray name="units">
                        {({ remove, push }) => {
                          return (
                            <div>
                              <div className="flex justify-between items-center">
                                <div className="text-lg">Unit</div>
                                <button
                                  className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                                  type="button"
                                  title='Create Unit'
                                  onClick={() => push({ name: '', description: '' })}
                                >
                                  <BiPlus className='mr-2' size={'1.5rem'} />
                                  <div>Create Unit</div>
                                </button>
                              </div>
                              <hr className="my-4" />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                                {values.units.map((unit, key) => (
                                  <div key={key} className="flex items-center">
                                    <TextField
                                      label={'Unit Name'}
                                      name={`units.${key}.name`}
                                      type={'text'}
                                      placeholder={'Unit Name'}
                                      required
                                    />
                                    <button type="button" disabled={values.units.length === 1} className="mt-auto mb-6 h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 text-rose-500 hover:text-rose-600 disabled:text-gray-500 disabled:cursor-not-allowed" onClick={() => remove(key)}>
                                      <IoClose className='' size={'1.5rem'} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        }}
                      </FieldArray>
                    </div>
                    <div className="mb-4">
                      <FieldArray name="propertyprices">
                        {({ remove, push }) => {
                          return (
                            <div>
                              <div>
                                <div className="flex justify-between items-center">
                                  <div className="text-lg">Price</div>
                                  <button
                                    className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                                    type="button"
                                    title='Create Price'
                                    onClick={() => toggleModalPropertyprice(null, null)}
                                  >
                                    <BiPlus className='mr-2' size={'1.5rem'} />
                                    <div>Create Price</div>
                                  </button>
                                </div>
                                <hr className="my-4" />
                                <div className="">
                                  {values.propertyprices ? (
                                    (() => {
                                      try {
                                        return (

                                          <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleDragEnd}
                                            onDragStart={handleDragStart}
                                            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                                          >
                                            <SortableContext
                                              items={values.propertyprices.filter((item) => item.priority !== 1).map((item) => item)}
                                              strategy={verticalListSortingStrategy}
                                            >
                                              {values.propertyprices.map((propertyprice, index) => {
                                                if (propertyprice.priority === 1) return null;
                                                return (
                                                  <SortablePriceItem
                                                    key={propertyprice.id}
                                                    propertyprice={propertyprice}
                                                    index={index}
                                                    remove={remove}
                                                  />
                                                );
                                              })}
                                            </SortableContext>
                                            <div className="">
                                              {values.propertyprices.filter((item) => item.priority === 1).map((propertyprice, index) => (
                                                <div
                                                  key={index}
                                                >
                                                  <div className='flex items-center border-2 p-2 mb-2'>
                                                    <div className="flex-1">{displayDays(propertyprice.weekdays)}</div>
                                                    <div className="flex-1">{displayMoney(propertyprice.price as number)}</div>
                                                    <div className="ml-auto flex">
                                                      <button
                                                        className='w-10 h-10 rounded text-amber-500 hover:text-amber-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                                                        type="button"
                                                        title='Update Price'
                                                        onClick={() => toggleModalPropertyprice(propertyprice, index)}
                                                      >
                                                        <RiPencilLine className='' size={'1.5rem'} />
                                                      </button>
                                                      <button
                                                        className='w-10 h-10 rounded text-rose-500 hover:text-rose-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base disabled:text-gray-500 disabled:cursor-not-allowed'
                                                        type="button"
                                                        disabled={propertyprice.priority === 1}
                                                        title='Delete Price'
                                                        onClick={() => remove(index)}
                                                      >
                                                        <IoClose className='' size={'1.5rem'} />
                                                      </button>
                                                    </div>
                                                  </div>
                                                  {errors.propertyprices && errors.propertyprices[index] && Object.values(errors.propertyprices[index]).map((dataerr, key) => (
                                                    <div className="text-rose-500 mb-2" key={key}>{dataerr}</div>
                                                  ))}
                                                </div>
                                              ))}
                                            </div>
                                          </DndContext>
                                        );
                                      } catch (error) {
                                        // Fallback to non-draggable list if dnd-kit fails
                                        console.error('Dnd-kit error:', error);
                                        return (
                                          <div className="">
                                            {values.propertyprices.map((propertyprice, index) => (
                                              <div
                                                key={index}
                                                className='flex items-center border-2 p-2 mb-2'
                                              >
                                                <div className="flex-1">{displayDays(propertyprice.weekdays)}</div>
                                                <div className="flex-1">{displayMoney(propertyprice.price as number)}</div>
                                                <div className="ml-auto flex">
                                                  <button
                                                    className='w-10 h-10 rounded text-amber-500 hover:text-amber-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                                                    type="button"
                                                    title='Update Price'
                                                    onClick={() => toggleModalPropertyprice(propertyprice, index)}
                                                  >
                                                    <RiPencilLine className='' size={'1.5rem'} />
                                                  </button>
                                                  <button
                                                    className='w-10 h-10 rounded text-rose-500 hover:text-rose-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                                                    type="button"
                                                    title='Delete Price'
                                                    onClick={() => remove(index)}
                                                  >
                                                    <IoClose className='' size={'1.5rem'} />
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        );
                                      }
                                    })()
                                  ) : (
                                    <div className='w-full text-center my-16'>
                                      <div className='flex justify-center items-center mb-4'>
                                        <PiFolderOpenDuotone size={'4rem'} className={'text-gray-500'} />
                                      </div>
                                      <div>
                                        {'No data found'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        }}
                      </FieldArray>
                    </div>
                    <div className="mb-4 max-w-xl">
                      <ButtonSubmit
                        label={'Save'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    {process.env.DEBUG === 'true' && (
                      <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                        {JSON.stringify({ 'values': values, 'errors': errors }, null, 4)}
                      </div>
                    )}
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