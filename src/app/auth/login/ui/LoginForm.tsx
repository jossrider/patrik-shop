'use client'

import { authenticate } from '@/actions'
import clsx from 'clsx'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { BsExclamationCircle } from 'react-icons/bs'

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)
  useEffect(() => {
    if (errorMessage === 'success') {
      window.location.replace('/')
    }
  }, [errorMessage])
  
  return (
    <form action={formAction} className='flex flex-col'>
      <label htmlFor='email'>Correo electrónico</label>
      <input className='px-5 py-2 border bg-gray-200 rounded mb-5' type='email' name='email' />

      <label htmlFor='password'>Contraseña</label>
      <input className='px-5 py-2 border bg-gray-200 rounded mb-5' type='password' name='password' />

      {errorMessage !== 'success' && errorMessage != undefined && (
        <div className='flex items-center cente justify-center'>
          <BsExclamationCircle className='h-5 w-5 text-red-500' size={35} />
          <p className='m-2 font-bold text-red-500'>Credenciales incorrectas.</p>
        </div>
      )}
      <input type='hidden' name='redirectTo' value={callbackUrl} />
      <button
        type='submit'
        className={clsx({
          'btn-primary hover:cursor-pointer': !isPending,
          'btn-disabled': isPending,
        })}
        disabled={isPending}>
        Ingresar
      </button>

      {/* divisor l ine */}
      <div className='flex items-center my-5'>
        <div className='flex-1 border-t border-gray-500'></div>
        <div className='px-2 text-gray-800'>O</div>
        <div className='flex-1 border-t border-gray-500'></div>
      </div>
      <Link href='/auth/new-account' className='btn-secondary text-center'>
        Crear una nueva cuenta
      </Link>
    </form>
  )
}
