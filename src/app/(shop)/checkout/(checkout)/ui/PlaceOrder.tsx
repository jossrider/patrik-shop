'use client'

import { placeOrder } from '@/actions'
import { useAddressStore, useCartStore } from '@/store'
import { currencyFormat } from '@/utils'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export const PlaceOrder = () => {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [errorMessage, seErrorMessage] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const address = useAddressStore((state) => state.address)
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)
  const summary = useCartStore((state) => state.getSumaryInformation)
  const { itemsInCart, subTotal, tax, total } = summary()
  useEffect(() => {
    setLoaded(true)
  }, [])

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true)
    // await sleep(1)
    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }))

    //! Server Action
    const resp = await placeOrder(productsToOrder, address)
    if (!resp.ok) {
      setIsPlacingOrder(false)
      seErrorMessage(resp.message)
      return
    }
    //* Todo salio bien
    clearCart()
    router.replace('/orders/' + resp.order?.id)
  }

  if (!loaded) {
    return <p>Cargando..!!</p>
  }

  return (
    <div className='bg-white rounded-xl shadow-xl p-7'>
      <h2 className='text-2xl mb-2 font-bold'>Dirección de entrega</h2>
      <div className='mb-10'>
        <p className='text-xl'>
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>{address.phone}</p>
        <p>
          {' '}
          {address.city}, {address.country}
        </p>
      </div>
      {/* Divider */}
      <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />
      <h2 className='text-2xl mb-2 font-bold'>Resumen de orden</h2>
      <div className='grid grid-cols-2'>
        <span>No. Productos</span>
        <span className='text-right'>{itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`} </span>
        <span>Subtotal</span>
        <span className='text-right'>{currencyFormat(subTotal)}</span>
        <span>Impuestos (10%)</span>
        <span className='text-right'>{currencyFormat(tax)}</span>
        <span className='text-2xl mt-5'>Total:</span>
        <span className='text-right mt-5 text-2xl'>{currencyFormat(total)}</span>
      </div>
      <div className='mt-5 mb-2 w-full'>
        {/* Disclaimer */}
        <p className='mb-3 leading-0.5'>
          <span className='text-xs'>
            Al hacer click en &quot;Colocar orden&quot;, aceptas nuestros{' '}
            <a href='#' className='underline'>
              términos, condiciones
            </a>{' '}
            y <a href='#' className='underline'></a> política de privacidad.
          </span>
        </p>
        <p className='text-red-500 font-bold mb-3'>{errorMessage}</p>
        <button
          //href={'/orders/123'}
          onClick={onPlaceOrder}
          className={clsx({
            'btn-primary': !isPlacingOrder,
            'btn-disabled': isPlacingOrder,
          })}>
          Colocar orden
        </button>
      </div>
    </div>
  )
}
