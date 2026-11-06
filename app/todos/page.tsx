'use client';

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { Backdrop, OverlayWrapper } from "@/components/tailgrids/core/overlay";
import { TextArea } from "@/components/tailgrids/core/text-area";
import { TextField } from "@/components/tailgrids/core/text-field";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";
import { Toggle } from "@/components/tailgrids/core/toggle";
import {
  NativeSelect,
  NativeSelectOption
} from "@/components/tailgrids/core/native-select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from "@/components/tailgrids/core/table";
import { Pagination } from "@/components/tailgrids/core/pagination";

import { Spinner } from "@/components/tailgrids/core/spinner";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  return res.json();
};

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    checkLogin(router, '/todos');
  }, [router]);

  const [isLoading, setIsLoading] = useState(true);
  const [todosRaw, setTodosRaw] = useState<Todo[]>([]);
  const [onlyWaiting, setOnlyWaiting] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [numPages, setNumPages] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const [showdialog, setshowdialog] = useState(false);

  // 1. ดึงข้อมูลแบบสุ่มโอกาสมีข้อมูล 80%
  useEffect(() => {
    setIsLoading(true);
    fetchTodos()
      .then((data) => {
        const hasData = Math.random() < 0.8; // สุ่ม 80%
        const sliced = hasData ? data.slice(0, 13) : [];
        console.log(hasData ? "ดึงข้อมูลสำเร็จ (13 รายการ)" : "ไม่พบข้อมูล ([])", sliced);
        setTodosRaw(sliced);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 2. กรองข้อมูลตาม Toggle switch
  useEffect(() => {
    const selectedItems = todosRaw.filter(
      (todo) => !onlyWaiting || !todo.completed
    );
    setTodos(selectedItems);
  }, [todosRaw, onlyWaiting]);

  // 3. คำนวณจำนวนหน้า
  useEffect(() => {
    setNumPages(Math.ceil(todos.length / itemsPerPage));
  }, [todos, itemsPerPage]);

  // 4. ควบคุมตำแหน่งหน้าปัจจุบันเมื่อจำนวนหน้าเปลี่ยนแปลง
  useEffect(() => {
    if (numPages === 0) setCurPage(0);
    else if (curPage === 0) setCurPage(1);
    else if (curPage > numPages) setCurPage(numPages);
  }, [numPages, curPage]);

  // ลบรายการ
  const deleteClick = (id: number) => {
    setTodosRaw((prev) => prev.filter((todo) => todo.id !== id));
  };

  // เปลี่ยนสถานะเป็นเสร็จสิ้น (completed = true)
  const waitingClick = (id: number) => {
    setTodosRaw((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
  };

  // เพิ่ม todo ใหม่
  const addClick = () => {
    const title = window.prompt("พิมพ์ todo ใหม่")?.trim();
    if (!title) return;

    const newId =
      todosRaw.length > 0 ? Math.max(...todosRaw.map((t) => t.id)) + 1 : 1;

    setTodosRaw((prev) => [
      ...prev,
      { userId: 1, id: newId, title, completed: false }
    ]);
  };

  const start = (curPage - 1) * itemsPerPage;
  const pageItems = curPage > 0 ? todos.slice(start, start + itemsPerPage) : [];

  return (<>
    <div className="mt-4 px-2 max-w-3xl mx-auto">
      {/* Controller */}
      <div className="flex justify-between items-center">
        {/* Toggle */}
        <div className="flex items-center gap-2">
          <Toggle
            label="Show only"
            checked={onlyWaiting}
            onChange={(e) => setOnlyWaiting(e.target.checked)}
          />
          <Button
            size="sm"
            className="h-8 p-2 bg-yellow-400 pointer-events-none"
          >
            waiting ⏲
          </Button>
        </div>

        {/* Dropdown */}
        <div className="w-1/3">
          <NativeSelect
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <NativeSelectOption value="3">3 items per page</NativeSelectOption>
            <NativeSelectOption value="5">5 items per page</NativeSelectOption>
            <NativeSelectOption value="10">10 items per page</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4">
        <TableRoot>
          <TableHeader>
            <TableRow className="bg-background-soft-50 [&>th]:text-text-50">
              <TableHead className="bg-black !text-white" scope="col">ID</TableHead>
              <TableHead className="bg-black !text-white" scope="col">Title</TableHead>
              <TableHead className="bg-black !text-white" scope="col">
                <div className="flex items-center justify-end gap-2">
                  <span>Completed</span>
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0 bg-blue-600 text-white"
                  onClick={() => setshowdialog(true)}

                  >
                    +
                  </Button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex justify-center items-center gap-2">
                    <Spinner />
                    <span>กำลังโหลดข้อมูล...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-red-500 font-medium">
                  No data, may be connection refused (refetch again)
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell>{todo.id}</TableCell>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {todo.completed ? (
                        <Button
                          size="sm"
                          className="h-8 p-2 bg-green-600 text-white pointer-events-none"
                        >
                          done ✔
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 p-2 bg-yellow-400 text-black"
                          onClick={() => waitingClick(todo.id)}
                        >
                          waiting ⏲
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="h-8 p-2 bg-red-600 text-white"
                        onClick={() => deleteClick(todo.id)}
                      >
                        🗑
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </TableRoot>
      </div>

      {/* Pagination */}
      <div className="mt-2">
        {!isLoading && numPages > 0 && (
          <Pagination
            currentPage={curPage}
            totalPages={numPages}
            onPageChange={setCurPage}
          />
        )}
      </div>
    </div>
    <Backdrop
      isOpen={showdialog}
      onOpenChange={setshowdialog}
      >
      <Dialog>
        <DialogHeader>
          <DialogTitle>New todo</DialogTitle>
          <DialogDescription>

          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form className="flex flex-col gap-4">
            <TextField className="flex flex-col gap-1.5">
              <Label>ID (auto)</Label>
              <Input
                disabled
                className="w-full"
                autoFocus
                value={todosRaw.length ? todosRaw.length + 1 : 1}
              />
            </TextField>

            <TextField className="flex flex-col gap-1.5">
              <Label>Title</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"

              />
            </TextField>

            {/* <TextField className="flex flex-col gap-1.5">
                <Label>Bio</Label>
                <TextArea
                  rows={3}
                  placeholder="Tell us about yourself"
                  className="w-full"
                />
              </TextField> */}
          </form>
        </DialogBody>

        <DialogFooter>
          <DialogClose appearance="outline">Cancel</DialogClose>
          <DialogClose >Add auto</DialogClose>
        </DialogFooter>
      </Dialog>
    </Backdrop>

  </>



  );
}