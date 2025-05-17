import { Title } from '@/components'
import { initialData } from '@/seed/seed'
import { ProductGrid } from '../../components/products/product-grid/ProductGrid'

const products = initialData.products

export default function Home() {
  return (
    <>
      <Title title='Tienda' subtitle='Todos los productos' className='mb-2' />
      <ProductGrid products={products} />
    </>
  )
}
