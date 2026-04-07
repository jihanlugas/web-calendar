import dynamic from 'next/dynamic';
import moment, { Moment } from 'moment';
import {
  type TimelineGroupBase,
  type TimelineItemBase,
  type ReactCalendarTimelineProps,
  TimelineMarkers,
  TodayMarker,
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TimelineKeys,
} from 'react-calendar-timeline';
import { EVENT_STATUS_CONFIRM, EVENT_STATUS_HOLD } from '@/utils/constant';
import { IoCloseSharp } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
import { displayMoney, displayTime } from '@/utils/formater';

const keys: TimelineKeys = {
  groupIdKey: 'id',
  groupTitleKey: 'name',
  groupLabelKey: 'description',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'name',
  itemDivTitleKey: 'description',
  itemGroupKey: 'unitId',
  itemTimeStartKey: 'startDt',
  itemTimeEndKey: 'endDt',
}

export interface TimelineItem extends TimelineItemBase<any> {
  groupId: number
  name: string
  start: Moment;
  end: Moment;

}
export interface TimelineGroup extends TimelineGroupBase { }

interface TimelineProps
  extends Omit<
    ReactCalendarTimelineProps<TimelineItem, TimelineGroup>,
    'defaultTimeStart' | 'defaultTimeEnd' | 'sidebarWidth' | 'lineHeight' | 'minZoom' | 'maxZoom' | 'stackItems' | 'rightSidebarWidth' | 'itemHeightRatio' | 'timeSteps' | 'keys' | 'items' | 'groups'
  > {
  // Optionally override defaultTimeStart/end
  isConnected?: boolean;
  connect?: () => void;
  propertyName: string;
  defaultTimeStart?: number;
  defaultTimeEnd?: number;
  sidebarWidth?: number;
  lineHeight?: number;
  minZoom?: number;
  maxZoom?: number;
  stackItems?: boolean;
  dragSnap?: number;
  items: any[];
  groups: any[];
}

const TimelineLib = dynamic(
  () =>
    import('react-calendar-timeline').then(
      (mod) =>
        mod.default as React.ComponentType<
          ReactCalendarTimelineProps<TimelineItem, TimelineGroup>
        >
    ),
  { ssr: false }
);

export default function Timeline({
  isConnected = false,
  connect,
  propertyName,
  defaultTimeStart = moment().add(-12, 'hour').valueOf(),
  defaultTimeEnd = moment().add(12, 'hour').valueOf(),
  sidebarWidth = 200,
  lineHeight = 52,
  minZoom = 1000 * 60 * 60 * 4, // 4 jam 
  maxZoom = 1000 * 60 * 60 * 24 * 2, // 2 hari
  stackItems = true,
  dragSnap = 30 * 60 * 1000, // 30 min
  ...rest
}: TimelineProps) {

  const ItemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {

    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
    const itemprops = getItemProps({
      // title: undefined,
      ...item.itemProps,
    })

    let itemClass = ''
    const selectedItemClass = 'rct-item rounded !font-bold !text-gray-100 !bg-amber-500 !border-amber-700'

    switch (item.status) {
      case EVENT_STATUS_HOLD:
        itemClass = 'rct-item rounded !font-bold !text-gray-100 !bg-gray-500 !border-gray-700'
        break;
      case EVENT_STATUS_CONFIRM:
        itemClass = 'rct-item rounded !font-bold !text-gray-100 !bg-blue-500 !border-blue-700'
        break;
      default:
        break;
    }

    return (
      <>
        <div
          {...itemprops}
          key={itemprops.key}
          className={itemContext.selected ? selectedItemClass : itemClass}
          data-tooltip-id={`tootltip-item-${item.id}`}
          data-tooltip-delay-show={300}
          data-tooltip-delay-hide={200}
          title='' // set title empty to remove default tooltip and use custom tooltip
        >
          {itemContext.useResizeHandle ? <div key={itemprops.key} {...leftResizeProps} /> : ''}
          <div
            key={itemprops.key}
            className="rct-item-content"
            style={{ maxHeight: `${itemContext.dimensions.height}` }}
          >
            {item.name}
          </div>
          {itemContext.useResizeHandle ? <div key={itemprops.key} {...rightResizeProps} /> : ''}
        </div>
        <Tooltip id={`tootltip-item-${item.id}`} style={{ zIndex: 999 }}>
          <div className='text-xs'>
            <div className='mb-2'>
              <div className="font-bold">{item.name}</div>
              <div className="whitespace-pre-line">{item.description}</div>
            </div>
            <div>
              <div className='flex justify-between'>
                <div>Time</div>
                <div>{displayTime(item.startDt) + ' - ' + displayTime(item.endDt)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Status</div>
                <div className='' >{item.status}</div>
              </div>
              <div className='flex justify-between'>
                <div>Price</div>
                <div>{displayMoney(item.price)}</div>
              </div>
              <div className='flex justify-between mt-2'>
                <div></div>
                <div className='font-bold text-green-500' >{"PAID"}</div>
              </div>
            </div>
          </div>
        </Tooltip>
      </>
    )
  }

  const GroupRenderer = ({ group }) => {
    return (
      <div className="flex items-center px-2">
        <span className="font-semibold">{group.name}</span>
      </div>
    );
  };

  const handleConnect = () => {
    if (connect) {
      connect()
    }
  }

  // useEffect(() => {
  //   if (!isConnected) {
  //     connect()
  //   }
  // }, [isConnected, connect])

  return (
    <TimelineLib
      defaultTimeStart={defaultTimeStart}
      defaultTimeEnd={defaultTimeEnd}
      lineHeight={lineHeight}
      sidebarWidth={sidebarWidth}
      minZoom={minZoom}
      maxZoom={maxZoom}
      stackItems={stackItems}
      keys={keys}
      rightSidebarWidth={0}
      itemHeightRatio={0.8}
      dragSnap={dragSnap}
      timeSteps={undefined}
      itemRenderer={ItemRenderer}
      // itemVerticalGap={16}
      groupRenderer={GroupRenderer}
      {...rest}
    >
      <TimelineMarkers>
        <TodayMarker />
      </TimelineMarkers>
      <TimelineHeaders>
        <SidebarHeader>
          {({ getRootProps }) => {
            return (
              <div {...getRootProps()} className='relative flex justify-center items-center text-xl text-gray-50 px-2 font-bold'>
                <div>{propertyName}</div>
                <IoCloseSharp title='Disconnect, Click to reconnect' onClick={handleConnect} className={`absolute text-rose-500 right-4 ${isConnected && ' hidden'}`} size={'1.2em'} />
              </div>
            )
          }}
        </SidebarHeader>
        <DateHeader
          unit='day'
          labelFormat={(range, unit) => range[0].format("DD MMMM YYYY")}
          className='font-bold !h-8 !cursor-auto'
        />
        <DateHeader
          unit="hour"
          labelFormat={(range, unit) => range[0].format("HH")}
          className='font-bold !h-8 !cursor-auto'
        />
        {/* <DateHeader
          unit="day"
          className={'!h-10'}
          labelFormat={(range, unit) => range[0].format("DD MMMM YYYY")}
          intervalRenderer={({ getIntervalProps, intervalContext, data }) => {
            return <div className='h-full flex justify-center items-center border-x border-primary-600 text-gray-50 font-bold' {...getIntervalProps()}>
              {intervalContext.intervalText}
            </div>
          }}
        />
        <DateHeader
          unit="hour"
          labelFormat={(range, unit) => range[0].format("HH")}
          className={'!h-8 bg-gray-200'}
          intervalRenderer={({ getIntervalProps, intervalContext, data }) => {
            return <div className='h-full flex justify-center items-center border border-gray-600 text-gray-800' {...getIntervalProps()}>
              {intervalContext.intervalText}
            </div>
          }}
        /> */}
      </TimelineHeaders>
    </TimelineLib>
  );
}
