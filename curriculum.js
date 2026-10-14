// Applied content extends the original question IDs without changing existing scores.
QUESTIONS.forEach(q=>q.level='foundation');
const DEEP={};
function deepen(id,distinctions,reasoning,variation,model,challenge){
 DEEP[id]={distinctions,reasoning,variation,model};
 QUESTIONS.push({id:id+'-applied',lesson:id,domain:Number(id[0])-1,level:'applied',prompt:challenge[0],options:challenge[1],explanations:challenge[2],answer:0});
}
deepen('1.1',[
 ['Preventive vs. detective','An IPS dropping an attack blocks it. An IDS alerting on the same attack identifies it. Both may inspect traffic, but only the stated blocking action is preventive.'],
 ['Compensating vs. corrective','A compensating control substitutes for an unavailable safeguard. A corrective control fixes a condition or restores service after an event.'],
 ['Category vs. function','A policy is managerial by implementation and may be directive by purpose. Give both labels when the question asks for both axes.']
],'Read the verb first: block, detect, restore, discourage or require. Then identify the mechanism. Do not classify a control by every capability it could have; use the action in the scenario.',
'A locked door is replaced by a guard who checks an approved visitor list. The guard also writes down denied entry attempts. Which functions are present?',
'The guard’s access decision is preventive. Replacing the unavailable lock may make the guard a compensating control in this context. The denial log provides detective evidence. One implementation can perform several functions.',[
'A server cannot install endpoint protection because of a documented compatibility issue. Its owner proposes network isolation, application restrictions and enhanced monitoring until replacement. Which assessment is most accurate?',
['These are compensating safeguards; the exception still needs ownership and review','These are corrective controls, so the original risk has been eliminated','These are detective controls only because monitoring is included','These constitute avoidance because the server remains in production'],
['They address a control gap without claiming to remove the underlying weakness.','Alternative safeguards do not prove that the weakness is removed.','Isolation and execution restrictions also prevent or limit actions.','Avoidance would stop the risky activity; this system remains in use.']]);
deepen('1.2',[
 ['Authentication vs. authorization','A valid sign-in proves a claimed identity under the authentication method. An access decision separately checks whether that identity may perform this action.'],
 ['Integrity vs. authenticity','Integrity concerns improper changes. Authenticity concerns whether the origin or identity is genuine. A trusted signature can support both.'],
 ['Control plane vs. data plane','The control plane makes and administers access decisions. A policy enforcement point applies them to resource access in the data plane.']
],'Name the asset and the harm first. Secret records exposed means confidentiality; records altered means integrity; a service unavailable means availability. Many incidents affect all three, so use the primary effect the question specifies.',
'An attacker encrypts files, steals a copy and changes a bank-account number before the encryption. Which CIA properties are affected?',
'The theft affects confidentiality, the altered account number affects integrity, and the inaccessible files affect availability. Calling the event ransomware does not limit it to availability alone.',[
'A user passes MFA, but access to a confidential application is blocked because the laptop is unmanaged. Which interpretation best fits?',
['Authentication succeeded; a context-based authorization policy denied access','Authentication failed because every denied request is an authentication failure','Accounting failed because device management is a type of logging','Network segmentation failed because MFA should override device policy'],
['Identity verification and policy-based resource authorization are separate decisions.','A successful MFA challenge does not guarantee authorization.','Accounting records activity; the described decision enforces access policy.','MFA does not override other required conditions.']]);
deepen('1.3',[
 ['Approval vs. testing','Approval accepts the planned change and its impact. Testing produces evidence that the change behaves as intended. Neither replaces the other.'],
 ['Backout vs. backup','A backup is recoverable data or configuration. A backout plan states when and how to reverse the change, including dependencies and validation.'],
 ['Emergency vs. undocumented','An emergency path accelerates authorized decisions. It should still record actions and require an appropriate follow-up review.']
],'Before implementation, connect the technical change to its users and dependencies. Define success criteria and a failure threshold that triggers reversal. Afterward, verify actual service behavior, not merely a successful command exit.',
'A patch installs successfully, but the application now fails its login check. Is the change successful?',
'No. Installation success is only one technical signal. The application’s acceptance checks failed; use the approved escalation or backout decision and investigate the dependency.',[
'A firewall change passed a lab test and received approval. The team has a saved configuration but no agreed rollback trigger. What is the most important remaining preparation?',
['Define failure criteria, reversal steps and who authorizes the backout','Obtain a second copy of the same approval email','Replace the lab test with a production change during peak usage','Extend the maintenance window without consulting stakeholders'],
['A file alone is not a complete recovery procedure; decisions and validated steps are needed.','Duplicating approval does not address the missing backout decision.','A production experiment can introduce avoidable impact.','More time does not resolve unclear rollback criteria or authority.']]);
deepen('1.4',[
 ['Hash vs. signature','A hash can detect a change only if the reference digest is trustworthy. A verified signature also connects the content to a trusted signing key.'],
 ['Salt vs. pepper','A salt is unique per password and can be stored with its hash. A pepper is a separate secret; losing it complicates verification and rotation.'],
 ['Revocation vs. expiration','Expiration ends the planned validity period. Revocation can invalidate trust earlier, for example after a key compromise.']
],'Ask whether the goal is secrecy, detecting changes, proving origin or safe password verification. For a download, a digest fetched from the same compromised location may be attacker-controlled too. Establish a trusted reference or verify the publisher signature.',
'A file and its SHA-256 digest are both replaced on a compromised website. The new digest matches the new file. Does that prove publisher authenticity?',
'No. It only shows that the file matches that digest. An attacker controlling both can replace both. Verify a signature against a trusted publisher key or use another trusted integrity reference.',[
'A publisher’s signing private key is stolen while its certificate is still within its validity period. Which response best addresses future trust in signatures from that key?',
['Revoke the compromised certificate and replace the signing key using the incident process','Publish a new SHA-256 digest while continuing to use the stolen key','Extend the certificate expiration date to reduce validation errors','Encrypt the download with the publisher’s public key instead'],
['Revocation addresses compromise before normal expiry; replacement restores a controlled signing identity.','A digest does not repair loss of control over the signing key.','Extending validity increases the exposure period.','Encryption to that key is not a replacement for trustworthy publisher signatures.']]);
deepen('2.1',[
 ['Actor vs. motive','An insider is defined by access or relationship. Financial gain is a motive that insiders and external groups can both have.'],
 ['Intentional vs. accidental','An employee selling data is malicious; an employee accidentally sharing a folder may be negligent. Both can create insider risk.'],
 ['Attribution vs. containment','Identifying the actor may take time. Credible evidence of harm can justify authorized containment before attribution is complete.']
],'Separate observable facts from inferences. Access logs may establish an account used and actions taken; they do not always establish the human behind the account. Describe confidence and alternatives when attributing activity.',
'An employee’s account downloads records outside normal hours. Must the employee be a malicious insider?',
'No. The account could be compromised or an approved task could be unusual. Correlate endpoint, identity and business context before attributing the behavior to the employee.',[
'A valid administrator account exports sensitive data after hours. Which conclusion is best supported by this evidence alone?',
['A privileged identity performed an unusual export that requires investigation','The administrator is conclusively a malicious insider','The activity must be a nation-state operation because the account is privileged','The export is authorized because the login succeeded'],
['This states the observable activity without overstating actor or authorization.','A compromised account is another plausible explanation.','Privilege level does not establish geopolitical attribution.','Successful authentication does not establish business authorization.']]);
deepen('2.2',[
 ['Spear phishing vs. whaling','Both are targeted phishing. Whaling specifically targets senior or high-value executives.'],
 ['Spoofed sender vs. compromised mailbox','Spoofing imitates a sender. A compromised mailbox sends from a real trusted account. Independent verification helps with both.'],
 ['Pretext vs. channel','A convincing help-desk story is a pretext; voice is the channel. Several social-engineering labels may describe the same event.']
],'Identify the requested behavior: reveal a secret, run software, transfer money or change an account. Verify through a channel you already trust. A message can pass email authentication checks and still be malicious if the sender’s account is compromised.',
'The invoice email passes SPF, DKIM and DMARC. Its sender asks for new bank details. Is further verification unnecessary?',
'No. Those checks concern email authentication and alignment, not whether the business request is legitimate. A real mailbox can be compromised. Verify the change using an established contact.',[
'A supplier’s genuine mailbox sends a request to change payment details. Email authentication passes. Which measure best addresses the remaining risk?',
['Confirm the change using the supplier contact details already on file','Treat passing DMARC as sufficient approval for the payment change','Reply to the same thread requesting a second confirmation','Add the supplier domain to the email allow-list'],
['A separate trusted route can expose abuse of the genuine mailbox.','Domain authentication does not authenticate the business decision.','An attacker in the mailbox can respond on the same thread.','Allow-listing reduces filtering without validating the change.']]);
deepen('2.3',[
 ['Vulnerability vs. exploit','A missing patch is a weakness; using it to execute code is exploitation. Discovery of one does not prove the other occurred.'],
 ['Stored XSS vs. SQL injection','Stored XSS executes script in a user’s browser. SQL injection changes database query behavior. Their impact and primary defenses differ.'],
 ['Race condition vs. buffer overflow','A race depends on timing between operations. A buffer overflow writes beyond an allocated memory boundary.']
],'Look for the trust boundary crossed: input into a database command, untrusted content into browser execution, a guest VM into its host, or a checked file into a replaced resource. The boundary is often more informative than the application name.',
'A scanner reports an old library, but a verified vendor backport fixed the flaw without changing the visible version. Is the finding automatically valid?',
'No. Validate the patch evidence and the scanner’s detection method. Version-based findings can be false positives; document why the actual vulnerable behavior is or is not present.',[
'A program validates a file’s permissions, then opens it later. An attacker replaces the file between those operations. What class of weakness is illustrated?',
['Time-of-check/time-of-use race condition','Buffer overflow','Cross-site request forgery','Integer overflow'],
['The resource changes between validation and use.','No out-of-bounds memory write is described.','The scenario does not abuse a browser’s authenticated request context.','No arithmetic wraparound is described.']]);
deepen('2.4',[
 ['Spraying vs. stuffing','Spraying uses a small password set across many users. Stuffing reuses previously stolen username/password pairs on another service.'],
 ['Lateral movement vs. escalation','Lateral movement reaches another system. Privilege escalation gains greater rights. An attacker may do either or both.'],
 ['Indicator vs. proof','An unusual country or large transfer raises suspicion. Correlation determines whether the activity represents an incident.']
],'Identify the pattern over time and across accounts. One source with many destinations, one identity across many systems, or successful access after repeated failures each suggests a different investigation. Avoid treating every anomaly as definitive compromise.',
'An attacker tries thousands of different passwords against one account. How does this differ from spraying?',
'The concentration on one account is a brute-force guessing pattern. Spraying spreads a smaller set of candidate passwords across many accounts, often to avoid per-account thresholds.',[
'Logs show a set of leaked username/password pairs being tried against a different organization’s portal. Each account receives a different candidate password. What best fits?',
['Credential stuffing','Password spraying','A replay of captured session tokens','An offline password-hash attack'],
['Stolen credential pairs are being reused against another service.','Spraying repeats a small candidate set across many users.','No captured session token is being submitted.','These are online login attempts, not local hash cracking.']]);
deepen('2.5',[
 ['Patching vs. segmentation','A patch can remove a software flaw. Segmentation limits who can reach it or where an attacker can go next.'],
 ['Allow-list vs. deny-list','An allow-list starts from approved items. A deny-list starts from items known to be unwanted and may miss new variants.'],
 ['Isolation vs. permanent removal','Isolation can contain a device while preserving it for investigation. Decommissioning removes the asset from service through a controlled process.']
],'Match the mitigation to the failure mode and time horizon. An actively exploited exposed service needs immediate exposure reduction plus a durable fix. A temporary mitigation requires an owner, deadline and verification that its assumptions still hold.',
'A vulnerable server is moved to another VLAN, but all inter-VLAN traffic is allowed. How much does the VLAN change reduce reachability?',
'Little by itself. Logical separation must be paired with rules that restrict the relevant traffic. Check actual permitted paths instead of relying on a diagram label.',[
'A legacy application has an unpatched remote-access flaw. It must stay available to two known service hosts. Which temporary mitigation best balances need and exposure?',
['Restrict access to the required hosts and ports, monitor, and track the remediation exception','Move it to a new VLAN while retaining allow-any routing','Rely on a daily vulnerability scan to block exploitation','Change its DNS name and leave the service publicly reachable'],
['Explicitly scoped access reduces reachable attack paths while preserving the required function.','An unrestricted route still permits the same attack traffic.','A scan detects findings but is not an inline blocking control.','Renaming does not prevent discovery or exploitation.']]);
deepen('3.1',[
 ['IaaS vs. PaaS','IaaS customers normally maintain guest operating systems. PaaS moves more runtime and operating-system work to the provider; customer code and configuration remain important.'],
 ['Container vs. VM','Containers usually share the host kernel. VMs run separate guest operating systems on a hypervisor. Isolation boundaries and patch responsibilities differ.'],
 ['Availability vs. fault isolation','More components can improve resilience, but shared credentials, regions or dependencies may still create a common failure path.']
],'Draw the responsibility boundary for the actual service, then place data, identity, code, OS and hardware on it. Never infer all duties from the word “cloud.” Confirm the provider’s service-specific commitments.',
'The hosted application is patched by its provider. A former employee’s account still works. Whose operational control needs attention?',
'The customer’s access lifecycle, unless the agreement explicitly delegates that task. Provider application maintenance does not remove customer responsibilities for assigning and removing users.',[
'A team moves its application from self-managed VMs to a managed application platform. Which responsibility most clearly remains with the team?',
['Secure application code, configuration and access to its data','Physical access control for the provider’s data center','Replacement of failed provider storage hardware','Patching the provider-managed host operating system'],
['Managed infrastructure does not remove customer responsibility for their code and permitted data use.','The provider normally operates the physical facility.','Physical hardware replacement is normally provider-managed.','This platform manages the host OS; duties should still be confirmed for the service.']]);
deepen('3.2',[
 ['Firewall vs. WAF','A network firewall governs network paths and may inspect applications. A WAF specializes in HTTP application requests. Neither is a substitute for fixing vulnerable code.'],
 ['IDS vs. IPS','A passive IDS observes and alerts. An inline IPS can interrupt traffic, adding a potential availability dependency.'],
 ['VPN vs. authorization','A VPN protects a communication path. It does not authorize every resource or prove an endpoint is uncompromised.']
],'List required source, destination, protocol and port before choosing a control. Place public services, application tiers and management interfaces in appropriate zones. Test both permitted flows and forbidden paths.',
'A vendor can connect by VPN. Should the VPN pool have unrestricted access to every internal subnet?',
'No. Authorize only the systems and services required by the engagement, with suitable identity, time and monitoring controls. An encrypted path can still carry malicious activity.',[
'A public web application needs database access. Administrators must use a jump host. Which design best enforces the intended separation?',
['Permit web-tier database traffic and jump-host administration only; deny other paths','Allow the entire public subnet to all internal services because it is a DMZ','Expose the database publicly but require administrators to use a VPN','Put every server in one zone and rely only on web application authentication'],
['Explicit communication paths limit unnecessary reachability between roles.','A DMZ label does not make broad internal access safe.','Public database exposure is unnecessary for the described flow.','Application login controls do not govern every network service.']]);
deepen('3.3',[
 ['Masking vs. encryption','Masking conceals displayed values; the full value may still exist behind the display. Encryption protects data using keys and depends on key access.'],
 ['Tokenization vs. hashing','A token can point to a separately stored original. A one-way digest does not inherently provide such a lookup mechanism.'],
 ['Owner vs. custodian','An owner is accountable for classification and authorized use. A custodian implements storage, access and handling controls.']
],'Start with who needs the original data and why. If analysts only need trends, reduce or replace identifiers before export. Then protect the mapping or source, control access and apply retention rules.',
'A report hides most digits on screen but downloads a CSV with full identifiers. Does the display masking protect the export?',
'No. The export is a separate data path. Its fields and permissions must follow the same handling requirements. Test all ways users and integrations can retrieve data.',[
'Analysts need consistent pseudonymous client IDs across reports, while a restricted team must be able to reconnect an ID to its original record. Which approach best fits?',
['Tokenization with a separately protected mapping','Masking only the browser’s display while exporting original IDs','Publishing unsalted hashes of predictable sequential IDs','Encoding identifiers in Base64'],
['A stable token supports linkage while restricting access to the mapping.','Display masking does not protect exported originals.','Predictable identifiers can be enumerated and hashed for comparison.','Base64 is readily reversible encoding.']]);
deepen('3.4',[
 ['RTO vs. RPO','RTO measures acceptable restoration time. RPO measures acceptable data loss as a time interval. A plan can meet one and fail the other.'],
 ['Backup vs. replication','Replication reduces lag but can copy deletion or corruption. Backups provide recovery points if properly retained, protected and restorable.'],
 ['Full vs. differential vs. incremental','A differential captures changes since the last full backup. An incremental captures changes since the previous backup in the chain. Restore dependencies differ.']
],'Use a timeline. Place the last usable recovery point before the failure and the moment service is validated after it. Compare those two gaps to the business targets. Include dependencies and the time needed to establish that recovery is trustworthy.',
'Backups run hourly and restore in ten minutes. The business demands a five-minute RPO and a two-hour RTO. Does the fast restore meet both?',
'No. Ten-minute restoration can meet the RTO, but hourly recovery points cannot guarantee at most five minutes of lost data. Improve the recovery-point frequency or design.',[
'A service has a 15-minute RPO and a two-hour RTO. Its recoverable snapshots are one hour apart and restoration takes 45 minutes including validation. Which statement is correct?',
['The modeled RTO is met, but the snapshot interval cannot guarantee the RPO','Both are met because restoration takes less than an hour','The RPO is met, but RTO is missed','Neither is met because backups must be continuous for any RTO'],
['45 minutes is within two hours, but a failure just before a snapshot could lose nearly an hour.','Fast restoration does not shorten the gap between recoverable snapshots.','This reverses the two targets.','Continuous protection is not a universal RTO requirement.']]);
deepen('4.1',[
 ['Configuration vs. compliance vs. access','A management policy configures a setting; a compliance check evaluates state; an access policy decides what to allow based on that state.'],
 ['Secure Boot vs. disk encryption','Secure Boot verifies parts of the boot chain. Disk encryption protects stored content against offline access. They address different threats.'],
 ['Input validation vs. parameterization','Validation checks acceptable data. Parameterization prevents database values from becoming query structure. Use the appropriate defense for each input context.']
],'Turn a baseline into observable requirements: encrypted storage, supported software, controlled privilege and logging. Then distinguish a missing configuration from a stale report or an unenforced access requirement.',
'A laptop is marked noncompliant, yet it still opens an application. Is the compliance assessment necessarily broken?',
'No. Verify whether the application is covered by an enforcement policy and whether an existing session is still valid. Reporting compliance and enforcing access are separate controls.',[
'A device management system correctly marks an unencrypted laptop noncompliant, but the laptop can still sign in to a protected cloud application. What should you examine next?',
['Whether the application’s access policy enforces the device-compliance requirement','Whether the inventory record has a more descriptive hostname','Whether the endpoint can resolve its own DNS name','Whether the help desk has closed the enrollment ticket'],
['The assessment exists; the next question is whether the access decision uses it.','A hostname does not enforce the security condition.','DNS reachability does not explain why a correctly assessed state is not enforced.','Ticket closure is not a technical access control.']]);
deepen('4.2',[
 ['Inventory vs. discovery','Discovery finds assets and attributes. Inventory maintains the accountable record over time, including ownership and lifecycle status.'],
 ['Deletion vs. sanitization','Deleting a file removes a reference. Sanitization applies a suitable method to make recovery infeasible for the intended reuse or disposal case.'],
 ['Cryptographic erase vs. key loss','Approved cryptographic erase depends on suitable encryption coverage and key handling. Merely losing track of a key is not a verified sanitization process.']
],'Follow the asset and its data through procurement, deployment, reassignment and retirement. Verify who has custody at each transition. Media type, sensitivity and reuse plans determine the disposal method.',
'A recycling company promises to destroy drives but provides no serial-number evidence. Can your asset register be confidently closed?',
'Not from that promise alone. Use the agreed verification and evidence requirements to reconcile what was sent, what was processed and any exceptions.',[
'A batch of laptops was sanitized by an approved vendor. Which evidence best supports closing each asset’s disposal record?',
['Verified sanitization records matched to the individual device or media identifiers','A generic invoice stating “IT services”','A screenshot showing an empty desktop on one laptop','The vendor’s marketing claim that it follows best practices'],
['Device-level records let the organization reconcile custody and verified processing.','A generic invoice does not establish what happened to each medium.','An empty desktop is not proof of media sanitization.','A general assurance does not verify the specific assets.']]);
deepen('4.3',[
 ['Severity vs. priority','Technical severity is one input. Exposure, exploitation, business impact and compensating controls determine local urgency.'],
 ['False positive vs. accepted risk','A false positive is a finding that is not actually present. An accepted risk is a real condition retained by an authorized decision.'],
 ['Remediation vs. validation','Installing a fix is an action. Validation establishes that the vulnerable condition is resolved in the target environment.']
],'Check whether the finding is real, reachable and consequential. Assign an owner and response time, then record the chosen fix or exception. Re-test after the change; do not close solely because a ticket says “done.”',
'A critical-score issue exists on an isolated test VM. A lower-score flaw is actively exploited on an internet-facing identity gateway. Which is likely first?',
'The exposed actively exploited identity gateway usually warrants immediate attention because likelihood and business impact are higher. Local context can outweigh raw severity ordering.',[
'A scanner identifies a vulnerable version, but vendor evidence confirms the installed build includes a backported fix. What is the best next step?',
['Validate the build and detection logic, then document a false positive if supported','Accept the risk without checking whether the vulnerability exists','Reclassify all findings from that scanner as false positives','Close the finding only because the system owner says it is fine'],
['Evidence should determine whether the detected condition is actually vulnerable.','Risk acceptance assumes a real retained risk; first validate the finding.','One detection issue does not invalidate unrelated findings.','Owner assurance needs supporting technical evidence.']]);
deepen('4.4',[
 ['SIEM vs. SOAR','A SIEM collects and correlates events. SOAR coordinates actions such as enrichment, ticketing and response. Product features may overlap.'],
 ['False positive vs. false negative','A false positive alerts on benign activity. A false negative misses malicious activity. Reducing one carelessly can worsen the other.'],
 ['Collection vs. detection','Having logs stored does not mean a useful rule, owner or response exists. Test whether the intended event generates an actionable alert.']
],'For every detection, define the behavior, required telemetry, conditions and response owner. Validate with known benign and malicious examples. Track why alerts are dismissed before changing thresholds.',
'The team eliminates alert fatigue by disabling all identity detections. Did detection quality improve?',
'No. Alert volume fell by removing visibility. Tune noisy conditions and prioritization while checking that meaningful attack patterns are still detected.',[
'A new detection generates thousands of benign alerts but catches a useful attack pattern. What is the best adjustment?',
['Analyze benign triggers, refine context and validate against known attack examples','Disable the detection permanently and treat zero alerts as success','Raise the threshold arbitrarily until every alert disappears','Stop collecting the underlying logs while keeping the rule enabled'],
['Contextual tuning balances alert quality with retaining useful coverage.','Silence alone is not evidence of effective monitoring.','An arbitrary threshold can hide true attacks.','A rule without required telemetry may become ineffective.']]);
deepen('4.5',[
 ['SPF vs. DKIM vs. DMARC','SPF checks authorized sending infrastructure for an envelope identity. DKIM validates a domain signature. DMARC evaluates alignment with the visible From domain and publishes policy.'],
 ['First match vs. most specific','In a first-match list, the earliest applicable rule wins. A more specific later rule may never execute.'],
 ['Baseline vs. exception','A baseline defines the norm; an exception documents a deliberate deviation with accountability and review.']
],'Evaluate the effective configuration, not just individual settings. An earlier rule can shadow a later rule. A policy may exclude the very application or user you meant to protect. Test representative allow and deny cases.',
'A firewall has a precise deny rule below a broad permit. The deny’s hit counter stays at zero. What should you inspect?',
'The earlier rules. In first-match processing, traffic accepted by the broad permit never reaches the deny. Reorder or narrow rules under the change process and test both permitted and denied paths.',[
'A first-match firewall has “allow guest to any” above “deny guest to internal.” Which change best enforces guest internet access while restricting internal access?',
['Place the internal deny before the broader guest permit and validate both paths','Place a second identical internal deny at the bottom','Add a logging rule after the broad permit and leave ordering unchanged','Rename the guest zone to “untrusted” without changing rules'],
['The internal flow now hits a deny first, while other required traffic can reach the permit.','A later duplicate remains shadowed by the first allow.','Later logging does not reverse the earlier allow decision.','Names do not change effective enforcement.']]);
deepen('4.6',[
 ['RBAC vs. ABAC','RBAC assigns permissions through roles. ABAC evaluates attributes such as department, device or data classification. Systems can combine both.'],
 ['SSO vs. federation','SSO describes reusing sign-in across services. Federation establishes trust between identity domains; it can enable SSO.'],
 ['MFA vs. session security','MFA strengthens authentication. Session tokens, recovery methods and ongoing authorization still need protection.'],
 ['Provisioning vs. review','Provisioning sets initial access. Reviews catch stale access after people change jobs or responsibilities.']
],'Separate identity proof, allowed action, scope and duration. Ask whether the user needs read or change access, which resources they need, and when it should expire. Avoid solving a small access need with broad permanent privilege.',
'An employee moves from finance to facilities. Their new role is added, but their old finance role remains. What control failed?',
'The mover process did not remove obsolete entitlements. Role changes and periodic access reviews should check accumulated privileges, not just whether the new role works.',[
'A contractor needs to restart one application service for two hours, with all actions attributable. Which grant best satisfies the requirement?',
['A named account with scoped, time-limited rights to that service','A shared administrator account with a password that expires next month','A permanent server-administrator role followed by a quarterly review','Read-only access to every server in the environment'],
['It matches the subject, action, resource and duration while preserving accountability.','Shared identity and broad rights exceed the stated requirement.','A later review does not justify unnecessary standing privilege.','Broad read access neither supports the task nor matches its scope.']]);
deepen('4.7',[
 ['Automation vs. orchestration','Automation executes a task. Orchestration coordinates tasks and dependencies across systems.'],
 ['Idempotence vs. repeated side effects','An idempotent action can be repeated without adding unintended effects. Retrying a workflow should not create duplicate accounts or endlessly disable resources.'],
 ['Credential scope vs. workflow scope','A workflow may have a narrow purpose while using an overly powerful credential. Both the logic and the identity need constraints.']
],'Design the failure path before enabling enforcement: missing data, timeout, duplicate trigger and partial completion. Log the result of each action. High-impact containment should follow approved conditions and escalation.',
'An automation creates an account but times out before recording success. Its retry creates another account. What design issue does this expose?',
'The workflow does not safely recognize an already-completed action. Use stable identifiers, state checks and idempotent operations to handle retries without duplicate side effects.',[
'A playbook disables accounts when an alert threshold is met. Its API token can also change tenant-wide authentication policy. What is the clearest risk?',
['The automation identity has permissions beyond its required actions','The playbook is necessarily too slow to be useful','Using an API prevents audit logging','Approval steps make least privilege impossible'],
['Excess permissions expand the impact of token theft or a workflow defect.','Privilege scope says nothing about execution speed.','APIs can produce audit records when configured appropriately.','Approval and least privilege are complementary safeguards.']]);
deepen('4.8',[
 ['Containment vs. eradication','Containment stops spread or access. Eradication removes the attacker’s foothold and cause. Blocking one connection may not remove persistence.'],
 ['Recovery vs. restore','Restoring files is a technical step. Recovery also verifies trust, dependencies and monitoring before returning to normal operation.'],
 ['Chain of custody vs. hashing','Custody records who handled evidence. Hashes help verify unchanged contents. Neither substitutes for the other.']
],'Read FIRST or NEXT carefully. If harm is ongoing, authorized containment may be urgent. Once contained, preserve evidence and investigate root cause before treating restoration as resolution. A lesson sequence is a teaching model; real tasks can overlap under the response plan.',
'A compromised account’s password is reset, but an attacker still has a valid session and an added access method. Has eradication finished?',
'No. Investigate and remove unauthorized persistence, revoke affected sessions where supported, and verify identity configuration. The response must address the actual access paths, not just the original password.',[
'A ransomware host has been isolated. A clean backup is available, but the initial access and persistence are unknown. What should guide the next step?',
['Preserve relevant evidence and investigate the foothold before validated restoration','Reconnect immediately after copying files because a clean backup proves eradication','Delete the isolated disk before collecting any relevant evidence','Treat isolation as complete remediation and close the incident'],
['A clean restore can be reinfected if the attacker’s access remains.','Data restoration alone does not remove the original access path.','Premature deletion can prevent root-cause analysis and destroy evidence.','Containment limits harm but is not the end of response.']]);
deepen('4.9',[
 ['Flow vs. packet capture','Flows summarize communication. Packet captures provide packets and visible protocol details; encryption may hide payload content.'],
 ['Identity log vs. endpoint log','Identity logs describe authentication and access context. Endpoint telemetry can connect a process to local execution and network activity.'],
 ['No event vs. no activity','Absence may reflect retention limits, disabled collection, clock errors or a blind spot. Check coverage before concluding nothing occurred.']
],'Start with a question, then choose a source capable of answering it. “Which process sent this?” needs endpoint context. “How much data went out?” may be answered by flow records. Establish time consistency and preserve originals.',
'Firewall flows show a large TLS transfer. Can you determine the exact documents from those records alone?',
'No. Flow metadata can show endpoints, timing and volume, not the plaintext files inside encrypted traffic. Correlate authorized endpoint, application or proxy records.',[
'An analyst sees an outbound transfer at 10:00 in network logs and 10:07 in endpoint logs. What should be checked before concluding they are separate events?',
['Clock synchronization, time zones and timestamp interpretation','Whether the two logs use the same font','Whether every network transfer is malicious','Whether the account name contains a department code'],
['Clock skew or interpretation can make one event appear at different times.','Formatting does not explain event chronology.','Maliciousness is a separate question requiring evidence.','Naming conventions do not reconcile timestamp differences.']]);
deepen('5.1',[
 ['Policy vs. standard','Policy sets intent and requirements. Standards define mandatory specifics that implement that intent.'],
 ['Procedure vs. guideline','Procedures give required steps for a defined process. Guidelines recommend approaches where judgment is permitted.'],
 ['Responsible vs. accountable','A team may perform a task while a named owner remains accountable for the outcome and decision.']
],'Choose the document based on what must be communicated: why and what, exact mandatory configuration, repeatable steps or optional advice. Add ownership and review dates so the document remains actionable.',
'An optional guideline says to encrypt laptops, but management intends encryption to be mandatory. What is missing?',
'A binding policy or standard with defined scope and enforcement. Optional advice is a weak vehicle for a mandatory requirement.',[
'A security policy requires timely user offboarding. Which pair of supporting documents best turns it into consistent execution?',
['A mandatory timing standard and a step-by-step deprovisioning procedure','An optional awareness poster and an informal chat message','A supplier NDA and a recovery-point objective','A penetration-test scope and a certificate revocation list'],
['The standard defines required timing; the procedure defines the actions to meet it.','Optional or informal guidance does not reliably establish required steps.','Confidentiality contracts and backup objectives do not implement offboarding.','These address different security activities.']]);
deepen('5.2',[
 ['Inherent vs. residual risk','Inherent risk is considered before controls; residual risk remains afterward. Controls rarely make every consequence disappear.'],
 ['Appetite vs. tolerance','Appetite describes broad willingness to take risk. Tolerance sets more specific boundaries and variation around objectives.'],
 ['SLE vs. ALE','SLE estimates one loss event. ALE multiplies that loss by the expected events per year. Frequency can be fractional.']
],'Keep units attached to every number. An asset value in dollars times an exposure percentage gives dollars per event. Multiply by events per year to get dollars per year. Treat the result as an estimate, not a promise that losses occur evenly.',
'A control costs $8,000 per year and reduces estimated ALE from $20,000 to $15,000. Does this calculation alone justify it financially?',
'On these assumptions, the estimated annual reduction is $5,000, below the annual cost. That does not settle the decision: obligations, severe tail risks and nonfinancial impacts may still matter.',[
'An asset worth $200,000 would lose 25% of its value in an incident expected once every five years. What is the estimated ALE?',
['$10,000 per year','$50,000 per year','$250,000 per year','$40,000 per year'],
['SLE is $200,000 × 0.25 = $50,000; ARO is 0.2; ALE is $10,000.','This is SLE without annual frequency.','This multiplies the loss by five rather than by 0.2.','This applies frequency to the asset value but omits the exposure factor.']]);
deepen('5.3',[
 ['Due diligence vs. ongoing monitoring','Due diligence supports selection. Monitoring catches later changes in access, performance, ownership or risk.'],
 ['SLA vs. NDA','An SLA defines service commitments. An NDA protects confidentiality. They address different obligations.'],
 ['Contract vs. evidence','A contractual requirement creates an obligation. Assessments, records and monitoring help determine whether it is actually met.']
],'Follow the data and dependencies through the provider and its subcontractors. Decide what happens during a breach and at termination before signing. Match the depth of assessment to criticality and exposure.',
'A critical supplier passed review two years ago but now uses new subprocessors. Is the original review sufficient?',
'Not necessarily. Material changes can alter data access, jurisdiction and resilience. Reassess the changed risk and contract requirements rather than treating onboarding as permanent approval.',[
'A cloud vendor meets uptime targets but cannot explain how customer data is deleted after contract termination. What should be addressed?',
['Data return, retention and verified deletion obligations in the agreement and exit plan','Only a higher uptime percentage in the SLA','Only an additional NDA with the same confidentiality terms','Replacing the risk register with the vendor’s marketing statement'],
['The gap concerns data lifecycle and termination, not merely service availability.','Higher uptime does not define secure exit handling.','Confidentiality alone does not specify retention and deletion evidence.','Marketing is not a substitute for governed risk assessment.']]);
deepen('5.4',[
 ['Privacy vs. confidentiality','Confidentiality restricts disclosure. Privacy also asks whether collection, use, retention and sharing are appropriate.'],
 ['Compliance vs. assurance','Meeting assessed requirements provides bounded evidence. It does not certify the absence of all security weaknesses.'],
 ['Retention vs. legal hold','Retention sets ordinary disposal schedules. A valid legal hold can require preserving relevant records beyond the normal schedule.']
],'Identify the applicable obligation and responsible owner before interpreting it. For a study scenario, use the stated facts; in real operations, involve the appropriate privacy, legal and compliance stakeholders.',
'Data is strongly encrypted, but it was collected for no defined purpose and kept indefinitely. Does encryption resolve the privacy concern?',
'No. Encryption protects against some disclosure threats; it does not establish a legitimate purpose or appropriate retention. Privacy requires decisions about the data lifecycle.',[
'A routine retention schedule calls for deleting records, but those records are covered by an active legal hold. What is the appropriate action?',
['Preserve the relevant records under the hold and coordinate with the responsible legal process','Delete on schedule because automated retention always overrides exceptions','Remove access logs but keep the documents','Encrypt the documents and treat that as permission to delete the originals'],
['An applicable hold suspends routine destruction of the relevant records.','Automation must respect valid preservation obligations.','Related logs may also be relevant evidence; do not delete them arbitrarily.','Encryption is not authorization to destroy held records.']]);
deepen('5.5',[
 ['Audit vs. penetration test','An audit evaluates evidence against criteria. A penetration test attempts authorized exploitation within scope. Their conclusions answer different questions.'],
 ['Tabletop vs. technical exercise','A tabletop walks through decisions and coordination. A technical exercise validates behavior in systems. Both can uncover different gaps.'],
 ['Red vs. blue vs. purple','Red simulates adversary behavior; blue detects and defends; purple collaboration connects results to defensive improvement.']
],'Define the question, scope, authorization and evidence before choosing the method. A clean vulnerability scan does not demonstrate that staff can coordinate an incident, and a good discussion does not prove backups restore.',
'The response team handles a tabletop perfectly. Does that prove the production failover works?',
'No. A tabletop can validate understanding and coordination, but a controlled technical test is needed to validate actual failover behavior and timings.',[
'Leadership wants to find gaps in incident roles, escalation and communication without touching production systems. Which exercise best fits?',
['A facilitated tabletop based on a realistic incident','An unannounced destructive penetration test','A credentialed vulnerability scan alone','A full production failover without stakeholder involvement'],
['A tabletop directly examines decisions and coordination without technical disruption.','Destructive testing is not needed for the stated objective.','A scan assesses technical findings rather than human coordination.','A live failover introduces unnecessary operational risk for this purpose.']]);
deepen('5.6',[
 ['Completion vs. behavior','Training completion measures participation. Reporting speed and response quality show whether people apply what they learned.'],
 ['Generic vs. role-specific','Everyone needs core awareness. Finance, help desk and administrators also face distinct decisions that warrant targeted practice.'],
 ['Simulation vs. real incident','A simulation is an exercise under defined rules. Real suspicious activity must still be reported and assessed through the operational process.']
],'Teach one concrete action people can take when uncertain. Make reporting simple and respond constructively. Use exercise results to improve materials and controls, not just to rank staff by mistakes.',
'Phishing click rates fall, but employees report fewer suspicious messages because they fear blame. Is the program clearly improving?',
'No. Click rate is only one measure. Reduced reporting can delay discovery. Review reporting culture, training relevance and the ease of contacting the response team.',[
'After a punitive phishing campaign, reported clicks drop sharply but so do suspicious-message reports. Which interpretation is most justified?',
['The metrics are ambiguous; investigate whether fear is suppressing useful reporting','The program definitely succeeded because one metric improved','All employees have become resistant to phishing','Reporting is unnecessary once simulation clicks decline'],
['Both behavior and willingness to report matter; one falling metric cannot establish success.','A single metric can improve while response capability worsens.','The data do not demonstrate immunity to phishing.','Reporting remains important for real incidents.']]);
const LESSON_LABS={'1.1':'matching','1.2':'access','1.4':'matching','2.2':'incident','2.4':'triage','2.5':'firewall','3.2':'firewall','3.4':'recovery','4.4':'triage','4.5':'firewall','4.6':'access','4.8':'incident','4.9':'triage','5.2':'recovery'};
const REFERENCES={
 '1.4':['Password storage — OWASP','https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'],
 '1.2':['Zero trust — NIST SP 800-207','https://csrc.nist.gov/pubs/sp/800/207/final'],
 '4.1':['Conditional Access — Microsoft Learn','https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview'],
 '4.6':['Authentication — OWASP','https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'],
 '4.8':['Incident response — NIST SP 800-61 Rev. 3','https://csrc.nist.gov/pubs/sp/800/61/r3/final']
};
