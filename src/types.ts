import { UniqueIdentifier } from "@dnd-kit/core";
import { ColumnId } from "./components/KanbanBoard";

export interface Task {
    id: UniqueIdentifier;
    columnId: ColumnId;
    name: string;
    description: string;
    tableName: string;
    url: string;
    params: string;
} 