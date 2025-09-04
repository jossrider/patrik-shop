export const revalidate = 0
// https://tailwindcomponents.com/component/hoverable-table
import { Title } from '@/components'
import { redirect } from 'next/navigation'
import { UsersTable } from './ui/UsersTable'
import { getPaginatedUsers } from '@/actions'

export default async function UsuariosPage() {
  const { ok, users = [] } = await getPaginatedUsers()
  if (!ok) {
    redirect('/auth/login')
  }
  return (
    <>
      <Title title='Administración de Usuarios' />
      <div className='mb-10'>
        <UsersTable users={users} />
      </div>
    </>
  )
}
