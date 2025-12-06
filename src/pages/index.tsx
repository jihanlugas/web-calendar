import PageWithLayoutType from '@/types/layout';
import MainAuth from '@/components/layout/main-auth';
import Dashboard from './dashboard';
import { LoginUser } from '@/types/auth';
import { NextPage } from 'next/types';

type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {
  return <Dashboard loginUser={loginUser} />;
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;