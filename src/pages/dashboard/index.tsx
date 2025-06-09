import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAuth from '@/components/layout/main-auth';
import Breadcrumb from '@/components/breadcrumb';
import { useEffect, useState } from 'react';
import { PropertyView } from '@/types/property';
import moment from 'moment';
import Timeline from '@/components/timeline';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import ModalEvent from '@/components/modal/modal-event';
import { BiPlus } from 'react-icons/bi';

const Index = () => {
  const [properties, setProperties] = useState<PropertyView[]>([]);


  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  useEffect(() => {
    if (loginUser?.status) {
      setProperties(loginUser?.payload?.user?.company.properties || [])
    }
  }, [loginUser])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Dashboard'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Dashboard', path: '' },
          ]}
        />
        {properties.map((property, key) => {
          return (
            <SingleTimeline
              key={key}
              property={property}
            />
          )
        })}
      </div>
    </>
  );
};

const SingleTimeline = ({ property }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [items, setItems] = useState([]);
  const [showModalEvent, setShowModalEvent] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState(null);

  const [pageRequest, setPageRequest] = useState({
    companyId: property.companyId,
    propertyId: property.id,
    startDt: moment().add(-1 * property.propertytimeline.defaultStartDtValue * 2, property.propertytimeline.defaultStartDtUnit).toISOString(), // *2 agar dapat data lebih banyak, karena onBoundsChange juga get data lebih jauh
    endDt: moment().add(property.propertytimeline.defaultEndDtValue * 2, property.propertytimeline.defaultEndDtUnit).toISOString(), // *2 agar dapat data lebih banyak, karena onBoundsChange juga get data lebih jauh
    preloads: "",
  });


  const { isLoading, data, refetch } = useQuery({
    queryKey: ['event', 'timeline', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/event/timeline', queryKey[2] as object),
  });


  const onBoundsChange = (canvasTimeStart, canvasTimeEnd) => {
    setPageRequest({
      ...pageRequest,
      startDt: moment(canvasTimeStart).toISOString(),
      endDt: moment(canvasTimeEnd).toISOString(),
    })
    console.log('onBoundsChange')
    console.log('canvasTimeStart', new Date(canvasTimeStart))
    console.log('canvasTimeEnd', new Date(canvasTimeEnd))
  }

  const onCanvasDoubleClick = (groupId, time, e) => {
    const startDt = new Date(time)
    const endDt = new Date(time)

    setNewEvent({
      id: '',
      companyId: property.companyId,
      name: '',
      description: '',
      propertyId: property.id,
      propertygroupId: groupId,
      startDt: new Date(startDt.setHours(startDt.getHours(), 0, 0, 0)),
      endDt: new Date(endDt.setHours(endDt.getHours() + 1, 0, 0, 0)),
    })

    toggleModalEvent()
  }

  const handleClickNewEvent = () => {
    const startDt = new Date()
    const endDt = new Date()

    setNewEvent({
      id: '',
      companyId: property.companyId,
      name: '',
      description: '',
      propertyId: property.id,
      propertygroupId: "",
      startDt: new Date(startDt.setHours(startDt.getHours() + 1, 0, 0, 0)),
      endDt: new Date(endDt.setHours(endDt.getHours() + 2, 0, 0, 0)),
    })

    toggleModalEvent()
  }

  const onItemClick = (itemId) => {
    setNewEvent(items.find(item => item.id === itemId))
    toggleModalEvent()
  }

  const onItemMove = (itemId, dragTime, propertyId) => {
    console.log('onItemMove')
    console.log('itemId ', itemId)
    console.log('dragTime ', new Date(dragTime))
    console.log('propertyId ', propertyId)

    setItems(items.map(item => {
      if (item.id === itemId) {

        const duration = moment.duration(moment(item.endDt).diff(moment(item.startDt)));
        return {
          ...item,
          startDt: moment(dragTime),
          endDt: moment(dragTime).add(duration),
        }
      }
      return item
    }))
  }

  const toggleModalEvent = (refresh = false) => {
    if (refresh) {
      refetch()
      setSelectedItem(null)
    }
    setShowModalEvent(!showModalEvent);
  }

  useEffect(() => {
    if (data?.status) {
      const newData = data.payload.map((v) => {
        return {
          ...v,
          startDt: moment(v.startDt),
          endDt: moment(v.endDt),
        }
      })
      setItems(newData);
    }
  }, [data]);

  return (
    <>
      <ModalEvent
        show={showModalEvent}
        onClickOverlay={toggleModalEvent}
        newEvent={newEvent}
        setItems={setItems}
        property={property}
      />
      <div className='bg-white mb-4 p-4 rounded shadow'>
        <div className='flex justify-end'>
          <button type='button' onClick={handleClickNewEvent} className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
            <BiPlus className='mr-2' size={'1.5rem'} />
            <div>New Event</div>
          </button>
        </div>
        <Timeline
          isLoading={isLoading}
          propertyName={property.name}
          defaultTimeStart={moment().add(-1 * property.propertytimeline.defaultStartDtValue, property.propertytimeline.defaultStartDtUnit).valueOf()}
          defaultTimeEnd={moment().add(property.propertytimeline.defaultEndDtValue, property.propertytimeline.defaultEndDtUnit).valueOf()}
          minZoom={1000 * 60 * 60 * property.propertytimeline.minZoomTimelineHour}
          maxZoom={1000 * 60 * 60 * property.propertytimeline.maxZoomTimelineHour}
          dragSnap={1000 * 60 * property.propertytimeline.dragSnapMin}
          groups={property.propertygroups}
          items={items}
          onBoundsChange={onBoundsChange}
          onCanvasDoubleClick={onCanvasDoubleClick}
          onItemSelect={(itemId) => setSelectedItem(itemId as string)}
          onItemClick={onItemClick}
          onItemMove={onItemMove}
          selected={selectedItem ? [selectedItem] : []}
          onCanvasClick={() => setSelectedItem(null)}
        />
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;