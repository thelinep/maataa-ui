const str = (description) => ({ type: "string", description });
const num = (description) => ({ type: "number", description });
const bool = (description) => ({ type: "boolean", description });
const en = (...values) => ({ type: "string", enum: values });
const arr = (items) => ({ type: "array", items });
const obj = (properties, required = []) => ({ type: "object", additionalProperties: false, properties, required });

export const contracts = [
  { name:"Recommendation", file:"recommendation", schema:obj({id:str("Stable recommendation ID"),summary:str("User-facing summary"),rationaleSummary:str("Auditable rationale summary"),confidence:num("0..1 confidence"),evidenceIds:arr(str("Evidence ID")),proposedActionIds:arr(str("Action ID"))},["id","summary"]) },
  { name:"PolicyDecision", file:"policy-decision", schema:obj({id:str("Decision ID"),outcome:en("allow","deny","allow_with_approval","allow_with_constraints"),reasonCodes:arr(str("Stable reason code")),requiredApprovalIds:arr(str("Approval ID"))},["id","outcome","reasonCodes"]) },
  { name:"Approval", file:"approval", schema:obj({id:str("Approval ID"),status:en("pending","approved","rejected","returned","revoked"),approverRef:str("Approver reference"),decidedAt:str("ISO time"),comment:str("Decision comment")},["id","status"]) },
  { name:"Evidence", file:"evidence", schema:obj({id:str("Evidence ID"),kind:str("Evidence kind"),uri:str("Optional URI"),hash:str("Content hash"),observedAt:str("Observation time"),sourceRef:str("Source reference")},["id","kind"]) },
  { name:"AuditEvent", file:"audit-event", schema:obj({id:str("Audit ID"),actorRef:str("Actor"),action:str("Action"),entityRef:str("Entity"),authorityClass:en("advisory","proposal","approval","execution","authoritative"),occurredAt:str("ISO time"),evidenceIds:arr(str("Evidence ID"))},["id","actorRef","action","entityRef","authorityClass","occurredAt"]) },
  { name:"ControlCommand", file:"control-command", schema:obj({commandId:str("Command ID"),deviceId:str("Target device"),capability:str("Bounded capability"),payload:{},status:en("requested","validated","authorized","queued","dispatched","acknowledged","completed","verified","denied","nack","cancelled","timed_out","failed","verification_failed"),idempotencyKey:str("Replay protection key"),issuedAt:str("ISO time"),expiresAt:str("ISO time"),approvalIds:arr(str("Approval ID"))},["commandId","deviceId","capability","status","idempotencyKey","issuedAt"]) },
  { name:"ControlReceipt", file:"control-receipt", schema:obj({commandId:str("Command ID"),acknowledged:bool("Device/gateway acknowledgement"),verified:bool("Observed-state verification"),terminalState:en("verified","denied","nack","cancelled","timed_out","failed","verification_failed"),evidenceIds:arr(str("Evidence ID")),observedAt:str("ISO time")},["commandId","acknowledged","verified","terminalState"]) },
  { name:"ControlLease", file:"control-lease", schema:obj({leaseId:str("Lease ID"),resourceId:str("Controlled resource"),holderRef:str("Controller"),mode:en("exclusive","shared","observer"),status:en("active","expired","revoked","released"),expiresAt:str("ISO time")},["leaseId","resourceId","holderRef","mode","status"]) },
  { name:"TelemetrySample", file:"telemetry-sample", schema:obj({deviceId:str("Device ID"),metric:str("Metric name"),value:{},unit:str("Canonical unit"),observedAt:str("ISO time"),quality:en("good","uncertain","bad","stale"),sourceRef:str("Source")},["deviceId","metric","value","observedAt","quality"]) },
  { name:"DigitalTwin", file:"digital-twin", schema:obj({twinId:str("Twin ID"),physicalEntityRef:str("Physical entity"),kind:str("Twin kind"),observedState:{type:"object"},desiredState:{type:"object"},capabilities:arr(str("Capability")),constraints:arr(str("Constraint")),updatedAt:str("ISO time")},["twinId","physicalEntityRef","kind","observedState","capabilities","updatedAt"]) },
  { name:"Device", file:"device", schema:obj({deviceId:str("Device ID"),kind:str("Device kind"),manufacturer:str("Manufacturer"),model:str("Model"),trustState:en("trusted","untrusted","revoked","unknown"),connectionState:en("online","degraded","offline","unknown"),capabilities:arr(str("Capability"))},["deviceId","kind","trustState","connectionState","capabilities"]) },
  { name:"AdapterDescriptor", file:"adapter", schema:obj({adapterId:str("Adapter ID"),version:str("Adapter version"),protocol:str("Protocol"),capabilities:arr(str("Capability")),discovery:bool("Discovery support"),command:bool("Command support"),telemetry:bool("Telemetry support")},["adapterId","version","protocol","capabilities"]) },
  { name:"AutomationRule", file:"automation-rule", schema:obj({ruleId:str("Rule ID"),enabled:bool("Enabled"),trigger:str("Deterministic trigger"),condition:str("Deterministic condition"),actionType:str("Bounded action"),requiresApproval:bool("Approval requirement")},["ruleId","enabled","trigger","actionType","requiresApproval"]) },
  { name:"SpatialState", file:"spatial-state", schema:obj({entityRef:str("Entity"),coordinateSystem:str("Coordinate system"),x:num("X"),y:num("Y"),z:num("Z"),confidence:en("verified","measured","estimated","unknown"),observedAt:str("ISO time")},["entityRef","coordinateSystem","x","y","confidence"]) },
  { name:"Mission", file:"mission", schema:obj({missionId:str("Mission ID"),resourceId:str("Robot/vehicle"),status:en("draft","validated","authorized","running","paused","completed","failed","cancelled"),waypointIds:arr(str("Waypoint")),requiresApproval:bool("Approval")},["missionId","resourceId","status","waypointIds"]) },
  { name:"Theme", file:"theme", schema:obj({themeId:str("Theme ID"),version:str("Theme version"),tokens:{type:"object"},highContrast:bool("High contrast support")},["themeId","version","tokens"]) },
  { name:"Workspace", file:"workspace", schema:obj({workspaceId:str("Workspace ID"),organizationId:str("Organization ID"),name:str("Name"),policyRefs:arr(str("Policy ref"))},["workspaceId","organizationId","name"]) },
  { name:"RegistryEntry", file:"registry-entry", schema:obj({componentId:str("Stable component ID"),version:str("Semantic version"),package:str("Owning package"),category:str("Category"),authorityClass:en("advisory","proposal","approval","execution","authoritative"),states:arr(str("State")),schemaRef:str("Optional schema ref"),headless:bool("Explicitly headless registry entry"),renderAdapter:str("Optional render adapter identifier")},["componentId","version","package","category","authorityClass","states","headless"]) },
  { name:"CameraState", file:"camera-state", schema:obj({deviceId:str("Camera"),streamState:en("streaming","stopped","degraded","offline"),pan:num("Degrees"),tilt:num("Degrees"),zoom:num("Zoom factor"),preset:str("Preset"),tracking:bool("Tracking state"),observedAt:str("ISO time")},["deviceId","streamState","pan","tilt","zoom","tracking","observedAt"]) },
  { name:"Incident", file:"incident", schema:obj({incidentId:str("Incident ID"),severity:en("info","warning","critical"),status:en("open","acknowledged","resolved"),entityRef:str("Affected entity"),summary:str("Summary"),openedAt:str("ISO time")},["incidentId","severity","status","entityRef","summary","openedAt"]) },
  { name:"DomainRecord", file:"domain-record", schema:obj({id:str("Record ID"),domain:en("event","commerce","creator","production","finance","knowledge","robotics","iot","building","industrial","mobility","energy","show-control"),kind:str("Record kind"),status:str("Domain status"),refs:arr(str("Related ID"))},["id","domain","kind","status"]) }
].map(c => {
  const version = c.version ?? "1.0.0";
  return {
    ...c,
    version,
    schema:{
      $schema:"https://json-schema.org/draft/2020-12/schema",
      $id:`https://schemas.maataa.ui/v1/${c.file}.schema.json`,
      "x-maataa-contract-version":version,
      title:c.name,
      ...c.schema
    }
  };
});
