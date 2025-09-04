import { getOrderById } from '@/actions/order/get-order-by-id'
import { OrderStatus, PaypalButton, Title } from '@/components'
import { currencyFormat } from '@/utils'
import Image from 'next/image'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrdersPageById({ params }: Props) {
  const { id } = await params
  // Todo: Llamar el server action
  const { ok, order } = await getOrderById(id)
  if (!ok) {
    redirect('/')
  }
  const address = order!.OrderAddress
  return (
    <div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title={`Orden #${id.split('-').at(-1)}`} />
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {/* Carrito */}
          <div className='flex flex-col mt-5'>
            {/* <OrderStatus isPaid={order!.isPaid} /> */}
            {/* Items */}
            {order!.OrderItem.map((item) => (
              <div key={item.product.slug + '-' + item.size} className='flex mb-3'>
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  style={{ width: '100px', height: '100px' }}
                  alt={item.product.title}
                  className='mr-5 rounded'
                />
                <div>
                  <p>{item.product.title}</p>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                  <p className='font-bold'>Subtotal: {currencyFormat(item.price * item.quantity)}</p>
                  <button className='underline mt-3 hover:cursor-pointer'>Remover</button>
                </div>
              </div>
            ))}
          </div>
          {/* Checkout - Resumen de compras */}
          <div className='bg-white rounded-xl shadow-xl p-7'>
            <h2 className='text-2xl mb-2 font-bold'>Dirección de entrega</h2>
            <div className='mb-10'>
              <p className='text-xl'>
                {address?.firstName} {address?.lastName}{' '}
              </p>
              <p>{address?.address}</p>
              <p>{address?.city}</p>
              <p>{address?.country}</p>
            </div>
            {/* Divider */}
            <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />
            <h2 className='text-2xl mb-2 font-bold'>Resumen de orden</h2>
            <div className='grid grid-cols-2'>
              <span>No. Productos</span>
              <span className='text-right'>
                {order?.itemsInOrder === 1 ? '1 Articulos' : `${order?.itemsInOrder} Articulos`}{' '}
              </span>
              <span>Subtotal</span>
              <span className='text-right'>{currencyFormat(order!.subTotal)}</span>
              <span>Impuestos (10%)</span>
              <span className='text-right'>{currencyFormat(order!.tax)}</span>
              <span className='text-2xl mt-5'>Total:</span>
              <span className='text-right mt-5 text-2xl'>{currencyFormat(order!.total)}</span>
            </div>
            <div className='mt-5 mb-2 w-full'>
              {order?.isPaid ? (
                <OrderStatus isPaid={order!.isPaid} />
              ) : (
                <PaypalButton amount={order!.total} orderId={order!.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
