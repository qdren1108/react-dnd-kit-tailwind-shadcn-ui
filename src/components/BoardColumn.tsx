import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import React from "react";
import { TaskCard } from "./TaskCard";
import { Task } from "../types";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { GripVertical, Plus, Merge, MessageSquare } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AddTaskDialog } from "./AddTaskDialog";
import { MergeTaskDialog } from "./MergeTaskDialog";
import { ChatDialog } from "./ChatDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "./ui/dropdown-menu";

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
  onAddTask?: (taskData: { name: string; description: string; tableName: string; url: string; params: string; }) => void;
  onDeleteTask?: (taskId: UniqueIdentifier) => void;
  onMergeTask?: (taskData: { name: string; description: string; tableName: string; url: string; params: string; sourceTasks: Task[]; }) => void;
}

export function BoardColumn({
  column,
  tasks,
  isOverlay,
  onAddTask,
  onDeleteTask,
  onMergeTask,
}: BoardColumnProps) {
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [mergeTaskDialogOpen, setMergeTaskDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
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
              onClick={() => setAddTaskDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">添加任务</span>
            </Button>
          )}
          {column.id === "bank" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary/50 hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">打开菜单</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>银行事件操作</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>属性修改</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>法人信息</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>基本信息变更</DropdownMenuItem>
                        <DropdownMenuItem>法定代表人变更</DropdownMenuItem>
                        <DropdownMenuItem>注册资本变更</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>个人信息</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>身份信息变更</DropdownMenuItem>
                        <DropdownMenuItem>联系方式变更</DropdownMenuItem>
                        <DropdownMenuItem>地址信息变更</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>账户管理</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>对公账户</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>开户申请</DropdownMenuItem>
                        <DropdownMenuItem>销户申请</DropdownMenuItem>
                        <DropdownMenuItem>账户状态变更</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>个人账户</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>开户申请</DropdownMenuItem>
                        <DropdownMenuItem>销户申请</DropdownMenuItem>
                        <DropdownMenuItem>账户状态变更</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>交易管理</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>转账交易</DropdownMenuItem>
                    <DropdownMenuItem>支付结算</DropdownMenuItem>
                    <DropdownMenuItem>资金归集</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>信贷业务</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>贷款申请</DropdownMenuItem>
                    <DropdownMenuItem>还款处理</DropdownMenuItem>
                    <DropdownMenuItem>额度调整</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>风控管理</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>风险预警</DropdownMenuItem>
                    <DropdownMenuItem>合规检查</DropdownMenuItem>
                    <DropdownMenuItem>反洗钱监控</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {column.id === "person" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary/50 hover:text-primary"
              onClick={() => setMergeTaskDialogOpen(true)}
            >
              <Merge className="h-4 w-4" />
              <span className="sr-only">合并任务</span>
            </Button>
          )}
          {column.id === "execute" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary/50 hover:text-primary"
              onClick={() => setChatDialogOpen(true)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">打开对话</span>
            </Button>
          )}
        </CardHeader>
        <ScrollArea>
          <CardContent className="flex flex-grow flex-col gap-2 p-2">
            <SortableContext items={tasksIds}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
              ))}
            </SortableContext>
          </CardContent>
        </ScrollArea>
      </Card>
      {column.id === "standard" && onAddTask && (
        <AddTaskDialog
          open={addTaskDialogOpen}
          onOpenChange={setAddTaskDialogOpen}
          onAddTask={onAddTask}
        />
      )}
      {column.id === "person" && onMergeTask && (
        <MergeTaskDialog
          open={mergeTaskDialogOpen}
          onOpenChange={setMergeTaskDialogOpen}
          onMergeTask={onMergeTask}
          tasks={tasks}
        />
      )}
      {column.id === "execute" && (
        <ChatDialog
          open={chatDialogOpen}
          onOpenChange={setChatDialogOpen}
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
