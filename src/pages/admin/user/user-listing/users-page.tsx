import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import ToolsPanel from "./tools-panel";
import { User } from "@/types/user";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/lib/api/user-api";
import { cn } from "@/lib/utils";
import Loader from "@/components/loader";

const UsersListingPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await getAllUsers();
      if ((response as { success: boolean }).success) {
        setUsers(response.data);
      } else {
        console.error("Error fetching users:", response.error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const roleColors: Record<string, string> = {
    CUSTOMER: "bg-green-500 text-white",
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "stt",
      header: "STT",
      cell: ({ row }) => row.index + 1, // Số thứ tự bắt đầu từ 1
    },
    {
      accessorKey: "name",
      header: "Tên",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "phoneNumber",
      header: "Số điện thoại",
      cell: (info) => info.getValue() || "Chưa có",
    },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ getValue }) => {
        const role = getValue() as string;
        return (
          <span className={cn("px-2 py-1 rounded text-xs font-semibold", roleColors[role] || roleColors.default)}>
            {role}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-col h-screen">
      <Header title="Tổng quan" href="/" currentPage="Danh sách tài khoản" />
      <div className="p-5 flex-1 overflow-auto">
        <ToolsPanel />
        {loading ? (
          <div>
            {" "}
            <Loader />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Không có kết quả.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Tiếp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersListingPage;
