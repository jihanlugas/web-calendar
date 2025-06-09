import Breadcrumb from "@/components/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import ModalUpdateProduct from "@/components/modal/modal-update-product";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { ProductView } from "@/types/product";
import { displayDateTime, displayMoney } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";


type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {
  const [product, setProduct] = useState<ProductView>(null)
  const [selectedProductId, setSelectedProductId] = useState<string>('')

  const [showModalUpdateProduct, setShowModalUpdateProduct] = useState<boolean>(false);

  const preloads = ''
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['product', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/product/' + id, { preloads }) : null
    },
  })

  const toggleModalUpdateProduct = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedProductId(id)
    setShowModalUpdateProduct(!showModalUpdateProduct);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setProduct(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Product Detail'}</title>
      </Head>
      <ModalUpdateProduct
        show={showModalUpdateProduct}
        onClickOverlay={toggleModalUpdateProduct}
        id={selectedProductId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Product', path: '/product' },
            { name: product?.name || id, path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Product</div>
                  <button
                    className='w-60 h-10 bg-amber-500 hover:bg-amber-600 rounded text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105 text-base'
                    type="button"
                    title='Update Product'
                    onClick={() => toggleModalUpdateProduct(product?.id)}
                  >
                    <RiPencilLine className='mr-2' size={'1.5rem'} />
                    <div>Update Product</div>
                  </button>
                </div>
                <hr className="my-4 border-2" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="">{'Name'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{product?.name}</div>
                  <div className="">{'Description'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600 whitespace-pre-wrap">{product?.description || '-'}</div>
                  <div className="">{'Price'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{displayMoney(product?.price)}</div>
                  <div className="">{'Create By'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{product?.createName}</div>
                  <div className="">{'Create Date'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{displayDateTime(product?.createDt)}</div>
                  <div className="">{'Last Update By'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{product?.updateName}</div>
                  <div className="">{'Last Update Date'}</div>
                  <div className="col-span-1 md:col-span-3 mb-4 md:mb-0 text-gray-600">{displayDateTime(product?.updateDt)}</div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(product, null, 4)}
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  )
}



(Index as PageWithLayoutType).layout = MainAuth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;
