import { IoClose } from "react-icons/io5";
import Modal from "@/components/modal/modal";
import { NextPage } from "next";
import * as Yup from 'yup';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import notif from "@/utils/notif";
import { Form, Formik, FormikValues } from "formik";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import ButtonSubmit from "@/components/formik/button-submit";
import { CreatePropertyprice, PropertyView } from "@/types/property";
import { weekdays } from "moment";
import TextFieldNumber from "../formik/text-field-number";
import CheckboxField from "../formik/checkbox-field";
import { DAYMAP } from "@/utils/constant";
import { getUuid } from "@/utils/helper";

type Props = {
  show: boolean;
  onClickOverlay: (propertyprice?: CreatePropertyprice) => void;
  propertyprice: CreatePropertyprice;
  setPropertyprice: Dispatch<SetStateAction<CreatePropertyprice>>
  dataindex?: number;
  handleSubmitPropertyprice?: (propertyprice: CreatePropertyprice) => void;

}

const schema = Yup.object().shape({
  companyId: Yup.string(),
  propertyId: Yup.string(),
  price: Yup.number()
    .typeError('Field be a number')
    .required('Required field'),
  weekdays: Yup.array().of(Yup.number()).min(1, 'Select at least one day').required('Required field'),
});

const defaultInitFormikValue: CreatePropertyprice = {
  id: '',
  priority: 0,
  price: '',
  weekdays: [],
}

const ModalCreatePropertyPropertyprice: NextPage<Props> = ({ show, onClickOverlay, propertyprice, setPropertyprice, dataindex, handleSubmitPropertyprice }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState(null)

  const handleSubmit = (values) => {
    handleSubmitPropertyprice(values);
    onClickOverlay();
  }

  useEffect(() => {
    if (show) {
      if (dataindex === null) {
        setInitFormikValue({
          ...defaultInitFormikValue,
          id: getUuid(),
        })
      } else {
        setInitFormikValue(propertyprice)
      }
    }
  }, [show])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>{selectedId === '' ? 'Create Price' : 'Update Price'}</div>
          <button type="button" onClick={() => onClickOverlay(null)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4" />
        <div>
          <div className="ml-auto">
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ values, errors, setFieldValue, touched }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4">
                      <TextFieldNumber
                        label={'Price'}
                        name={`price`}
                        placeholder={'100...'}
                        autoFocus={true}
                      />
                    </div>
                    <div className="mb-4">
                      {DAYMAP.map((day, index) => (
                        <div key={index} className="mb-2">
                          <CheckboxField
                            showError={false}
                            label={day}
                            name="weekdays"
                            className="pb-2 pt-2"
                            disabled={values?.priority === 1}
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
                      {touched.weekdays && errors.weekdays && <div className="text-rose-500">{errors.weekdays as string}</div>}
                    </div>
                    <div className="mb-4">
                      <ButtonSubmit
                        label={'Save'}
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
      </div>
    </Modal>
  );
}

export default ModalCreatePropertyPropertyprice;
