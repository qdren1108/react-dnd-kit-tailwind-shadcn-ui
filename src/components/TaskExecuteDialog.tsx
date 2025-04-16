import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import { Task } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TaskExecuteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task;
    onExecute: (task: Task) => void;
    onCancel: () => void;
}

export function TaskExecuteDialog({ open, onOpenChange, task, onExecute, onCancel }: TaskExecuteDialogProps) {
    const [taskData, setTaskData] = useState<Task>(task);
    const [activeTab, setActiveTab] = useState("main");

    useEffect(() => {
        setTaskData(task);
    }, [task]);

    const handleChange = (field: keyof Task) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSourceTaskChange = (index: number, field: keyof Task) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskData(prev => {
            if (!prev.sourceTasks) return prev;
            const newSourceTasks = [...prev.sourceTasks];
            newSourceTasks[index] = {
                ...newSourceTasks[index],
                [field]: e.target.value
            };
            return {
                ...prev,
                sourceTasks: newSourceTasks
            };
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>执行任务</DialogTitle>
                    <DialogDescription>请确认或修改任务参数后执行</DialogDescription>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="main">主任务信息</TabsTrigger>
                        <TabsTrigger value="sources">原始任务信息</TabsTrigger>
                    </TabsList>
                    <TabsContent value="main">
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
                    </TabsContent>
                    <TabsContent value="sources">
                        <div className="grid gap-4 py-4">
                            {taskData.sourceTasks && taskData.sourceTasks.length > 0 ? (
                                <div className="space-y-4">
                                    {taskData.sourceTasks.map((sourceTask, index) => (
                                        <Card key={sourceTask.id}>
                                            <CardHeader>
                                                <CardTitle className="text-sm">原始任务 {index + 1}: {sourceTask.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="text-sm">
                                                <div className="grid gap-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor={`source-name-${index}`} className="text-right">名称</Label>
                                                        <Input
                                                            id={`source-name-${index}`}
                                                            value={sourceTask.name}
                                                            onChange={handleSourceTaskChange(index, 'name')}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor={`source-description-${index}`} className="text-right">描述</Label>
                                                        <Input
                                                            id={`source-description-${index}`}
                                                            value={sourceTask.description}
                                                            onChange={handleSourceTaskChange(index, 'description')}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor={`source-tableName-${index}`} className="text-right">表名</Label>
                                                        <Input
                                                            id={`source-tableName-${index}`}
                                                            value={sourceTask.tableName}
                                                            onChange={handleSourceTaskChange(index, 'tableName')}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor={`source-url-${index}`} className="text-right">接口地址</Label>
                                                        <Input
                                                            id={`source-url-${index}`}
                                                            value={sourceTask.url}
                                                            onChange={handleSourceTaskChange(index, 'url')}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor={`source-params-${index}`} className="text-right">参数</Label>
                                                        <Input
                                                            id={`source-params-${index}`}
                                                            value={sourceTask.params}
                                                            onChange={handleSourceTaskChange(index, 'params')}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    没有原始任务信息
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
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