'use client'
import type { FC } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import logoSrc from './logo.svg' // Import the SVG source path

export type AppIconProps = {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  className,
}) => {
  return (
    <div
      className={cn(
        className,
        'relative inline-flex items-center justify-center rounded-md',
        size === 'small' && 'w-8 h-8',
        size === 'medium' && 'w-10 h-10',
        size === 'large' && 'w-12 h-12',
      )}
    >
      <Image
        src={logoSrc}
        alt="App Logo"
        fill
        style={{ objectFit: 'contain' }}
      />
    </div>
  )
}

export default AppIcon
