import PageWithLayoutType from '@/types/layout';
import MainAuth from '@/components/layout/main-auth';
import Dashboard from './dashboard';

const Index = () => {
  return <Dashboard />;
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;