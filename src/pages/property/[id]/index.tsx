import Breadcrumb from '@/components/component/breadcrumb';;
import MainAuth from "@/components/layout/main-auth";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import ModalUnit from "@/components/modal/modal-unit";
import ModalUpdateProperty from "@/components/modal/modal-update-property";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { PropertyView } from "@/types/property";
import { PropertypriceView } from "@/types/propertyprice";
import { displayDateTime, displayDays, displayMoney } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiPlus, BiMove } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { PiFolderOpenDuotone } from 'react-icons/pi';
import { RiPencilLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


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

  const [propertyPrices, setPropertyPrices] = useState<PropertypriceView[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

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

  const { mutate: mutateSort, isPending: isPendingSort } = useMutation({
    mutationKey: ['property', 'sort', id],
    mutationFn: (sortedPrices: PropertypriceView[]) => {
      const propertyprices = sortedPrices.map((item, index) => ({
        id: item.id,
        priority: index + 1
      }));
      return Api.post(`/property/${id}/sort`, { propertyprices });
    }
  });

  const toggleModalUpdateProperty = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedPropertyId(id)
    setShowModalUpdateProperty(!showModalUpdateProperty);
  };

  // Function to move prices in the list
  const movePrice = (fromIndex: number, toIndex: number) => {
    const updatedPrices = [...propertyPrices];
    const [movedItem] = updatedPrices.splice(fromIndex, 1);
    updatedPrices.splice(toIndex, 0, movedItem);
    setHasChanges(true)
    setPropertyPrices(updatedPrices);
  };

  // Function to save the new order
  const saveSortOrder = () => {
    mutateSort(propertyPrices, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          refetch(); // Refresh data from server
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Failed to save sort order');
      },
    });
  };

  // Function to save the new order
  const cancelSortOrder = () => {
    setHasChanges(false)
    setPropertyPrices([...property.propertyprices].sort((a, b) => a.priority - b.priority));
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
        if (data.payload.propertyprices) {
          setPropertyPrices([...data.payload.propertyprices].sort((a, b) => a.priority - b.priority));
          setHasChanges(false)
        }
      }
    }
  }, [data])

  // Draggable component for property prices
  const DraggablePriceItem = ({ price, index, movePrice }: { price: PropertypriceView, index: number, movePrice: (fromIndex: number, toIndex: number) => void }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: 'price',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'price',
      hover(item: { index: number }, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        // Time to actually perform the action
        movePrice(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      },
    });

    drag(drop(ref));

    return (
      <div
        ref={ref}
        className={`flex items-center border-2 p-2 mb-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        style={{ cursor: 'move' }}
      >
        <div className="flex-1">{displayDays(price.weekdays)}</div>
        <div className="flex-1">{displayMoney(price.price)}</div>
        <div className="ml-auto flex">
          <button
            className='w-10 h-10 rounded text-gray-500 hover:text-gray-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base cursor-move'
            type="button"
            title='Drag to reorder'
          >
            <BiMove className='' size={'1.5rem'} />
          </button>
          <button
            className='w-10 h-10 rounded text-amber-500 hover:text-amber-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
            type="button"
            title='Update Price'
            onClick={() => toggleModalUnit(price.id)}
          >
            <RiPencilLine className='' size={'1.5rem'} />
          </button>
          <button
            className='w-10 h-10 rounded text-rose-500 hover:text-rose-600 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
            type="button"
            title='Delete Price'
            onClick={() => handleClickDelete(price.id, "delete")}
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
                    <DndProvider backend={HTML5Backend}>
                      <div className="">
                        {propertyPrices.map((propertyprice, index) => (
                          <DraggablePriceItem
                            key={propertyprice.id}
                            price={propertyprice}
                            index={index}
                            movePrice={movePrice}
                          />
                        ))}
                      </div>
                      {hasChanges && (
                        <div className="mt-4 flex justify-end">
                          <div className='ml-4'>
                            <button
                              className='w-60 h-10 bg-rose-500 hover:bg-rose-600 rounded text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                              type="button"
                              title='Save Sort Order'
                              onClick={cancelSortOrder}
                              disabled={isPendingSort}
                            >
                              {isPendingSort ? (
                                <AiOutlineLoading3Quarters className={'animate-spin mr-2'} size={'1.5rem'} />
                              ) : null}
                              Cancel Order
                            </button>
                          </div>
                          <div className='ml-4'>
                            <button
                              className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                              type="button"
                              title='Save Sort Order'
                              onClick={saveSortOrder}
                              disabled={isPendingSort}
                            >
                              {isPendingSort ? (
                                <AiOutlineLoading3Quarters className={'animate-spin mr-2'} size={'1.5rem'} />
                              ) : null}
                              Save Order
                            </button>
                          </div>
                        </div>

                      )}
                    </DndProvider>
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
