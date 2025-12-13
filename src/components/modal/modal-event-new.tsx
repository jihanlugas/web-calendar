import { NextPage } from "next/types";
import { IoClose } from "react-icons/io5";
import Modal from "./modal";
import { PropertyView } from "@/types/property";
import { EventNew } from "@/types/event";
import { Form, Formik, FormikValues } from "formik";
import * as Yup from 'yup';
import TextField from "../formik/text-field";
import DateField from "../formik/date-field";
import { EVENT_STATUS } from "@/utils/constant";
import DropdownField from "../formik/dropdown-field";
import TextAreaField from "../formik/text-area-field";
import ButtonSubmit from "../formik/button-submit";
import { useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useEffect, useState } from "react";
import { displayDateTimeForm } from "@/utils/formater";
import notif from "@/utils/notif";

type Props = {
  show: boolean;
  onClickOverlay: (refresh?: boolean) => void;
  property: PropertyView
  eventNew: EventNew
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  unitId: Yup.string().required('Required'),
  startDt: Yup.string().required('Required'),
  endDt: Yup.string().required('Required'),
});


const ModalEventNew: NextPage<Props> = ({ show, onClickOverlay, property, eventNew }) => {

  const [initFormikValue, setInitFormikValue] = useState(eventNew)


  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationKey: ['event', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/event', val),
  });

  const handleSubmit = (values: any, { setSubmitting, setErrors }: any) => {
    // Prepare values for API submission
    const submitValues = {
      ...values,
      propertyId: property.id,
      // Ensure dates are in ISO format for the API
      startDt: new Date(values.startDt).toISOString(),
      endDt: new Date(values.endDt).toISOString()
    };

    mutateCreate(submitValues, {
      onSuccess: (res) => {
        setSubmitting(false);
        if (res.status) {
          notif.success(res.message || 'Event created successfully');
          onClickOverlay(true); // Close modal and refresh data
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
      setInitFormikValue({
        ...eventNew,
        startDt: displayDateTimeForm(eventNew.startDt),
        endDt: displayDateTimeForm(eventNew.endDt),
      })
    } else {
      setInitFormikValue(null)
    }
  }, [show])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="">
        <div className={'p-4 text-xl flex justify-between items-center'}>
          <div>New Event</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr />
        <div className='p-4 h-[70vh] overflow-y-auto'>
          <Formik
            initialValues={initFormikValue}
            validationSchema={schema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
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
                        name={"unitId"}
                        items={property.units}
                        keyValue={"id"}
                        keyLabel={"name"}
                        placeholder="Select Property Group"
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
                  </div>

                  <div className="mt-auto">
                    <div className={'mb-4'}>
                      <ButtonSubmit
                        label={'Save'}
                        disabled={isPendingCreate}
                        loading={isPendingCreate}
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Modal>
  )
}

export default ModalEventNew;