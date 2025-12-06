import { NextPage } from "next/types";
import { IoClose } from "react-icons/io5";
import Modal from "./modal";
import { PropertyView } from "@/types/property";
import { EventView } from "@/types/event";
import { Form, Formik, FormikValues } from "formik";
import * as Yup from 'yup';
import TextField from "../formik/text-field";
import DateField from "../formik/date-field";
import { EVENT_STATUS, EVENT_STATUS_CONFIRM, EVENT_STATUS_HOLD } from "@/utils/constant";
import DropdownField from "../formik/dropdown-field";
import TextAreaField from "../formik/text-area-field";
import ButtonSubmit from "../formik/button-submit";
import { useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useEffect, useState } from "react";
import { displayDateTime, displayDateTimeForm, displayDuration, displayMoney } from "@/utils/formater";

type Props = {
  show: boolean;
  onClickOverlay: (refresh?: boolean) => void;
  property: PropertyView
  event: EventView
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  propertyId: Yup.string().required('Required'),
  propertygroupId: Yup.string().required('Required'),
  startDt: Yup.string().required('Required'),
  endDt: Yup.string().required('Required'),
});


const ModalEventSummary: NextPage<Props> = ({ show, onClickOverlay, property, event }) => {

  const [initFormikValue, setInitFormikValue] = useState(event)

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="">
        <div className={'p-4 text-xl flex justify-between items-center'}>
          <div>Summary Event</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr />
        {event && (
          <div className='p-4 h-[70vh] overflow-y-auto'>
            <div>
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
              <div className="grid grid-cols-4 gap-4 mb-2">
                <div className={''}>{'Duration'}</div>
                <div className={'col-span-3'}>{displayDuration(event.startDt, event.endDt) || '-'}</div>
              </div>
              {/* <div className="grid grid-cols-4 gap-4 mb-2">
              <div className={''}>{'Billed'}</div>
              <div className={'col-span-3'}>{getBilledHour(event.startDt, event.endDt) + ' hour' || '-'}</div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-2">
              <div className={''}>{'Price'}</div>
              <div className={'col-span-3'}>{displayMoney(getTotalPrice(property.price, event.startDt, event.endDt)) || '-'}</div>
            </div> */}
            </div>
          </div>
        )}

      </div>
    </Modal>
  )
}

export default ModalEventSummary;