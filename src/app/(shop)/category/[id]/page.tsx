import { notFound } from 'next/navigation'

export default async function ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (id === 'kids') {
    notFound()
  }
  return (
    <div>
      <h1>Category Page {id}</h1>
    </div>
  )
}
