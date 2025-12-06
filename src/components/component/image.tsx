import { NextPage } from "next"
import Image from "next/image"

// interface Props extends React.ComponentProps<typeof Image> {}

const DisplayImage: NextPage<React.ComponentProps<typeof Image>> = ({
  src: srcProp = '',
  alt: altProp = '',
  ...props
}) => {
  const src = srcProp || process.env.DEFAULT_IMAGE
  const alt = altProp || ''

  return (
    <Image
      src={src}
      alt={alt}
      width="99999"
      height="99999"
      sizes="100%"
      {...props}
    />
  )
}

export default DisplayImage;