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
import { Task } from "./TaskCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface TaskTransformDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sourceTask: Task;
    onTransform: (taskData: {
        name: string;
        description: string;
        tableName: string;
        url: string;
        params: string;
        transformType: string;
    }) => void;
}

const TRANSFORM_TYPES = [
    { id: 'phone', label: '电话修改' },
    { id: 'email', label: '邮箱修改' },
    { id: 'address', label: '地址修改' },
];

export function TaskTransformDialog({
    open,
    onOpenChange,
    sourceTask,
    onTransform
}: TaskTransformDialogProps) {
    const [taskData, setTaskData] = useState({
        name: sourceTask.name,
        description: sourceTask.description,
        tableName: sourceTask.tableName,
        url: sourceTask.url,
        params: sourceTask.params,
        transformType: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (taskData.transformType && taskData.name.trim()) {
            onTransform(taskData);
            onOpenChange(false);
        }
    };

    const handleChange = (field: keyof typeof taskData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTaskData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>转换任务类型</DialogTitle>
                        <DialogDescription>
                            请选择要转换的任务类型并修改相关信息。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="transformType" className="text-right">
                                转换类型
                            </Label>
                            <Select
                                value={taskData.transformType}
                                onValueChange={(value) =>
                                    setTaskData(prev => ({
                                        ...prev,
                                        transformType: value,
                                        name: `${sourceTask.name} - ${TRANSFORM_TYPES.find(t => t.id === value)?.label}`
                                    }))
                                }
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="选择转换类型" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TRANSFORM_TYPES.map(type => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                名称
                            </Label>
                            <Input
                                id="name"
                                className="col-span-3"
                                value={taskData.name}
                                onChange={handleChange("name")}
                                placeholder="请输入任务名称"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                描述
                            </Label>
                            <Input
                                id="description"
                                className="col-span-3"
                                value={taskData.description}
                                onChange={handleChange("description")}
                                placeholder="请输入任务描述"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tableName" className="text-right">
                                表名
                            </Label>
                            <Input
                                id="tableName"
                                className="col-span-3"
                                value={taskData.tableName}
                                onChange={handleChange("tableName")}
                                placeholder="请输入表名"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                URL地址
                            </Label>
                            <Input
                                id="url"
                                className="col-span-3"
                                value={taskData.url}
                                onChange={handleChange("url")}
                                placeholder="请输入URL地址"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="params" className="text-right">
                                入参
                            </Label>
                            <Input
                                id="params"
                                className="col-span-3"
                                value={taskData.params}
                                onChange={handleChange("params")}
                                placeholder="请输入入参"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!taskData.transformType || !taskData.name.trim()}>
                            确认转换
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 