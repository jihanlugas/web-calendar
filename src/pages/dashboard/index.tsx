import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAuth from '@/components/layout/main-auth';
import Breadcrumb from '@/components/component/breadcrumb';
import { useEffect, useState } from 'react';
import { PageProperty, PropertyView } from '@/types/property';
import moment from 'moment';
import Timeline from '@/components/timeline';
import ModalCreateEvent from '@/components/modal/modal-create-event';
import { BiPlus } from 'react-icons/bi';
import { NextPage } from 'next/types';
import { LoginUser } from '@/types/auth';
import { Api } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { EventNew, EventView } from '@/types/event';
import notif from '@/utils/notif';
import useWebSocket from '@/utils/hook';
import { EVENT_STATUS_CONFIRM } from '@/utils/constant';
import ModalEvent from '@/components/modal/modal-event';

type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {
  const [properties, setProperties] = useState<PropertyView[]>([]);



  const [pageRequest, setPageRequest] = useState<PageProperty>({
    limit: -1,
    page: 1,
    preloads: "Propertytimeline,Units",
  });


  const { isLoading, data, refetch } = useQuery({
    queryKey: ['property', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/property', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setProperties(data.payload.list);
    }
  }, [data]);

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
        {properties.map((property) => {
          return (
            <SingleTimeline
              key={property.id}
              property={property}
            />
          )
        })}
      </div>
    </>
  );
};

type SingleTimelineProps = {
  property: PropertyView
}

const defaultEvent: EventNew = {
  companyId: '',
  name: '',
  description: '',
  propertyId: '',
  unitId: '',
  startDt: new Date(),
  endDt: new Date(),
  status: EVENT_STATUS_CONFIRM,
  price: '',
}

const SingleTimeline: NextPage<SingleTimelineProps> = ({ property }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [items, setItems] = useState<EventView[]>([]);
  const [showModalCreateEvent, setShowModalCreateEvent] = useState<boolean>(false);
  const [showModalEvent, setShowModalEvent] = useState<boolean>(false);
  const [eventNew, setEventNew] = useState<EventNew>(defaultEvent);
  const [eventId, setEventId] = useState<string>("");
  const [dorefetch, setDorefetch] = useState(0);

  const [pageRequest, setPageRequest] = useState({
    companyId: property.companyId,
    propertyId: property.id,
    startDt: moment().startOf("day").toISOString(),
    endDt: moment().endOf("day").toISOString(),
    preloads: "",
  });

  // const { isLoading, data, refetch } = useQuery({
  //   queryKey: ['event', 'timeline', pageRequest],
  //   queryFn: ({ queryKey }) => Api.get('/event/timeline', queryKey[2] as object),
  // });

  const { mutate: mutateUpdate } = useMutation({
    mutationKey: ['event', 'update'],
    mutationFn: (val: EventView) => Api.put('/event/' + val?.id, val),
  });


  const onBoundsChange = (canvasTimeStart, canvasTimeEnd) => {
    setPageRequest({
      ...pageRequest,
      startDt: moment(canvasTimeStart).toISOString(),
      endDt: moment(canvasTimeEnd).toISOString(),
    })
  }

  const url = process.env.WS_END_POINT + '/ws?propertyId=' + property.id;
  const { isConnected, messages, connect, sendMessage } = useWebSocket({ url, autoReconnect: true });

  const onCanvasClick = (groupId, time, e) => {
    const startDt = new Date(time)
    const endDt = new Date(time)

    setEventNew({
      companyId: property.companyId,
      name: '',
      description: '',
      propertyId: property.id,
      unitId: groupId,
      startDt: new Date(startDt.setHours(startDt.getHours(), 0, 0, 0)),
      endDt: new Date(endDt.setHours(endDt.getHours() + 1, 0, 0, 0)),
      status: EVENT_STATUS_CONFIRM,
      price: '',
    })

    toggleModalCreateEvent()
  }

  // const handleClickNewEvent = () => {
  //   const startDt = new Date()
  //   const endDt = new Date()

  //   setEventNew({
  //     companyId: property.companyId,
  //     name: "",
  //     description: "",
  //     propertyId: property.id,
  //     unitId: "",
  //     startDt: new Date(startDt.setHours(startDt.getHours() + 1, 0, 0, 0)),
  //     endDt: new Date(endDt.setHours(endDt.getHours() + 2, 0, 0, 0)),
  //     status: EVENT_STATUS_CONFIRM,
  //     price: "",
  //   })

  //   toggleModalCreateEvent()
  // }

  const onItemClick = (itemId, e) => {
    // e.currentTarget.blur()
    setEventId(itemId)
    toggleModalEvent()

    setSelectedItem(null)
  }

  const onItemMove = (itemId, dragTime, newGroupOrder) => {
    setItems(items.map(item => {
      if (item.id === itemId) {

        const duration = moment.duration(moment(item.endDt).diff(moment(item.startDt)));
        item.startDt = moment(dragTime)
        item.endDt = moment(dragTime).add(duration)
        item.unitId = property.units[newGroupOrder].id

        mutateUpdate(item, {
          onSuccess: ({ status, message }) => {
            if (status) {
              notif.success(message);
            } else {
              notif.error(message);
            }
          },
          onError: () => {
            notif.error('Please cek you connection');
          }
        })
        return {
          ...item,
        }
      }
      return item
    }))

    setSelectedItem(null)
  }

  const toggleModalCreateEvent = () => {
    setShowModalCreateEvent(!showModalCreateEvent);
  }

  const toggleModalEvent = (clear?: boolean) => {
    setShowModalEvent(!showModalEvent);
    if (clear) {
      setEventId("")
    }
  }

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: 'GET_EVENT',
        payload: pageRequest,
      })
    }
  }, [isConnected, pageRequest, sendMessage, dorefetch])

  useEffect(() => {
    connect()
  }, [])

  useEffect(() => {
    if (messages && messages.length > 0) {
      const message = messages.at(-1)
      switch (message.type) {
        case "DATA_EVENT":
          const newData = message.payload.map((v) => {
            return {
              ...v,
              startDt: moment(v.startDt),
              endDt: moment(v.endDt),
            }
          })
          setItems(newData);
          break;
        case "REFETCH":
          // setItems([]);
          setDorefetch(dorefetch + 1)
          break;
        default:
          break;
      }
    }
  }, [messages])

  return (
    <>
      <ModalCreateEvent
        show={showModalCreateEvent}
        onClickOverlay={toggleModalCreateEvent}
        eventNew={eventNew}
        property={property}
      />
      <ModalEvent
        show={showModalEvent}
        onClickOverlay={() => toggleModalEvent(true)}
        eventId={eventId}
        property={property}
      />
      <div className='bg-white mb-4 p-4 rounded shadow'>
        {/* <div className='flex justify-end'>
          <button type='button' onClick={handleClickNewEvent} className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
            <BiPlus className='mr-2' size={'1.5rem'} />
            <div>New Event</div>
          </button>
        </div> */}
        <Timeline
          isConnected={isConnected}
          connect={connect}
          propertyName={property.name}
          defaultTimeStart={moment().startOf("day").valueOf()}
          defaultTimeEnd={moment().endOf("day").valueOf()}
          minZoom={1000 * 60 * 60 * property.propertytimeline.minZoomTimelineHour}
          maxZoom={1000 * 60 * 60 * property.propertytimeline.maxZoomTimelineHour}
          dragSnap={1000 * 60 * property.propertytimeline.dragSnapMin}
          groups={property.units}
          items={items}
          onBoundsChange={onBoundsChange}
          // onCanvasDoubleClick={onCanvasDoubleClick}
          onItemSelect={(itemId) => { setSelectedItem(itemId as string) }}
          onItemClick={onItemClick}
          onItemMove={onItemMove}
          selected={selectedItem ? [selectedItem] : []}
          // onItemDeselect={() => setSelectedItem(null)}
          onCanvasClick={onCanvasClick}
          canResize={false}
        // itemTouchSendsClick={true}
        // touchEnabled={true}
        />
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;