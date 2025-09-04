'use server'

import { auth } from '@/auth.config'
import type { Address, Size } from '@/interfaces'
import prisma from '@/lib/prisma'

interface ProductToOrder {
  productId: string
  quantity: number
  size: Size
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
  const session = await auth()
  const userId = session?.user.id
  // verificar sesión de usuario
  if (!userId) {
    return {
      ok: false,
      message: 'No hay sesión de usuario',
    }
  }
  // obtener la informacion de los productos
  // Nota: recuerder que podemos llevar 2+ productos con el mismo ID
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  })
  // calcular los montos - Encabezado
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)
  // Totales tax, subtotal y total
  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity
      const product = products.find((product) => product.id === item.productId)
      if (!product) throw new Error(`${item.productId} no existe - 500`)
      const subTotal = product.price * productQuantity
      totals.subTotal += subTotal
      totals.tax += subTotal * 0.1
      totals.total += subTotal * 1.1
      return totals
    },
    { subTotal: 0, tax: 0, total: 0 }
  )
  // crear la transaccion de BD
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock
      const updatedProductsPromises = products.map((product) => {
        // Acumular cantidad de productos
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0)
        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`)
        }
        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: { decrement: productQuantity },
          },
        })
      })
      const updatedProducts = await Promise.all(updatedProductsPromises)
      // Verificar valores negativos en las existencias = no hay stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`No hay stock suficiente de ${product.title}.`)
        }
      })
      // 2. Crear la orden - Encabezado - Detalle
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                price: products.find((product) => product.id === p.productId)?.price ?? 0,
                productId: p.productId,
              })),
            },
          },
        },
      })
      // Valida si el price es cero, entonces lanzar un error
      // 3. Crear la dirección de la orden
      // Address
      const orderAddress = await tx.orderAddress.create({
        data: {
          address: address.address,
          city: address.city,
          country: address.country,
          firstName: address.firstName,
          lastName: address.lastName,
          address2: address.address2,
          phone: address.phone,
          postalCode: address.postalCode,
          orderId: order.id,
        },
      })
      return {
        order: order,
        orderAddress: orderAddress,
        updatedProducts: updatedProducts,
      }
    })
    return { ok: true, order: prismaTx.order, prismaTx: prismaTx }
  } catch (error: any) {
    return { ok: false, message: error?.message }
  }
}
