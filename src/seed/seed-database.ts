import prisma from '../lib/prisma'
import { initialData } from './seed'
import { countries } from './seed-countries'

async function main() {
  // 1. Truncar tablas
  // await Promise.all([
  await prisma.orderAddress.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()

  await prisma.userAddress.deleteMany()
  await prisma.user.deleteMany()
  await prisma.country.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  // ])

  // 2. Categorias
  const { categories, products, users } = initialData
  await prisma.user.createMany({ data: users })
  const categoriesData = categories.map((name) => ({ name }))
  await prisma.category.createMany({ data: categoriesData })

  const categoriesDB = await prisma.category.findMany()
  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLocaleLowerCase()] = category.id
    return map
  }, {} as Record<string, string>)

  // 3. Productos
  products.forEach(async (product) => {
    const { images, type, ...rest } = product
    const dbProduct = await prisma.product.create({ data: { ...rest, categoryId: categoriesMap[type] } })

    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }))

    await prisma.productImage.createMany({ data: imagesData })
  })

  // 4. Paises
  await prisma.country.createMany({ data: countries })

  console.log('Seed executed!!')
}

;(() => {
  if (process.env.NODE_ENV === 'production') return
  main()
})()
