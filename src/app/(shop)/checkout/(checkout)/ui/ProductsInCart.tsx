'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/store'
import { currencyFormat } from '@/utils'

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false)
  const productsInCart = useCartStore((state) => state.cart)
  useEffect(() => {
    setLoaded(true)
  }, [loaded])

  if (!loaded) {
    return <p>Loading..!!</p>
  }
  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug} -${product.size}`} className='flex mb-3'>
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            style={{ width: '100px', height: '100px' }}
            alt={product.tittle}
            className='mr-5 rounded'
          />
          <div>
            <span>
              {product.size} - {product.tittle} ({product.quantity})
            </span>
            <p className='font-bold'>${currencyFormat(product.price * product.quantity)}</p>
          </div>
        </div>
      ))}
    </>
  )
}
