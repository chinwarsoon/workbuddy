# 应用蓝图 — 12 个应用（含数据模型）

## A01 Design Basis Manager（设计基础主数据）
问题：进水水质/水量/许可限值散落在 Word、邮件、会议纪要中；假设未被标记为假设。
核心对象：
- Project { id, name, capacity_m3d, technology[], jurisdiction, permit_ref[] }
- InfluentProfile { id, source_stream, parameter, statistic(p50/p95/max), unit, sample_count, period, method(SM/EPA/ISO), dataset_ref }
- DesignBasis { id, revision, flow_avg, flow_peak_hour, flow_peak_factor, loads{BOD,COD,TSS,TN,TP,FOG,metals}, temperature_min/max, alkalinity, pH_range, status(draft/issued/approved) }
- Assumption { id, statement, basis, confidence(1-5), owner, validation_method, validation_date, impact_if_wrong[], derived_deliverables[] }
- LimitValue { parameter, limit, unit, statistic(annual/monthly/daily), averaging, monitoring_method, permit_clause }
关键交互：假设必须显式登记，且可反向查询「哪些交付物依赖此假设」；假设变更自动生成影响清单。
MVP：DesignBasis + Assumption + 依赖追踪。指标：假设闭环率、因假设变化导致的返工工时。

## A02 Deliverable Register & IFR/IFA/IFC Gate
问题：MDR 只是清单，没有状态语义、没有权重、不可审计。
核心对象：
- Deliverable { id, disc, type, package, wbs, title, budget_hours, planned_start, planned_ifr, planned_ifc, responsible, checker, approver, status }
- Stage { name(NotStarted/InProgress/IFR/IFA/IFC/AFC/AsBuilt), weight_pct, actual_date, evidence_link }
- Issue { deliverable_id, purpose(Information/Review/Approval/Construction), transmittal_id, date }
关键交互：状态变更 = 挣值事件；每个阶段有必填校审清单与签署人。
MVP：Register + 阶段权重 + S 曲线。指标：IFC 准时率、平均评审周转、阶段停留时长。

## A03 Stage-weighted Earned Value Engine
核心对象：
- ManhourBaseline { deliverable_type, norm_hours, source(historical/benchmark) }
- TimesheetEntry { deliverable_id, engineer, date, hours, activity }
- EVSnapshot { date, discipline, BCWS, BCWP, ACWP, SPI, CPI, EAC }
关键逻辑：EarnedHours = Σ(budget_hours × achieved_stage_weight)。三大数分列：预算/实耗/挣值。
指标：SPI/CPI by discipline、EAC 偏差、超支预警提前期。

## A04 Interface Register（硬接口/软接口）
核心对象：
- InterfacePoint { id, type(Hard/Soft), from_party, to_party, description, required_date, status, consequence_if_late, ref_deliverable[], ref_equipment_tags[] }
- InterfaceAgreement { parties[], scope_split, acceptance_criteria, signed_date }
- InterfaceQuery { ip_id, raised_by, question, response, closed_date }
典型硬接口：设备荷载↔基础、机械包↔电气供电、电缆路由↔结构、工艺设备↔控制 I/O、成套撬块↔厂区公用工程、保护系统↔SCADA。
典型软接口：供应商数据表、设计数据交换、控制逻辑。
关键交互：接口点须由设计人创建（非施工期发现）；关闭需证据（安装完成/试验通过）。
指标：接口按期关闭率、因接口导致的变更数量。

## A05 Procurement–Engineering Link（长周期项）
核心对象：
- LLIItem { tag, package, lead_time_wks, required_on_site, requisition_date, award_date, vendor_data_due[], fat_date, ship_date, float_wks, criticality_score }
- Requisition { package, mrb_ref, design_maturity_required, design_maturity_actual }
指标：采购浮动余量、逾期关键供应商资料数、下单决策延迟。

## A06 Vendor Document Tracker
核心对象：
- VendorDocument { vendor, doc_no, rev, type(Datasheet/GA/ITP/Calc/Manual), required_date, received_date, review_cycle_no, review_code(A/B/C/D), comments[] }
- Comment { id, clause_ref, severity, owner, status, carried_to_rev }
关键规则：开放意见必须自动带入下一版（丢失意见=返工之源）。
指标：首次通过率、平均评审周期数、因供应商资料导致的延误天数。

## A07 Change & RFI Intelligence
核心对象：
- ChangeEvent { id, trigger(drawing_conflict/missing_dimension/spec_gap/client_change/vendor_deviation/field_condition), root_cause, affected_deliverables[], affected_packages[], cost_impact, time_impact_days, responsibility, evidence[] }
- RFI { id, question, raised_by, discipline, avoidable_flag, root_cause_category, answer, cycle_days }
关键：RFI 与变更必须带根因分类，才能沉淀为设计改进项。
指标：RFI/$M、可避免比例、变更平均处理天数、设计原因变更占比。

## A08 Cross-discipline QA & Clash Gate
核心对象：
- ReviewChecklist { discipline, stage, items[{question, mandatory, evidence}] }
- ClashIssue { model_a, model_b, location, severity, owner, resolved_date }
- SetCompletenessCheck { drawingset_id, findings[{type: missing_dim/mismatch/spec_orphan}] }
指标：IFC 前严重冲突数、图纸集自洽缺陷数、首轮通过率。

## A09 Process Design Workbook（工艺设计工作簿）
问题：工艺计算与模拟孤立，参数与设备选型、P&ID 无法追溯。
核心对象：
- CalculationSet { unit_process, inputs{}, formula_ref, outputs{}, version, engineer }
- ModelRun { software, version, scenario, influent_profile_id, results{effluent_quality, energy, sludge}, calibration_source }
- SizingLink { calculation_id → equipment_tag → datasheet → P&ID }
指标：计算书可追溯率、设计余量分布（防止「拔高设计」）、能耗强度（kWh/m³）。

## A10 Commissioning & Turnover
核心对象：
- System { id, subsystem[], boundary_description, tags[] }
- ITR { tag, test_type(LoopCheck/Flush/Hydrotest/Function), status, signed_by, date, evidence }
- PunchItem { location, category, severity, owner, due, verified_by }
- TurnoverPackage { system, MC/RFC/RFSU certificates, docs[] }
- BiomassLog { date, MLSS, SVI, F/M, DO, feed_pct }（污水厂特有）
指标：ITR 完成率、系统就绪度、遗留项清零曲线、性能试验一次通过。

## A11 Asset Data Handover
核心对象：
- Asset { tag, class(Uniclass/OmniClass), location, manufacturer, model, serial, install_date, warranty_end, spare_parts[], maintenance_interval }
- COBieExport { facility, floor, space, type, component, system, contact, attribute }
- DocumentLink { asset_tag ↔ O&M manual ↔ as-built drawing ↔ test certificate }
指标：资产数据完整率、COBie 一次验收通过率、移交周期（天）。

## A12 Lessons & Design Rules Library
核心对象：
- LessonRecord { project, event, root_cause, cost_impact, rework_hours, recommended_rule }
- DesignRule { rule_text, discipline, trigger, auto_check_prompt, linked_checklist_item }
关键：教训必须转化为可执行的检查项或规则，否则不会被执行。
指标：规则复用率、同类重复问题下降率。

## 组合关系
A01 是根；A02/A03 让状态可见；A04 管边界；A05/A06 管外部输入；A07 管因果；A08 管质量闸门；A09 管工艺正确性；A10/A11 管交付；A12 闭环。
共享主数据：Project、WBS、Discipline、EquipmentTag、DocumentId、Person/Role。
