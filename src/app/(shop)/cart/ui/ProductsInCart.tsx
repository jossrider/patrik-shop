'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store'
import { ProductImage, QuantitySelector } from '@/components'
import Link from 'next/link'

export const ProductsInCart = () => {
  const updateProductQuantity = useCartStore((state) => state.updateProductQuantity)
  const removeProduct = useCartStore(state => state.removeProduct)
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
          <ProductImage
            src={product.image}
            width={100}
            height={100}
            style={{ width: '100px', height: '100px' }}
            alt={product.tittle}
            className='mr-5 rounded'
          />
          <div>
            <Link className='hover:underline cursor-pointer' href={`/product/${product.slug}`}>
              {product.size} - {product.tittle}
            </Link>
            <p>${product.price}</p>
            <QuantitySelector
              onQuantityChanged={(value) => updateProductQuantity(product, value)}
              quantity={product.quantity}
            />
            <button onClick={()=> removeProduct(product)} className='underline mt-3 hover:cursor-pointer'>Remover</button>
          </div>
        </div>
      ))}
    </>
  )
}
