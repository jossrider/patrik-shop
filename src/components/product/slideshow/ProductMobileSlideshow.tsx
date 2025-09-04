'use client'

import { Swiper } from 'swiper/react'
import { SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

import './slideshow.css'
import { Autoplay, FreeMode, Pagination } from 'swiper/modules'
import { ProductImage } from '@/components'

interface Props {
  images: string[]
  tittle: string
  className?: string
}

export const ProductMobileSlideshow = ({ images, tittle, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{ width: '100vw', height: '500px' }}
        pagination
        autoplay={{ delay: 2500 }}
        modules={[FreeMode, Autoplay, Pagination]}
        className='mySwiper2'>
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductImage width={600} height={500} src={image} alt={tittle} className='object-fill' />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
