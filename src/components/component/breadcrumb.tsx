import { BreadcrumbLink } from "@/types/component";
import Link from "next/link";
import { NextPage } from "next/types";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

type Props = {
  links: BreadcrumbLink[]
}

const Breadcrumb: NextPage<Props> = ({ links }) => {

  if (links.length === 0) {
    return null
  }
  
  return (
    <div className='bg-white mb-4 p-4 rounded shadow'>
      <div className='text-xl flex items-center'>
        <div className='hidden md:flex items-center'>
          {links.map((link, index) => {
            if (index === links.length - 1) {
              return (
                <div className='mr-4' key={link.path}>
                  {link.name}
                </div>
              )
            } else {
              return (
                <div className="flex items-center" key={link.path}>
                  <Link href={link.path}>
                    <div className='mr-4 text duration-300 text-primary-500 hover:text-primary-400'>{link.name}</div>
                  </Link>
                  <div className='mr-4'>
                    <BsChevronRight className={''} size={'1.2rem'} />
                  </div>
                </div>
              )
            }
          })}
        </div>
        <div className='flex items-center md:hidden'>
          {links.length > 1 && (
            <Link href={links[links.length - 2].path}>
              <div className='mr-4 text duration-300 text-primary-500 hover:text-primary-400'>
                <BsChevronLeft className={''} size={'1.2rem'} />
              </div>
            </Link>
          )}
          <div className='mr-4'>{links[links.length - 1].name}</div>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb;