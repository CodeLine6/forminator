import React from 'react'
import { FormElement } from './FormElements'
import { Button } from './ui/button'
import { useDraggable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

const SidebarBtnElement = ({FormElement} : {FormElement : FormElement}) => {
  const {label,icon : Icon} = FormElement.designerBtnElement
  const dragable = useDraggable({
    id : `designer-btn-${FormElement.type}`,
    data : {
        type : FormElement.type,
        isDesignerBtnElement : true
    }
  })
  return (
    <Button 
    variant={"outline"} 
    ref={dragable.setNodeRef} 
    className={cn("flex flex-col gap-2 h-[120px] w-[120px] cursor-grab",
    dragable.isDragging && "cursor-grabbing ring-2 ring-primary")} 
    {...dragable.listeners} 
    {...dragable.attributes}>
        <Icon className="h-8 w-8 text-primary" />
        <p className="text-xs">{label}</p>
    </Button>
  )
}

export const SidebarBtnElementDragOverlay = ({FormElement} : {FormElement : FormElement}) => {
    const {label,icon : Icon} = FormElement.designerBtnElement
    return (
      <Button 
      variant={"outline"} 
      className="flex flex-col gap-2 h-[120px] w-[120px] cursor-grab" >
          <Icon className="h-8 w-8 text-primary" />
          <p className="text-xs">{label}</p>
      </Button>
    )
  }

export default SidebarBtnElement