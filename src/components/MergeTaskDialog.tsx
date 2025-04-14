import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Task } from "../types";
import { UniqueIdentifier } from "@dnd-kit/core";

interface MergeTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onMergeTask: (taskData: {
        name: string;
        description: string;
        tableName: string;
        url: string;
        params: string;
    }) => void;
    tasks: Task[];
}

export function MergeTaskDialog({ open, onOpenChange, onMergeTask, tasks }: MergeTaskDialogProps) {
    const [selectedTasks, setSelectedTasks] = useState<UniqueIdentifier[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTasks.length >= 2) {
            const selectedTaskNames = selectedTasks
                .map(taskId => tasks.find(task => task.id === taskId)?.name)
                .filter(Boolean)
                .join(" + ");

            const mergedTask = {
                name: selectedTaskNames,
                description: "由多个任务合并而成",
                tableName: "merged",
                url: "/api/merged",
                params: selectedTasks.join(",")
            };
            onMergeTask(mergedTask);
            setSelectedTasks([]);
            onOpenChange(false);
        }
    };

    const toggleTaskSelection = (taskId: UniqueIdentifier) => {
        setSelectedTasks(prev => {
            if (prev.includes(taskId)) {
                return prev.filter(id => id !== taskId);
            } else {
                return [...prev, taskId];
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>合并任务</DialogTitle>
                        <DialogDescription>
                            选择要合并的任务（至少选择2个任务）
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div key={task.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={task.id.toString()}
                                        checked={selectedTasks.includes(task.id)}
                                        onChange={() => toggleTaskSelection(task.id)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor={task.id.toString()}>{task.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={selectedTasks.length < 2}>
                            合并
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 