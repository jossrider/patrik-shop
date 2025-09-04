import { getPaginatedProductsWithImages } from '@/actions'
import { Pagination, ProductGrid, Title } from '@/components'
import { redirect } from 'next/navigation'
import { Gender } from '@/generated/prisma'

interface Props {
  params: Promise<{ gender: string }>
  searchParams: Promise<{ page?: string }>
}

export const revalidate = 60

export default async function GenderByPage({ params, searchParams }: Props) {
  const { gender } = await params
  const { page: pagina } = await searchParams
  const page = pagina ? parseInt(pagina) : 1
  const { products, totalPages } = await getPaginatedProductsWithImages({ page, gender: gender as Gender })
  if (products.length === 0) {
    redirect(`/gender/${gender}`)
  }
  const labels: Record<string, string> = { men: 'Hombres', women: 'Mujeres', kid: 'Niños', unisex: 'Unisex' }
  return (
    <>
      <Title title={`Articulos de ${labels[gender]}`} subtitle='Todos los productos' className='mb-2' />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  )
}
