'use server'

import { Gender, Product, Size } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL ?? '')

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.trim().split(',')),
  tags: z.string().trim(),
  gender: z.nativeEnum(Gender),
})

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData)
  const productParsed = productSchema.safeParse(data)
  if (!productParsed.success) {
    console.log(productParsed.error)
    return { ok: false }
  } else {
    const product = productParsed.data
    product.slug.toLocaleLowerCase().replace(/ /g, '-').trim()

    const { id, ...rest } = product

    try {
      const prismaTx = await prisma.$transaction(async (tx) => {
        let product: Product
        const tagsArray = rest.tags.split(',').map((tag) => tag.trim().toLocaleLowerCase())
        if (id) {
          // Actualizar
          product = await tx.product.update({
            where: { id },
            data: { ...rest, sizes: { set: rest.sizes as Size[] }, tags: { set: tagsArray } },
          })
          //console.log({ updatedProduct: product })
        } else {
          // Crear
          product = await tx.product.create({
            data: { ...rest, sizes: { set: rest.sizes as Size[] }, tags: { set: tagsArray } },
          })
        }
        // Proceso de carga y guardado de imagenes
        // Recorremos las imagenes y las guardamos
        if (formData.getAll('images')) {
          const images = await uploadImages(formData.getAll('images') as File[])
          if (!images) {
            throw new Error('No se pudo cargar las imagenes, rollingback')
          }
          await prisma.productImage.createMany({ data: images.map((image) => ({ url: image!, productId: product.id })) })
        }
        return { product }
      })
      // Todo: RevalidatePaths
      revalidatePath('/admin/products')
      revalidatePath(`/admin/product/${product.slug}`)
      revalidatePath(`/products/${product.slug}`)
      return { ok: true, product: prismaTx.product }
    } catch (error) {
      console.log(error)
      return { ok: false, message: 'No se pudo crear/actualizar, revisar los logs' }
    }
  }
}

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer()
        const base64Image = Buffer.from(buffer).toString('base64')
        return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`).then((r) => r.secure_url)
      } catch (error) {
        console.log(error)
        return null
      }
    })
    const uloadedImages = await Promise.all(uploadPromises)
    return uloadedImages
  } catch (error) {
    console.log(error)
    return null
  }
}
