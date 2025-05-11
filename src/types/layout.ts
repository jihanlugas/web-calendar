import { NextPage } from 'next';
import Main from '@/components/layout/main';
// import MainAdmin from '@com/Layout/MainAdmin';
// import MainUser from '@com/Layout/MainSaksi';

type PageWithMainLayoutType = NextPage & { layout: typeof Main, title?: string }

// type PageWithPostLayoutType = NextPage & { layout: typeof SecondaryLayout }

// type PageWithLayoutType = PageWithMainLayoutType | PageWithPostLayoutType
type PageWithLayoutType = PageWithMainLayoutType & any

export default PageWithLayoutType;