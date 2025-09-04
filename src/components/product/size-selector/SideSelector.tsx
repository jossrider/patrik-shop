import type { Size } from '@/interfaces'
import clsx from 'clsx'

interface Props {
  selectSized?: Size
  availableSizes: Size[]
  onSizeChanged: (size: Size) => void
}
export const SideSelector = ({ selectSized, availableSizes, onSizeChanged }: Props) => {
  return (
    <div className='my-5'>
      <h3 className='font-bold mb-4'>Talles disponibles</h3>
      <div className='flex'>
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChanged(size)}
            className={clsx('mx-2 hover:underline hover:cursor-pointer text-lg', { underline: size === selectSized })}>
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
