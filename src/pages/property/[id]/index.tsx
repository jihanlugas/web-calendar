import Breadcrumb from "@/components/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import ModalPropertygroup from "@/components/modal/modal-propertygroup";
import ModalUpdateProperty from "@/components/modal/modal-update-property";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { PropertyView } from "@/types/property";
import { displayDateTime, displayMoney } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { RiPencilLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";


type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {
  const [property, setProperty] = useState<PropertyView>(null)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')
  const [selectedPropertyGroupId, setSelectedPropertyGroupId] = useState<string>('')

  const [showModalUpdateProperty, setShowModalUpdateProperty] = useState<boolean>(false);
  const [showModalPropertygroup, setShowModalPropertygroup] = useState<boolean>(false);

  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const preloads = 'Propertygroups'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['property', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/property/' + id, { preloads }) : null
    },
  })

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['propertygroup', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/propertygroup/' + id)
  });

  const toggleModalUpdateProperty = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedPropertyId(id)
    setShowModalUpdateProperty(!showModalUpdateProperty);
  };

  const toggleModalPropertygroup = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedPropertyGroupId(id)
    setShowModalPropertygroup(!showModalPropertygroup);
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
      <ModalPropertygroup
        show={showModalPropertygroup}
        onClickOverlay={toggleModalPropertygroup}
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
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
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
                <hr className="my-4 border-2" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="">{'Name'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{property?.name}</div>
                  <div className="">{'Description'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600 whitespace-pre-wrap">{property?.description || '-'}</div>
                  <div className="">{'Price'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{displayMoney(property?.price)}</div>
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
              <hr className="my-4 border" />
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Property Group</div>
                  <button
                    className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                    type="button"
                    title='Create Property Group'
                    onClick={() => toggleModalPropertygroup()}
                  >
                    <BiPlus className='mr-2' size={'1.5rem'} />
                    <div>Create Property Group</div>
                  </button>
                </div>
                <hr className="my-4 border-2" />
                <div className="grid grid-cols-1 gap-4">
                  {property?.propertygroups ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                      {property?.propertygroups.sort((a, b) => a.name.localeCompare(b.name)).map((propertygroup, key) => (
                        <div key={key} className="flex items-center border-b-2 pb-2">
                          <div data-tooltip-id={`tootltip-name-${propertygroup.id}`} className="flex-1">{propertygroup.name}</div>
                          {propertygroup.description && (
                            <Tooltip id={`tootltip-name-${propertygroup.id}`} clickable>
                              <div className="font-bold">Description</div>
                              <div className="whitespace-pre-line">{propertygroup.description}</div>
                            </Tooltip>
                          )}
                          <div className="ml-auto flex">
                            <button
                              className='w-10 h-10 rounded text-amber-500 hover:text-amber-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                              type="button"
                              title='Update Property Group'
                              onClick={() => toggleModalPropertygroup(propertygroup.id)}
                            >
                              <RiPencilLine className='' size={'1.5rem'} />
                            </button>
                            <button
                              className='w-10 h-10 rounded text-rose-500 hover:text-rose-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                              type="button"
                              title='Delete Property Group'
                              onClick={() => handleClickDelete(propertygroup.id, propertygroup.name)}
                            >
                              <IoClose className='' size={'1.5rem'} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                      <div className="col-span-1 md:col-span-5 mb-4 md:mb-0 text-gray-600">{"No Data"}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(property, null, 4)}
              </div> */}
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
