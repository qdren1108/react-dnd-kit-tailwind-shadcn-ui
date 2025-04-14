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

interface AddTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddTask: (content: string) => void;
}

export function AddTaskDialog({ open, onOpenChange, onAddTask }: AddTaskDialogProps) {
    const [taskContent, setTaskContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (taskContent.trim()) {
            onAddTask(taskContent);
            setTaskContent("");
            onOpenChange(false);
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
                            <Label htmlFor="task-content" className="text-right">
                                任务内容
                            </Label>
                            <Input
                                id="task-content"
                                className="col-span-3"
                                value={taskContent}
                                onChange={(e) => setTaskContent(e.target.value)}
                                placeholder="请输入任务内容"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!taskContent.trim()}>
                            添加任务
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 