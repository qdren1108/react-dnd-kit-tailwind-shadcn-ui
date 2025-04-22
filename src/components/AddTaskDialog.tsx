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
import { useState, useEffect } from "react";

interface AddTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddTask: (taskData: {
        name: string;
        description: string;
        tableName: string;
        url: string;
        params: string;
    }, targetColumn: string) => void;
    targetColumn: string;
    initialTaskName?: string;
}

export function AddTaskDialog({
    open,
    onOpenChange,
    onAddTask,
    targetColumn,
    initialTaskName = ""
}: AddTaskDialogProps) {
    const [name, setName] = useState(initialTaskName);
    const [description, setDescription] = useState("");
    const [tableName, setTableName] = useState("");
    const [url, setUrl] = useState("");
    const [params, setParams] = useState("");

    useEffect(() => {
        setName(initialTaskName);
    }, [initialTaskName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask({
            name,
            description,
            tableName,
            url,
            params,
        }, targetColumn);
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        switch (field) {
            case "name":
                setName(value);
                break;
            case "description":
                setDescription(value);
                break;
            case "tableName":
                setTableName(value);
                break;
            case "url":
                setUrl(value);
                break;
            case "params":
                setParams(value);
                break;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>添加新任务</DialogTitle>
                        <DialogDescription>
                            在此添加新的标准事件任务。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                名称
                            </Label>
                            <Input
                                id="name"
                                className="col-span-3"
                                value={name}
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
                                value={description}
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
                                value={tableName}
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
                                value={url}
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
                                value={params}
                                onChange={handleChange("params")}
                                placeholder="请输入入参"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!name.trim()}>
                            添加任务
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 