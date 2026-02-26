"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
import {
  Plus, Pencil, Trash2, Search, Server,
  ListTodo, DatabaseBackup, ClipboardList,
  Play, Pause, RotateCcw,
} from "lucide-react"

// ════════════════════════════════════════════
//  Mock 数据
// ════════════════════════════════════════════

const initialNodes = [
  { 节点ID: "NODE-001", 节点名称: "采集节点-北京1", IP地址: "10.1.1.10", 节点类型: "采集节点", CPU: "72%", 内存: "68%", 存储: "75%", 状态: "正常" },
  { 节点ID: "NODE-002", 节点名称: "采集节点-北京2", IP地址: "10.1.1.11", 节点类型: "采集节点", CPU: "65%", 内存: "71%", 存储: "80%", 状态: "正常" },
  { 节点ID: "NODE-003", 节点名称: "存储节点-上海1", IP地址: "10.2.1.10", 节点类型: "存储节点", CPU: "45%", 内存: "82%", 存储: "91%", 状态: "告警" },
  { 节点ID: "NODE-004", 节点名称: "分析节点-上海2", IP地址: "10.2.1.11", 节点类型: "分析节点", CPU: "88%", 内存: "79%", 存储: "67%", 状态: "繁忙" },
  { 节点ID: "NODE-005", 节点名称: "索引节点-广州1", IP地址: "10.3.1.10", 节点类型: "索引节点", CPU: "58%", 内存: "63%", 存储: "72%", 状态: "正常" },
  { 节点ID: "NODE-006", 节点名称: "备份节点-广州2", IP地址: "10.3.1.11", 节点类型: "备份节点", CPU: "32%", 内存: "45%", 存储: "88%", 状态: "正常" },
]

const initialTasks = [
  { 任务ID: "TASK-001", 任务名称: "DMZ区全流量回溯", 任务类型: "流量回溯", 优先级: "高", 目标节点: "NODE-001", 创建时间: "14:30:00", 状态: "运行中" },
  { 任务ID: "TASK-002", 任务名称: "数据库会话重建", 任务类型: "会话重建", 优先级: "中", 目标节点: "NODE-004", 创建时间: "14:22:00", 状态: "运行中" },
  { 任务ID: "TASK-003", 任务名称: "恶意指纹批量匹配", 任务类型: "指纹匹配", 优先级: "高", 目标节点: "NODE-005", 创建时间: "14:15:00", 状态: "排队中" },
  { 任务ID: "TASK-004", 任务名称: "APT威胁历史回溯", 任务类型: "威胁分析", 优先级: "高", 目标节点: "NODE-004", 创建时间: "13:50:00", 状态: "运行中" },
  { 任务ID: "TASK-005", 任务名称: "每日增量数据备份", 任务类型: "数据备份", 优先级: "低", 目标节点: "NODE-006", 创建时间: "13:00:00", 状态: "已完成" },
  { 任务ID: "TASK-006", 任务名称: "横向移动路径分析", 任务类型: "威胁分析", 优先级: "中", 目标节点: "NODE-004", 创建时间: "12:30:00", 状态: "失败" },
]

const initialBackups = [
  { 备份ID: "BKP-20260226-001", 备份时间: "2026-02-26 02:00", 类型: "全量备份", 数据量: "2.3 TB", 耗时: "3h 42m", 状态: "已完成" },
  { 备份ID: "BKP-20260225-003", 备份时间: "2026-02-25 18:00", 类型: "增量备份", 数据量: "128 GB", 耗时: "25m", 状态: "已完成" },
  { 备份ID: "BKP-20260225-002", 备份时间: "2026-02-25 12:00", 类型: "增量备份", 数据量: "96 GB", 耗时: "18m", 状态: "已完成" },
  { 备份ID: "BKP-20260225-001", 备份时间: "2026-02-25 02:00", 类型: "全量备份", 数据量: "2.1 TB", 耗时: "3h 28m", 状态: "已完成" },
  { 备份ID: "BKP-20260224-002", 备份时间: "2026-02-24 18:00", 类型: "配置备份", 数据量: "4.2 MB", 耗时: "3s", 状态: "已完成" },
]

const initialAuditLogs = [
  { 时间: "14:32:15", 操作人: "admin", 操作类型: "节点管理", 操作对象: "NODE-003", 操作详情: "重启存储节点-上海1", 操作IP: "10.0.0.100", 结果: "成功" },
  { 时间: "14:28:03", 操作人: "zhangsan", 操作类型: "任务调度", 操作对象: "TASK-001", 操作详情: "创建DMZ区全流量回溯任务", 操作IP: "10.0.0.101", 结果: "成功" },
  { 时间: "14:15:22", 操作人: "admin", 操作类型: "系统配置", 操作对象: "全局设置", 操作详情: "修改存储保留策略为90天", 操作IP: "10.0.0.100", 结果: "成功" },
  { 时间: "13:58:44", 操作人: "lisi", 操作类型: "任务调度", 操作对象: "TASK-006", 操作详情: "取消横向移动路径分析任务", 操作IP: "10.0.0.102", 结果: "成功" },
  { 时间: "13:42:11", 操作人: "admin", 操作类型: "权限管理", 操作对象: "User:wangwu", 操作详情: "分配分析员角色权限", 操作IP: "10.0.0.100", 结果: "成功" },
  { 时间: "13:20:08", 操作人: "zhangsan", 操作类型: "节点管理", 操作对象: "NODE-007", 操作详情: "新增采集节点-深圳1", 操作IP: "10.0.0.101", 结果: "成功" },
  { 时间: "12:55:33", 操作人: "admin", 操作类型: "备份管理", 操作对象: "BKP-20260225-003", 操作详情: "手动触发增量备份", 操作IP: "10.0.0.100", 结果: "成功" },
  { 时间: "12:30:19", 操作人: "lisi", 操作类型: "任务调度", 操作对象: "TASK-005", 操作详情: "创建每日增量数据备份任务", 操作IP: "10.0.0.102", 结果: "成功" },
  { 时间: "11:45:07", 操作人: "admin", 操作类型: "系统配置", 操作对象: "告警规则", 操作详情: "新增CPU超过85%告警规则", 操作IP: "10.0.0.100", 结果: "成功" },
  { 时间: "10:20:55", 操作人: "zhangsan", 操作类型: "权限管理", 操作对象: "User:zhaoliu", 操作详情: "创建新用户并分配只读权限", 操作IP: "10.0.0.101", 结果: "成功" },
]

// ════════════════════════════════════════════
//  状态标签
// ════════════════════════════════════════════

function StatusBadge({ value }: { value: string }) {
  let cls = "bg-muted text-muted-foreground border-border"
  if (["告警", "失败", "严重", "高危"].includes(value)) {
    cls = "bg-destructive/15 text-destructive border-destructive/30"
  } else if (["繁忙", "排队中", "运行中", "进行中", "备份中", "高"].includes(value)) {
    cls = "bg-warning/15 text-warning border-warning/30"
  } else if (["正常", "已完成", "成功", "低"].includes(value)) {
    cls = "bg-primary/15 text-primary border-primary/30"
  } else if (["离线", "维护中", "已暂停"].includes(value)) {
    cls = "bg-accent/15 text-accent border-accent/30"
  } else if (value === "中") {
    cls = "bg-muted text-muted-foreground border-border"
  }
  return (
    <Badge variant="outline" className={`text-xs whitespace-nowrap ${cls}`}>{value}</Badge>
  )
}

// 判断是否为状态类列
function isStatusCol(col: string) {
  return ["状态", "结果", "优先级"].includes(col)
}

// ════════════════════════════════════════════
//  通用搜索框
// ════════════════════════════════════════════

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="搜索..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-48 pl-8 text-xs"
      />
    </div>
  )
}

// ════════════════════════════════════════════
//  表格渲染器
// ════════════════════════════════════════════

function DataTable({
  columns,
  rows,
  actions,
}: {
  columns: string[]
  rows: Record<string, string>[]
  actions?: (row: Record<string, string>, idx: number) => React.ReactNode
}) {
  const displayCols = actions ? [...columns, "操作"] : columns
  return (
    <ScrollArea className="w-full">
      <div className="min-w-[700px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {displayCols.map((col) => (
                <th key={col} className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={displayCols.length} className="px-3 py-8 text-center text-sm text-muted-foreground">暂无数据</td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="border-b border-border/50 transition-colors hover:bg-secondary/50">
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-2.5 whitespace-nowrap">
                      {isStatusCol(col) ? <StatusBadge value={row[col] ?? ""} /> : <span className="text-foreground">{row[col] ?? ""}</span>}
                    </td>
                  ))}
                  {actions && <td className="px-3 py-2.5">{actions(row, idx)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  )
}

// ════════════════════════════════════════════
//  表单对话框
// ════════════════════════════════════════════

interface FormField {
  key: string
  label: string
  type: "text" | "select"
  options?: string[]
  placeholder?: string
}

function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  formData,
  onFieldChange,
  onSave,
  saveLabel,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description: string
  fields: FormField[]
  formData: Record<string, string>
  onFieldChange: (key: string, value: string) => void
  onSave: () => void
  saveLabel: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.key} className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm">{field.label}</Label>
              <div className="col-span-3">
                {field.type === "select" && field.options ? (
                  <Select value={formData[field.key] || ""} onValueChange={(v) => onFieldChange(field.key, v)}>
                    <SelectTrigger className="h-9"><SelectValue placeholder={`请选择${field.label}`} /></SelectTrigger>
                    <SelectContent>
                      {field.options.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={formData[field.key] || ""}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder || `请输入${field.label}`}
                    className="h-9"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={onSave}>{saveLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDialog({
  open,
  onOpenChange,
  entityName,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  entityName: string
  onConfirm: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>确定要删除这条{entityName}记录吗？此操作不可撤销。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">确认删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ════════════════════════════════════════════
//  Tab 1: 节点管理
// ════════════════════════════════════════════

const nodeFields: FormField[] = [
  { key: "节点名称", label: "节点名称", type: "text", placeholder: "如: 采集节点-深圳1" },
  { key: "IP地址", label: "IP地址", type: "text", placeholder: "如: 10.4.1.10" },
  { key: "节点类型", label: "节点类型", type: "select", options: ["采集节点", "存储节点", "分析节点", "索引节点", "备份节点"] },
  { key: "状态", label: "状态", type: "select", options: ["正常", "告警", "繁忙", "离线", "维护中"] },
]
const nodeColumns = ["节点ID", "节点名称", "IP地址", "节点类型", "CPU", "内存", "存储", "状态"]

function NodeManagement() {
  const [rows, setRows] = useState(initialNodes)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const kw = search.toLowerCase()
    return rows.filter((r) => Object.values(r).some((v) => v.toLowerCase().includes(kw)))
  }, [rows, search])

  const openAdd = () => { setEditIdx(null); setForm({}); setDialogOpen(true) }
  const openEdit = (i: number) => { setEditIdx(i); setForm({ ...rows[i] }); setDialogOpen(true) }
  const getActual = (fi: number) => rows.indexOf(filtered[fi])

  const handleSave = () => {
    if (editIdx !== null) {
      const u = [...rows]; u[editIdx] = { ...u[editIdx], ...form }; setRows(u)
    } else {
      const id = `NODE-${String(rows.length + 1).padStart(3, "0")}`
      setRows([{ 节点ID: id, CPU: "0%", 内存: "0%", 存储: "0%", ...form }, ...rows])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteIdx !== null) setRows(rows.filter((_, i) => i !== deleteIdx))
    setDeleteIdx(null)
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">探针与节点管理</CardTitle>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} />
              <Button size="sm" onClick={openAdd} className="h-8 gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" />新增节点</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <DataTable
            columns={nodeColumns}
            rows={filtered}
            actions={(_, fi) => {
              const ai = getActual(fi)
              return (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(ai)} className="h-7 w-7 p-0 text-muted-foreground hover:text-primary" title="编辑"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteIdx(ai)} className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" title="删除"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              )
            }}
          />
          <div className="mt-3 text-xs text-muted-foreground">共 {rows.length} 个节点{search && `，筛选出 ${filtered.length} 个`}</div>
        </CardContent>
      </Card>
      <FormDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        title={editIdx !== null ? "编辑节点" : "新增节点"}
        description={editIdx !== null ? "修改节点的配置信息" : "填写新探针节点的配置信息"}
        fields={nodeFields} formData={form}
        onFieldChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))}
        onSave={handleSave} saveLabel={editIdx !== null ? "保存修改" : "确认新增"}
      />
      <DeleteDialog open={deleteIdx !== null} onOpenChange={() => setDeleteIdx(null)} entityName="节点" onConfirm={handleDelete} />
    </>
  )
}

// ════════════════════════════════════════════
//  Tab 2: 任务调度
// ════════════════════════════════════════════

const taskFields: FormField[] = [
  { key: "任务名称", label: "任务名称", type: "text", placeholder: "如: DMZ区全流量回溯" },
  { key: "任务类型", label: "任务类型", type: "select", options: ["流量回溯", "会话重建", "指纹匹配", "威胁分析", "数据备份"] },
  { key: "优先级", label: "优先级", type: "select", options: ["高", "中", "低"] },
  { key: "目标节点", label: "目标节点", type: "text", placeholder: "如: NODE-001" },
  { key: "状态", label: "状态", type: "select", options: ["运行中", "排队中", "已完成", "失败", "已暂停"] },
]
const taskColumns = ["任务ID", "任务名称", "任务类型", "优先级", "目标节点", "创建时间", "状态"]

function TaskScheduling() {
  const [rows, setRows] = useState(initialTasks)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const kw = search.toLowerCase()
    return rows.filter((r) => Object.values(r).some((v) => v.toLowerCase().includes(kw)))
  }, [rows, search])

  const openAdd = () => { setEditIdx(null); setForm({}); setDialogOpen(true) }
  const openEdit = (i: number) => { setEditIdx(i); setForm({ ...rows[i] }); setDialogOpen(true) }
  const getActual = (fi: number) => rows.indexOf(filtered[fi])

  // 快捷操作：暂停/恢复/重试
  const quickAction = (idx: number, newStatus: string) => {
    const u = [...rows]; u[idx] = { ...u[idx], 状态: newStatus }; setRows(u)
  }

  const handleSave = () => {
    if (editIdx !== null) {
      const u = [...rows]; u[editIdx] = { ...u[editIdx], ...form }; setRows(u)
    } else {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      const id = `TASK-${String(rows.length + 1).padStart(3, "0")}`
      setRows([{ 任务ID: id, 创建时间: time, ...form }, ...rows])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteIdx !== null) setRows(rows.filter((_, i) => i !== deleteIdx))
    setDeleteIdx(null)
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">回溯任务调度</CardTitle>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} />
              <Button size="sm" onClick={openAdd} className="h-8 gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" />新增任务</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <DataTable
            columns={taskColumns}
            rows={filtered}
            actions={(row, fi) => {
              const ai = getActual(fi)
              const st = row["状态"]
              return (
                <div className="flex items-center gap-1">
                  {/* 快捷操作按钮 */}
                  {st === "运行中" && (
                    <Button variant="ghost" size="sm" onClick={() => quickAction(ai, "已暂停")} className="h-7 w-7 p-0 text-muted-foreground hover:text-warning" title="暂停"><Pause className="h-3.5 w-3.5" /></Button>
                  )}
                  {st === "已暂停" && (
                    <Button variant="ghost" size="sm" onClick={() => quickAction(ai, "运行中")} className="h-7 w-7 p-0 text-muted-foreground hover:text-primary" title="恢复"><Play className="h-3.5 w-3.5" /></Button>
                  )}
                  {st === "失败" && (
                    <Button variant="ghost" size="sm" onClick={() => quickAction(ai, "排队中")} className="h-7 w-7 p-0 text-muted-foreground hover:text-primary" title="重试"><RotateCcw className="h-3.5 w-3.5" /></Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => openEdit(ai)} className="h-7 w-7 p-0 text-muted-foreground hover:text-primary" title="编辑"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteIdx(ai)} className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" title="删除"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              )
            }}
          />
          <div className="mt-3 text-xs text-muted-foreground">
            共 {rows.length} 个任务{search && `，筛选出 ${filtered.length} 个`}
            <span className="ml-4">运行中 {rows.filter((r) => r["状态"] === "运行中").length}</span>
            <span className="ml-2">排队中 {rows.filter((r) => r["状态"] === "排队中").length}</span>
            <span className="ml-2">已完成 {rows.filter((r) => r["状态"] === "已完成").length}</span>
            <span className="ml-2">失败 {rows.filter((r) => r["状态"] === "失败").length}</span>
          </div>
        </CardContent>
      </Card>
      <FormDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        title={editIdx !== null ? "编辑任务" : "新增任务"}
        description={editIdx !== null ? "修改调度任务的配置" : "创建新的回溯调度任务"}
        fields={taskFields} formData={form}
        onFieldChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))}
        onSave={handleSave} saveLabel={editIdx !== null ? "保存修改" : "创建任务"}
      />
      <DeleteDialog open={deleteIdx !== null} onOpenChange={() => setDeleteIdx(null)} entityName="任务" onConfirm={handleDelete} />
    </>
  )
}

// ════════════════════════════════════════════
//  Tab 3: 系统备份
// ════════════════════════════════════════════

const backupFields: FormField[] = [
  { key: "类型", label: "备份类型", type: "select", options: ["全量备份", "增量备份", "配置备份"] },
  { key: "备份描述", label: "备份描述", type: "text", placeholder: "如: 手动触发每周全量备份" },
]
const backupColumns = ["备份ID", "备份时间", "类型", "数据量", "耗时", "状态"]

function BackupManagement() {
  const [rows, setRows] = useState(initialBackups)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const kw = search.toLowerCase()
    return rows.filter((r) => Object.values(r).some((v) => v.toLowerCase().includes(kw)))
  }, [rows, search])

  const getActual = (fi: number) => rows.indexOf(filtered[fi])

  const handleCreate = () => {
    const now = new Date()
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    const dateStr = ts.replace(/[-: ]/g, "").slice(0, 8)
    const id = `BKP-${dateStr}-${String(rows.length + 1).padStart(3, "0")}`
    const sizeMap: Record<string, string> = { "全量备份": "— (进行中)", "增量备份": "— (进行中)", "配置备份": "— (进行中)" }
    setRows([{
      备份ID: id,
      备份时间: ts,
      类型: form["类型"] || "增量备份",
      数据量: sizeMap[form["类型"] || "增量备份"],
      耗时: "—",
      状态: "备份中",
    }, ...rows])
    setDialogOpen(false)
    setForm({})
  }

  const handleDelete = () => {
    if (deleteIdx !== null) setRows(rows.filter((_, i) => i !== deleteIdx))
    setDeleteIdx(null)
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-medium text-foreground">系统备份管理</CardTitle>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} />
              <Button size="sm" onClick={() => { setForm({}); setDialogOpen(true) }} className="h-8 gap-1.5 text-xs"><DatabaseBackup className="h-3.5 w-3.5" />创建备份</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <DataTable
            columns={backupColumns}
            rows={filtered}
            actions={(_, fi) => {
              const ai = getActual(fi)
              return (
                <Button variant="ghost" size="sm" onClick={() => setDeleteIdx(ai)} className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" title="删除"><Trash2 className="h-3.5 w-3.5" /></Button>
              )
            }}
          />
          <div className="mt-3 text-xs text-muted-foreground">共 {rows.length} 条备份记录{search && `，筛选出 ${filtered.length} 条`}</div>
        </CardContent>
      </Card>
      <FormDialog
        open={dialogOpen} onOpenChange={setDialogOpen}
        title="创建备份" description="选择备份类型并立即开始备份"
        fields={backupFields} formData={form}
        onFieldChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))}
        onSave={handleCreate} saveLabel="立即备份"
      />
      <DeleteDialog open={deleteIdx !== null} onOpenChange={() => setDeleteIdx(null)} entityName="备份" onConfirm={handleDelete} />
    </>
  )
}

// ════════════════════════════════════════════
//  Tab 4: 操作审计
// ════════════════════════════════════════════

const auditColumns = ["时间", "操作人", "操作类型", "操作对象", "操作详情", "操作IP", "结果"]

function AuditLog() {
  const [search, setSearch] = useState("")
  const filtered = useMemo(() => {
    if (!search.trim()) return initialAuditLogs
    const kw = search.toLowerCase()
    return initialAuditLogs.filter((r) => Object.values(r).some((v) => v.toLowerCase().includes(kw)))
  }, [search])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-foreground">操作审计日志</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">记录系统内所有管理操作，不可删除</p>
          </div>
          <SearchInput value={search} onChange={setSearch} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <DataTable columns={auditColumns} rows={filtered} />
        <div className="mt-3 text-xs text-muted-foreground">共 {initialAuditLogs.length} 条记录{search && `，筛选出 ${filtered.length} 条`}</div>
      </CardContent>
    </Card>
  )
}

// ════════════════════════════════════════════
//  主组件：OpsMatrix 管理面板
// ════════════════════════════════════════════

export function OpsMatrixPanels() {
  return (
    <Tabs defaultValue="nodes" className="w-full">
      <TabsList className="mb-4 w-full justify-start bg-secondary/50">
        <TabsTrigger value="nodes" className="gap-1.5 text-xs">
          <Server className="h-3.5 w-3.5" />
          节点管理
        </TabsTrigger>
        <TabsTrigger value="tasks" className="gap-1.5 text-xs">
          <ListTodo className="h-3.5 w-3.5" />
          任务调度
        </TabsTrigger>
        <TabsTrigger value="backups" className="gap-1.5 text-xs">
          <DatabaseBackup className="h-3.5 w-3.5" />
          系统备份
        </TabsTrigger>
        <TabsTrigger value="audit" className="gap-1.5 text-xs">
          <ClipboardList className="h-3.5 w-3.5" />
          操作审计
        </TabsTrigger>
      </TabsList>

      <TabsContent value="nodes"><NodeManagement /></TabsContent>
      <TabsContent value="tasks"><TaskScheduling /></TabsContent>
      <TabsContent value="backups"><BackupManagement /></TabsContent>
      <TabsContent value="audit"><AuditLog /></TabsContent>
    </Tabs>
  )
}
