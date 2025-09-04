import { getProductBySlug } from '@/actions'
import { ProductMobileSlideshow, ProductSlideshow, StockLabel } from '@/components'
import { titleFont } from '@/config/fonts'
import { Metadata} from 'next'
import { notFound } from 'next/navigation'
import { AddToCart } from './ui/AddToCart'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 604800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug

  // fetch post information
  const product = await getProductBySlug(slug)

  return {
    title: (product?.title ?? 'Producto no encontrado') + ' Patrik|Shop',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  // console.log(product)

  if (!product) {
    notFound()
  }
  return (
    <div className='mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3'>
      {/* Slideshow */}
      <div className='col-span-1 md:col-span-2'>
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow tittle={product.title} images={product.images} className='block md:hidden' />
        {/* Desktop Slideshow */}
        <ProductSlideshow tittle={product.title} images={product.images} className='hidden md:block' />
      </div>
      {/* Detalles del producto */}
      <div className='col-span-1 px-5'>
        <StockLabel slug={product.slug} />
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>{product.title}</h1>
        <p className='text-lg mb-5'>${product.price}</p>
        <AddToCart product={product} />
        {/* Descripcion */}
        <h3 className='font-bold text-sm '>Descripción</h3>
        <p className='font-light'>{product.description}</p>
      </div>
    </div>
  )
}
