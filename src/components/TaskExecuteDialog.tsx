import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import { Task } from "../types";

interface TaskExecuteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task;
    onExecute: (task: Task) => void;
    onCancel: () => void;
}

export function TaskExecuteDialog({ open, onOpenChange, task, onExecute, onCancel }: TaskExecuteDialogProps) {
    const [taskData, setTaskData] = useState<Task>(task);

    useEffect(() => {
        setTaskData(task);
    }, [task]);

    const handleChange = (field: keyof Task) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>执行任务</DialogTitle>
                    <DialogDescription>请确认或修改任务参数后执行</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">任务名称</Label>
                        <Input
                            id="name"
                            value={taskData.name}
                            onChange={handleChange('name')}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">描述</Label>
                        <Input
                            id="description"
                            value={taskData.description}
                            onChange={handleChange('description')}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tableName" className="text-right">表名</Label>
                        <Input
                            id="tableName"
                            value={taskData.tableName}
                            onChange={handleChange('tableName')}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url" className="text-right">接口地址</Label>
                        <Input
                            id="url"
                            value={taskData.url}
                            onChange={handleChange('url')}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="params" className="text-right">参数</Label>
                        <Input
                            id="params"
                            value={taskData.params}
                            onChange={handleChange('params')}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        取消
                    </Button>
                    <Button onClick={() => onExecute(taskData)}>
                        执行
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 