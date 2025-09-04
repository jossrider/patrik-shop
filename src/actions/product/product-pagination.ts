'use server'

import { Gender } from '@/generated/prisma'
import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
  gender?: Gender
}

export const getPaginatedProductsWithImages = async ({ page = 1, take = 12, gender }: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1
  if (page < 0) page = 1

  if (isNaN(Number(take))) page = 1
  if (take < 0) page = 1

  try {
    // 1. Obtener los productos
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: { take: 2, select: { url: true } },
      },
      where: {
        gender: gender,
      },
    })
    // 2. Obtener el total de paginas
    // todo:
    const totalCount = await prisma.product.count({
      where: {
        gender: gender,
      },
    })
    const totalPages = Math.ceil(totalCount / take)
    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    }
  } catch (error) {
    throw new Error('No se pudo cargar los productos!' + error)
  }
}
