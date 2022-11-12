import { FC, ReactElement } from 'react'

export enum TextPosition {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

export const Icon: FC<{
  icon: ReactElement<any, any>
  text?: string
  textPosition?: TextPosition
  onClick?: () => void
  textHoverColor?: string
  hoverDuration?: string
  transition?:
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'linear'
    | 'step-start'
    | 'step-end'
    | 'initial'
    | 'inherit'
    | undefined
  textClasses?: string
}> = ({
  icon,
  text,
  textPosition = TextPosition.RIGHT,
  onClick,
  textHoverColor = 'red-600',
  hoverDuration = 'duration-150',
  transition = 'ease-in',
  textClasses = '',
}) => {
  const renderClass = () => {
    switch (textPosition) {
      case TextPosition.TOP:
        return 'flex-col'
      case TextPosition.BOTTOM:
        return 'flex-col-reverse'
      case TextPosition.LEFT:
        return 'flex-row'
      case TextPosition.RIGHT:
        return 'flex-row-reverse'
      default:
        return 'flex-col-reverse'
    }
  }

  console.log(textHoverColor)

  return (
    <div
      className={`flex justify-center items-center cursor-pointer ${transition} ${hoverDuration} hover:text-${textHoverColor}`}
      onClick={onClick}
    >
      <span className={`flex items-center ${renderClass()}`}>
        <>
          {text && <span className={`${textClasses}`}>{text}</span>}
          {icon}
        </>
      </span>
    </div>
  )
}
