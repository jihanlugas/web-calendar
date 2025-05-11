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

const keys : TimelineKeys = {
  groupIdKey: 'id',
  groupTitleKey: 'name',
  groupLabelKey: 'description',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'name',
  itemDivTitleKey: 'description',
  itemGroupKey: 'propertyId',
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
    'defaultTimeStart' | 'defaultTimeEnd' | 'sidebarWidth' | 'lineHeight' | 'minZoom' | 'maxZoom' | 'stackItems' | 'rightSidebarWidth' |'itemHeightRatio' | 'timeSteps'| 'keys'| 'items'| 'groups'
  > {
  // Optionally override defaultTimeStart/end
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
  defaultTimeStart = moment().add(-12, 'hour').valueOf(),
  defaultTimeEnd = moment().add(12, 'hour').valueOf(),
  sidebarWidth = 200,
  lineHeight = 40,
  minZoom = 1000 * 60 * 60 * 4, // 4 jam 
  maxZoom = 1000 * 60 * 60 * 24 * 2, // 2 hari
  stackItems = true,
  dragSnap = 30 * 60 * 1000, // 30 min
  ...rest
}: TimelineProps) {

  const ItemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {

    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
    const itemprops = getItemProps(item.itemProps)

    return (
      <div {...itemprops} key={itemprops.key}>
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}

        <div
          className="rct-item-content"
          style={{ maxHeight: `${itemContext.dimensions.height}` }}
        >
          {itemContext.title}
        </div>

        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
      </div>
    )
  }

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
      itemHeightRatio={0.75}
      dragSnap={dragSnap}
      timeSteps={undefined}
      itemRenderer={ItemRenderer}
      {...rest}
    >
      <TimelineMarkers>
        <TodayMarker />
      </TimelineMarkers>
      <TimelineHeaders>
        <SidebarHeader>
          {({ getRootProps }) => {
            return (
              <div {...getRootProps()} className='relative flex justify-center items-center text-2xl text-gray-50'>
                <div>{'Timeline'}</div>
                {/* <AiOutlineLoading3Quarters className={`absolute right-4 animate-spin ${!props.isLoading && ' hidden'}`} size={'1em'} /> */}
              </div>
            )
          }}
        </SidebarHeader>
        <DateHeader unit="primaryHeader" />
        <DateHeader />
      </TimelineHeaders>
    </TimelineLib>
  );
}
