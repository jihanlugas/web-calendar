import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';



type Props = {
  children: React.ReactNode
}

const Main: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="theme-color" content={'currentColor'} />
      </Head>
      <main className={''}>
        {children}
      </main>
    </>
  );
};

export default Main;