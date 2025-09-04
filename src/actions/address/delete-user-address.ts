'use server'
import prisma from '@/lib/prisma'

export const eraseAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({ where: { userId } })
    if (!address) return null
    await prisma.userAddress.delete({ where: { id: address.id } })
  } catch (error) {
    console.log(error)
    return { ok: false, message: 'No se pudo eliminar la dirección' }
  }
}
