import Image from "next/image"

type Props = {
  size: number;
}

export const Logo = ({size}: Props) => {
  return(
      <Image
        src={'/logo.svg'}
        alt="Cobrato Web"
        height={size}
        width={size}
      />
  )
}