// 每个模块的专属数据配置：统计卡片、图表数据、表格数据

export interface ModuleStats {
  label: string
  value: string
  change: string
}

export interface ModulePieItem {
  name: string
  value: number
  color: string
}

export interface ModuleTableConfig {
  title: string
  columns: string[]
  rows: Record<string, string>[]
}

export interface CrudFormField {
  key: string
  label: string
  type: "text" | "select"
  options?: string[]
  placeholder?: string
}

export interface CrudConfig {
  entityName: string
  formFields: CrudFormField[]
}

export interface ModuleChartConfig {
  title: string
  yLabel: string
  series: { key: string; name: string; color: string; dashed?: boolean }[]
}

export interface ModulePageData {
  stats: ModuleStats[]
  chart: ModuleChartConfig
  chartData: Record<string, string | number>[]
  pieTitle: string
  pieData: ModulePieItem[]
  table: ModuleTableConfig
  crud?: CrudConfig
}

// 生成24小时模拟数据
function genHourly(fn: (h: number) => Record<string, number>): Record<string, string | number>[] {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    ...fn(i),
  }))
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

const C1 = "oklch(0.72 0.19 170)"
const C2 = "oklch(0.55 0.20 200)"
const C3 = "oklch(0.65 0.15 60)"
const C4 = "oklch(0.60 0.22 25)"
const C5 = "oklch(0.55 0.18 280)"

export const modulePageDataMap: Record<string, ModulePageData> = {
  // ─── 1. TimeStream 全时域流量存储引擎 ───
  timestream: {
    stats: [
      { label: "存储总量", value: "2.8 PB", change: "+128TB" },
      { label: "今日写入", value: "128 TB", change: "+12.5%" },
      { label: "平均检索延迟", value: "0.23s", change: "-18%" },
      { label: "存储节点", value: "32 个", change: "全部在线" },
    ],
    chart: {
      title: "存储写入趋势",
      yLabel: "TB",
      series: [
        { key: "write", name: "写入量", color: C1 },
        { key: "read", name: "读取量", color: C2, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ write: rand(3, 8), read: rand(1, 5) })),
    pieTitle: "冷热数据分布",
    pieData: [
      { name: "热数据", value: 45, color: C4 },
      { name: "温数据", value: 30, color: C3 },
      { name: "冷数据", value: 25, color: C2 },
    ],
    table: {
      title: "近期检索记录",
      columns: ["时间", "查询条件", "命中记录", "耗时", "状态"],
      rows: [
        { 时间: "14:32:05", 查询条件: "src_ip=192.168.1.45 AND port=443", 命中记录: "28,473", 耗时: "0.18s", 状态: "完成" },
        { 时间: "14:28:11", 查询条件: "dst_ip=10.0.3.22 AND proto=TCP", 命中记录: "142,891", 耗时: "0.35s", 状态: "完成" },
        { 时间: "14:25:33", 查询条件: "domain=*.example.com", 命中记录: "8,234", 耗时: "0.12s", 状态: "完成" },
        { 时间: "14:21:47", 查询条件: "payload CONTAINS 'passwd'", 命中记录: "347", 耗时: "1.24s", 状态: "完成" },
        { 时间: "14:18:09", 查询条件: "time_range=[08:00,12:00] AND alert=true", 命中记录: "1,892", 耗时: "0.28s", 状态: "完成" },
        { 时间: "14:15:22", 查询条件: "session_id=SES-20260225-84721", 命中记录: "1", 耗时: "0.02s", 状态: "完成" },
      ],
    },
    crud: {
      entityName: "检索规则",
      formFields: [
        { key: "查询条件", label: "查询条件", type: "text", placeholder: "如: src_ip=192.168.1.45 AND port=443" },
        { key: "命中记录", label: "最大返回记录", type: "select", options: ["100", "1,000", "10,000", "50,000", "不限"] },
        { key: "状态", label: "状态", type: "select", options: ["完成", "执行中", "排队中"] },
      ],
    },
  },

  // ─── 2. SessionRebuild 会话重建与业务还原中心 ───
  "session-rebuild": {
    stats: [
      { label: "今日重建会话", value: "284,392", change: "+8.3%" },
      { label: "重建成功率", value: "99.2%", change: "+0.1%" },
      { label: "支持协议数", value: "47 种", change: "+3" },
      { label: "活跃重建任务", value: "12", change: "稳定" },
    ],
    chart: {
      title: "会话重建趋势",
      yLabel: "会话数",
      series: [
        { key: "rebuilt", name: "重建会话", color: C1 },
        { key: "failed", name: "失败会话", color: C4, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ rebuilt: rand(8000, 15000), failed: rand(10, 120) })),
    pieTitle: "协议分布",
    pieData: [
      { name: "HTTPS", value: 45, color: C1 },
      { name: "HTTP", value: 20, color: C2 },
      { name: "FTP", value: 12, color: C3 },
      { name: "SMTP", value: 10, color: C4 },
      { name: "其他", value: 13, color: C5 },
    ],
    table: {
      title: "近期会话重建记录",
      columns: ["时间", "协议", "源地址", "目标地址", "持续时长", "还原对象", "状态"],
      rows: [
        { 时间: "14:32:18", 协议: "HTTPS", 源地址: "192.168.1.45:52341", 目标地址: "10.0.3.22:443", 持续时长: "3m 42s", 还原对象: "Web页面 ×12", 状态: "完成" },
        { 时间: "14:30:05", 协议: "FTP", 源地址: "10.0.1.88:45123", 目标地址: "172.16.0.5:21", 持续时长: "8m 15s", 还原对象: "文件 ×3", 状态: "完成" },
        { 时间: "14:28:44", 协议: "SMTP", 源地址: "10.0.2.33:38921", 目标地址: "172.16.0.10:25", 持续时长: "0m 28s", 还原对象: "邮件 ×1", 状态: "完成" },
        { 时间: "14:25:11", 协议: "MySQL", 源地址: "192.168.1.100:49283", 目标地址: "10.0.3.50:3306", 持续时长: "15m 03s", 还原对象: "SQL语句 ×847", 状态: "完成" },
        { 时间: "14:22:37", 协议: "HTTP", 源地址: "172.16.0.88:51234", 目标地址: "10.0.1.15:8080", 持续时长: "1m 12s", 还原对象: "API请求 ×34", 状态: "完成" },
        { 时间: "14:19:50", 协议: "DNS", 源地址: "10.0.0.5:53421", 目标地址: "8.8.8.8:53", 持续时长: "0m 02s", 还原对象: "DNS查询 ×128", 状态: "完成" },
      ],
    },
    crud: {
      entityName: "重建任务",
      formFields: [
        { key: "协议", label: "协议类型", type: "select", options: ["HTTPS", "HTTP", "FTP", "SMTP", "MySQL", "DNS", "SSH", "RDP"] },
        { key: "源地址", label: "源地址", type: "text", placeholder: "如: 192.168.1.45:52341" },
        { key: "目标地址", label: "目标地址", type: "text", placeholder: "如: 10.0.3.22:443" },
        { key: "状态", label: "状态", type: "select", options: ["完成", "进行中", "排队中"] },
      ],
    },
  },

  // ─── 3. TraceWeaver 多维关联溯源中心 ───
  "trace-weaver": {
    stats: [
      { label: "关联实体总数", value: "128,473", change: "+2,847" },
      { label: "溯源链条", value: "2,847 条", change: "+12.1%" },
      { label: "关键节点", value: "347 个", change: "+23" },
      { label: "活跃分析", value: "23 个", change: "+5" },
    ],
    chart: {
      title: "关联分析趋势",
      yLabel: "实体数",
      series: [
        { key: "entities", name: "新增实体", color: C1 },
        { key: "links", name: "新增关联", color: C2, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ entities: rand(200, 800), links: rand(500, 2000) })),
    pieTitle: "实体类型分布",
    pieData: [
      { name: "IP地址", value: 35, color: C1 },
      { name: "用户账号", value: 25, color: C2 },
      { name: "终端设备", value: 20, color: C3 },
      { name: "域名", value: 15, color: C4 },
      { name: "文件", value: 5, color: C5 },
    ],
    table: {
      title: "近期溯源分析记录",
      columns: ["时间", "源实体", "目标实体", "关联维度", "跳数", "状态"],
      rows: [
        { 时间: "14:31:22", 源实体: "IP:192.168.1.45", 目标实体: "User:admin@corp.cn", 关联维度: "登录行为", 跳数: "2", 状态: "完成" },
        { 时间: "14:28:15", 源实体: "Domain:evil.com", 目标实体: "IP:10.0.3.22", 关联维度: "DNS解析", 跳数: "1", 状态: "完成" },
        { 时间: "14:25:47", 源实体: "File:trojan.exe", 目标实体: "Device:PC-SALES-07", 关联维度: "文件传输", 跳数: "3", 状态: "完成" },
        { 时间: "14:22:33", 源实体: "User:zhang.san", 目标实体: "IP:172.16.0.88", 关联维度: "VPN接入", 跳数: "1", 状态: "完成" },
        { 时间: "14:19:08", 源实体: "IP:10.0.1.15", 目标实体: "Domain:c2.attacker.net", 关联维度: "C2通信", 跳数: "4", 状态: "告警" },
        { 时间: "14:16:51", 源实体: "Device:SRV-DB-01", 目标实体: "IP:ext:185.22.4.1", 关联维度: "异常外联", 跳数: "2", 状态: "告警" },
      ],
    },
    crud: {
      entityName: "溯源任务",
      formFields: [
        { key: "源实体", label: "源实体", type: "text", placeholder: "如: IP:192.168.1.45" },
        { key: "目标实体", label: "目标实体", type: "text", placeholder: "如: User:admin@corp.cn" },
        { key: "关联维度", label: "关联维度", type: "select", options: ["登录行为", "DNS解析", "文件传输", "VPN接入", "C2通信", "异常外联", "端口扫描"] },
        { key: "状态", label: "状态", type: "select", options: ["完成", "进行中", "告警"] },
      ],
    },
  },

  // ─── 4. AttackPath 攻击路径推演中心 ───
  "attack-path": {
    stats: [
      { label: "检测攻击链", value: "23 条", change: "+3" },
      { label: "横向移动", value: "8 次", change: "+2" },
      { label: "高危路径", value: "5 条", change: "-1" },
      { label: "推演任务", value: "12 个", change: "运行中" },
    ],
    chart: {
      title: "攻击检测趋势",
      yLabel: "事件数",
      series: [
        { key: "attacks", name: "攻击事件", color: C4 },
        { key: "blocked", name: "已阻断", color: C1, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ attacks: rand(5, 30), blocked: rand(3, 25) })),
    pieTitle: "攻击阶段分布",
    pieData: [
      { name: "侦察探测", value: 25, color: C1 },
      { name: "初始入侵", value: 20, color: C2 },
      { name: "横向移动", value: 20, color: C3 },
      { name: "权限提升", value: 15, color: C4 },
      { name: "数据窃取", value: 20, color: C5 },
    ],
    table: {
      title: "近期攻击路径",
      columns: ["时间", "攻击源", "目标", "攻击阶段", "涉及主机", "风险等级", "状态"],
      rows: [
        { 时间: "14:30:12", 攻击源: "ext:89.12.3.44", 目标: "10.0.0.5", 攻击阶段: "初始入侵→横向移动", 涉及主机: "4", 风险等级: "严重", 状态: "推演中" },
        { 时间: "14:25:33", 攻击源: "ext:45.33.12.7", 目标: "172.16.0.88", 攻击阶段: "C2通信→数据窃取", 涉及主机: "2", 风险等级: "高危", 状态: "已确认" },
        { 时间: "14:20:18", 攻击源: "192.168.1.45", 目标: "10.0.3.0/24", 攻击阶段: "横向移动→权限提升", 涉及主机: "7", 风险等级: "高危", 状态: "推演中" },
        { 时间: "14:15:44", 攻击源: "ext:203.0.113.5", 目标: "10.0.0.0/16", 攻击阶段: "侦察探测", 涉及主机: "1", 风险等级: "中危", 状态: "已完成" },
        { 时间: "14:10:21", 攻击源: "10.0.1.15", 目标: "ext:185.22.4.1", 攻击阶段: "数据窃取", 涉及主机: "1", 风险等级: "严重", 状态: "已确认" },
      ],
    },
  },

  // ─── 5. ShadowAsset 隐性资产发现中心 ───
  "shadow-asset": {
    stats: [
      { label: "已发现资产", value: "1,847", change: "+7 今日" },
      { label: "未登记资产", value: "234 个", change: "+12" },
      { label: "高风险资产", value: "18 个", change: "-3" },
      { label: "指纹识别率", value: "94.7%", change: "+0.3%" },
    ],
    chart: {
      title: "资产发现趋势",
      yLabel: "资产数",
      series: [
        { key: "discovered", name: "新发现", color: C1 },
        { key: "registered", name: "已登记", color: C2, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ discovered: rand(2, 15), registered: rand(1, 10) })),
    pieTitle: "资产类型分布",
    pieData: [
      { name: "服务器", value: 30, color: C1 },
      { name: "IoT设备", value: 25, color: C2 },
      { name: "网络设备", value: 20, color: C3 },
      { name: "终端设备", value: 15, color: C4 },
      { name: "其他", value: 10, color: C5 },
    ],
    table: {
      title: "近期发现资产",
      columns: ["时间", "IP地址", "类型", "操作系统/服务", "开放端口", "风险等级", "状态"],
      rows: [
        { 时间: "14:32:05", IP地址: "10.0.5.123", 类型: "服务器", "操作系统/服务": "Linux/Nginx", 开放端口: "80,443,22", 风险等级: "中危", 状态: "未登记" },
        { 时间: "14:28:33", IP地址: "172.16.3.45", 类型: "IoT设备", "操作系统/服务": "嵌入式/RTSP", 开放端口: "554,80", 风险等级: "高危", 状态: "未登记" },
        { 时间: "14:25:11", IP地址: "192.168.5.201", 类型: "网络设备", "操作系统/服务": "Cisco IOS", 开放端口: "22,161,443", 风险等级: "低危", 状态: "已登记" },
        { 时间: "14:21:47", IP地址: "10.0.8.88", 类型: "终端设备", "操作系统/服务": "Windows 11", 开放端口: "135,445,3389", 风险等级: "中危", 状态: "未登记" },
        { 时间: "14:18:22", IP地址: "172.16.1.100", 类型: "服务器", "操作系统/服务": "Linux/Docker", 开放端口: "2375,8080,9090", 风险等级: "高危", 状态: "未登记" },
        { 时间: "14:15:08", IP地址: "10.0.2.77", 类型: "IoT设备", "操作系统/服务": "打印机/JetDirect", 开放端口: "9100,80,515", 风险等级: "低危", 状态: "已登记" },
      ],
    },
    crud: {
      entityName: "资产信息",
      formFields: [
        { key: "IP地址", label: "IP地址", type: "text", placeholder: "如: 10.0.5.123" },
        { key: "类型", label: "资产类型", type: "select", options: ["服务器", "IoT设备", "网络设备", "终端设备", "其他"] },
        { key: "操作系统/服务", label: "操作系统/服务", type: "text", placeholder: "如: Linux/Nginx" },
        { key: "开放端口", label: "开放端口", type: "text", placeholder: "如: 80,443,22" },
        { key: "风险等级", label: "风险等级", type: "select", options: ["高危", "中危", "低危"] },
        { key: "状态", label: "登记状态", type: "select", options: ["已登记", "未登记"] },
      ],
    },
  },

  // ─── 6. CipherSense 加密流量智能识别中心 ───
  "cipher-sense": {
    stats: [
      { label: "加密流量占比", value: "73.6%", change: "+1.2%" },
      { label: "异常检测", value: "47 个", change: "+5" },
      { label: "C2通信嫌疑", value: "3 个", change: "新增" },
      { label: "隐蔽隧道", value: "8 个", change: "+2" },
    ],
    chart: {
      title: "加密流量分析趋势",
      yLabel: "GB",
      series: [
        { key: "encrypted", name: "加密流量", color: C1 },
        { key: "anomaly", name: "异常流量", color: C4, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ encrypted: rand(300, 900), anomaly: rand(5, 40) })),
    pieTitle: "加密协议分布",
    pieData: [
      { name: "TLS 1.3", value: 55, color: C1 },
      { name: "TLS 1.2", value: 25, color: C2 },
      { name: "QUIC", value: 12, color: C3 },
      { name: "SSH", value: 5, color: C4 },
      { name: "其他", value: 3, color: C5 },
    ],
    table: {
      title: "近期异常告警",
      columns: ["时间", "源地址", "目标地址", "异常类型", "置信度", "风险评分", "状态"],
      rows: [
        { 时间: "14:31:45", 源地址: "10.0.1.15", 目标地址: "ext:95.142.46.2", 异常类型: "C2通信特征", 置信度: "97.3%", 风险评分: "9.5", 状态: "告警" },
        { 时间: "14:28:22", 源地址: "172.16.0.88", 目标地址: "ext:45.33.12.7", 异常类型: "隐蔽隧道", 置信度: "89.1%", 风险评分: "8.7", 状态: "告警" },
        { 时间: "14:25:08", 源地址: "192.168.1.45", 目标地址: "ext:104.27.1.1", 异常类型: "异常JA3指纹", 置信度: "76.5%", 风险评分: "6.2", 状态: "观察" },
        { 时间: "14:22:33", 源地址: "10.0.3.22", 目标地址: "ext:185.22.4.1", 异常类型: "DGA域名", 置信度: "92.8%", 风险评分: "9.1", 状态: "告警" },
        { 时间: "14:19:11", 源地址: "10.0.2.33", 目标地址: "ext:203.0.113.5", 异常类型: "证书异常", 置信度: "68.4%", 风险评分: "5.1", 状态: "观察" },
        { 时间: "14:16:47", 源地址: "172.16.0.101", 目标地址: "ext:89.12.3.44", 异常类型: "心跳周期异常", 置信度: "84.7%", 风险评分: "7.8", 状态: "告警" },
      ],
    },
  },

  // ─── 7. FlowDNA 流量指纹基因库 ───
  "flow-dna": {
    stats: [
      { label: "指纹总数", value: "12,847", change: "+23 今日" },
      { label: "今日匹配", value: "384,291", change: "+15.2%" },
      { label: "新增指纹", value: "23 个", change: "+8" },
      { label: "未知变种", value: "7 个", change: "待分析" },
    ],
    chart: {
      title: "指纹匹配趋势",
      yLabel: "匹配次数",
      series: [
        { key: "matched", name: "已匹配", color: C1 },
        { key: "unknown", name: "未知流量", color: C4, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ matched: rand(10000, 20000), unknown: rand(50, 500) })),
    pieTitle: "指纹类别分布",
    pieData: [
      { name: "Web应用", value: 30, color: C1 },
      { name: "恶意软件", value: 25, color: C4 },
      { name: "IoT协议", value: 20, color: C2 },
      { name: "隧道工具", value: 15, color: C3 },
      { name: "其他", value: 10, color: C5 },
    ],
    table: {
      title: "近期匹配记录",
      columns: ["时间", "指纹ID", "类别", "匹配流量", "置信度", "来源IP", "状态"],
      rows: [
        { 时间: "14:32:11", 指纹ID: "FP-2847", 类别: "恶意软件", 匹配流量: "Cobalt Strike Beacon", 置信度: "98.7%", 来源IP: "10.0.1.15", 状态: "告警" },
        { 时间: "14:29:45", 指纹ID: "FP-1023", 类别: "隧道工具", 匹配流量: "DNS隧道", 置信度: "94.2%", 来源IP: "172.16.0.101", 状态: "告警" },
        { 时间: "14:27:33", 指纹ID: "FP-0891", 类别: "Web应用", 匹配流量: "WordPress 6.x", 置信度: "99.1%", 来源IP: "10.0.5.123", 状态: "正常" },
        { 时间: "14:24:18", 指纹ID: "FP-NEW-07", 类别: "未知", 匹配流量: "未知加密协议", 置信度: "—", 来源IP: "192.168.1.45", 状态: "学习中" },
        { 时间: "14:21:52", 指纹ID: "FP-3421", 类别: "IoT协议", 匹配流量: "MQTT v5", 置信度: "96.8%", 来源IP: "172.16.3.45", 状态: "正常" },
        { 时间: "14:18:09", 指纹ID: "FP-2103", 类别: "恶意软件", 匹配流量: "Emotet变种", 置信度: "87.3%", 来源IP: "10.0.2.33", 状态: "告警" },
      ],
    },
    crud: {
      entityName: "指纹规则",
      formFields: [
        { key: "指纹ID", label: "指纹ID", type: "text", placeholder: "如: FP-3001" },
        { key: "类别", label: "类别", type: "select", options: ["Web应用", "恶意软件", "IoT协议", "隧道工具", "其他"] },
        { key: "匹配流量", label: "匹配特征描述", type: "text", placeholder: "如: Cobalt Strike Beacon" },
        { key: "来源IP", label: "关联来源IP", type: "text", placeholder: "如: 10.0.1.15" },
        { key: "状态", label: "状态", type: "select", options: ["正常", "告警", "学习中", "禁用"] },
      ],
    },
  },

  // ─── 8. RetroAI 智能回溯分析引擎 ───
  "retro-ai": {
    stats: [
      { label: "回溯任务", value: "47 个", change: "+8 今日" },
      { label: "发现威胁", value: "128 个", change: "+23" },
      { label: "历史匹配", value: "2,847 条", change: "+342" },
      { label: "补救触发", value: "34 次", change: "+5" },
    ],
    chart: {
      title: "回溯分析趋势",
      yLabel: "匹配数",
      series: [
        { key: "scanned", name: "扫描流量", color: C1 },
        { key: "threats", name: "发现威胁", color: C4, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ scanned: rand(50000, 150000), threats: rand(2, 20) })),
    pieTitle: "威胁类型分布",
    pieData: [
      { name: "APT攻击", value: 25, color: C4 },
      { name: "恶意软件", value: 30, color: C5 },
      { name: "数据泄露", value: 20, color: C3 },
      { name: "C2通信", value: 15, color: C2 },
      { name: "其他", value: 10, color: C1 },
    ],
    table: {
      title: "近期回溯结果",
      columns: ["时间", "威胁特征", "回溯时段", "匹配数", "影响范围", "状态"],
      rows: [
        { 时间: "14:30:22", 威胁特征: "APT-41 新IOC", 回溯时段: "近30天", 匹配数: "847", 影响范围: "12台主机", 状态: "已触发补救" },
        { 时间: "14:25:11", 威胁特征: "Log4Shell 变种", 回溯时段: "近90天", 匹配数: "234", 影响范围: "8台主机", 状态: "分析中" },
        { 时间: "14:20:45", 威胁特征: "Emotet C2域名", 回溯时段: "近7天", 匹配数: "56", 影响范围: "3台主机", 状态: "已确认" },
        { 时间: "14:15:33", 威胁特征: "数据外泄模式", 回溯时段: "近14天", 匹配数: "1,203", 影响范围: "5台主机", 状态: "已触发补救" },
        { 时间: "14:10:18", 威胁特征: "SSH暴力破解特征", 回溯时段: "近60天", 匹配数: "507", 影响范围: "23台主机", 状态: "分析中" },
      ],
    },
    crud: {
      entityName: "回溯任务",
      formFields: [
        { key: "威胁特征", label: "威胁特征", type: "text", placeholder: "如: APT-41 新IOC" },
        { key: "回溯时段", label: "回溯时段", type: "select", options: ["近7天", "近14天", "近30天", "近60天", "近90天"] },
        { key: "影响范围", label: "影响范围", type: "text", placeholder: "如: 12台主机" },
        { key: "状态", label: "状态", type: "select", options: ["分析中", "已确认", "已触发补救", "待处理"] },
      ],
    },
  },

  // ─── 9. EvidenceStudio 取证与报告生成中心 ───
  "evidence-studio": {
    stats: [
      { label: "报告总数", value: "234 份", change: "+12 今日" },
      { label: "证据条目", value: "1,847 条", change: "+89" },
      { label: "今日导出", value: "89 次", change: "+34" },
      { label: "活跃案例", value: "12 个", change: "+2" },
    ],
    chart: {
      title: "报告生成趋势",
      yLabel: "报告数",
      series: [
        { key: "reports", name: "生成报告", color: C1 },
        { key: "evidence", name: "收集证据", color: C2, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ reports: rand(2, 12), evidence: rand(10, 60) })),
    pieTitle: "证据类型分布",
    pieData: [
      { name: "网络流量", value: 35, color: C1 },
      { name: "日志记录", value: 25, color: C2 },
      { name: "文件样本", value: 20, color: C3 },
      { name: "会话记录", value: 15, color: C4 },
      { name: "其他", value: 5, color: C5 },
    ],
    table: {
      title: "近期报告",
      columns: ["报告ID", "案例名称", "类型", "证据数", "导出格式", "创建时间", "状态"],
      rows: [
        { 报告ID: "RPT-2024-0234", 案例名称: "APT入侵事件取证", 类型: "攻击取证", 证据数: "127", 导出格式: "PDF", 创建时间: "14:30:00", 状态: "已完成" },
        { 报告ID: "RPT-2024-0233", 案例名称: "数据泄露溯源报告", 类型: "泄露分析", 证据数: "89", 导出格式: "PDF+CSV", 创建时间: "14:15:00", 状态: "已完成" },
        { 报告ID: "RPT-2024-0232", 案例名称: "内部违规行为取证", 类型: "合规取证", 证据数: "234", 导出格式: "PDF", 创建时间: "13:45:00", 状态: "生成中" },
        { 报告ID: "RPT-2024-0231", 案例名称: "勒索软件攻击链分析", 类型: "攻击取证", 证据数: "56", 导出格式: "HTML", 创建时间: "13:20:00", 状态: "已完成" },
        { 报告ID: "RPT-2024-0230", 案例名称: "横向移动行为报告", 类型: "行为分析", 证据数: "178", 导出格式: "PDF+JSON", 创建时间: "12:50:00", 状态: "已完成" },
      ],
    },
  },

  // ─── 10. FlowScope 可视化回溯分析中心 ───
  "flow-scope": {
    stats: [
      { label: "回溯会话", value: "47,283", change: "+2,341" },
      { label: "时间轴事件", value: "128,473", change: "+8,921" },
      { label: "活跃分析", value: "23 个", change: "+5" },
      { label: "过滤规则", value: "156 条", change: "+12" },
    ],
    chart: {
      title: "分析会话趋势",
      yLabel: "会话数",
      series: [
        { key: "sessions", name: "分析会话", color: C1 },
        { key: "events", name: "关联事件", color: C2, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ sessions: rand(1000, 3000), events: rand(3000, 8000) })),
    pieTitle: "事件类型分布",
    pieData: [
      { name: "网络连接", value: 35, color: C1 },
      { name: "安全事件", value: 25, color: C4 },
      { name: "协议变更", value: 18, color: C2 },
      { name: "异常行为", value: 15, color: C3 },
      { name: "其他", value: 7, color: C5 },
    ],
    table: {
      title: "近期分析任务",
      columns: ["时间", "分析目标", "回溯时段", "事件数", "会话数", "分析师", "状态"],
      rows: [
        { 时间: "14:32:00", 分析目标: "192.168.1.45 全流量", 回溯时段: "02-25 08:00~14:00", 事件数: "2,847", 会话数: "1,234", 分析师: "张三", 状态: "分析中" },
        { 时间: "14:25:00", 分析目标: "DMZ区异常流量", 回溯时段: "02-24 00:00~23:59", 事件数: "12,473", 会话数: "5,891", 分析师: "李四", 状态: "分析中" },
        { 时间: "14:18:00", 分析目标: "C2通信回溯", 回溯时段: "02-20~02-25", 事件数: "347", 会话数: "89", 分析师: "王五", 状态: "已完成" },
        { 时间: "14:10:00", 分析目标: "数据库异常访问", 回溯时段: "02-25 10:00~12:00", 事件数: "891", 会话数: "234", 分析师: "赵六", 状态: "已完成" },
        { 时间: "14:02:00", 分析目标: "横向移动路径追踪", 回溯时段: "02-23~02-25", 事件数: "4,521", 会话数: "1,847", 分析师: "张三", 状态: "已完成" },
      ],
    },
  },

  // ─── 11. OpsMatrix 平台管理与资源调度中心 ───
  "ops-matrix": {
    stats: [
      { label: "探针节点", value: "128 个", change: "全部在线" },
      { label: "CPU使用率", value: "67.3%", change: "正常" },
      { label: "存储使用率", value: "82.1%", change: "+2.3%" },
      { label: "活跃任务", value: "34 个", change: "+5" },
    ],
    chart: {
      title: "资源使用趋势",
      yLabel: "%",
      series: [
        { key: "cpu", name: "CPU", color: C1 },
        { key: "memory", name: "内存", color: C2, dashed: true },
      ],
    },
    chartData: genHourly(() => ({ cpu: rand(45, 85), memory: rand(60, 90) })),
    pieTitle: "任务状态分布",
    pieData: [
      { name: "运行中", value: 45, color: C1 },
      { name: "排队中", value: 20, color: C3 },
      { name: "已完成", value: 25, color: C2 },
      { name: "失败", value: 10, color: C4 },
    ],
    table: {
      title: "节点状态列表",
      columns: ["节点ID", "节点名称", "IP地址", "CPU", "内存", "存储", "状态"],
      rows: [
        { 节点ID: "NODE-001", 节点名称: "采集节点-北京1", IP地址: "10.1.1.10", CPU: "72%", 内存: "68%", 存储: "75%", 状态: "正常" },
        { 节点ID: "NODE-002", 节点名称: "采集节点-北京2", IP地址: "10.1.1.11", CPU: "65%", 内存: "71%", 存储: "80%", 状态: "正常" },
        { 节点ID: "NODE-003", 节点名称: "存储节点-上海1", IP地址: "10.2.1.10", CPU: "45%", 内存: "82%", 存储: "91%", 状态: "告警" },
        { 节点ID: "NODE-004", 节点名称: "分析节点-上海2", IP地址: "10.2.1.11", CPU: "88%", 内存: "79%", 存储: "67%", 状态: "繁忙" },
        { 节点ID: "NODE-005", 节点名称: "索引节点-广州1", IP地址: "10.3.1.10", CPU: "58%", 内存: "63%", 存储: "72%", 状态: "正常" },
        { 节点ID: "NODE-006", 节点名称: "备份节点-广州2", IP地址: "10.3.1.11", CPU: "32%", 内存: "45%", 存储: "88%", 状态: "正常" },
      ],
    },
  },
}
