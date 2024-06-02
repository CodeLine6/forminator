"use client"
import React, { useState } from 'react'
import DesignerSidebar from './DesignerSidebar'
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { ElementsType, FormElementInstance, FormElements } from './FormElements'
import useDesigner from './hooks/useDesigner'
import idGenerator from '@/lib/idGenerator'
import { Button } from './ui/button'
import { BiSolidTrash } from 'react-icons/bi'

const Designer = () => {
    const { elements, addElement, selectedElement, setSelectedElement,removeElement } = useDesigner()

    const droppable = useDroppable({
        id: 'designer-drop-area',
        data: {
            isDesignerDropArea: true
        }
    })

    useDndMonitor({
        onDragEnd: (event: DragEndEvent) => {
            const { active, over } = event
            if (!active || !over) return

            const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea

            const droppingSidebarButtonOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea
            if (droppingSidebarButtonOverDesignerDropArea) {
                const type = active.data.current?.type
                const newElement = FormElements[type as ElementsType].construct(idGenerator())

                addElement(elements.length, newElement)
                return
            }
            const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement

            const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement

            const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf

            const droppingSidebarButtonOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;

            if (droppingSidebarButtonOverDesignerElement) {
                const type = active.data.current?.type
                const newElement = FormElements[type as ElementsType].construct(idGenerator())

                const overElementIndex = elements.findIndex(element => element.id === over.data.current?.elementId)
                if (overElementIndex === -1) {
                    throw new Error('Element Not Found')
                }

                const indexForNewElement = isDroppingOverDesignerElementTopHalf ? overElementIndex : overElementIndex + 1

                addElement(indexForNewElement, newElement)
                return
            }
            
            const isDraggingDesignerElement =active.data?.current?.isDesignerElement
            const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement

            if (draggingDesignerElementOverAnotherDesignerElement) {
                const activeId = active.data.current?.elementId
                const overId = over.data.current?.elementId

                const activeElementIndex = elements.findIndex(element => element.id === activeId)
                const overElementIndex = elements.findIndex(element => element.id === overId)

                const newIndex = isDroppingOverDesignerElementTopHalf ? overElementIndex : overElementIndex + 1

                if(activeElementIndex === -1 || overElementIndex === -1) {
                    throw new Error('Element Not Found')
                }

                const activeElement = {...elements[activeElementIndex]}
                removeElement(activeElement.id)

                addElement(newIndex, activeElement)
            }

        },
    })

    return (

        <div className='flex w-full h-full'>
            <div className="p-4 w-full" onClick={() => {
                if (selectedElement) setSelectedElement(null)
            }}>
                <div ref={droppable.setNodeRef} className={cn("bg-background h-full m-auto max-w-[920px] rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
                    droppable.isOver && "ring-2 ring-primary"
                )}>
                    {!droppable.isOver && !elements.length && <p className='text-3xl text-muted-foreground flex flex-grow items-center font-bold'>Drop Here</p>}
                    {droppable.isOver && !elements.length && <div className='p-4 w-full'>
                        <div className='h-[120px] rounded-md bg-primary/20'></div>
                    </div>}
                    {elements.length > 0 && (
                        <div className="flex flex-col w-full gap-2 p-4">
                            {elements.map((element, index) => (
                                <DesignerElementWrapper key={element.id} element={element} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <DesignerSidebar />
        </div>
    )
}

const DesignerElementWrapper = ({ element }: { element: FormElementInstance }) => {
    const { removeElement, selectedElement, setSelectedElement } = useDesigner()
    const [mouseIsOver, setMouseIsOver] = useState<Boolean>(false)

    const topHalf = useDroppable({
        id: `${element.id}+top`,
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true
        }
    })

    const bottomHalf = useDroppable({
        id: `${element.id}+bottom`,
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true
        }
    })

    
    const draggable = useDraggable({
        id: element.id,
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true
        }
    })

    if (draggable.isDragging)
        return null

    const Designerelement = FormElements[element.type].designerComponent


    return <div ref={draggable.setNodeRef}
        {...draggable.listeners}
        {...draggable.attributes}
        className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'
        onMouseEnter={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
        onClick={(e) => {
            e.stopPropagation()
            setSelectedElement(element)
        }
        }
    >
        <div ref={topHalf.setNodeRef} className="absolute w-full h-1/2 top-0 rounded-t-md"></div>
        <div ref={bottomHalf.setNodeRef} className="absolute w-full h-1/2 bottom-0 rounded-b-md"></div>
        {mouseIsOver && (
            <>
                <div className='absolute right-0 h-full z-10'>
                    <Button className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500'
                        variant={"outline"}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (selectedElement?.id === element.id) setSelectedElement(null)
                            removeElement(element.id)
                        }}>
                        <BiSolidTrash className='' />
                    </Button>
                </div>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <p className='text-muted-foreground text-sm'>Click for properties or drag to move</p>
                </div>
            </>
        )}
        {
            topHalf.isOver && (
                <div className='absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none' />
            )
        }
        <div className={cn(
            'flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100',
            mouseIsOver && 'opacity-30'
        )}>
            <Designerelement elementInstance={element} />
        </div>
        {
            bottomHalf.isOver && (
                <div className='absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none' />
            )
        }
    </div>
}

export default Designer