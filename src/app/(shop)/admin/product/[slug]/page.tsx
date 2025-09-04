import { getCategories, getProductBySlug } from '@/actions'
import { Title } from '@/components'
import { redirect } from 'next/navigation'
import { ProductForm } from './ui/ProductForm'

interface Props {
  params: Promise<{ slug: string }>
}
export default async function ProducPage({ params }: Props) {
  const { slug } = await params
  const [product, categories] = await Promise.all([getProductBySlug(slug), getCategories()])
  if (!product && slug !== 'new') {
    redirect('/admin/products')
  }
  // Todo: New
  const tittle = slug === 'new' ? 'Nuevo Producto' : 'Editar Producto'
  return (
    <>
      <Title title={tittle} />
      <ProductForm product={product ?? {}} categories={categories} />
    </>
  )
}
