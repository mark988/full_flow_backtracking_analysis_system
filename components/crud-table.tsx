"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import type { CrudFormField } from "@/lib/module-data"

interface CrudTableProps {
  title: string
  columns: string[]
  initialRows: Record<string, string>[]
  formFields: CrudFormField[]
  entityName: string
}

export function CrudTable({
  title,
  columns,
  initialRows,
  formFields,
  entityName,
}: CrudTableProps) {
  const [rows, setRows] = useState<Record<string, string>[]>(initialRows)
  const [searchText, setSearchText] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  // 搜索过滤
  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows
    const keyword = searchText.toLowerCase()
    return rows.filter((row) =>
      Object.values(row).some((v) => v.toLowerCase().includes(keyword))
    )
  }, [rows, searchText])

  // 打开新增对话框
  const openAdd = () => {
    setEditingIndex(null)
    setFormData({})
    setDialogOpen(true)
  }

  // 打开编辑对话框
  const openEdit = (actualIndex: number) => {
    setEditingIndex(actualIndex)
    setFormData({ ...rows[actualIndex] })
    setDialogOpen(true)
  }

  // 打开删除确认
  const openDelete = (actualIndex: number) => {
    setDeletingIndex(actualIndex)
    setDeleteDialogOpen(true)
  }

  // 获取行在原始数组中的真实索引
  const getActualIndex = (filteredIdx: number) => {
    const row = filteredRows[filteredIdx]
    return rows.indexOf(row)
  }

  // 保存（新增/编辑）
  const handleSave = () => {
    if (editingIndex !== null) {
      // 编辑模式：更新现有行
      const updated = [...rows]
      updated[editingIndex] = { ...updated[editingIndex], ...formData }
      setRows(updated)
    } else {
      // 新增模式：添加新行
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      const newRow: Record<string, string> = { 时间: timeStr }
      // 用表单数据填充
      for (const field of formFields) {
        newRow[field.key] = formData[field.key] || ""
      }
      // 非表单列填默认值
      for (const col of columns) {
        if (!newRow[col]) {
          newRow[col] = "—"
        }
      }
      setRows([newRow, ...rows])
    }
    setDialogOpen(false)
    setFormData({})
    setEditingIndex(null)
  }

  // 删除
  const handleDelete = () => {
    if (deletingIndex !== null) {
      setRows(rows.filter((_, i) => i !== deletingIndex))
    }
    setDeleteDialogOpen(false)
    setDeletingIndex(null)
  }

  // 更新表单字段
  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  // 展示列 = 原始列 + 操作列
  const displayColumns = [...columns, "操作"]

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="h-8 w-48 pl-8 text-xs"
                />
              </div>
              {/* 新增按钮 */}
              <Button size="sm" onClick={openAdd} className="h-8 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                新增{entityName}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="w-full">
            <div className="min-w-[700px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {displayColumns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={displayColumns.length}
                        className="px-3 py-8 text-center text-sm text-muted-foreground"
                      >
                        {searchText ? "未找到匹配记录" : "暂无数据"}
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, filteredIdx) => {
                      const actualIdx = getActualIndex(filteredIdx)
                      return (
                        <tr
                          key={filteredIdx}
                          className="border-b border-border/50 transition-colors hover:bg-secondary/50"
                        >
                          {columns.map((col) => {
                            const val = row[col] ?? ""
                            if (col === "状态" || col === "风险等级") {
                              return (
                                <td key={col} className="px-3 py-2.5">
                                  <StatusBadge value={val} />
                                </td>
                              )
                            }
                            return (
                              <td
                                key={col}
                                className="px-3 py-2.5 text-foreground whitespace-nowrap"
                              >
                                {val}
                              </td>
                            )
                          })}
                          {/* 操作列 */}
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEdit(actualIdx)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                                title="编辑"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDelete(actualIdx)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                title="删除"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </ScrollArea>
          {/* 底部统计 */}
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>共 {rows.length} 条记录{searchText && `，筛选出 ${filteredRows.length} 条`}</span>
          </div>
        </CardContent>
      </Card>

      {/* 新增/编辑 对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? `编辑${entityName}` : `新增${entityName}`}
            </DialogTitle>
            <DialogDescription>
              {editingIndex !== null
                ? `修改${entityName}的相关信息`
                : `填写${entityName}的相关信息后点击保存`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formFields.map((field) => (
              <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-sm">{field.label}</Label>
                <div className="col-span-3">
                  {field.type === "select" && field.options ? (
                    <Select
                      value={formData[field.key] || ""}
                      onValueChange={(v) => updateField(field.key, v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={`请选择${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData[field.key] || ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder || `请输入${field.label}`}
                      className="h-9"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              {editingIndex !== null ? "保存修改" : "确认新增"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条{entityName}记录吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// 状态/风险等级标签
function StatusBadge({ value }: { value: string }) {
  let className = "bg-muted text-muted-foreground border-border"

  if (value === "告警" || value === "严重" || value === "高危") {
    className = "bg-destructive/15 text-destructive border-destructive/30"
  } else if (
    value === "观察" || value === "中危" || value === "分析中" ||
    value === "推演中" || value === "学习中" || value === "繁忙" ||
    value === "生成中" || value === "进行中" || value === "执行中" || value === "排队中"
  ) {
    className = "bg-warning/15 text-warning border-warning/30"
  } else if (
    value === "完成" || value === "已完成" || value === "已确认" ||
    value === "已触发补救" || value === "正常" || value === "已登记" || value === "低危"
  ) {
    className = "bg-primary/15 text-primary border-primary/30"
  } else if (value === "未登记" || value === "待处理") {
    className = "bg-accent/15 text-accent border-accent/30"
  }

  return (
    <Badge variant="outline" className={`text-xs whitespace-nowrap ${className}`}>
      {value}
    </Badge>
  )
}
