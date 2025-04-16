import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical, Trash2, Layers } from "lucide-react";
import { Badge } from "./ui/badge";
import { ColumnId } from "./KanbanBoard";
import { Task } from "../types";

export interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onDelete?: (taskId: UniqueIdentifier) => void;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay, onDelete }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-3 flex flex-row items-start gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 cursor-grab p-0 text-muted-foreground/50"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">{task.name}</CardTitle>
          <CardDescription className="text-xs">{task.description}</CardDescription>
          {task.sourceTasks && task.sourceTasks.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Layers className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                包含 {task.sourceTasks.length} 个原始任务
              </span>
            </div>
          )}
        </div>
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-destructive/50 hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}
