import { redirect } from 'next/navigation'
import { Pagination, Title, ProductGrid } from '@/components'
import { getPaginatedProductsWithImages } from '@/actions'

interface Props {
  searchParams: Promise<{ page?: string }>
}

export const revalidate = 60

export default async function Home({ searchParams }: Props) {
  const { page : pagina } = await searchParams
  const page  = pagina ? parseInt(pagina) : 1
  const { products, totalPages } = await getPaginatedProductsWithImages({ page })

  // console.log(currentPage, totalPages)

  if (products.length === 0) {
    redirect('/')
  }
  return (
    <>
      <Title title='Tienda' subtitle='Todos los productos' className='mb-2' />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  )
}
