'use client'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { PayPalButtonCreateOrder, PayPalButtonOnApprove } from '@paypal/paypal-js'
import { paypalCheckPayment, setTransactionId } from '@/actions'

interface Props {
  orderId: string
  amount: number
}

export const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer()

  const roundedAmount = Math.round(amount * 100) / 100

  if (isPending) {
    return (
      <div className='animate-pulse mb-16'>
        <div className='h-10 bg-gray-300 rounded'></div>
        <div className='h-10 bg-gray-300 rounded mt-2'></div>
      </div>
    )
  }

  const createOrder: PayPalButtonCreateOrder = async (data, actions) => {
    const transactionId = await actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [{ invoice_id: orderId, amount: { currency_code: 'USD', value: `${roundedAmount}` } }],
    })

    const { ok } = await setTransactionId(orderId, transactionId)
    if (!ok) {
      throw new Error('No se pudo actualizar la orden')
    }

    return transactionId
  }

  const onApprove: PayPalButtonOnApprove = async (data, actions) => {
    const details = await actions.order?.capture()
    if (!details) return
    await paypalCheckPayment(details.id!)
  }
  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} className='relative z-0'/>
}
