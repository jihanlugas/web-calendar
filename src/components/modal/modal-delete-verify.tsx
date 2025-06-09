import Modal from '@/components/modal/modal';
import { NextPage } from 'next';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

type Props = {
  show: boolean;
  onClickOverlay: () => void;
  onDelete: () => void;
  isLoading?: boolean;
  verify: string;
  children: React.ReactNode;
}

const ModalDelete: NextPage<Props> = ({ show, onClickOverlay, onDelete, isLoading = false, verify, children }) => {

  const [verifyValue, setVerifyValue] = useState('');

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
      <div className="p-4">
        <div className={'text-xl mb-4 border-b pb-4 flex justify-between items-center'}>
          <span>Delete</span>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <div className={'mb-4'}>
          {children}
        </div>
        <div className={'mb-4'}>
          <div className='mb-2'>Please type <span className={'font-bold'}>{verify}</span> to confirm</div>
          <input
            type="text"
            className='w-full h-10 px-2 select-all'
            value={verifyValue}
            onChange={e => setVerifyValue(e.target.value)}
          />
        </div>
        <div className={'flex'}>
          <button
            className='px-4 py-2 w-full flex justify-center items-center bg-rose-500 disabled:bg-rose-300 disabled:cursor-not-allowed duration-300 rounded-md text-gray-50 font-semibold'
            onClick={() => onDelete()}
            disabled={isLoading || verifyValue !== verify}
          >
            {isLoading ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDelete;