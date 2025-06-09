import { NextPage } from 'next';

interface Props {
  children: React.ReactNode;
  show: boolean;
  onClickOverlay: () => void;
  layout: 'sm:max-w-md' | 'sm:max-w-lg' | 'sm:max-w-xl' | 'sm:max-w-2xl' | 'sm:max-w-3xl' | 'sm:max-w-4xl' | 'sm:max-w-5xl' | 'sm:max-w-6xl' | 'sm:max-w-7xl'
}


const Modal: NextPage<Props> = ({ children, show, onClickOverlay, layout = '' }) => {
  if (!show)
    return null

  return (
    <div className={'z-50 inset-0 overflow-y-auto fixed'} >
      <div className="flex items-center justify-center h-full pt-4 px-4 pb-4 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={() => onClickOverlay()} aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className={` text-left bg-white rounded-lg w-full overflow-hidden shadow-xl transform sm:my-8 ${layout}`} role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          {children}
        </div>
        {/* <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${layout}`} role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div className={'bg-white'}>
            <div className="">
              {children}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;