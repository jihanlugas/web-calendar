import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAuth from '@/components/layout/main-auth';
import Breadcrumb from '@/components/breadcrumb';
import { useState } from 'react';
import { Property } from '@/types/property';
import { Calendar } from '@/types/calendar';
import moment from 'moment';
import Timeline from '@/components/timeline';



const defaultGroups: Property[] = [
  {
    id: '1',
    name: 'Group A',
    description: 'Description Group A',
    companyId: "",
    createBy: "",
    createDt: "",
    updateBy: "",
    updateDt: "",
    deleteBy: "",
    createName: "",
    updateName: "",
    deleteName: "",
    companyName: "",
  },
  {
    id: '2',
    name: 'Group B',
    description: 'Description Group B',
    companyId: "",
    createBy: "",
    createDt: "",
    updateBy: "",
    updateDt: "",
    deleteBy: "",
    createName: "",
    updateName: "",
    deleteName: "",
    companyName: "",
  },
  {
    id: '3',
    name: 'Group C',
    description: 'Description Group C',
    companyId: "",
    createBy: "",
    createDt: "",
    updateBy: "",
    updateDt: "",
    deleteBy: "",
    createName: "",
    updateName: "",
    deleteName: "",
    companyName: "",
  },
];

const defaultItems: Calendar[] = [
  {
    id: '1',
    propertyId: '1',
    name: 'Item 1',
    startDt: moment().add(-1, 'hour'),
    endDt: moment().add(1, 'hour'),
    description: 'Description 1',
  },
  {
    id: '2',
    propertyId: '2',
    name: 'Item 2',
    startDt: moment().add(-0.5, 'hour'),
    endDt: moment().add(2, 'hour'),
    description: 'Description 2',
  },
];

const Index = () => {

  const [groups, setGroups] = useState<Property[]>(defaultGroups);
  const [items, setItems] = useState<Calendar[]>(defaultItems);

  const onBoundsChange = (canvasTimeStart, canvasTimeEnd) => {
    console.log('onBoundsChange')
    console.log('canvasTimeStart', new Date(canvasTimeStart))
    console.log('canvasTimeEnd', new Date(canvasTimeEnd))
  }

  const onCanvasDoubleClick = (groupId, time, e) => {
    console.log('onCanvasDoubleClick')
    console.log('groupId', groupId)
    console.log('time', new Date(time))
    console.log('e', e)

    const startDt = new Date(time)
    const endDt = new Date(time)

    setItems([
      ...items,
      {
        id: String(items.length + 1),
        propertyId: groupId,
        name: 'Item ' + (items.length + 1),
        startDt: new Date(startDt.setHours(startDt.getHours(), 0, 0, 0)),
        endDt: new Date(endDt.setHours(endDt.getHours() + 1, 0, 0, 0)),
        description: 'Description ' + (items.length + 1),
      },
    ])
  }

  const onItemClick = (itemId, e, time) => {
    console.log('onItemClick')
    console.log('itemId ', itemId)
    console.log('e ', e)
    console.log('time ', time)
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
          <div className='rounded'>
            <Timeline
              groups={groups}
              items={items}
              onBoundsChange={onBoundsChange}
              onCanvasDoubleClick={onCanvasDoubleClick}
              onItemClick={onItemClick}
              onItemMove={onItemMove}
            />
          </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;