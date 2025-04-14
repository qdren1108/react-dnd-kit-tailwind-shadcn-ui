import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BoardColumn, BoardContainer } from "./BoardColumn";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { type Task, TaskCard } from "./TaskCard";
import type { Column } from "./BoardColumn";
import { hasDraggableData } from "./utils";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { TaskTransformDialog } from "./TaskTransformDialog";

const defaultCols = [
  {
    id: "execute" as const,
    title: "执行事件库",
  },
  {
    id: "person" as const,
    title: "个人事件库",
  },
  {
    id: "bank" as const,
    title: "银行事件库",
  },
  {
    id: "standard" as const,
    title: "标准事件库",
  },

] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];

const initialTasks: Task[] = [
  {
    id: "task1",
    columnId: "standard",
    name: "顾客属性变更",
    description: "更新顾客的基本属性信息",
    tableName: "customer",
    url: "/api/customer/update",
    params: "customerId, attributes"
  },
  {
    id: "task4",
    columnId: "bank",
    name: "顾客属性变更 - 电话修改",
    description: "更新顾客留存电话",
    tableName: "bank_account",
    url: "/api/bank/phone/update",
    params: "accountId, phone"
  },
  {
    id: "task5",
    columnId: "bank",
    name: "顾客属性变更 - 邮箱修改",
    description: "更新顾客留存邮箱",
    tableName: "bank_account",
    url: "/api/bank/email/update",
    params: "accountId, email"
  },
  {
    id: "task6",
    columnId: "person",
    name: "个人信息更新",
    description: "更新个人基本信息",
    tableName: "person",
    url: "/api/person/update",
    params: "personId, info"
  },
  {
    id: "task7",
    columnId: "person",
    name: "联系方式变更",
    description: "更新联系方式信息",
    tableName: "contact",
    url: "/api/person/contact/update",
    params: "personId, contactInfo"
  },

];
export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [transformDialogOpen, setTransformDialogOpen] = useState(false);
  const [taskToTransform, setTaskToTransform] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  const handleAddTask = (taskData: {
    name: string;
    description: string;
    tableName: string;
    url: string;
    params: string;
  }) => {
    const newTask: Task = {
      id: `task${tasks.length + 1}`,
      columnId: "standard",
      ...taskData
    };
    setTasks([...tasks, newTask]);
  };

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${startColumnIdx + 1
          } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.columnId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${active.data.current.task.content
          } at position: ${taskPosition + 1} of ${tasksInColumn.length
          } in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${over.data.current.column.title
          } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task ${active.data.current.task.content
            } was moved over column ${column?.title} in position ${taskPosition + 1
            } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${tasksInColumn.length
          } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${active.data.current.column.title
          } was dropped into position ${overColumnPosition + 1} of ${columnsId.length
          }`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${taskPosition + 1
            } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${tasksInColumn.length
          } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeId === overId) return;

    // 处理从标准事件库到银行事件库的拖拽
    if (
      activeData?.type === "Task" &&
      activeData?.task.columnId === "standard" &&
      ((overData?.type === "Task" && overData?.task.columnId === "bank") ||
        (overData?.type === "Column" && overId === "bank"))
    ) {
      setTaskToTransform(activeData.task);
      setTransformDialogOpen(true);
      return;
    }

    // 处理从银行事件库到个人事件库的克隆
    if (
      activeData?.type === "Task" &&
      activeData?.task.columnId === "bank" &&
      ((overData?.type === "Task" && overData?.task.columnId === "person") ||
        (overData?.type === "Column" && overId === "person"))
    ) {
      const activeTask = tasks.find((t) => t.id === activeId);
      if (activeTask) {
        const newTask: Task = {
          ...activeTask,
          id: `task${tasks.length + 1}`,
          columnId: "person" as ColumnId
        };
        setTasks([...tasks, newTask]);
        return;
      }
    }

    const isActiveAColumn = activeData?.type === "Column";
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
      return;
    }

    // 处理任务的移动
    if (activeData?.type === "Task") {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];

        if (!activeTask) return tasks;

        // 如果是拖到另一个列上
        if (overData?.type === "Column") {
          activeTask.columnId = overId as ColumnId;
          return arrayMove(tasks, activeIndex, activeIndex);
        }

        // 如果是拖到另一个任务上
        if (overData?.type === "Task") {
          const overTask = tasks[overIndex];
          if (overTask && activeTask.columnId !== overTask.columnId) {
            activeTask.columnId = overTask.columnId;
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }
          return arrayMove(tasks, activeIndex, overIndex);
        }

        return tasks;
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    // 移除在 onDragOver 中的任务转换逻辑，只在 onDragEnd 中处理
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
  }

  const handleTransformTask = (taskData: {
    name: string;
    description: string;
    tableName: string;
    url: string;
    params: string;
    transformType: string;
  }) => {
    if (!taskToTransform) return;

    const newTask: Task = {
      id: `task${tasks.length + 1}`,
      columnId: "bank",
      ...taskData
    };

    setTasks([...tasks, newTask]);
    setTaskToTransform(null);
  };

  const handleDeleteTask = (taskId: UniqueIdentifier) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleMergeTask = (taskData: {
    name: string;
    description: string;
    tableName: string;
    url: string;
    params: string;
  }) => {
    const newTask: Task = {
      id: `task${tasks.length + 1}`,
      columnId: "person",
      ...taskData
    };

    setTasks([...tasks, newTask]);
  };

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.columnId === col.id)}
              onAddTask={col.id === "standard" ? handleAddTask : undefined}
              onDeleteTask={handleDeleteTask}
              onMergeTask={col.id === "person" ? handleMergeTask : undefined}
            />
          ))}
        </SortableContext>
      </BoardContainer>

      {taskToTransform && (
        <TaskTransformDialog
          open={transformDialogOpen}
          onOpenChange={setTransformDialogOpen}
          sourceTask={taskToTransform}
          onTransform={handleTransformTask}
        />
      )}

      {"document" in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
