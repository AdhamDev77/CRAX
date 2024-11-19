import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

type Props = {
  images: string[];
}

const Slider = ({ images }: Props) => {
  return (
    <Carousel className='h-full w-full' showArrows={false} autoPlay={true} infiniteLoop={true}>
      {images.map((imageUrl, index) => (
        <div key={index}>
          <img src={imageUrl} />
        </div>
      ))}
    </Carousel>
  )
}

export default Slider