import Breadcrumb from '@/components/component/breadcrumb';;
import MainAuth from "@/components/layout/main-auth";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import ModalUnit from "@/components/modal/modal-unit";
import ModalUpdateProperty from "@/components/modal/modal-update-property";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { PropertyView } from "@/types/property";
import { displayDateTime, displayDays, displayMoney } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { PiFolderOpenDuotone } from 'react-icons/pi';
import { RiPencilLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";


type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {
  const queryClient = useQueryClient()

  const [property, setProperty] = useState<PropertyView>(null)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')
  const [selectedPropertyGroupId, setSelectedPropertyGroupId] = useState<string>('')

  const [showModalUpdateProperty, setShowModalUpdateProperty] = useState<boolean>(false);
  const [showModalUnit, setShowModalUnit] = useState<boolean>(false);

  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const preloads = 'Units,Propertyprices'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['property', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/property/' + id, { preloads }) : null
    },
  })

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['unit', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/unit/' + id)
  });

  const toggleModalUpdateProperty = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedPropertyId(id)
    setShowModalUpdateProperty(!showModalUpdateProperty);
  };

  const toggleModalUnit = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedPropertyGroupId(id)
    setShowModalUnit(!showModalUnit);
  };

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
  };

  const handleDelete = () => {
    mutateDelete(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          refetch()
          setDeleteId('');
          toggleModalDelete();
          notif.success(message);
          queryClient.invalidateQueries({ queryKey: ['init'] })
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

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setProperty(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Property Detail'}</title>
      </Head>
      <ModalUpdateProperty
        show={showModalUpdateProperty}
        onClickOverlay={toggleModalUpdateProperty}
        id={selectedPropertyId}
      />
      <ModalUnit
        show={showModalUnit}
        onClickOverlay={toggleModalUnit}
        property={property}
        id={selectedPropertyGroupId}
      />
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
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Property', path: '/property' },
            { name: property?.name || id, path: '' },
          ]}
        />
        <div>
          {isLoading ? (
            <div className='bg-white mb-20 p-4 rounded shadow'>
              <div className="flex justify-center items-center">
                <div className="py-20">
                  <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
                </div>
              </div>
            </div>
          ) : !property ? (
            <div className='bg-white mb-20 p-4 rounded shadow'>
              <div className='w-full text-center my-16'>
                <div className='flex justify-center items-center mb-4'>
                  <PiFolderOpenDuotone size={'4rem'} className={'text-gray-500'} />
                </div>
                <div>
                  {'No data found'}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className='bg-white p-4 rounded shadow mb-4'>
                <div className="text-xl flex justify-between items-center mb-4">
                  <div>Property</div>
                  <button
                    className='w-60 h-10 bg-amber-500 hover:bg-amber-600 rounded text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                    type="button"
                    title='Update Property'
                    onClick={() => toggleModalUpdateProperty(property?.id)}
                  >
                    <RiPencilLine className='mr-2' size={'1.5rem'} />
                    <div>Update Property</div>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="">{'Name'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{property?.name}</div>
                  <div className="">{'Description'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600 whitespace-pre-wrap">{property?.description || '-'}</div>
                  <div className="">{'Create By'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{property?.createName}</div>
                  <div className="">{'Create Date'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{displayDateTime(property?.createDt)}</div>
                  <div className="">{'Last Update By'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{property?.updateName}</div>
                  <div className="">{'Last Update Date'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{displayDateTime(property?.updateDt)}</div>
                </div>
              </div>
              <div className='bg-white p-4 rounded shadow mb-4'>
                <div className="text-xl flex justify-between items-center mb-4">
                  <div>Unit</div>
                  <button
                    className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                    type="button"
                    title='Create Unit'
                    onClick={() => toggleModalUnit()}
                  >
                    <BiPlus className='mr-2' size={'1.5rem'} />
                    <div>Create Unit</div>
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {property?.units ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                      {property?.units.sort((a, b) => a.name.localeCompare(b.name)).map((unit, key) => (
                        <div key={key} className="flex items-center border-b-2 pb-2">
                          <div data-tooltip-id={`tootltip-name-${unit.id}`} className="flex-1">{unit.name}</div>
                          {unit.description && (
                            <Tooltip id={`tootltip-name-${unit.id}`} clickable>
                              <div className="font-bold">Description</div>
                              <div className="whitespace-pre-line">{unit.description}</div>
                            </Tooltip>
                          )}
                          <div className="ml-auto flex">
                            <button
                              className='w-10 h-10 rounded text-amber-500 hover:text-amber-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                              type="button"
                              title='Update Unit'
                              onClick={() => toggleModalUnit(unit.id)}
                            >
                              <RiPencilLine className='' size={'1.5rem'} />
                            </button>
                            <button
                              className='w-10 h-10 rounded text-rose-500 hover:text-rose-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                              type="button"
                              title='Delete Unit'
                              onClick={() => handleClickDelete(unit.id, unit.name)}
                            >
                              <IoClose className='' size={'1.5rem'} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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
              <div className='bg-white p-4 rounded shadow mb-4'>
                <div className="text-xl flex justify-between items-center mb-4">
                  <div>Prices</div>
                </div>
                <div className="">
                  {property?.propertyprices ? (
                    <div className="">
                      {property?.propertyprices.sort((a, b) => a.priority - b.priority).map((propertyprice, key) => (
                        <div key={key} className="flex items-center border-b-2 pb-2">
                          <div className="flex-1">{displayDays(propertyprice.weekdays)}</div>
                          <div className="flex-1">{displayMoney(propertyprice.price)}</div>
                          <div className="ml-auto flex">
                            <button
                              className='w-10 h-10 rounded text-amber-500 hover:text-amber-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                              type="button"
                              title='Update Price'
                              onClick={() => toggleModalUnit(propertyprice.id)}
                            >
                              <RiPencilLine className='' size={'1.5rem'} />
                            </button>
                            <button
                              className='w-10 h-10 rounded text-rose-500 hover:text-rose-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                              type="button"
                              title='Delete Price'
                              onClick={() => handleClickDelete(propertyprice.id, "delete")}
                            >
                              <IoClose className='' size={'1.5rem'} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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
              {process.env.DEBUG === 'true' && (
                <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                  {JSON.stringify(property, null, 4)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}



(Index as PageWithLayoutType).layout = MainAuth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;
