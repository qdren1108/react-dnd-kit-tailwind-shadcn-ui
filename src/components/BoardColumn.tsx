import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import React from "react";
import { Task, TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { GripVertical, Plus } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AddTaskDialog } from "./AddTaskDialog";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
  onAddTask?: (content: string) => void;
}

export function BoardColumn({ column, tasks, isOverlay, onAddTask }: BoardColumnProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-[400px] max-h-[400px] w-[280px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  return (
    <div className="flex flex-col">
      <Card
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}
      >
        <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
          >
            <span className="sr-only">{`Move column: ${column.title}`}</span>
            <GripVertical />
          </Button>
          <span className="ml-auto mr-2"> {column.title}</span>
          {column.id === "standard" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary/50 hover:text-primary"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">添加任务</span>
            </Button>
          )}
        </CardHeader>
        <ScrollArea>
          <CardContent className="flex flex-grow flex-col gap-2 p-2">
            <SortableContext items={tasksIds}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SortableContext>
          </CardContent>
        </ScrollArea>
      </Card>
      {column.id === "standard" && onAddTask && (
        <AddTaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddTask={onAddTask}
        />
      )}
    </div>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4 max-w-[1200px] mx-auto", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
