import { Api } from '@/lib/api';
import React, { useState, useEffect, useRef } from 'react';
import { BsList } from 'react-icons/bs';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { getInitialWord } from '@/utils/helper';
import Image from 'next/image';
import Notif from '@/utils/notif';
import Link from 'next/link';
import { LoginUser } from '@/types/auth';

interface Props {
  sidebar: boolean,
  setSidebar: (sidebar: boolean) => void,
  loginUser: LoginUser
}

const Header: React.FC<Props> = ({ sidebar, setSidebar, loginUser }) => {

  const refProfile = useRef<HTMLDivElement>(null);
  const [profileBar, setProfileBar] = useState(false);


  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: () => Api.get('/auth/sign-out')
  });

  const handleLogout = () => {
    mutate(null, {
      onSuccess: () => {
        localStorage.clear()
        router.push('/sign-in');
        Notif.success('Logout Successfully');
      },
      onError: () => {
        Notif.error('Please cek you connection');
      }
    });
  };

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (profileBar && refProfile.current && !refProfile.current.contains(e.target)) {
        setProfileBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [profileBar]);

  return (
    <header>
      <div className="fixed h-16 w-full flex justify-between items-center shadow bg-primary-500 z-40">
        <div className="p-2 flex text-white items-center">
          <button className="p-2 rounded-full duration-300 hover:bg-primary-600" onClick={() => setSidebar(!sidebar)}>
            <BsList className="" size={'1.2rem'} />
          </button>
          <div className="text-2xl px-2">
            <span className=''>{process.env.APP_NAME}</span>
          </div>
        </div>
        {loginUser?.user && (
          <div className="relative inline-block text-left p-2" ref={refProfile}>
            <div className="flex items-center">
              <div className="hidden md:block mx-2 text-white">{loginUser.user.fullname}</div>
              {loginUser.user.photoUrl !== '' ? (
                <button className="relative overflow-hidden mx-2 h-10 w-10 rounded-full" onClick={() => setProfileBar(!profileBar)}>
                  <Image src={loginUser.user.photoUrl} alt={loginUser.user.fullname} layout={'fill'} />
                </button>
              ) : (
                <button className="mx-2 h-10 w-10 bg-gray-700 rounded-full text-gray-100 flex justify-center items-center text-xl" onClick={() => setProfileBar(!profileBar)}>
                  {getInitialWord(loginUser.user.fullname)}
                </button>
              )}
            </div>
            <div className={`absolute right-4 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none duration-300 ease-in-out ${!profileBar && 'scale-0 shadow-none ring-0'}`}>
              <div className="" role="none">
                <Link href={'/account/change-password'}>
                  <div className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700'}>{'Ganti Password'}</div>
                </Link>
                <Link href={'/setting'}>
                  <div className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700'}>{'Setting'}</div>
                </Link>
                <hr />
                <button onClick={handleLogout} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
                  {'Sign Out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
