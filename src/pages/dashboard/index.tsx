import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAuth from '@/components/layout/main-auth';
import Breadcrumb from '@/components/component/breadcrumb';
import { useEffect, useState } from 'react';
import { PropertyView } from '@/types/property';
import moment from 'moment';
import Timeline from '@/components/timeline';
import ModalEventNew from '@/components/modal/modal-event-new';
import { BiPlus } from 'react-icons/bi';
import { NextPage } from 'next/types';
import { LoginUser } from '@/types/auth';
import { Api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { EventNew, EventView } from '@/types/event';
import notif from '@/utils/notif';
import useWebSocket from '@/utils/hook';
import { EVENT_STATUS_CONFIRM } from '@/utils/constant';
import ModalEventSummary from '@/components/modal/modal-event-summary';

type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {
  const [properties, setProperties] = useState<PropertyView[]>([]);


  useEffect(() => {
    setProperties(loginUser?.user?.company.properties || [])
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

type SingleTimelineProps = {
  property: PropertyView
}

const defaultEvent: EventNew = {
  companyId: '',
  name: '',
  description: '',
  propertyId: '',
  propertygroupId: '',
  startDt: new Date(),
  endDt: new Date(),
  status: EVENT_STATUS_CONFIRM,
}

const SingleTimeline: NextPage<SingleTimelineProps> = ({ property }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [items, setItems] = useState<EventView[]>([]);
  const [showModalEventNew, setShowModalEventNew] = useState<boolean>(false);
  const [showModalEventSummary, setShowModalEventSummary] = useState<boolean>(false);
  const [eventNew, setEventNew] = useState<EventNew>(defaultEvent);
  const [event, setEvent] = useState<EventView>(null);
  const [dorefetch, setDorefetch] = useState(0);

  const [pageRequest, setPageRequest] = useState({
    companyId: property.companyId,
    propertyId: property.id,
    startDt: moment().add(-1 * property.propertytimeline.defaultStartDtValue * 2, property.propertytimeline.defaultStartDtUnit as moment.unitOfTime.DurationConstructor).toISOString(), // *2 agar dapat data lebih banyak, karena onBoundsChange juga get data lebih jauh
    endDt: moment().add(property.propertytimeline.defaultEndDtValue * 2, property.propertytimeline.defaultEndDtUnit as moment.unitOfTime.DurationConstructor).toISOString(), // *2 agar dapat data lebih banyak, karena onBoundsChange juga get data lebih jauh
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

  const onCanvasDoubleClick = (groupId, time, e) => {
    const startDt = new Date(time)
    const endDt = new Date(time)

    setEventNew({
      companyId: property.companyId,
      name: '',
      description: '',
      propertyId: property.id,
      propertygroupId: groupId,
      startDt: new Date(startDt.setHours(startDt.getHours(), 0, 0, 0)),
      endDt: new Date(endDt.setHours(endDt.getHours() + 1, 0, 0, 0)),
      status: EVENT_STATUS_CONFIRM,
    })

    toggleModalEventNew()
  }

  const handleClickNewEvent = () => {
    const startDt = new Date()
    const endDt = new Date()

    setEventNew({
      companyId: property.companyId,
      name: '',
      description: '',
      propertyId: property.id,
      propertygroupId: "",
      startDt: new Date(startDt.setHours(startDt.getHours() + 1, 0, 0, 0)),
      endDt: new Date(endDt.setHours(endDt.getHours() + 2, 0, 0, 0)),
      status: EVENT_STATUS_CONFIRM,
    })

    toggleModalEventNew()
  }

  const onItemClick = (itemId, e) => {
    // e.currentTarget.blur()
    setEvent(items.find(item => item.id === itemId))
    toggleModalEventSummary()

    setSelectedItem(null)
  }

  const onItemMove = (itemId, dragTime, newGroupOrder) => {
    setItems(items.map(item => {
      if (item.id === itemId) {

        const duration = moment.duration(moment(item.endDt).diff(moment(item.startDt)));
        item.startDt = moment(dragTime)
        item.endDt = moment(dragTime).add(duration)
        item.propertygroupId = property.propertygroups[newGroupOrder].id

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

  const toggleModalEventNew = () => {
    setShowModalEventNew(!showModalEventNew);
  }

  const toggleModalEventSummary = () => {
    setShowModalEventSummary(!showModalEventSummary);
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
          setDorefetch(dorefetch + 1)
          break;
        default:
          break;
      }
    }
  }, [messages])

  return (
    <>
      <ModalEventNew
        show={showModalEventNew}
        onClickOverlay={toggleModalEventNew}
        eventNew={eventNew}
        property={property}
      />
      <ModalEventSummary
        show={showModalEventSummary}
        onClickOverlay={toggleModalEventSummary}
        event={event}
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
          isConnected={isConnected}
          connect={connect}
          propertyName={property.name}
          defaultTimeStart={moment().add(-1 * property.propertytimeline.defaultStartDtValue, property.propertytimeline.defaultStartDtUnit as moment.unitOfTime.DurationConstructor).valueOf()}
          defaultTimeEnd={moment().add(property.propertytimeline.defaultEndDtValue, property.propertytimeline.defaultEndDtUnit as moment.unitOfTime.DurationConstructor).valueOf()}
          minZoom={1000 * 60 * 60 * property.propertytimeline.minZoomTimelineHour}
          maxZoom={1000 * 60 * 60 * property.propertytimeline.maxZoomTimelineHour}
          dragSnap={1000 * 60 * property.propertytimeline.dragSnapMin}
          groups={property.propertygroups}
          items={items}
          onBoundsChange={onBoundsChange}
          onCanvasDoubleClick={onCanvasDoubleClick}
          onItemSelect={(itemId) => { setSelectedItem(itemId as string) }}
          onItemClick={onItemClick}
          onItemMove={onItemMove}
          selected={selectedItem ? [selectedItem] : []}
          onItemDeselect={() => setSelectedItem(null)}
          onCanvasClick={() => setSelectedItem(null)}
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