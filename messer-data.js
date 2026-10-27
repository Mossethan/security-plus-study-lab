// Original companion exercises. Lesson names and order follow the linked public course.
const MESSER_BASE='https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/';
const MESSER_COURSE=MESSER_BASE+'sy0-701-comptia-security-plus-course/';
const MESSER_LESSONS=[
{id:'security-controls',title:'Security Controls',objective:'1.1',duration:'11:48',slug:'security-controls-sy0-701/',recall:'How does a control’s category differ from its purpose?',questions:[
{prompt:'A firewall blocks incoming connections to an administrative port. Which category and function best describe this rule?',options:['Physical and detective','Technical and preventive','Managerial and corrective','Operational and deterrent'],answer:1,why:'The firewall implements the control through technology, and blocking the connection prevents access. Category describes how a control works; function describes its purpose.'},
{prompt:'A legacy application cannot meet a required authentication standard. Access is restricted through a hardened gateway as an approved alternative. What is the gateway’s role here?',options:['Directive control','Detective control','Compensating control','Risk acceptance without controls'],answer:2,why:'An alternative safeguard used to address a requirement that cannot be met directly is compensating. It must adequately address the risk; merely accepting the risk adds no safeguard.'}],
activity:{title:'Sort controls by their primary function',instruction:'Classify the purpose emphasized in each scenario. A control can serve more than one purpose in other contexts.',labels:['Preventive','Detective','Corrective','Deterrent'],items:[
['A door lock stops entry without a key.',0,'The lock blocks entry.'],['An alert reports repeated failed sign-ins.',1,'The alert identifies activity; it does not itself block it.'],['Restore damaged files from a clean backup.',2,'Restoration repairs the impact of an incident.'],['A warning highlights penalties to discourage trespassing.',3,'The emphasized purpose is discouragement.']]}}
,
{id:'cia-triad',title:'The CIA Triad',objective:'1.2',duration:'5:17',slug:'the-cia-triad-sy0-701/',recall:'Can you distinguish disclosure, modification and loss of access?',questions:[
{prompt:'A payroll export is accidentally shared with every employee. The file is accurate and still accessible. Which security goal was directly violated?',options:['Availability','Integrity','Confidentiality','Redundancy'],answer:2,why:'Confidentiality limits disclosure to authorized people. Accuracy concerns integrity; access when needed concerns availability. Redundancy is a technique, not a member of the CIA triad.'},
{prompt:'An administrator compares a downloaded installer’s hash with a trusted vendor hash. What is the primary goal?',options:['Detect unexpected changes to the installer','Hide the installer’s contents','Keep the download server online','Prove which person downloaded it'],answer:0,why:'A hash comparison checks integrity. The expected hash must come from a trusted source. Hashing neither conceals data nor keeps services running, and it does not identify the downloader.'}],
activity:{title:'Match the affected security goal',instruction:'Choose the goal most directly affected by each event. Labels may be used more than once.',labels:['Confidentiality','Integrity','Availability'],items:[
['A stolen unencrypted drive exposes personnel records.',0,'Unauthorized disclosure breaks confidentiality.'],['An attacker changes a bank routing number.',1,'Unauthorized modification breaks integrity.'],['A service outage stops staff opening records.',2,'Loss of usable access affects availability.'],['A misconfigured share exposes private salary data.',0,'The issue is disclosure, even if the data remains accurate.']]}}
,
{id:'non-repudiation',title:'Non-repudiation',objective:'1.2',duration:'7:57',slug:'non-repudiation-sy0-701/',recall:'What evidence connects a signed message to its signer?',questions:[
{prompt:'A supplier must provide evidence that it approved a purchase order and that the order was not altered. Which approach best supports this?',options:['An unsigned hash stored beside the order','A digital signature using the supplier’s private key','A shared password used by every supplier','Encrypting the order with the recipient’s public key only'],answer:1,why:'A verified digital signature links unchanged content to a signing key. Non-repudiation also depends on trustworthy identity binding and control of that private key. Encryption alone does not prove who approved an order.'},
{prompt:'A team signs approvals with one shared private key. What is the main problem when proving who approved a specific order?',options:['Public keys cannot verify signatures','A signature automatically encrypts the order','Individual attribution is weakened by shared key access','Hash functions stop detecting modifications'],answer:2,why:'A valid signature establishes use of the signing key, but several people can use a shared key. Individual attribution is therefore weak. Public-key verification and integrity checking can still work.'}],
activity:{title:'Match each piece of signature evidence',instruction:'Connect each cryptographic element to its role.',labels:['Private signing key','Public verification key','Message digest','Identity binding'],items:[
['Kept secret and used to create the signature.',0,'Private-key control is essential to meaningful attribution.'],['Used by the recipient to validate the signature.',1,'The verifier needs the corresponding trusted public key.'],['A fixed-length hash representing the message.',2,'A changed message should produce a different digest.'],['Connects the verified public key to the claimed signer.',3,'A certificate or another trusted process establishes this connection.']]}}
,
{id:'aaa',title:'Authentication, Authorization, and Accounting',objective:'1.2',duration:'9:03',slug:'authentication-authorization-and-accounting-sy0-701/',recall:'Who are you, what may you do, and what did you do?',questions:[
{prompt:'A technician signs in successfully but is denied access to a restricted report. Which process made the access decision?',options:['Accounting','Authentication','Authorization','Hashing'],answer:2,why:'Authorization checks allowed actions after identity is established. Successful authentication does not imply permission to read every resource. Accounting records activity.'},
{prompt:'During an investigation, the team needs to see which authenticated account exported a report and when. Which AAA function supplies this evidence?',options:['Authorization','Accounting','Authentication','Encryption'],answer:1,why:'Accounting records activity associated with an identity, such as timestamps and exports. It helps investigations but does not itself prove the account’s human owner performed every recorded action.'}],
activity:{title:'Sort an employee’s session into AAA',instruction:'Assign each event to the AAA function it illustrates. Labels may repeat.',labels:['Authentication','Authorization','Accounting'],items:[
['A security key proves the claimed identity during sign-in.',0,'This verifies identity.'],['A role permits viewing records but blocks deleting them.',1,'This defines permitted actions.'],['An audit trail records the account and export time.',2,'This records use of the system.'],['A policy denies a signed-in intern access to payroll.',1,'The identity is known; permission is denied.']]}}
,
{id:'gap-analysis',title:'Gap Analysis',objective:'1.2',duration:'6:44',slug:'gap-analysis-sy0-701/',recall:'How do current state, target state and remediation fit together?',questions:[
{prompt:'A target baseline requires MFA for all privileged accounts. An inventory finds 12 accounts without it. What has the comparison identified?',options:['A confirmed compromise','A security gap against the target','The likelihood of every attack','A completed remediation'],answer:1,why:'The comparison identifies a difference between the current and desired state. It does not establish that an attack occurred, and identifying a gap is not the same as fixing it.'},
{prompt:'An assessment identifies dozens of missing safeguards. What is the most useful next step?',options:['Mark the assessment complete and stop','Replace every system immediately','Prioritize remediation by risk, assign owners and dates','Assume all gaps have identical urgency'],answer:2,why:'A practical remediation plan addresses the most significant risks, with accountability and deadlines. Follow-up evidence is needed to confirm that changes close the gaps.'}],
activity:{title:'Match the evidence to the analysis',instruction:'Identify the role of each statement in a gap analysis.',labels:['Current state','Target state','Identified gap','Remediation plan'],items:[
['Today, 70 of 100 laptops have verified disk encryption.',0,'This describes the observed environment.'],['The approved baseline requires all 100 laptops encrypted.',1,'This defines the desired condition.'],['Thirty laptops fall short of the encryption requirement.',2,'This is the difference between current and target states.'],['The endpoint team will encrypt and verify those 30 by Friday.',3,'An owner, action and deadline turn the gap into work.']]}}
,
{id:'zero-trust',title:'Zero Trust',objective:'1.2',duration:'10:04',slug:'zero-trust-sy0-701/',recall:'Why is being inside the network insufficient for trust?',questions:[
{prompt:'A laptop is on the office network, but its security agent is disabled. What best fits a zero-trust access decision?',options:['Allow all access because the device is internal','Evaluate identity, device posture and policy before granting limited access','Trust it permanently after one successful password entry','Remove authentication for corporate devices'],answer:1,why:'Zero trust avoids implicit trust based only on network location. Decisions use current signals and policy, and access should be limited to what is needed.'},
{prompt:'Which component actually permits or blocks a resource connection after the access decision is made?',options:['Policy engine','Policy administrator','Policy enforcement point','Certificate authority'],answer:2,why:'The policy enforcement point enforces access. The policy engine makes the decision; the policy administrator carries out control-plane actions to establish or terminate the path. A certificate authority issues certificates.'}],
activity:{title:'Match zero-trust roles',instruction:'Connect each role or principle to its job.',labels:['Policy engine','Policy administrator','Policy enforcement point','Least privilege'],items:[
['Evaluates signals and policy to decide whether access is allowed.',0,'The engine makes the access decision.'],['Acts on the decision by directing connection establishment or termination.',1,'The administrator communicates control actions.'],['Allows, monitors or terminates the actual connection.',2,'This is the enforcement boundary.'],['Limits access to the minimum needed for the task.',3,'A permitted connection should not grant unrestricted access.']]}}
,
{id:'physical-security',title:'Physical Security',objective:'1.2',duration:'8:17',slug:'physical-security-comptia-security/',recall:'Which physical control addresses which threat?',questions:[
{prompt:'A facility needs to stop a vehicle from driving through its entrance. Which control most directly addresses the threat?',options:['Bollards rated for the expected impact','A privacy screen','A motion sensor alone','A password policy'],answer:0,why:'Appropriately rated bollards provide a physical vehicle barrier. A motion sensor can detect movement but does not stop the vehicle; the other options address unrelated threats.'},
{prompt:'Staff keep following authorized employees through a secure door without presenting their own badge. Which design most directly limits this behavior?',options:['A camera used only after incidents','A larger parking lot','An access control vestibule enforcing one-person passage','A shorter password expiration interval'],answer:2,why:'A properly configured access control vestibule controls passage between doors and can reduce tailgating. Cameras help detect or investigate; they do not directly enforce individual passage.'}],
activity:{title:'Choose a physical safeguard',instruction:'Match each need to the most directly relevant control.',labels:['Bollards','Access control vestibule','Video surveillance','Door contact sensor'],items:[
['Provide a barrier against vehicle entry.',0,'Select barriers suited to the vehicle risk.'],['Control individual passage through a secure entry.',1,'Interlocked doors can enforce controlled passage.'],['Record visual evidence of activity at an entrance.',2,'Cameras support monitoring and investigation.'],['Detect when a secured door is opened.',3,'A contact sensor detects door position.']]}}
,
{id:'deception-disruption',title:'Deception and Disruption',objective:'1.2',duration:'4:30',slug:'deception-and-disruption-sy0-701/',recall:'How do a decoy host, network, document and credential differ?',questions:[
{prompt:'A defender deploys an isolated decoy server with no legitimate business use to observe suspicious connections. What is it?',options:['A production load balancer','A honeypot','A recovery backup','A certificate authority'],answer:1,why:'A honeypot is a decoy system used to attract and observe suspicious activity. It should be isolated and monitored so it cannot become a route into real systems.'},
{prompt:'An unused fake API credential is planted in a monitored location. Any attempt to use it triggers an alert. What best describes it?',options:['A honeytoken','A production service account','A shared administrative password','A key escrow service'],answer:0,why:'A honeytoken is a decoy data element, such as a credential, whose use can signal suspicious activity. It should not grant meaningful production access.'}],
activity:{title:'Match the decoy to its name',instruction:'Choose the most specific term for each decoy.',labels:['Honeypot','Honeynet','Honeyfile','Honeytoken'],items:[
['One decoy host set up to attract suspicious connections.',0,'A honeypot represents an individual decoy system.'],['Several connected decoy systems simulating an environment.',1,'A honeynet extends deception across a network.'],['A bait document monitored for unauthorized access.',2,'A honeyfile is a decoy file.'],['A fake credential monitored for attempts to use it.',3,'A honeytoken can be a credential or another traceable data element.']]}}
];

// Section 1 continued: change management and cryptographic solutions.
MESSER_LESSONS.push(
{id:'change-management',title:'Change Management',objective:'1.3',duration:'11:22',slug:'change-management-sy0-701/',recall:'What must be decided before a production change, and checked afterward?',questions:[
{prompt:'IT plans to replace a firewall during business hours. What should happen before implementation?',options:['Implement first and request approval afterward','Review impact, stakeholders, testing and rollback with the approval authority','Skip review because the replacement is newer','Notify only the technician doing the work'],answer:1,why:'Change approval needs enough information to weigh benefit, disruption and risk. A newer device can still interrupt critical dependencies.'},
{prompt:'A patch passed testing, but production validation fails. Which preparation is most directly useful?',options:['A documented, tested backout plan','A longer password','An inventory without configuration backups','A promise to investigate next month'],answer:0,why:'A backout plan defines how and when to restore a known working state. Passing a test does not eliminate production risk.'}],activity:{title:'Match the change-management responsibility',instruction:'Match each action to its purpose.',labels:['Stakeholder identification','Impact analysis','Backout planning','Post-change validation'],items:[
['Find the departments whose work depends on the service.',0,'Affected teams need a voice and notice.'],['Assess possible downtime and consequences of failure.',1,'Impact analysis informs the risk decision.'],['Document how to restore the previous working configuration.',2,'Plan recovery before making the change.'],['Confirm real users can complete critical tasks afterward.',3,'A successful installation alone is not proof of service recovery.']]}}
,
{id:'technical-change-management',title:'Technical Change Management',objective:'1.3',duration:'10:54',slug:'technical-change-management-sy0-701/',recall:'What technical dependencies can make a small change disruptive?',questions:[
{prompt:'A configuration update requires restarting an authentication service. What is the most important scheduling consideration?',options:['Whether the change request uses a short title','Only the time needed to edit the file','Dependent applications and possible sign-in interruption','The technician’s preferred editor'],answer:2,why:'A brief edit can cause a wider outage when services restart. Account for dependencies, downtime, validation and recovery in the maintenance window.'},
{prompt:'An approved network change succeeds. What should the technician do with diagrams and operating procedures?',options:['Keep the old documents to avoid confusion','Update them to reflect the implemented state','Delete them because the change succeeded','Update them only after an outage'],answer:1,why:'Accurate diagrams and procedures support later operation and troubleshooting. Version control preserves history while identifying the current configuration.'}],activity:{title:'Identify the technical consideration',instruction:'Match each situation to the concept it illustrates.',labels:['Dependency','Maintenance window','Version control','Legacy application'],items:[
['A reporting service needs a particular database version.',0,'Changing the database can affect dependent services.'],['A reserved period includes installation, restart and validation.',1,'The window must cover the real work and disruption.'],['Configuration revisions record what changed and allow comparison.',2,'History helps identify and recover from changes.'],['An older business application cannot use a required new library.',3,'Compatibility constraints can complicate upgrades.']]}}
,
{id:'public-key-infrastructure',title:'Public Key Infrastructure',objective:'1.4',duration:'9:08',slug:'public-key-infrastructure-sy0-701/',recall:'Which key is shared, which is secret, and what establishes trust?',questions:[
{prompt:'Alice wants to send Bob a confidential message using public-key encryption. Which key should she use to encrypt it?',options:['Alice’s public key','Bob’s private key','Alice’s private key','Bob’s authenticated public key'],answer:3,why:'Bob’s public key encrypts for Bob; the corresponding private key decrypts. Alice must trust that the public key really belongs to Bob.'},
{prompt:'Why must a certificate owner protect the corresponding private key?',options:['Anyone holding it may impersonate the owner in uses supported by that key','Public certificates must remain secret','The public key cannot be distributed until the private key is published','A certificate automatically replaces the private key'],answer:0,why:'A certificate contains public information, not the private key. Compromised private-key control undermines the identity assurance provided by the certificate.'}],activity:{title:'Match the key-management concept',instruction:'Identify the concept described by each statement.',labels:['Symmetric encryption','Asymmetric encryption','Digital certificate','Key escrow'],items:[
['Uses the same secret key for encryption and decryption.',0,'Both sides must protect the shared secret.'],['Uses a mathematically related public and private key pair.',1,'The public key can be shared; the private key stays protected.'],['Binds identity information to a public key using an issuer’s signature.',2,'Trust requires validating that binding.'],['Stores a recoverable key with a designated trusted custodian.',3,'Escrow needs strict access and recovery controls.']]}}
,
{id:'encrypting-data',title:'Encrypting Data',objective:'1.4',duration:'9:48',slug:'encrypting-data-sy0-701/',recall:'What layer is encrypted, and when is the data exposed?',questions:[
{prompt:'A powered-off laptop is stolen. Which measure most directly protects the contents of its storage?',options:['TLS on the email server','Full-disk encryption with protected keys','A hash of the computer’s hostname','An encrypted Wi-Fi connection at the office'],answer:1,why:'Full-disk encryption protects stored data when the attacker cannot obtain the decryption keys. Network encryption does not encrypt the laptop’s stored files.'},
{prompt:'A database uses transparent encryption for its stored files. An authorized application queries a sensitive column. What should you expect?',options:['The application can never read the column','Encryption replaces all access permissions','The database can return plaintext to the authorized application','The column becomes a one-way hash'],answer:2,why:'Encryption at rest can be transparent to applications. It does not prevent authorized queries or replace authorization and protection of data in use.'}],activity:{title:'Choose the encryption scope',instruction:'Match the requirement to the scope that most directly fits.',labels:['Full-disk encryption','File encryption','Record-level encryption','Transport encryption'],items:[
['Protect the contents of an entire laptop storage volume.',0,'This covers the volume rather than one selected file.'],['Encrypt one document independently of the rest of the volume.',1,'The protection applies to the selected file.'],['Protect selected database records individually.',2,'Record-level protection offers finer granularity.'],['Protect a browser’s connection to a web service.',3,'TLS protects data traveling between endpoints.']]}}
,
{id:'key-exchange',title:'Key Exchange',objective:'1.4',duration:'3:39',slug:'key-exchange-sy0-701/',recall:'How can two parties establish a secret over an observable network?',questions:[
{prompt:'In Diffie–Hellman key agreement, what is the purpose of exchanging public values?',options:['Publish both private secrets','Disable the need for cryptography','Derive a shared secret without sending that secret directly','Prove the human identity of both users automatically'],answer:2,why:'Each party combines its private value with the peer’s public value to derive shared key material. The derived secret is not simply transmitted.'},
{prompt:'Why does an unauthenticated key exchange remain vulnerable to an on-path attacker?',options:['The attacker may substitute its own exchange values','All public exchange values must be hidden','Symmetric encryption cannot use derived keys','Private values must be identical on both endpoints'],answer:0,why:'Without authenticating the peer and exchange, an attacker can establish separate secrets with each endpoint. Key agreement alone does not establish identity.'}],activity:{title:'Match the exchange component',instruction:'Distinguish key agreement, confidentiality and authentication.',labels:['Public exchange value','Private exchange value','Derived shared secret','Peer authentication'],items:[
['Sent across the network as part of key agreement.',0,'This value need not be confidential.'],['Retained locally and never deliberately sent to the other party.',1,'The private contribution must remain secret.'],['Used to derive keys for subsequent protected communication.',2,'Key material is computed from the agreement.'],['Checks that the exchange is with the intended party.',3,'Authentication prevents undetected substitution of a peer.']]}}
,
{id:'encryption-technologies',title:'Encryption Technologies',objective:'1.4',duration:'6:53',slug:'encryption-technologies-sy0-701/',recall:'How do TPMs, HSMs and secure enclaves protect cryptographic operations?',questions:[
{prompt:'A company needs a dedicated device to protect centrally managed signing keys and perform high-volume cryptographic operations. Which fits best?',options:['A network switch','A plaintext key spreadsheet','A checksum file','A hardware security module'],answer:3,why:'An HSM is designed to protect cryptographic keys and perform operations with them. Dedicated key protection reduces exposure compared with ordinary files.'},
{prompt:'A laptop uses hardware to protect device keys and support measured boot. Which technology is most directly relevant?',options:['A public certificate directory','A trusted platform module','A honeyfile','A data-masking rule'],answer:1,why:'A TPM supports protected key operations and platform measurements. It does not itself encrypt every file or guarantee that all software is trustworthy.'}],activity:{title:'Match the protection technology',instruction:'Choose the most specific technology for each description.',labels:['TPM','HSM','Secure enclave','Key management system'],items:[
['A device-bound component protects keys and platform measurements.',0,'A TPM is tied to platform security functions.'],['Dedicated hardware protects centrally used cryptographic keys.',1,'HSMs provide protected cryptographic processing.'],['An isolated execution area protects sensitive processing from other software.',2,'An enclave provides an isolated processing boundary.'],['A service manages key generation, rotation and access policies.',3,'A KMS manages the key lifecycle and may use HSMs underneath.']]}}
,
{id:'obfuscation',title:'Obfuscation',objective:'1.4',duration:'8:00',slug:'obfuscation-sy0-701/',recall:'How do hiding a message and replacing its visible values differ?',questions:[
{prompt:'A checkout system stores a substitute identifier instead of a card number. A protected service maps the identifier back to the original. What is this?',options:['Tokenization','Hash collision','Digital signing','Steganography'],answer:0,why:'Tokenization replaces sensitive data with a surrogate. The mapping system must be protected because it can connect the token to the original value.'},
{prompt:'A message is concealed inside an image so an observer may not notice it exists. Which technique is being used?',options:['Key escrow','Certificate revocation','Steganography','Full-disk encryption'],answer:2,why:'Steganography hides the existence of a message within a carrier. It does not necessarily encrypt the hidden content; concealment and encryption are different goals.'}],activity:{title:'Identify the data-protection technique',instruction:'Match each example to its technique. Labels may be reused.',labels:['Data masking','Tokenization','Steganography'],items:[
['A support screen displays only the last four digits of an account.',0,'Masking limits what the viewer sees.'],['A random substitute stands in for a card number in a payment workflow.',1,'The substitute represents the original value.'],['A secret note is hidden within an audio file.',2,'The carrier conceals the note’s presence.'],['A report replaces visible sensitive digits with asterisks.',0,'The display conceals selected characters.']]}}
,
{id:'hashing-digital-signatures',title:'Hashing and Digital Signatures',objective:'1.4',duration:'10:24',slug:'hashing-and-digital-signatures-sy0-701/',recall:'What does hashing prove, and what does a signature add?',questions:[
{prompt:'An attacker replaces a download and the unsigned hash on the same compromised web page. Why can checking those two values fail to expose the attack?',options:['Hashes are reversible encryption','A hash alone does not authenticate its source','Hashing requires a private key','An altered file always has the original hash'],answer:1,why:'The attacker can publish the hash of the replacement file. Integrity comparison needs a trusted expected value or an authenticated signature.'},
{prompt:'Why are unique random salts used when storing password hashes?',options:['To make every password identical','To enable password decryption','To eliminate password guessing','To make identical passwords produce different stored results and frustrate precomputed tables'],answer:3,why:'Salts make precomputed attacks less reusable. They are not secret keys and do not stop guessing; use a suitable slow password-hashing function as well.'}],activity:{title:'Match the cryptographic tool',instruction:'Choose the tool that serves each purpose.',labels:['Hash','Digital signature','Salt','Encryption'],items:[
['Produces a fixed-length digest for a chosen hash algorithm.',0,'A digest can support integrity checks.'],['Allows a verifier to check content against a trusted signing key.',1,'Signing adds source authentication to integrity checking.'],['Adds a unique input to each stored password hash.',2,'Salts reduce reuse of precomputed results.'],['Transforms plaintext into ciphertext that can be recovered with a key.',3,'Encryption is reversible with the appropriate key.']]}}
,
{id:'blockchain-technology',title:'Blockchain Technology',objective:'1.4',duration:'2:22',slug:'blockchain-technology-sy0-701/',recall:'What makes a chain tamper-evident, and what does it not guarantee?',questions:[
{prompt:'Why does modifying an older block create a detectable inconsistency in a hash-linked blockchain?',options:['The changed block’s hash no longer matches the later reference','Every block contains a copy of a private encryption key','Hashes automatically repair incorrect data','All participants must be anonymous'],answer:0,why:'Later blocks reference earlier hashes. Altering a block changes its hash; consensus and validation rules govern which history participants accept.'},
{prompt:'A ledger entry states that a shipment arrived, but the entry was false when submitted. What does blockchain alone establish?',options:['That the shipment definitely arrived','That every entry is confidential','A verifiable ledger history, not the truth of the original physical claim','That no access controls are necessary'],answer:2,why:'Tamper-evident records do not guarantee accurate input. Real-world claims still require trustworthy evidence and validation.'}],activity:{title:'Match the ledger concept',instruction:'Identify the role of each component or process.',labels:['Block','Hash link','Distributed ledger','Consensus'],items:[
['A unit containing a group of recorded transactions.',0,'Blocks organize ledger entries.'],['A reference connecting a block to a prior block’s digest.',1,'This supports detection of historical alterations.'],['Replicated records maintained across participating systems.',2,'Multiple participants can maintain copies of the ledger.'],['Rules for participants to agree on accepted ledger history.',3,'Consensus is separate from whether real-world input is truthful.']]}}
,
{id:'certificates',title:'Certificates',objective:'1.4',duration:'14:38',slug:'certificates-sy0-701/',recall:'How do issuance, trust chains and revocation work together?',questions:[
{prompt:'A browser receives an unexpired certificate signed by a trusted issuer, but it names a different website. What should the browser do?',options:['Ignore the name because the issuer is trusted','Accept it if the page looks familiar','Use the certificate’s private key','Reject the hostname mismatch'],answer:3,why:'Trusting an issuer does not make its certificates valid for every host. The certificate must cover the requested hostname and pass other validation checks.'},
{prompt:'A server’s private key is stolen before its certificate expires. What certificate-management action is needed?',options:['Publish the stolen private key','Revoke the affected certificate and replace the key and certificate','Wait until the expiry date','Copy the certificate to more servers'],answer:1,why:'Revocation signals that the certificate should no longer be trusted. Reissue using a new key pair; a new certificate over the compromised key does not fix the exposure.'}],activity:{title:'Match certificate lifecycle tools',instruction:'Connect each tool to its purpose.',labels:['Certificate signing request','Certificate revocation list','OCSP','OCSP stapling'],items:[
['Provides a public key and requested identity information to an issuer.',0,'A CSR does not include the private key.'],['An issuer publishes a signed list of revoked certificates.',1,'A CRL lists revocations before normal expiry.'],['A client queries a responder for a certificate’s status.',2,'OCSP supports online status checking.'],['A server supplies a signed status response during the handshake.',3,'Stapling reduces the need for the client to contact the responder.']]}}
);

// Original retrieval practice for the next consecutive videos, objectives 2.1–2.3.
function addMesserLesson(id,title,objective,duration,recall,qs,labels,items){
 MESSER_LESSONS.push({id,title,objective,duration,slug:id+'-sy0-701/',recall,
 questions:qs.map(q=>({prompt:q[0],options:q[1],answer:q[2],why:q[3]})),
 activity:{title:'Apply it: '+title,instruction:'Match each scenario to the most specific label. Labels may be reused.',labels,items}});
}
addMesserLesson('threat-actors','Threat Actors','2.1','10:23','How do access, motivation and resources distinguish threat actors?',[
['A group steals research over several years to benefit a foreign government. Which actor best fits the stated goal?',['Unskilled opportunist','Nation-state actor','Accidental insider','Shadow IT user'],1,'Sustained espionage for a government fits a nation-state actor. Duration or sophistication alone would not prove attribution.'],
['A department adopts an unapproved file-sharing service to finish work faster. What is the clearest classification?',['Organized crime','Hacktivism','Shadow IT','A confirmed nation-state campaign'],2,'Shadow IT operates outside approved technology governance. It can create risk without malicious intent.']
],['Insider threat','Organized crime','Hacktivist','Unskilled attacker'],[
['An employee deliberately abuses existing access to steal records.',0,'Legitimate access can be misused by an insider.'],['A criminal group runs ransomware campaigns for profit.',1,'Financial gain is the stated motivation.'],['A group attacks a site to promote an ideological cause.',2,'The political or social motivation points to hacktivism.'],['A novice uses a ready-made attack tool without understanding it.',3,'Available tools can lower the skill needed to attack.']]);
addMesserLesson('common-threat-vectors','Common Threat Vectors','2.2','17:14','What is the entry path, and what makes it exposed?',[
['An attacker signs in to a newly installed device using its unchanged factory password. What enabled the entry?',['Default credentials','An offline backup','A certificate renewal','A memory leak'],0,'Known default credentials expose a device until they are changed or disabled.'],
['A user finds a USB drive in a parking lot. What is the safest next action?',['Plug it in to identify its owner','Open it only on a personal laptop','Email its files to everyone','Give it to the security team under the approved process'],3,'Unknown removable media can carry malicious files or emulate other devices. Do not connect it casually.']
],['Message-based','Removable device','Open service port','Supply chain'],[
['A malicious attachment arrives in a chat message.',0,'The message delivers the content.'],['A planted USB device is connected to a workstation.',1,'The physical medium provides an entry path.'],['An unnecessary internet-facing service accepts connections.',2,'Reachable services expand the attack surface.'],['A trusted vendor distributes compromised software.',3,'The trusted supplier becomes the delivery path.']]);
addMesserLesson('phishing','Phishing','2.2','6:32','Which clues require verification rather than an immediate click?',[
['A payroll email uses a familiar logo but links to an unfamiliar sign-in domain. What is the best response?',['Enter a test password','Report it and access payroll using a known address','Trust the logo','Forward the link to colleagues to test'],1,'Branding is easy to copy. A known independent route avoids the suspicious link.'],
['A finance director receives a targeted message referencing a real acquisition and requesting a secret transfer. Which description best fits?',['Random radio interference','A software race condition','Spear phishing directed at an executive','An ordinary certificate request'],2,'Personalized targeting is spear phishing; targeting senior leaders is also called whaling. Accurate context does not prove authenticity.']
],['Smishing','Vishing','Spear phishing','Business email compromise'],[
['A fraudulent delivery notice arrives by SMS.',0,'Smishing uses text messages.'],['A caller tricks someone into revealing a sign-in code.',1,'Vishing uses voice communication.'],['A tailored email references a recipient’s current project.',2,'Specific targeting distinguishes spear phishing.'],['A compromised executive mailbox requests a fraudulent payment.',3,'A genuine account can be used for business email fraud.']]);
addMesserLesson('impersonation','Impersonation','2.2','5:52','How do you verify identity when someone claims authority?',[
['A caller claims to be a senior manager and demands that help desk bypass identity checks. What should happen?',['Bypass the checks because the request is urgent','Ask only whether the caller knows the manager’s name','Follow the approved verification process through a trusted channel','Accept caller ID as proof'],2,'Authority and urgency are persuasion tactics. Independently verify the claimed identity using the established process.'],
['Someone invents an audit deadline to persuade an employee to share records. What is this invented story called?',['Pretext','Hash','Security baseline','Certificate chain'],0,'A pretext supplies a convincing story that gives the victim a reason to comply.']
],['Claimed authority','Urgency','Pretext','Independent verification'],[
['“I am your director; approve this immediately.”',0,'The claim uses hierarchy to influence the target.'],['“Your account will close in five minutes.”',1,'Time pressure discourages careful checking.'],['A fake support case explains why credentials are supposedly needed.',2,'The fabricated context makes the request seem legitimate.'],['Call a previously known number to validate the request.',3,'A separate trusted route avoids relying on attacker-supplied details.']]);
addMesserLesson('watering-hole-attacks','Watering Hole Attacks','2.2','4:12','Why attack a site your targets already visit?',[
['Attackers compromise an industry portal regularly used by employees at a target company. Which technique fits?',['Watering hole','Password spraying','Physical tailgating','Key escrow'],0,'A watering hole compromises a place the targets are likely to visit rather than contacting each victim directly.'],
['A familiar professional website unexpectedly prompts staff to install a browser update. What is the best response?',['Install it because the site is familiar','Disable browser protections','Share the installer internally','Use the browser’s trusted update mechanism and report the prompt'],3,'Even a legitimate site may be compromised. Obtain updates through approved channels.']
],['Target selection','Site compromise','Visitor exposure','Layered defense'],[
['The attacker identifies a portal frequently used by intended victims.',0,'The visitors’ habits drive the choice of site.'],['Malicious content is added to that otherwise legitimate portal.',1,'The site becomes the delivery point.'],['An employee reaches the malicious content during a normal visit.',2,'Ordinary browsing can encounter the attack.'],['Patching browsers and monitoring endpoints reduce attack opportunities.',3,'Multiple controls reduce reliance on a site’s reputation.']]);
addMesserLesson('other-social-engineering-attacks','Other Social Engineering Attacks','2.2','3:29','How do false information and copied branding influence decisions?',[
['A campaign knowingly spreads fabricated claims to damage a company’s reputation. Which term best describes this?',['Misinformation without intent','Disinformation','Encryption','Data masking'],1,'Disinformation is deliberately deceptive. Misinformation can be spread without knowing it is false.'],
['A social-media support account copies a bank’s branding and asks for recovery codes. What should the customer do?',['Supply one code to verify the account','Trust the matching logo','Contact the bank through its established official channel','Send a screenshot of all codes'],2,'Copied branding does not authenticate an account. Recovery codes should not be shared.']
],['Misinformation','Disinformation','Brand impersonation','Source verification'],[
['A person unknowingly repeats an inaccurate security rumor.',0,'The person is not knowingly creating the deception.'],['An attacker deliberately fabricates a damaging announcement.',1,'Intentional deception is central.'],['A fake support page copies a vendor’s name and logo.',2,'Familiar branding is used to gain trust.'],['Check a claim against an independently reached authoritative source.',3,'Verify before acting on or amplifying the claim.']]);
addMesserLesson('memory-injections','Memory Injections','2.3','2:39','Why can malicious code inside a trusted process be hard to spot?',[
['Endpoint telemetry shows an unexpected process placing executable content into another process. Which technique is suspected?',['Disk encryption','Certificate stapling','Memory injection','DNS caching'],2,'Memory injection introduces code into another process’s address space. Investigate process behavior and execution context.'],
['A trusted application loads an unexpected malicious library. Why is trusting the application name alone insufficient?',['Its process can execute malicious loaded code','Every library is inherently malicious','Process names prove file integrity','A trusted name automatically prevents exploitation'],0,'The process’s name does not establish that all code executing inside it is trustworthy.']
],['Target process','Injected code','DLL injection','Behavioral monitoring'],[
['The running application whose address space is being abused.',0,'Its context can conceal or empower the malicious activity.'],['The attacker’s instructions introduced into another process.',1,'The payload executes where it was not intended.'],['A malicious dynamic library is made to run in a process.',2,'A DLL supplies code loaded into the process.'],['Detection examines unusual memory and execution activity.',3,'Behavior can reveal abuse beyond filenames.']]);
addMesserLesson('buffer-overflows','Buffer Overflows','2.3','3:37','What happens when input exceeds the space reserved for it?',[
['A program writes 200 bytes into storage reserved for 80 bytes without checking limits. Which flaw is illustrated?',['Buffer overflow','Certificate mismatch','Password spraying','Tokenization'],0,'Writing beyond the allocated buffer can corrupt adjacent memory and may allow code execution.'],
['Which development practice most directly prevents an unchecked buffer write?',['Longer account passwords','Publicly exposing debug ports','Turning off logs','Enforcing bounds or using memory-safe abstractions'],3,'Bounds enforcement stops writes outside allocated storage. Other safeguards do not fix the unsafe write.']
],['Buffer','Out-of-bounds write','Possible impact','Preventive coding'],[
['A region of memory allocated to hold input.',0,'Its capacity is finite.'],['Input is written beyond that region’s capacity.',1,'Adjacent memory may be overwritten.'],['The program crashes or execution is redirected.',2,'The outcome depends on the overwritten memory and defenses.'],['Validate lengths and use safe memory-handling operations.',3,'Prevent the invalid write instead of relying on a crash.']]);
addMesserLesson('race-conditions','Race Conditions','2.3','4:58','Can a security decision become stale before the action occurs?',[
['A file is checked for safe permissions, replaced, then opened using the earlier decision. What flaw is this?',['Stored XSS','Time-of-check/time-of-use race','Password reuse','Hash collision'],1,'The checked object or state changes before use, so the earlier security decision may no longer apply.'],
['Two concurrent requests both see the last available ticket and both sell it. Which design change most directly addresses the race?',['Rename the ticket','Add a warning banner','Make the check-and-update operation atomic','Disable time synchronization'],2,'An atomic transaction prevents both requests from independently acting on the same stale state.']
],['Time of check','State change','Time of use','Atomic operation'],[
['The program verifies the object’s permissions.',0,'This is the initial validation.'],['Another process changes the object after validation.',1,'The earlier result may no longer be valid.'],['The program acts using the stale validation result.',2,'The gap between check and use creates exposure.'],['A transaction enforces the condition and action as one unit.',3,'Proper synchronization removes the vulnerable interleaving.']]);
addMesserLesson('malicious-updates','Malicious Updates','2.3','5:45','What if malicious code arrives through an update channel?',[
['An attacker compromises a vendor’s build pipeline and inserts code into a distributed update. What trust assumption failed?',['Updates can never change executable code','A familiar delivery channel guarantees benign content','Backups provide encryption','Every patch causes a race condition'],1,'A trusted channel can distribute compromised content when its upstream process is breached.'],
['An update has a valid vendor signature but later shows malicious behavior. What does that signature actually establish?',['The code contains no vulnerabilities','Every action it takes is authorized','Its signing origin and integrity relative to the signed content','It needs no further monitoring'],2,'A valid signature supports origin and integrity, not a guarantee that the signed program is harmless.']
],['Compromised build','Fake update prompt','Staged deployment','Behavioral detection'],[
['Attackers alter software before the vendor packages it.',0,'The upstream production process is compromised.'],['A website tells visitors to download an unofficial browser patch.',1,'The update story is used to deliver malicious software.'],['A small monitored group receives an update before broad rollout.',2,'A pilot can reveal problems while limiting exposure.'],['Unexpected activity is investigated even after signature validation.',3,'Trust checks and runtime monitoring serve different purposes.']]);
addMesserLesson('operating-system-vulnerabilities','Operating System Vulnerabilities','2.3','4:09','How do privilege, patching and support affect OS exposure?',[
['A low-privilege application exploits a kernel flaw and gains system-level access. What is the security impact?',['Better availability','Privilege escalation','Certificate renewal','Data anonymization'],1,'The flaw crosses a privilege boundary, granting capabilities the application should not have.'],
['A critical business server runs an operating system that no longer receives security fixes. What is the strongest long-term response?',['Assume unused features cannot be attacked','Disable event collection','Plan migration to a supported platform','Give every user administrator rights'],2,'Isolation may reduce immediate risk, but migration addresses the inability to obtain future security fixes.']
],['Patch management','Least privilege','Hardening','Support lifecycle'],[
['Test and deploy vendor fixes for identified flaws.',0,'Fixes remove known weaknesses when successfully applied.'],['Limit routine accounts to required permissions.',1,'Restricted rights reduce the effects of misuse.'],['Disable unnecessary services and insecure defaults.',2,'Reduce exposure beyond installing patches.'],['Track when the vendor stops supplying security updates.',3,'Unsupported platforms need a replacement plan.']]);
addMesserLesson('sql-injection','SQL Injection','2.3','5:09','How can user input become part of a database command?',[
['A search field is concatenated directly into a database query. Which control most directly prevents input from altering the query structure?',['Parameterized queries','A longer login timeout','An encrypted monitor cable','A new database name'],0,'Parameters keep supplied values separate from SQL syntax. String concatenation can blur that boundary.'],
['Why should a web application use a database account with only necessary permissions?',['It eliminates the need for safe queries','It makes SQL injection impossible','It encrypts every database response','It limits damage if an application flaw is exploited'],3,'Least privilege reduces the attacker’s available actions, but it does not replace fixing injection vulnerabilities.']
],['Unsafe construction','Parameterization','Least privilege','Additional filtering'],[
['Raw user input is joined into SQL command text.',0,'Input can become executable query structure.'],['The query structure is fixed and values are bound separately.',1,'Data remains data within the prepared query.'],['The application cannot alter tables it only needs to read.',2,'Permissions constrain possible impact.'],['A WAF screens suspicious web requests while code is repaired.',3,'Filtering can supplement, but not replace, secure query construction.']]);
addMesserLesson('cross-site-scripting','Cross-site Scripting','2.3','8:34','Where does injected script execute, and why does the browser trust it?',[
['A malicious comment is saved and later runs script in other visitors’ browsers. Which type of XSS is this?',['Reflected only','Stored','Disk-based encryption','DNS spoofing'],1,'Stored XSS persists in application content and reaches later visitors when rendered unsafely.'],
['A site reflects a search term into HTML. What is the most direct output-side defense?',['Use one shared administrator password','Hide the search button','Apply context-appropriate output encoding','Increase database privileges'],2,'Encoding for the destination context prevents input from becoming active markup or script. Different contexts require different handling.']
],['Stored XSS','Reflected XSS','DOM-based XSS','Output encoding'],[
['A saved forum post runs script for later visitors.',0,'The payload persists on the site.'],['Input from a crafted request appears unsafely in the immediate response.',1,'The request supplies the payload reflected in the response.'],['Client-side code inserts untrusted data into an unsafe browser sink.',2,'The vulnerable transformation occurs in client-side code.'],['Characters are safely represented for their HTML or other output context.',3,'Encoding prevents interpretation as executable content.']]);
addMesserLesson('hardware-vulnerabilities','Hardware Vulnerabilities','2.3','6:27','Why does security maintenance extend below the operating system?',[
['A vulnerability affects a server’s firmware. The OS is fully patched. What is still needed?',['Nothing; OS patches cover all firmware','Disable backups','Assess and apply the appropriate vendor firmware remediation','Replace all user passwords only'],2,'Firmware has its own code and update lifecycle. Patching the OS does not necessarily fix it.'],
['A network appliance remains essential but its vendor has ended support. Which short-term action best reduces exposure while replacement is planned?',['Restrict access and monitor it using approved compensating controls','Expose its management port to everyone','Stop inventory tracking','Assume hardware cannot contain exploitable code'],0,'Isolation and restricted management reduce exposure, while replacement addresses the support gap.']
],['Firmware','End of life','Legacy platform','Physical tampering'],[
['Low-level code initializes or controls a device.',0,'This code can contain vulnerabilities and require updates.'],['The vendor stops supporting a product.',1,'Future defects may remain unpatched.'],['An older system remains in service for compatibility reasons.',2,'Business dependency can complicate replacement.'],['Someone modifies or replaces device components without authorization.',3,'Physical access can undermine hardware trust.']]);
addMesserLesson('virtualization-vulnerabilities','Virtualization Vulnerabilities','2.3','5:29','What should isolate guests from hosts and previously used resources?',[
['An exploit lets code in a guest VM execute on its host. What is this called?',['Resource compression','VM escape','Normal virtualization','Certificate pinning'],1,'VM escape breaks the isolation boundary between a guest and its host or hypervisor.'],
['A newly assigned virtual disk exposes another tenant’s old data. Which weakness is illustrated?',['MFA fatigue','A secure trust chain','Unsafe resource reuse','A hot-site failover'],2,'Resources must be isolated and sanitized before reassignment so residual data cannot cross tenant boundaries.']
],['Hypervisor','Guest isolation','VM escape','Resource sanitization'],[
['The layer that manages virtual machines and access to hardware.',0,'Its security affects hosted guests.'],['One VM cannot read or modify another VM’s memory.',1,'The boundary separates workloads.'],['Guest code crosses into the host’s execution context.',2,'This breaches the intended isolation.'],['Previously used storage is cleared before assignment to a new tenant.',3,'Sanitization prevents residual data exposure.']]);
addMesserLesson('cloud-specific-vulnerabilities','Cloud-specific Vulnerabilities','2.3','4:06','Which risks remain when an application moves to the cloud?',[
['A cloud-hosted application concatenates user input into database commands. Does cloud hosting remove the injection risk?',['Yes, all cloud applications are automatically safe','Yes, if billing is enabled','Yes, because the database is remote','No; the application still needs secure query handling'],3,'Deployment location does not remove flaws in application logic. Shared responsibility still includes customer-controlled code and configuration.'],
['A storage service is accidentally configured for public reads. Who must address the customer-controlled access setting?',['The customer team responsible for that configuration','Only the ISP','Only visitors who download the data','No one because cloud data is always private'],0,'Responsibility depends on the service, but customers remain responsible for settings they control. Verify the provider’s responsibility model.']
],['Access misconfiguration','Denial of service','Excessive permissions','Application vulnerability'],[
['A private object store is made publicly readable.',0,'The access policy exposes the data.'],['Traffic overwhelms a hosted application’s capacity.',1,'Availability can be attacked in cloud environments too.'],['A workload identity can administer unrelated resources.',2,'Unnecessary privileges increase impact if it is compromised.'],['A hosted web application treats user input as executable commands.',3,'Insecure application logic remains a risk.']]);
addMesserLesson('supply-chain-vulnerabilities','Supply Chain Vulnerabilities','2.3','9:12','How can a trusted supplier become an attacker’s route in?',[
['A managed service provider is compromised, and its remote-management access is abused against customers. Which risk does this demonstrate?',['Trust inherited through the supply chain','Only a local screen-lock issue','A harmless accounting error','A normal password reset'],0,'A supplier’s trusted access can extend a compromise to downstream organizations.'],
['Which control most directly limits the impact of a compromised supplier account?',['Permanent unrestricted access','One shared password across suppliers','Least-privilege, time-limited access with monitoring','Disabling supplier audit logs'],2,'Constrain supplier access to needed work and observe its use. Contractual assurances alone do not enforce technical boundaries.']
],['Software dependency','Managed service provider','Hardware supplier','Vendor assessment'],[
['A third-party library introduces malicious functionality into an application.',0,'Dependencies can carry upstream risk into software.'],['A compromised support provider abuses its remote-administration channel.',1,'Service-provider access creates a downstream path.'],['A device arrives with an unauthorized component modification.',2,'Risk can enter through manufacturing or distribution.'],['The organization evaluates supplier controls and ongoing obligations.',3,'Assessment informs trust but must be paired with controls.']]);
addMesserLesson('misconfiguration-vulnerabilities','Misconfiguration Vulnerabilities','2.3','7:09','Can correct software still be exposed by incorrect settings?',[
['A firewall rule intended for one contractor allows the entire internet to reach remote administration. What is the primary issue?',['A zero-day in every browser','An overly permissive configuration','A hash collision','Proper least privilege'],1,'The rule grants broader access than intended. Supported, patched software can still be exposed by unsafe settings.'],
['A team repeatedly deploys servers with the same insecure defaults. What best addresses the recurring cause?',['Fix only one server manually','Rename the templates','Use reviewed secure templates and validate deployed settings','Stop checking configuration drift'],2,'Correcting and validating the baseline prevents repeated errors; drift checks detect later divergence.']
],['Default credentials','Excessive permissions','Open management access','Configuration drift'],[
['A device still accepts the vendor’s widely known initial password.',0,'Change or disable default credentials before use.'],['A service account has privileges far beyond its job.',1,'Apply least privilege.'],['An administrative interface is reachable from untrusted networks.',2,'Restrict administrative paths.'],['A server’s settings diverge from the approved baseline over time.',3,'Regular comparison can reveal unauthorized or accidental changes.']]);
addMesserLesson('mobile-device-vulnerabilities','Mobile Device Vulnerabilities','2.3','3:23','How can mobile platform restrictions be bypassed?',[
['A user removes iOS platform restrictions to install unapproved modifications. What is this generally called?',['Tokenization','Certificate stapling','Jailbreaking','Network segmentation'],2,'Jailbreaking bypasses iOS restrictions and may weaken platform security boundaries.'],
['An Android user installs an app from outside the approved distribution process. Which activity is this?',['Sideloading','Key escrow','Firmware attestation','Data masking'],0,'Sideloading installs applications through an alternative distribution path. It is distinct from obtaining root access.']
],['Jailbreaking','Rooting','Sideloading','Device compliance check'],[
['iOS restrictions are bypassed to allow unauthorized modifications.',0,'This can undermine expected platform controls.'],['An Android device is modified to obtain elevated root privileges.',1,'Root access increases control and can weaken protections.'],['An application is installed outside the approved app distribution path.',2,'Its source and review history may differ from approved apps.'],['Management evaluates whether the device meets access requirements.',3,'Compliance checks can restrict access from risky devices.']]);
addMesserLesson('zero-day-vulnerabilities','Zero-day Vulnerabilities','2.3','3:02','How do you respond when a newly exposed flaw has no available fix?',[
['Attackers exploit a previously unknown flaw before the vendor has a security fix available. Which description best fits?',['Routine scheduled maintenance','Zero-day exploitation','A completed risk assessment','Certificate renewal'],1,'Zero-day attacks exploit a flaw before defenders have had the normal opportunity to receive and deploy a fix.'],
['A vendor confirms active exploitation but has not released a patch. What should defenders do now?',['Wait without changing anything','Disable every security log','Apply validated mitigations, restrict exposure and monitor for exploitation','Assume the flaw cannot affect supported software'],2,'Reduce exposure using trusted mitigations while tracking a permanent fix. Preserve visibility and investigate relevant indicators.']
],['Vulnerability','Exploit','Compensating mitigation','Permanent remediation'],[
['A weakness allows an unintended security boundary crossing.',0,'The vulnerability is the flaw itself.'],['A technique takes advantage of that weakness.',1,'The exploit is how the flaw is used.'],['A risky feature is restricted while no patch is available.',2,'Alternative controls reduce exposure before the underlying fix.'],['A validated vendor update removes the underlying flaw.',3,'Deploy and verify the fix through the appropriate change process.']]);

// Original extra scenarios. Append only: saved answers and quiz IDs use the original indices.
// Signature reference: https://csrc.nist.gov/glossary/term/digital_signature
function extendMesserReview(id,rows){
 const lesson=MESSER_LESSONS.find(l=>l.id===id);
 lesson.baseQuestionCount=lesson.questions.length;
 lesson.questions.push(...rows.map(q=>({prompt:q[0],options:q[1],answer:q[2],why:q[3]})));
}
extendMesserReview('security-controls',[
 ['Leadership approves a policy requiring quarterly access reviews. Classify the policy by how the control is implemented.', ['Technical','Operational','Managerial','Physical'],2,'A policy approved through governance is managerial. The staff performing the reviews would be an operational implementation of that policy.'],
 ['A receptionist checks visitors against an approved list and issues temporary badges. Which category best describes the staff-run checking process?', ['Operational','Technical','Managerial','Compensating'],0,'An operational control is performed by people. A badge reader enforcing access automatically would instead be technical; a written visitor policy would be managerial.'],
 ['A posted rule instructs everyone to display an ID badge inside the facility. Which control function is emphasized?', ['Detective','Corrective','Compensating','Directive'],3,'A directive control tells people what they must do. A warning intended to discourage misconduct emphasizes deterrence instead.'],
 ['A camera records a restricted doorway. Guards use the recordings only to identify unauthorized entry afterward. Which function is emphasized?', ['Preventive','Detective','Corrective','Compensating'],1,'The recordings help discover and investigate entry. The camera may also deter people in another scenario, but the stated use here is detection.']
]);
extendMesserReview('non-repudiation',[
 ['Alice digitally signs a maintenance approval for Bob. Which pair of operations is correct?', ['Alice signs with Bob’s public key; Bob verifies with his private key','Alice signs with her private key; Bob verifies with Alice’s trusted public key','Alice signs with her public key; Bob verifies with Alice’s private key','Bob signs with his private key; Alice verifies with Bob’s public key'],1,'The signer uses her private signing key. The recipient checks with the signer’s corresponding trusted public key. Bob’s key pair is not needed just to verify Alice’s signature.'],
 ['Bob computes a file’s hash and it matches a value obtained through a trusted channel. What does this check establish by itself?', ['Which employee created the file','That only Bob can read the file','That the sender cannot deny sending it','Evidence that the file matches the trusted reference'],3,'The match supports integrity. An ordinary hash contains no signer identity, so this check alone does not establish origin or non-repudiation.'],
 ['Alice sends a readable message with a valid digital signature but does not encrypt the message or the transport. Can someone who intercepts it read the content?', ['Yes; signing does not make the message confidential','No; all signed messages are ciphertext','Only with Alice’s private key','Only after changing the signature'],0,'Signing can protect authenticity and integrity without hiding the message. Confidentiality requires appropriate encryption too.'],
 ['Bob verifies Alice’s signature on an approval. Someone changes the approved amount but keeps the original signature. What should verification of the altered approval do?', ['Succeed because the signer’s name is unchanged','Succeed if the file has the same length','Fail because the signature no longer matches the signed content','Reveal Alice’s private key'],2,'A signature is tied to the signed content. Changing the amount invalidates it even if the document size or displayed author stays the same.'],
 ['A message arrives with a signature and a public key labeled “Alice.” The signature verifies, but Bob has never authenticated that key. What is still missing?', ['The private key must be attached too','Assurance that the verification key really belongs to Alice','A longer filename','Proof that Bob generated the key'],1,'An attacker can supply a key and sign with its paired private key. Bob needs a trusted binding between Alice and the key, such as a validated certificate or independently verified key.'],
 ['Bob receives an instruction encrypted only with his public encryption key. There is no signature. Why is this insufficient evidence that Alice authored it?', ['Bob’s public key is secret','Encryption always removes identity information','Public-key encryption only checks length','Anyone with Bob’s public key could encrypt a message to him'],3,'Encrypting for Bob addresses who can decrypt, not who authored the message. Alice’s digital signature would provide separate origin evidence.']
]);
extendMesserReview('aaa',[
 ['A user enters a username to claim an identity, then proves possession of a registered security key. Which step performs authentication?', ['Entering the username alone','Recording the sign-in timestamp','Verifying possession of the security key','Assigning a read-only role'],2,'A username identifies the claimed account. Checking the authenticator supplies evidence for that claim. Role assignment is authorization; logging is accounting.'],
 ['A service validates a device certificate during connection setup. What is being authenticated most directly?', ['The device or service identity associated with the certificate','Every human who has used the device','Permission to access all company databases','The accuracy of every device log entry'],0,'Certificates can authenticate machines and services as well as people. Device authentication does not automatically establish a human identity or grant every permission.'],
 ['Employees authenticate through a trusted identity provider to use a partner application. What must the partner application still determine?', ['Whether it can skip accounting','Whether all employees should become administrators','Whether the identity provider can decrypt all files','Which actions the authenticated identity is authorized to perform'],3,'Federated authentication can establish identity while the application still enforces permissions. Successful sign-in is not unrestricted authorization.'],
 ['An audit log records that a shared admin account deleted a record. What is the strongest supported conclusion?', ['A particular employee certainly deleted it','The action was associated with that account, but individual attribution needs more evidence','The deletion was authorized because it was logged','The record can be restored from the log alone'],1,'Accounting associates events with accounts. Sharing an account weakens individual attribution. Logging neither authorizes an action nor guarantees recovery.']
]);
extendMesserReview('zero-trust',[
 ['A policy service decides whether to allow a connection; a gateway carries the allowed application traffic. Which mapping is correct?', ['Decision: control plane; traffic forwarding: data plane','Decision: data plane; traffic forwarding: control plane','Both functions are exclusively accounting','Both functions are certificate issuance'],0,'The control plane governs access decisions and instructions. The data plane carries traffic and applies enforcement to the connection.'],
 ['A previously compliant laptop shows signs of compromise during an active session. Which response fits adaptive zero-trust access?', ['Ignore the alert until the annual review','Preserve full access because it passed an earlier check','Reevaluate the session and restrict or terminate access under policy','Trust it because its IP address is internal'],2,'Access decisions can change with risk signals. An earlier successful check does not confer permanent trust.'],
 ['A payroll clerk needs to read payroll records. Which grant best follows a resource-focused zero-trust policy?', ['Administrative access to the internal network','Read access to the required payroll resource under current policy','Permanent access to every system in the payroll subnet','Unrestricted access after one MFA challenge'],1,'Access should match the task and resource. MFA helps authenticate but does not justify excessive permissions or indefinite trust.'],
 ['A policy engine denies a connection and the policy administrator directs the gateway to close the path. Which statement correctly describes the roles?', ['The gateway made the decision because it carries traffic','The administrator issued the user’s certificate','The engine only recorded an accounting event','The engine decided, the administrator directed, and the enforcement point blocked'],3,'These are distinct roles even when one product implements them: decision, control instructions and connection enforcement.']
]);
extendMesserReview('change-management',[
 ['A database change could delay month-end billing. Who should help assess and schedule its business impact?', ['Only the engineer editing the database','Billing stakeholders and the responsible technical and change owners','Only the hardware reseller','Only users whose passwords expire that week'],1,'Affected business teams understand deadlines and consequences that a technical-only review can miss. Clear ownership and approval remain necessary.'],
 ['An update works in a lab, but the lab has no connection to the production identity service. What is the most important test limitation?', ['Passing any lab test guarantees production success','Testing is unnecessary after approval','The test did not exercise a critical production dependency','The identity service must be compromised'],2,'A test supports only what it exercises. Missing dependencies leave uncertainty to address before rollout.'],
 ['A change owner must define when to stop a rollout and restore service. Which plan is most useful?', ['Specific failure triggers, a recovery owner, restoration steps and validation checks','A statement that the team will troubleshoot as needed','A screenshot of the latest software version','An instruction to continue until every host is updated'],0,'A usable backout plan makes recovery decisions and execution concrete. It must account for whether changes, including data changes, are reversible.'],
 ['A change installs successfully, but users cannot complete purchase orders. Should the team close it as successful?', ['Yes, because the installer reported success','Yes, if the ticket was approved','Yes, once the maintenance window ends','No; validate the business workflow and address the failed outcome'],3,'Post-change validation checks service outcomes, not just installation. Use the approved recovery or corrective process when critical workflows fail.']
]);
extendMesserReview('technical-change-management',[
 ['A signed application update changes its executable hash. An allow list permits only the old hash. What should the approved rollout account for?', ['Disabling endpoint protection permanently','Keeping only the old hash because the filename is unchanged','Updating the relevant allow-list rule after validating the new executable','Assuming signatures override every allow-list rule'],2,'A hash-based rule identifies specific file content. An update changes that content, so the approved policy must be updated and tested.'],
 ['A service upgrade requires a newer database driver used by several other applications. What should be checked before rollout?', ['Compatibility across the dependent applications','Only the installer’s disk-space needs','Whether the new version has a shorter name','Only the ticket writer’s permissions'],0,'Shared dependencies can turn one upgrade into failures elsewhere. Test supported combinations and sequence the changes accordingly.'],
 ['A patch requires a 15-minute reboot and 20 minutes of validation. Only 10 minutes remain in the maintenance window. What is the best action?', ['Start because the download is finished','Reboot now and skip validation','Mark the work complete without restarting','Reschedule or obtain required approval for a suitable window'],3,'The window must cover disruption, restart, verification and recovery time. Installation alone is not the whole change.'],
 ['After several configuration edits, a service fails. Which record best helps identify the exact change and recover prior settings?', ['An inventory listing only server names','Version-controlled configuration history with reviewed revisions','The latest uptime chart alone','A policy saying changes should be documented'],1,'Version history exposes differences and preserves prior content. Recovery still requires the approved process and validation.']
]);
extendMesserReview('public-key-infrastructure',[
 ['A backup is encrypted with AES. Which key relationship is used to recover the original data?', ['A public signing key reverses the hash','The sender’s public and recipient’s private key are interchangeable','The certificate authority publishes a decryption key','The same symmetric secret key is used for encryption and decryption'],3,'AES is symmetric encryption: the secret key protects and recovers the data. Safeguarding and distributing that key are separate challenges.'],
 ['A customer downloads a company’s public certificate. Which information should remain under the company’s exclusive protection?', ['The certificate’s issuer name','The corresponding private key','The expiration date','The public key in the certificate'],1,'The certificate and public key are shareable. Publishing the private key undermines the cryptographic uses associated with that key pair.'],
 ['An organization needs authorized recovery of encrypted archives if the key custodian becomes unavailable. Which arrangement addresses this?', ['Publishing archive keys on the intranet','Replacing encryption with an unsigned checksum','Controlled key escrow with restricted, audited recovery','Deleting all backup copies of the keys'],2,'Key escrow provides a controlled recovery path. Protect the escrowed material and tightly govern retrieval.'],
 ['A large transfer uses asymmetric cryptography to establish protected symmetric session keys. Why combine these methods?', ['Symmetric encryption efficiently protects bulk data while asymmetric methods support key establishment and authentication','Each byte needs a different public certificate','Public keys must be secret after the transfer','Asymmetric methods work only on unencrypted networks'],0,'Hybrid designs combine the methods’ strengths. The protocol defines key establishment and authentication; bulk data normally uses efficient symmetric encryption.']
]);
extendMesserReview('encrypting-data',[
 ['A browser uses TLS to upload a report. The server then stores that report as an unencrypted file. What protection did TLS supply?', ['Encryption of all stored copies','Protection for the connection while the report traveled between the TLS endpoints','Protection against every authorized server user','A permanent digital signature on the report'],1,'Transport encryption protects data in transit between its endpoints. Storage encryption and permissions must protect the saved report separately.'],
 ['A company must encrypt just the tax-ID column while leaving other database columns available to routine reports. Which scope best matches?', ['Full-disk encryption alone','Encryption of the network link alone','Encryption of every database file as one unit','Field- or column-level encryption with appropriate key access'],3,'Column-level protection can target selected values and control who can decrypt them. Whole-database encryption addresses a different scope.'],
 ['A user unlocks a disk-encrypted laptop and opens a document. Malware running with that user’s access reads the open document. Why did disk encryption not stop this?', ['The authorized session already had access to decrypted data','AES cannot encrypt text files','Disk encryption only protects network traffic','Every encrypted file requires a public certificate'],0,'Storage encryption protects locked data without available keys. It does not prevent malware in an authorized session from accessing data the session can already read.'],
 ['An encrypted backup and its unprotected decryption key are stolen together. What is the main weakness?', ['The backup should have used a longer filename','The attacker must still obtain the original plaintext','Key protection failed, allowing the ciphertext to be decrypted','The backup’s hash is now automatically public'],2,'Encryption relies on protecting its keys. Keeping an exposed key with the backup can defeat the confidentiality benefit.']
]);
extendMesserReview('hashing-digital-signatures',[
 ['A 1 KB file and a 2 GB file are both hashed with SHA-256. How do their digest lengths compare?', ['The larger file has a longer digest','Both digests are 256 bits','The smaller file has no digest','The digest length equals the filename length'],1,'For a chosen algorithm such as SHA-256, output length is fixed regardless of input size. File size affects processing work, not digest length.'],
 ['You change one character in a document and hash it again using the same secure algorithm. Which result is expected?', ['A substantially different digest','The same digest because the file length stayed the same','A digest that reveals the edited character','A digest shortened by one byte'],0,'Secure hashes are designed so small input changes substantially change the output. The digest detects a mismatch; it does not locate or explain the edit.'],
 ['A help desk wants to recover a forgotten password by “decrypting” its stored hash. What is the correct response?', ['Use the user’s public key to decrypt it','Use the salt as a decryption key','Remove half of the hash characters','Use the password reset process; hashes are not reversible encryption'],3,'A hash has no decryption operation. Attackers may still guess inputs and compare hashes, which is why password choice and suitable password hashing matter.'],
 ['Two different files produce the same digest under one hash algorithm. What is this called?', ['Key escrow','Digital signing','A hash collision','Certificate stapling'],2,'A collision means distinct inputs share an output. Secure algorithms make finding such pairs computationally impractical; equal hashes are not mathematical proof that collisions cannot exist.'],
 ['A password database includes each account’s salt beside its hash. Does disclosure of the salt alone defeat its intended purpose?', ['Yes; a salt is the secret decryption key','No; salts need not be secret, but passwords still need resistance to guessing','Yes; the salt directly contains the original password','No; salts make all password guessing impossible'],1,'Salts separate hashes across accounts and reduce reuse of precomputed work. Their purpose does not depend on secrecy, and attackers can still test guesses.'],
 ['A signed software package verifies against a trusted publisher key. Which conclusion goes beyond what the signature establishes?', ['The signed package has not been altered since signing','The signature was produced with the corresponding private key','The signature supports attribution to the publisher’s signing identity','The package is guaranteed free of malicious code or vulnerabilities'],3,'A signature supports integrity and origin, not software safety. A publisher or compromised build process can sign harmful software.']
]);
extendMesserReview('certificates',[
 ['An administrator creates a certificate signing request for a web service. What must stay protected and must not be sent in that request?', ['The requested service name','The public key','The private key','The requested subject information'],2,'A CSR provides public-key and identity information for issuance. The private key stays under the requester’s control.'],
 ['A server certificate chains through an intermediate CA to a root CA already trusted by the client. What allows the client to establish this chain of trust?', ['Validating the signatures and constraints along the chain to the trusted root','Trusting any root certificate the server sends','Checking only that the leaf certificate is unexpired','Reading the website’s company logo'],0,'Trust starts with the client’s accepted trust anchor and extends through a validated chain. A server cannot make an arbitrary root trusted simply by sending it.'],
 ['An internal tool uses a self-signed certificate. Why does a new employee’s unmanaged browser warn even if the certificate is unexpired and the hostname matches?', ['Self-signed certificates contain no public key','The browser has not established trust in that certificate','Self-signed certificates cannot support encryption','The certificate automatically expires after its first use'],1,'A self-signature alone does not establish trust for another party. Managed trust distribution or a suitable trusted issuer can address this; blindly ignoring warnings cannot.'],
 ['An organization wants clients to obtain a published, signed list of certificates revoked by a CA. Which mechanism meets this requirement?', ['A CSR','A subject alternative name','An ordinary DNS A record','A certificate revocation list'],3,'A CRL is a signed revocation list. OCSP instead provides certificate status responses; a CSR requests issuance.'],
 ['A web server includes a CA-authorized, signed certificate-status response during its TLS handshake. Which mechanism is this?', ['Key escrow','Certificate signing request','OCSP stapling','Certificate renewal'],2,'The server supplies an OCSP response for the client to validate, including its signature and freshness. It does not create its own trustworthy status just by claiming the certificate is valid.'],
 ['A browser sees a valid TLS certificate for a fraudulent shop’s own domain. What should you conclude?', ['The certificate supports the domain connection’s identity, but does not prove the shop is honest','A trusted certificate guarantees every purchase','A certificate proves the website has no application flaws','A valid certificate means the browser can skip hostname checks'],0,'Certificate validation authenticates the claimed endpoint within the certificate’s scope. It does not certify the business’s honesty, content or application security.']
]);
extendMesserReview('threat-actors',[
 ['An employee with legitimate database access deliberately sells customer records. Which characteristic makes this an insider threat?', ['The attack uses a public website','The employee uses existing trusted access for harm','The employee must have written advanced malware','The stolen records are encrypted in transit'],1,'Insider status concerns the trusted relationship or access being abused. It does not depend on sophisticated tools.'],
 ['An attacker group publishes stolen documents to advance a stated political cause. Which motivation most strongly supports a hacktivist classification?', ['Selling access to the highest bidder','Accidentally exposing a file','Testing a newly purchased backup system','Promoting an ideological objective'],3,'Hacktivism centers on an ideological or political objective. Financially motivated theft points elsewhere, although real actors can have mixed motives.'],
 ['A novice uses a ready-made exploit kit to compromise a vulnerable server. What should defenders infer about risk?', ['Limited personal skill does not prevent harm when effective tools are available','Only attackers who write their own code are dangerous','All automated attacks are nation-state operations','Using a tool proves the attack is authorized'],0,'Accessible tools can give an unskilled actor substantial capability. Evaluate exposure and impact instead of dismissing the actor.'],
 ['An intrusion is sophisticated and well funded, but investigators have no evidence of its sponsor or goal. What is the most defensible assessment?', ['Sophistication proves a particular country is responsible','Every costly attack is financially motivated crime','Resources inform the assessment, but are insufficient alone to attribute the actor','Attribution is unnecessary because the attack used software'],2,'Capability, access, resources and motivation help characterize actors. No single attribute reliably identifies a sponsor.']
]);
extendMesserReview('common-threat-vectors',[
 ['A help-desk chat includes a malicious document attachment. Which description most precisely separates the delivery path from the payload?', ['The password policy is the vector and chat is the payload','The document is the only possible attack surface','The user’s job title is the vector','Chat is the message-based delivery vector; the document carries the payload'],3,'The vector is the route used to reach the target. A message can deliver a malicious file or link, including through collaboration tools rather than email.'],
 ['A workstation runs an unsupported operating system with a known unpatched remote-access flaw. What most directly increases its exposure?', ['The lack of vendor fixes for reachable vulnerable software','A recently renewed TLS certificate','A short computer name','A documented maintenance window'],0,'Unsupported systems may no longer receive fixes. Restricting exposure can reduce risk while migration or replacement addresses the underlying support problem.'],
 ['A firewall exposes an unused remote-management service to the internet. Which change most directly reduces this attack surface?', ['Changing the login page color','Disabling the unnecessary service and removing its exposure','Renaming the configuration file','Increasing logging without restricting the service'],1,'Remove unnecessary reachable services. Monitoring remains useful, but leaving an unused entry point open preserves avoidable exposure.'],
 ['An image file exploits a flaw in an application’s image parser when opened. What lesson does this illustrate?', ['Only executable file extensions can carry attacks','Image files cannot reach vulnerable code','Ordinary file types can trigger vulnerabilities in the software that processes them','A familiar filename authenticates the sender'],2,'Risk includes the parser and application processing the content. A file does not need an executable extension to exploit a software flaw.'],
 ['A personally owned laptop with unknown patch status connects to company resources. What is the most appropriate access control response?', ['Give it full access because an employee owns it','Evaluate device compliance and grant only policy-permitted access','Remove all authentication for personal devices','Trust it if its model matches a company laptop'],1,'Unmanaged devices introduce uncertainty about configuration and security posture. Apply the organization’s device and access requirements rather than assuming ownership means trust.'],
 ['An attacker offers a convincing fake software update through a familiar supplier’s compromised portal. Which trust assumption failed?', ['All encrypted files are harmless','Only internal employees can upload files','Every browser warning means a firewall outage','A familiar delivery source was treated as proof the delivered content was safe'],3,'Trusted channels and third parties can be compromised. Validate updates through the approved process and combine origin checks with security controls and monitoring.']
]);
extendMesserReview('cross-site-scripting',[
 ['A crafted search URL causes a vulnerable site to echo active script in its immediate response. The payload is not saved. Which XSS delivery pattern fits?', ['Reflected XSS','Stored XSS','SQL injection','A buffer overflow'],0,'Reflected XSS uses input returned in the response to the crafted request. Stored XSS persists in content and affects later views.'],
 ['A page’s JavaScript reads untrusted URL data and inserts it into the page as active HTML. Which feature makes this a DOM-based XSS scenario?', ['The database changed the user’s role','The operating system rebooted','The unsafe transformation occurs in client-side browser code','The certificate has a subject alternative name'],2,'DOM-based XSS involves unsafe client-side processing of untrusted data. The server does not need to store or reflect the payload into its response.'],
 ['Injected script runs in a victim’s browser within a vulnerable website’s origin. Which impact is plausible?', ['Automatic decryption of every file on the computer','Actions or access to page data within the victim’s application session','Automatic compromise of every other browser origin','Changing the CA’s private key'],1,'XSS can abuse the privileges and data available in that application context. Browser boundaries and protections still matter; XSS does not imply unrestricted access to all systems.'],
 ['A comment editor deliberately allows limited HTML formatting. Which defense best preserves that feature while addressing dangerous markup?', ['Trusting all input from signed-in users','Removing only one known script string','Relying solely on HTTPS','Using a maintained HTML sanitizer with an appropriate allow list'],3,'When permitted HTML must remain markup, sanitization removes unsafe constructs. Plain-text fields should use safe rendering or context-appropriate encoding. HTTPS alone does not prevent XSS.']
]);
extendMesserReview('supply-chain-vulnerabilities',[
 ['An application includes an upstream library that receives a malicious update. The application’s own source was not directly changed by the attacker. Which route carried the compromise?', ['A physical access vestibule','A certificate hostname mismatch','A software dependency in the supply chain','An employee’s forgotten password'],2,'Third-party dependencies bring upstream changes into downstream products. Track components and control how updates are reviewed and adopted.'],
 ['A vendor’s build system is compromised and produces a malicious package with a valid vendor signature. Why is checking the signature insufficient?', ['The signature supports origin and integrity, not the safety of the vendor’s build process','Valid signatures mean the package cannot execute','A valid signature proves the vendor’s network was never compromised','Signing automatically removes malicious instructions'],0,'Compromise before signing can produce authentically signed malicious output. Supplier assurance and behavioral checks complement signature verification.'],
 ['A business hires an MSP that has remote administration access to its endpoints. Why does the MSP’s security posture matter?', ['The MSP removes all customer responsibility','Only the MSP’s public website can affect customers','Contract wording prevents technical compromise','Compromise of the MSP’s privileged channel could expose customer systems'],3,'An external provider’s access can become a path into the customer environment. Scope, monitor and review that access as part of supplier risk management.'],
 ['A new batch of network devices is suspected of being altered before delivery. Which supply-chain concern is most directly relevant?', ['Account lockout timing','Hardware manufacturing or distribution integrity','Output encoding in a web form','Password length on unrelated laptops'],1,'Hardware can be tampered with during manufacturing or distribution. Trusted sourcing, provenance and inspection help address that route.']
]);

// Domain 2 continued: original reviews for videos 39–56, objectives 2.4–2.5.
MESSER_LESSONS.push(...[
  {
    "id": "an-overview-of-malware",
    "title": "An Overview of Malware",
    "objective": "2.4",
    "duration": "6:06",
    "slug": "an-overview-of-malware-sy0-701/",
    "recall": "What does the malicious software do, how did it arrive, and what evidence supports containment?",
    "questions": [
      {
        "prompt": "A finance workstation begins encrypting shared documents and displays a payment demand. What is the most likely malware behavior?",
        "options": [
          "An application allowlist",
          "Ransomware",
          "A normal disk-encryption rollout",
          "A DNS cache refresh"
        ],
        "answer": 1,
        "why": "Unexpected encryption combined with an extortion demand supports ransomware. Legitimate encryption is authorized and managed; the symptoms still need investigation to establish scope."
      },
      {
        "prompt": "A payroll file is stolen before ransomware encrypts the server. Which assessment best captures the impact?",
        "options": [
          "Both confidentiality and availability may be affected",
          "Only availability matters because encryption occurred",
          "Encryption proves the stolen copy is unreadable",
          "Only the server hardware needs replacement"
        ],
        "answer": 0,
        "why": "Data theft threatens confidentiality, while encryption can prevent access. Restoring files does not undo disclosure or settle the incident."
      },
      {
        "prompt": "EDR identifies an active malicious process spreading from a workstation. What is the best immediate defensive action under the incident playbook?",
        "options": [
          "Pay the demand before assessing backups",
          "Delete every log to prevent further execution",
          "Wait for every employee to report symptoms",
          "Isolate the affected endpoint while preserving evidence"
        ],
        "answer": 3,
        "why": "Containment limits further communication and spread. Preserve useful evidence and follow the incident plan rather than erasing the system before assessment."
      },
      {
        "prompt": "Why should a backup recovery test include checking the restore point for compromise?",
        "options": [
          "A successful file copy proves the attacker is gone",
          "Restoring data automatically patches all vulnerabilities",
          "A backup may contain malware or attacker persistence",
          "Every backup is automatically clean once encrypted"
        ],
        "answer": 2,
        "why": "Recover from a verified clean point and address the original access and persistence. A backup protects recovery capability but is not proof of a clean environment."
      }
    ],
    "activity": {
      "title": "Connect malware behavior to response",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Ransomware",
        "Data exfiltration",
        "Containment",
        "Clean recovery"
      ],
      "items": [
        [
          "Unauthorized software encrypts a team share and demands payment.",
          0,
          "The behavior denies access to extort the organization."
        ],
        [
          "A process copies customer records to an unapproved external host.",
          1,
          "Sensitive information is leaving the controlled environment."
        ],
        [
          "The response team disconnects an affected host through EDR.",
          2,
          "Isolation limits further impact while investigation continues."
        ],
        [
          "Validated backups are restored after the intrusion path is addressed.",
          3,
          "Recovery includes restoring trustworthy operation, not just readable files."
        ]
      ]
    }
  },
  {
    "id": "viruses-and-worms",
    "title": "Viruses and Worms",
    "objective": "2.4",
    "duration": "5:54",
    "slug": "viruses-and-worms-sy0-701/",
    "recall": "How do host-dependent infection, autonomous propagation and memory-based execution differ?",
    "questions": [
      {
        "prompt": "An infected executable modifies other executable files when a user runs it. Which classification best fits?",
        "options": [
          "Network access control",
          "A certificate revocation check",
          "Virus",
          "Worm requiring no host program"
        ],
        "answer": 2,
        "why": "A virus attaches to a host such as an executable and runs with it. Its replication can depend on executing the infected host."
      },
      {
        "prompt": "A compromised service automatically scans for vulnerable peers and infects them without another person opening a file. What is the strongest classification?",
        "options": [
          "A backup snapshot",
          "Worm",
          "A macro virus that requires an opened document",
          "A harmless browser cookie"
        ],
        "answer": 1,
        "why": "A worm can replicate and propagate autonomously. Exploiting a reachable service can allow spread without repeated user interaction."
      },
      {
        "prompt": "An investigation finds malicious code running in memory through a trusted scripting interpreter, with no conventional malware executable on disk. What is the best conclusion?",
        "options": [
          "The behavior is consistent with a fileless attack",
          "No malicious activity is possible without an EXE file",
          "The interpreter is always safe because it is signed",
          "Disk encryption prevents all memory execution"
        ],
        "answer": 0,
        "why": "Fileless techniques can use memory and legitimate tools. Process behavior, scripting logs and memory evidence matter even when a standard executable is absent."
      },
      {
        "prompt": "Which combination most directly limits a worm exploiting an unpatched network service?",
        "options": [
          "Increase the desktop wallpaper resolution",
          "Rely only on users avoiding document macros",
          "Disable all network logging",
          "Patch the service and restrict unnecessary connectivity"
        ],
        "answer": 3,
        "why": "Patching removes a known exploitable flaw; segmentation and filtering limit reachable targets. Awareness alone does not stop autonomous service exploitation."
      },
      {
        "prompt": "A user reports that an installer was signed, but EDR observed suspicious child processes. What should the analyst do?",
        "options": [
          "Disable EDR because it disagreed with the signature",
          "Treat all signed installers as worms",
          "Investigate the behavior and validate the signer and file provenance",
          "Assume any signed process cannot be malicious"
        ],
        "answer": 2,
        "why": "A signature is one trust signal, not a guarantee of safe behavior. Stolen signing keys, malicious signed software and legitimate tools can still be involved in an attack."
      },
      {
        "prompt": "A worm stops reaching other subnets after firewall changes, but the original host remains compromised. What did the firewall primarily achieve?",
        "options": [
          "It proved that no other hosts were infected",
          "It reduced propagation paths without cleaning the host",
          "It removed all persistence from the original host",
          "It converted the worm into a virus"
        ],
        "answer": 1,
        "why": "Network restrictions can contain spread. Endpoint investigation, eradication and validation are still required, including checking whether spread occurred before containment."
      }
    ],
    "activity": {
      "title": "Identify how the infection operates",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Virus",
        "Worm",
        "Fileless technique",
        "Propagation control"
      ],
      "items": [
        [
          "Malicious code attaches to a program that the user executes.",
          0,
          "The host program carries and activates the infection."
        ],
        [
          "Malware exploits peers and copies itself without new user actions.",
          1,
          "Autonomous propagation is characteristic of a worm."
        ],
        [
          "A trusted interpreter executes malicious instructions in memory.",
          2,
          "The attack need not rely on a conventional executable file."
        ],
        [
          "An ACL blocks an unnecessary service between workstation segments.",
          3,
          "Reducing reachable targets can slow or prevent further spread."
        ]
      ]
    }
  },
  {
    "id": "spyware-and-bloatware",
    "title": "Spyware and Bloatware",
    "objective": "2.4",
    "duration": "4:21",
    "slug": "spyware-and-bloatware-sy0-701/",
    "recall": "What separates covert surveillance from unwanted software that consumes resources?",
    "questions": [
      {
        "prompt": "A browser extension silently collects browsing history and sends it to a third party. What behavior is most directly demonstrated?",
        "options": [
          "A clean backup restore",
          "A collision-resistant hash",
          "An authorized vulnerability assessment",
          "Spyware"
        ],
        "answer": 3,
        "why": "Covert monitoring and collection support spyware. Evaluate permissions and data flows; an extension being available in a store does not establish that its behavior is appropriate."
      },
      {
        "prompt": "A new laptop includes unused trial programs that slow startup but show no evidence of covert monitoring. What is the best description?",
        "options": [
          "A worm because several applications are installed",
          "Ransomware because storage is consumed",
          "Bloatware, pending any further evidence of malicious behavior",
          "Confirmed spyware solely because startup is slow"
        ],
        "answer": 2,
        "why": "Bloatware is unnecessary or unwanted software that adds overhead. It can increase exposure, but resource use alone does not establish spying, replication or extortion."
      },
      {
        "prompt": "What is the best enterprise approach to unnecessary preinstalled software?",
        "options": [
          "Give every user permanent administrative rights to experiment",
          "Remove unneeded applications through an approved baseline and deployment process",
          "Keep all bundled software because it was factory-installed",
          "Remove the endpoint agent to free resources first"
        ],
        "answer": 1,
        "why": "A supported clean baseline reduces unnecessary software, resource use and attack surface. Validate removal and dependencies rather than making uncontrolled changes."
      },
      {
        "prompt": "An employee installed a free utility that requests access to all browser data. What should IT evaluate first?",
        "options": [
          "Whether those permissions and data collection are necessary and authorized",
          "Whether the utility has the shortest name",
          "Whether the download icon is attractive",
          "Whether a low price proves it is safe"
        ],
        "answer": 0,
        "why": "Compare requested access with the business purpose and privacy requirements. A free or familiar application can still request excessive access or collect sensitive data."
      }
    ],
    "activity": {
      "title": "Separate surveillance from unnecessary software",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Spyware",
        "Bloatware",
        "Least privilege",
        "Standard image"
      ],
      "items": [
        [
          "An application secretly uploads a user’s browsing activity.",
          0,
          "The issue is unauthorized surveillance and collection."
        ],
        [
          "Unused vendor utilities consume memory without serving a business purpose.",
          1,
          "Unnecessary software adds overhead and potentially more exposed components."
        ],
        [
          "A browser extension receives only the permissions its approved job needs.",
          2,
          "Restricting permissions reduces what misuse can expose."
        ],
        [
          "IT deploys a validated operating-system build without unnecessary trial apps.",
          3,
          "A consistent approved image improves control over installed software."
        ]
      ]
    }
  },
  {
    "id": "other-malware-types",
    "title": "Other Malware Types",
    "objective": "2.4",
    "duration": "7:32",
    "slug": "other-malware-types-sy0-701/",
    "recall": "Can you distinguish keylogging, conditional activation, disguised software and concealed privileged access?",
    "questions": [
      {
        "prompt": "An apparently useful invoice utility secretly installs a remote-control payload. What is the most specific delivery classification?",
        "options": [
          "Trojan",
          "A worm solely because it provides remote access",
          "A security baseline",
          "A read-only audit log"
        ],
        "answer": 0,
        "why": "A Trojan masquerades as legitimate software. Remote access describes a capability; it does not by itself prove autonomous replication."
      },
      {
        "prompt": "A malicious routine activates only when a particular employee account is removed. What best describes that trigger mechanism?",
        "options": [
          "DNSSEC validation",
          "Load balancing",
          "A random hash collision",
          "Logic bomb"
        ],
        "answer": 3,
        "why": "A logic bomb waits for a specified condition, such as a date or account event. The trigger distinguishes it from continuous execution."
      },
      {
        "prompt": "An attacker captures everything typed into a payroll portal. Which malware capability is directly involved?",
        "options": [
          "Certificate stapling",
          "VLAN tagging",
          "Keylogging",
          "Database sharding"
        ],
        "answer": 2,
        "why": "A keylogger records keystrokes and can capture credentials or other sensitive input. It may be software or a physical device."
      },
      {
        "prompt": "The operating system hides a suspicious driver and gives inconsistent process listings. Which threat should investigators consider?",
        "options": [
          "A benign document template by definition",
          "A rootkit concealing privileged malicious activity",
          "An ordinary password expiry notice",
          "A failed SPF record"
        ],
        "answer": 1,
        "why": "Rootkits can alter system behavior and conceal components. Tools running inside a compromised OS may be unreliable; trusted external investigation can be necessary."
      },
      {
        "prompt": "EDR reports a cryptocurrency miner running on an application server without approval. What is the primary abuse?",
        "options": [
          "Unauthorized consumption of computing resources",
          "Proof the server’s TLS certificates were revoked",
          "Guaranteed encryption of every business file",
          "A required operating-system update"
        ],
        "answer": 0,
        "why": "Cryptomining malware uses CPU, GPU or cloud resources for someone else’s benefit. High utilization is a symptom to investigate, not proof on its own."
      },
      {
        "prompt": "A workstation has a backdoor that bypasses the normal sign-in process. Which recovery goal is essential?",
        "options": [
          "Change only the desktop theme",
          "Assume a reboot always removes persistent malware",
          "Publish the backdoor credentials for troubleshooting",
          "Remove the unauthorized access and verify it cannot re-establish persistence"
        ],
        "answer": 3,
        "why": "A backdoor provides an unauthorized route into the system. Recovery must address persistence and the initial compromise, not merely stop one running process."
      }
    ],
    "activity": {
      "title": "Classify distinctive malware behavior",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Keylogger",
        "Logic bomb",
        "Rootkit",
        "Trojan"
      ],
      "items": [
        [
          "A component records the characters entered at the keyboard.",
          0,
          "Keylogging can expose passwords and other private input."
        ],
        [
          "A malicious task waits until a specific date to delete records.",
          1,
          "Conditional activation is the defining feature here."
        ],
        [
          "A privileged component conceals malicious files from normal tools.",
          2,
          "Rootkits try to hide activity and maintain control."
        ],
        [
          "A program advertised as a legitimate helper secretly installs malware.",
          3,
          "The deceptive packaging makes it a Trojan."
        ]
      ]
    }
  },
  {
    "id": "physical-attacks",
    "title": "Physical Attacks",
    "objective": "2.4",
    "duration": "4:04",
    "slug": "physical-attacks-sy0-701/",
    "recall": "How can forced access, copied credentials and environmental disruption defeat physical safeguards?",
    "questions": [
      {
        "prompt": "An intruder physically breaks a locked equipment-cabinet latch. Which attack best describes the action?",
        "options": [
          "A cryptographic downgrade",
          "Physical brute force",
          "Password spraying",
          "DNS poisoning"
        ],
        "answer": 1,
        "why": "The attacker defeats a physical barrier through force. This differs from repeatedly guessing a digital secret."
      },
      {
        "prompt": "An attacker copies a vulnerable employee badge’s RFID identifier and presents the copy at a reader. What is the attack?",
        "options": [
          "RFID cloning",
          "Certificate renewal",
          "Disk sanitization",
          "Application allowlisting"
        ],
        "answer": 0,
        "why": "A copied badge credential can be presented as if it were the original. Stronger credential technology and verification can reduce the risk."
      },
      {
        "prompt": "Someone disables cooling to make a server room overheat. What is the primary attack category?",
        "options": [
          "A SQL injection against an application form",
          "A digital-signature forgery by definition",
          "A routine capacity-planning test",
          "Environmental attack affecting availability"
        ],
        "answer": 3,
        "why": "Environmental systems such as cooling and power support availability. Protecting only logical access leaves these physical dependencies exposed."
      },
      {
        "prompt": "A facility confirms that a lost badge was copied. What is the best immediate access-control response?",
        "options": [
          "Assume possession of any badge proves identity",
          "Increase the radio range of every reader",
          "Revoke the affected credential and investigate its use",
          "Issue an identical replacement while leaving the old identifier valid"
        ],
        "answer": 2,
        "why": "Revocation stops future acceptance of the compromised identifier where supported. Audit activity and verify identity rather than preserving a known exposed credential."
      }
    ],
    "activity": {
      "title": "Match attacks and immediate physical responses",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Physical brute force",
        "RFID cloning",
        "Environmental attack",
        "Credential revocation"
      ],
      "items": [
        [
          "A cabinet is pried open to reach networking equipment.",
          0,
          "Force defeats the physical barrier."
        ],
        [
          "A duplicate contactless badge reuses another person’s identifier.",
          1,
          "The attacker has copied an access credential."
        ],
        [
          "Cooling equipment is sabotaged to interrupt computing services.",
          2,
          "The attack targets the system’s operating environment."
        ],
        [
          "A stolen badge is disabled in the access-control system.",
          3,
          "The defensive action removes that credential’s authorization."
        ]
      ]
    }
  },
  {
    "id": "denial-of-service",
    "title": "Denial of Service",
    "objective": "2.4",
    "duration": "6:07",
    "slug": "denial-of-service-sy0-701/",
    "recall": "Where is availability being exhausted, and where must mitigation happen to help?",
    "questions": [
      {
        "prompt": "Thousands of compromised devices flood one public service at once. Which description fits best?",
        "options": [
          "A private-key signing operation",
          "A data-classification exercise",
          "Distributed denial of service",
          "One authorized load-balancing cluster"
        ],
        "answer": 2,
        "why": "DDoS uses multiple sources to disrupt availability. Source count helps distinguish it from a single-source attack, but both can exhaust services."
      },
      {
        "prompt": "The internet link is saturated before traffic reaches the organization’s firewall. What mitigation is most useful?",
        "options": [
          "A new file naming convention",
          "Upstream filtering or a provider’s DDoS scrubbing service",
          "An ACL applied only after the already-saturated link",
          "A longer Wi-Fi password on an unrelated office network"
        ],
        "answer": 1,
        "why": "Traffic must be reduced before the constrained link. A downstream control may protect hosts but cannot recover upstream bandwidth that is already consumed."
      },
      {
        "prompt": "A small forged-source request causes a much larger reply to be sent to a victim. Which two mechanisms are involved?",
        "options": [
          "Reflection and amplification",
          "Encryption and tokenization",
          "Hashing and non-repudiation",
          "Segmentation and clean recovery"
        ],
        "answer": 0,
        "why": "Reflection directs replies to the spoofed source; amplification increases response size relative to the request. They are related but distinct properties."
      },
      {
        "prompt": "A public web endpoint performs an expensive report calculation for each request. An attacker exhausts CPU using a modest request rate. What is the best characterization?",
        "options": [
          "Only a physical cable fault can cause this pattern",
          "A DNS registration transfer",
          "A password-hash collision",
          "Application-layer resource exhaustion"
        ],
        "answer": 3,
        "why": "DoS can target application logic instead of just bandwidth. Rate limits, request validation and resource controls should address the expensive operation."
      },
      {
        "prompt": "A change error creates a network loop and takes services offline. What should analysts conclude?",
        "options": [
          "The incident must be a nation-state intrusion",
          "The loop confirms that customer data was stolen",
          "Availability failed, but malicious intent has not been established",
          "Every outage proves an intentional DoS attack"
        ],
        "answer": 2,
        "why": "A denial of service can result from faults or mistakes as well as attacks. Establish cause from evidence instead of treating an outage as proof of an adversary."
      },
      {
        "prompt": "Why is adding server capacity alone an incomplete DDoS strategy?",
        "options": [
          "Capacity planning makes monitoring unnecessary",
          "The bottleneck may be bandwidth, state tables or an application dependency",
          "More servers automatically block spoofed traffic",
          "DDoS cannot affect cloud services"
        ],
        "answer": 1,
        "why": "More compute can help only some constraints. Defense needs to consider the full path, upstream support and what resource is actually being exhausted."
      }
    ],
    "activity": {
      "title": "Identify the denial-of-service mechanism",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "DDoS",
        "Reflection",
        "Amplification",
        "Application-layer DoS"
      ],
      "items": [
        [
          "Many remote devices simultaneously overwhelm a service.",
          0,
          "Distributed sources contribute to the disruption."
        ],
        [
          "A server sends its reply to the spoofed victim address.",
          1,
          "The response is reflected toward the victim."
        ],
        [
          "A short query produces a much larger response.",
          2,
          "The size difference magnifies traffic volume."
        ],
        [
          "Repeated expensive searches exhaust the web application’s worker pool.",
          3,
          "The constrained resource is application processing capacity."
        ]
      ]
    }
  },
  {
    "id": "dns-attacks",
    "title": "DNS Attacks",
    "objective": "2.4",
    "duration": "8:57",
    "slug": "dns-attacks-sy0-701/",
    "recall": "Did the attacker corrupt a cached answer, take over domain management, or exploit a look-alike name?",
    "questions": [
      {
        "prompt": "A recursive resolver caches a forged address for a legitimate domain. What attack is most directly shown?",
        "options": [
          "An authorized registrar renewal",
          "A clean zone transfer",
          "A backup rotation",
          "DNS cache poisoning"
        ],
        "answer": 3,
        "why": "The resolver stores a false answer and may supply it to later clients. Domain registration ownership need not change for cache poisoning to occur."
      },
      {
        "prompt": "An attacker uses a stolen registrar account to change a company domain’s nameservers. What is the most specific classification?",
        "options": [
          "A normal local DNS-cache expiry",
          "A file-integrity baseline",
          "Domain hijacking",
          "A browser-only display issue"
        ],
        "answer": 2,
        "why": "Control of domain registration or DNS management can redirect resolution for many users. Strong registrar authentication and change controls help protect that authority."
      },
      {
        "prompt": "A fraudulent site uses a misspelled version of a familiar company’s domain. Which technique is emphasized?",
        "options": [
          "A legitimate DNSSEC key rollover",
          "Typosquatting",
          "A hash collision",
          "A network worm"
        ],
        "answer": 1,
        "why": "A look-alike name exploits user mistakes or confusion. It is different from altering answers for the real company’s domain."
      },
      {
        "prompt": "What does validating DNSSEC primarily add to a DNS answer?",
        "options": [
          "Authentication of signed DNS data and integrity checking",
          "Confidentiality for every DNS query",
          "A guarantee that the destination website is honest",
          "Automatic endpoint malware removal"
        ],
        "answer": 0,
        "why": "DNSSEC validates signed DNS records and their trust chain. It does not encrypt DNS traffic or certify the business intent of the website."
      },
      {
        "prompt": "A workstation resolves a domain incorrectly even after switching to a known-good resolver. Its hosts file contains an unauthorized entry. What best explains the result?",
        "options": [
          "The registrar must have transferred the domain",
          "All public resolvers share the same poisoned cache",
          "DNSSEC decrypts the hosts file",
          "Local name-resolution manipulation can override the expected lookup"
        ],
        "answer": 3,
        "why": "A local hosts-file entry can affect resolution independently of the chosen DNS server. Investigate endpoint configuration as well as upstream DNS."
      },
      {
        "prompt": "After a DNS redirection incident, why must investigators also assess sessions and credentials?",
        "options": [
          "A DNS change cannot affect confidentiality",
          "Only DNS servers can record authentication attempts",
          "Users may have authenticated to an attacker-controlled destination",
          "Repairing a DNS entry revokes all stolen credentials automatically"
        ],
        "answer": 2,
        "why": "Restoring correct resolution addresses routing but not any credential theft or session exposure that occurred during the redirection."
      }
    ],
    "activity": {
      "title": "Locate the manipulated naming layer",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Cache poisoning",
        "Domain hijacking",
        "Typosquatting",
        "DNSSEC"
      ],
      "items": [
        [
          "A resolver stores an attacker-supplied answer for a legitimate name.",
          0,
          "A cached false record can misdirect later lookups."
        ],
        [
          "A stolen registrar login is used to change authoritative nameservers.",
          1,
          "Control of domain management has been taken over."
        ],
        [
          "A deceptive domain substitutes one letter in a trusted brand name.",
          2,
          "The attacker relies on a look-alike name."
        ],
        [
          "A resolver validates a DNS record’s digital signature chain.",
          3,
          "Signature validation checks authenticity and integrity, not secrecy."
        ]
      ]
    }
  },
  {
    "id": "wireless-attacks",
    "title": "Wireless Attacks",
    "objective": "2.4",
    "duration": "7:55",
    "slug": "wireless-attacks-sy0-701/",
    "recall": "What distinguishes a rogue access point, an evil twin, deauthentication and radio interference?",
    "questions": [
      {
        "prompt": "An employee connects an unauthorized wireless access point to the office LAN. What is it?",
        "options": [
          "Rogue access point",
          "An evil twin only if it has a different SSID",
          "An approved jump server",
          "A cryptographic salt"
        ],
        "answer": 0,
        "why": "A rogue AP is unauthorized. It need not impersonate another SSID or be installed by an external attacker to introduce risk."
      },
      {
        "prompt": "An attacker broadcasts the coffee shop’s SSID and presents a fake sign-in page to nearby users. Which description is most precise?",
        "options": [
          "A legitimate AP solely because the SSID matches",
          "A DNSSEC resolver",
          "An encrypted backup",
          "Evil twin"
        ],
        "answer": 3,
        "why": "An evil twin impersonates a trusted wireless network to attract clients. A familiar network name does not prove who operates it."
      },
      {
        "prompt": "Clients repeatedly receive forged disconnect management frames on a vulnerable wireless network. Which attack is indicated?",
        "options": [
          "A certificate revocation request",
          "A password manager rotation",
          "Deauthentication attack",
          "A rootkit modifying the kernel"
        ],
        "answer": 2,
        "why": "Forged deauthentication or disassociation frames can interrupt wireless sessions where protection is absent or insufficient."
      },
      {
        "prompt": "Which control specifically helps defend supported Wi-Fi connections against forged deauthentication frames?",
        "options": [
          "Using a shorter network name",
          "Protected Management Frames",
          "Increasing DHCP lease duration",
          "Disabling all certificate validation"
        ],
        "answer": 1,
        "why": "PMF protects certain management frames on supported, properly configured connections. It does not eliminate RF jamming or every wireless threat."
      },
      {
        "prompt": "A transmitter overwhelms the local radio channel with interference. Why may stronger Wi-Fi encryption fail to restore availability?",
        "options": [
          "Encryption does not stop physical-layer RF interference",
          "Encryption increases the attacker’s legal authorization",
          "Every RF disturbance is a DNS attack",
          "Changing the SSID removes interference from the spectrum"
        ],
        "answer": 0,
        "why": "Jamming disrupts use of the radio medium. Spectrum investigation and physical response address a different layer from protecting data contents."
      },
      {
        "prompt": "A staff laptop connects to enterprise Wi-Fi but warns that the authentication server’s certificate is untrusted. What is the best action?",
        "options": [
          "Accept any certificate if the SSID is correct",
          "Disable validation permanently to improve roaming",
          "Share the account password with the access-point operator",
          "Stop and verify the server identity and configured trust before connecting"
        ],
        "answer": 3,
        "why": "Validating the authentication server helps prevent credential exposure to impersonated infrastructure. The SSID and signal strength are not sufficient proof of trust."
      }
    ],
    "activity": {
      "title": "Recognize the wireless attack from its evidence",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Rogue AP",
        "Evil twin",
        "Deauthentication",
        "RF jamming"
      ],
      "items": [
        [
          "An unapproved access point is plugged into a corporate switch.",
          0,
          "The defining issue is unauthorized infrastructure."
        ],
        [
          "A fake hotspot impersonates the organization’s network name.",
          1,
          "The goal is to attract users by copying a trusted network identity."
        ],
        [
          "Forged disconnect frames force vulnerable clients off a network.",
          2,
          "The attack abuses wireless management signaling."
        ],
        [
          "A transmitter floods the channel with disruptive interference.",
          3,
          "The attacker is denying use of the radio medium."
        ]
      ]
    }
  },
  {
    "id": "on-path-attacks",
    "title": "On-path Attacks",
    "objective": "2.4",
    "duration": "5:30",
    "slug": "on-path-attacks-sy0-701/",
    "recall": "How does an attacker positioned between communicating systems read or alter their traffic?",
    "questions": [
      {
        "prompt": "A device secretly relays traffic between a user and a service, inspecting or changing it along the way. Which attack is most directly described?",
        "options": [
          "A scheduled vulnerability scan",
          "On-path attack",
          "Offline brute force against a password database",
          "A backup-integrity check"
        ],
        "answer": 1,
        "why": "An on-path attacker interposes in the communication path. Relaying can hide the interception from the endpoints if trust checks fail."
      },
      {
        "prompt": "A workstation accepts a forged ARP mapping that points the default gateway’s IP address to an attacker’s MAC address. What is the immediate risk?",
        "options": [
          "Traffic may be redirected through the attacker on the local network",
          "The public domain registration is automatically transferred",
          "Every TLS private key is automatically revealed",
          "ARP encrypts the redirected packets"
        ],
        "answer": 0,
        "why": "ARP manipulation can change local forwarding. Correctly validated end-to-end encryption can still protect contents; redirecting packets alone does not reveal every key."
      },
      {
        "prompt": "Which client behavior most directly undermines HTTPS protection during an on-path attack?",
        "options": [
          "Validating the server certificate against the intended name",
          "Using a supported TLS version",
          "Rejecting unexpected authentication-server certificates",
          "Ignoring a certificate identity or trust warning"
        ],
        "answer": 3,
        "why": "An attacker may present an untrusted or wrong-name certificate. Bypassing the warning removes a key check that should prevent trusting the impersonator."
      },
      {
        "prompt": "A packet capture shows traffic crossing an untrusted network. Does that alone prove the attacker can read HTTPS application contents?",
        "options": [
          "Yes; certificate validation only changes the browser’s icon",
          "No; encrypted packets reveal no metadata of any kind",
          "No; properly validated TLS can keep the application contents encrypted",
          "Yes; routing access always reveals every plaintext message"
        ],
        "answer": 2,
        "why": "Being on the route can reveal metadata and enable disruption, but does not automatically defeat TLS confidentiality. Encryption does not hide every connection property."
      }
    ],
    "activity": {
      "title": "Connect interception techniques and protections",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "On-path interception",
        "ARP poisoning",
        "Certificate validation",
        "End-to-end encryption"
      ],
      "items": [
        [
          "An intermediary relays a conversation while attempting to alter it.",
          0,
          "The attacker sits between communicating parties."
        ],
        [
          "A forged local address mapping sends gateway traffic to the wrong MAC.",
          1,
          "ARP poisoning manipulates local link-layer resolution."
        ],
        [
          "A client rejects a certificate issued for a different hostname.",
          2,
          "The client checks that the presented identity matches the intended service."
        ],
        [
          "Only the communicating application endpoints hold the keys to readable content.",
          3,
          "Proper cryptographic protection can preserve confidentiality across untrusted transit."
        ]
      ]
    }
  },
  {
    "id": "replay-attacks",
    "title": "Replay Attacks",
    "objective": "2.4",
    "duration": "5:45",
    "slug": "replay-attacks-sy0-701/",
    "recall": "What stops captured authentication data from being accepted as a fresh request?",
    "questions": [
      {
        "prompt": "An attacker records a valid authentication message and resends it unchanged later. What is the attack?",
        "options": [
          "A physical brute-force entry",
          "A baseline configuration review",
          "Replay",
          "A hash collision generated from two new inputs"
        ],
        "answer": 2,
        "why": "Replay reuses previously valid communication. The attacker may not need to decrypt or understand the captured message if the receiver accepts it again."
      },
      {
        "prompt": "A server issues a fresh unpredictable challenge for each authentication attempt and rejects reused challenges. What security property is it strengthening?",
        "options": [
          "Automatic removal of rootkits",
          "Freshness and replay resistance",
          "Permanent secrecy of all network metadata",
          "Guaranteed physical security"
        ],
        "answer": 1,
        "why": "A one-time challenge binds the response to a particular exchange. The receiver must validate freshness and prevent reuse; merely including a number is not enough."
      },
      {
        "prompt": "An attacker authenticates using a stolen password hash without first recovering the plaintext password. Which technique fits?",
        "options": [
          "Pass the hash",
          "Typosquatting",
          "DNS amplification",
          "Authorized password reset"
        ],
        "answer": 0,
        "why": "Some authentication mechanisms can accept proof based on a captured hash. Hashing passwords does not make captured credential material universally unusable."
      },
      {
        "prompt": "A stolen web session cookie lets an attacker continue an authenticated session. What is the most direct risk?",
        "options": [
          "A guaranteed collision in the cookie’s hash",
          "An automatic domain registration transfer",
          "RF jamming",
          "Session hijacking"
        ],
        "answer": 3,
        "why": "A valid session token can act as a bearer credential. Protect it in transit and storage, and invalidate exposed sessions as part of response."
      },
      {
        "prompt": "Why might simply encrypting a recorded message fail to prevent replay in a poorly designed protocol?",
        "options": [
          "Nonces are only useful for disk backups",
          "Replay requires breaking the encryption algorithm first",
          "The receiver may accept the same valid ciphertext more than once",
          "Encryption always publishes the plaintext"
        ],
        "answer": 2,
        "why": "Confidentiality alone does not establish freshness. Protocols need appropriate nonces, sequence checks or other validated anti-replay mechanisms."
      },
      {
        "prompt": "A session token is confirmed stolen. Which action directly addresses continued use of that token?",
        "options": [
          "Keep the session active to avoid inconvenience",
          "Revoke the affected session and require fresh authentication",
          "Only rename the user’s desktop shortcut",
          "Assume changing a password always invalidates every existing token"
        ],
        "answer": 1,
        "why": "Session revocation addresses the exposed token. Password changes and session invalidation are separate operations in many systems and both may be needed."
      }
    ],
    "activity": {
      "title": "Identify what was captured and reused",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Replay",
        "Nonce / challenge",
        "Pass the hash",
        "Session hijacking"
      ],
      "items": [
        [
          "A recorded valid response is sent again in a later exchange.",
          0,
          "Previously captured material is being reused."
        ],
        [
          "A fresh unpredictable value must be answered once and cannot be reused.",
          1,
          "Validated one-time challenges help establish freshness."
        ],
        [
          "Stolen hash material is used to authenticate without recovering a password.",
          2,
          "The credential representation itself supports the attack."
        ],
        [
          "A captured session cookie is used to act within an existing login.",
          3,
          "The attacker takes over an authenticated session."
        ]
      ]
    }
  },
  {
    "id": "malicious-code",
    "title": "Malicious Code",
    "objective": "2.4",
    "duration": "3:40",
    "slug": "malicious-code-sy0-701/",
    "recall": "How can scripts and trusted interpreters become part of an attack?",
    "questions": [
      {
        "prompt": "An invoice document asks a user to enable a macro that launches a shell and downloads an unknown payload. What should the user do?",
        "options": [
          "Enable the macro because invoices always require scripts",
          "Allow it because a trusted shell executable is used",
          "Forward it to all staff so they can test it",
          "Stop and report the suspicious document through the approved process"
        ],
        "answer": 3,
        "why": "The requested execution and download chain is suspicious. A legitimate interpreter can execute malicious instructions; its presence does not establish authorization."
      },
      {
        "prompt": "Why do defenders monitor scripting tools that administrators also use legitimately?",
        "options": [
          "A trusted tool cannot write files or contact a network",
          "Monitoring automatically grants scripts additional permissions",
          "Attackers can misuse trusted interpreters for unauthorized actions",
          "Every script is necessarily malware"
        ],
        "answer": 2,
        "why": "Intent and behavior matter. Scripts can be useful administration tools or attack components, so assess provenance, execution context and effects."
      },
      {
        "prompt": "A web page causes a browser to execute attacker-supplied JavaScript in another site’s security context. Which area should be investigated?",
        "options": [
          "A necessary consequence of all HTTPS sessions",
          "Malicious script execution in the application or browser context",
          "Only a faulty cooling fan",
          "A planned badge renewal"
        ],
        "answer": 1,
        "why": "Malicious scripts can run in browsers as well as operating-system shells. Authentication, data access and the application’s handling of untrusted content need review."
      },
      {
        "prompt": "Which policy most directly reduces unnecessary script execution without banning all administration?",
        "options": [
          "Restrict approved execution paths and privileges, and log relevant activity",
          "Give all scripts administrator rights",
          "Turn off interpreter logging permanently",
          "Trust any command pasted from a website"
        ],
        "answer": 0,
        "why": "Use controlled administration and least privilege with monitoring. A blanket assumption that all scripts are safe or all scripts are forbidden misses the actual business requirement."
      }
    ],
    "activity": {
      "title": "Match code to its execution context",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Document macro",
        "Shell script",
        "Browser script",
        "Execution control"
      ],
      "items": [
        [
          "An office attachment contains code that runs when macros are enabled.",
          0,
          "Documents can carry active content, not just static text."
        ],
        [
          "A command interpreter runs a sequence of operating-system instructions.",
          1,
          "The instructions may be legitimate or malicious depending on their use."
        ],
        [
          "JavaScript executes inside a web page’s application context.",
          2,
          "Browser-executed code can affect sessions and page data."
        ],
        [
          "Policy restricts unapproved interpreters and unnecessary execution rights.",
          3,
          "Control where code runs and what it is allowed to do."
        ]
      ]
    }
  },
  {
    "id": "application-attacks",
    "title": "Application Attacks",
    "objective": "2.4",
    "duration": "11:48",
    "slug": "application-attacks-sy0-701/",
    "recall": "Which trust boundary is crossed: another user’s records, higher privilege, the file path, or executable input?",
    "questions": [
      {
        "prompt": "A standard user exploits a flaw to obtain administrator permissions. What is the clearest classification?",
        "options": [
          "Vertical privilege escalation",
          "Horizontal access at the same privilege level",
          "A DNS key rollover",
          "A read-only backup check"
        ],
        "answer": 0,
        "why": "Vertical escalation moves to higher privileges. Horizontal escalation involves another user’s resources at a similar privilege level."
      },
      {
        "prompt": "A user changes a record identifier and opens a colleague’s private record without gaining an administrator role. What does this most directly show?",
        "options": [
          "Vertical escalation must have occurred",
          "A cryptographic collision",
          "A radio-frequency attack",
          "Broken object-level authorization / horizontal access"
        ],
        "answer": 3,
        "why": "The server failed to enforce permission for the requested object. Hiding identifiers in the UI is insufficient; authorization must be checked for each request."
      },
      {
        "prompt": "A file download endpoint accepts a path that escapes the approved directory and reads an operating-system configuration file. Which attack fits?",
        "options": [
          "DNS amplification",
          "An authorized restore point",
          "Directory traversal",
          "Password spraying"
        ],
        "answer": 2,
        "why": "Traversal manipulates path handling to reach files outside the intended location. Use safe path construction and enforce the allowed directory boundary."
      },
      {
        "prompt": "A field intended as search data is interpreted as part of a database command. Which weakness is being exploited?",
        "options": [
          "A routine certificate renewal",
          "Injection caused by mixing untrusted data with executable syntax",
          "Physical tailgating",
          "A wireless deauthentication frame"
        ],
        "answer": 1,
        "why": "Injection crosses a data/code boundary. Parameterized database queries keep values separate from query structure; validation is useful but does not replace that separation."
      },
      {
        "prompt": "A web application sends a location in an unvalidated input directly into an operating-system command. What is the key risk?",
        "options": [
          "Command injection in the server’s execution context",
          "A guarantee that only the browser can be affected",
          "A necessary DNSSEC operation",
          "An automatic downgrade of the Wi-Fi cipher"
        ],
        "answer": 0,
        "why": "Untrusted data can alter a command if it is treated as executable syntax. Avoid unnecessary shell execution, use safe APIs and constrain privileges."
      },
      {
        "prompt": "A trusted application loads a malicious library from an attacker-writable location before its legitimate library. Which technique is illustrated?",
        "options": [
          "Credential revocation",
          "Disk mirroring",
          "An authorized password lockout",
          "DLL side-loading / search-order hijacking"
        ],
        "answer": 3,
        "why": "Unsafe library loading can let malicious code run inside a trusted process. Control search paths, permissions and approved components."
      },
      {
        "prompt": "An attacker resends a captured authenticated API operation and the server performs the same sensitive action again. What design gap is emphasized?",
        "options": [
          "Only a longer user password is needed",
          "The API must be using a worm",
          "Missing replay resistance or operation freshness checks",
          "Insufficient camera coverage at the data center"
        ],
        "answer": 2,
        "why": "Sensitive operations may need unique request identifiers, appropriate anti-replay checks and business validation. A previously valid request is not always safe to repeat."
      },
      {
        "prompt": "Which defense best addresses a user requesting another customer’s document by guessing its ID?",
        "options": [
          "Trust an owner ID supplied by the browser",
          "Check the authenticated user’s permission for that document on the server",
          "Use longer document IDs as the only protection",
          "Remove the document link from the menu only"
        ],
        "answer": 1,
        "why": "Object-level authorization belongs at the server. Unpredictable IDs can reduce guessing but do not establish permission, and client-controlled owner claims are untrusted."
      }
    ],
    "activity": {
      "title": "Find the violated application boundary",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Vertical escalation",
        "Horizontal escalation",
        "Directory traversal",
        "Injection"
      ],
      "items": [
        [
          "A regular account gains the ability to perform administrator-only actions.",
          0,
          "The account crossed to a higher privilege level."
        ],
        [
          "One customer reads a different customer’s records at the same role level.",
          1,
          "The missing check is access to another user’s objects."
        ],
        [
          "A manipulated path reaches files above the permitted download directory.",
          2,
          "The attacker crosses a filesystem path boundary."
        ],
        [
          "Input meant as data changes the structure of a backend command.",
          3,
          "The application treated untrusted data as executable syntax."
        ]
      ]
    }
  },
  {
    "id": "cryptographic-attacks",
    "title": "Cryptographic Attacks",
    "objective": "2.4",
    "duration": "9:31",
    "slug": "cryptographic-attacks-sy0-701/",
    "recall": "Is the attacker forcing weaker protection, removing it, or exploiting a hash property?",
    "questions": [
      {
        "prompt": "An attacker forces two systems to negotiate an obsolete, weaker protocol that both still support. Which attack is emphasized?",
        "options": [
          "A safe key escrow procedure",
          "Downgrade attack",
          "A successful secure upgrade",
          "A physical badge clone"
        ],
        "answer": 1,
        "why": "A downgrade pushes communication toward weaker supported protection. Disable obsolete options and enforce acceptable protocol and cipher requirements."
      },
      {
        "prompt": "An intermediary keeps a victim using HTTP while it uses HTTPS toward the real service. Which technique fits?",
        "options": [
          "SSL stripping",
          "DNSSEC signing",
          "Disk encryption",
          "Certificate stapling"
        ],
        "answer": 0,
        "why": "Stripping removes HTTPS protection from the victim-facing leg. Secure HTTPS-only design and HSTS can help address this class of attack."
      },
      {
        "prompt": "Two different files produce the same digest under a hash algorithm. What has occurred?",
        "options": [
          "A private key was necessarily recovered",
          "The files must be identical",
          "The hash has encrypted both files",
          "A hash collision"
        ],
        "answer": 3,
        "why": "A collision means distinct inputs share a hash output. It does not mean the files are identical or that hashing encrypted them."
      },
      {
        "prompt": "What distinguishes a birthday attack against a hash from finding a preimage for one specified digest?",
        "options": [
          "A birthday attack only concerns calendar software",
          "A preimage attack always changes DNS registration",
          "The birthday attack seeks any colliding pair rather than one chosen digest’s input",
          "Both require recovering a TLS private key first"
        ],
        "answer": 2,
        "why": "The birthday effect makes finding any collision a different problem from finding an input for a particular target digest. Strong algorithms and suitable output lengths matter."
      },
      {
        "prompt": "A server supports an old protocol only for a rarely used legacy client. Why is that still a concern?",
        "options": [
          "Changing the certificate logo removes the risk",
          "The weaker option may remain an available downgrade path",
          "Rare use makes protocol flaws impossible to exploit",
          "The legacy setting strengthens every modern connection"
        ],
        "answer": 1,
        "why": "Supported fallback options remain part of the attack surface. Plan compatible modernization or isolation instead of assuming rarity eliminates exposure."
      },
      {
        "prompt": "A valid HTTPS connection ends at a malicious site with its own legitimate certificate. What does the certificate establish?",
        "options": [
          "The connection is protected to that domain; it does not guarantee honest content",
          "Every offer on the website is legitimate",
          "The site cannot host malware",
          "The operator has passed a universal criminal-background check"
        ],
        "answer": 0,
        "why": "TLS authenticates the certificate’s domain identity under its trust model and protects transport. A malicious operator can also obtain a certificate for a domain it controls."
      }
    ],
    "activity": {
      "title": "Distinguish attacks on transport and hashes",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Downgrade",
        "SSL stripping",
        "Hash collision",
        "Birthday attack"
      ],
      "items": [
        [
          "A connection is pushed onto a weaker supported protocol version.",
          0,
          "The negotiation ends with less secure protection."
        ],
        [
          "HTTPS is removed from the victim-facing part of a relayed connection.",
          1,
          "The client loses the expected transport protection."
        ],
        [
          "Different messages produce the same message digest.",
          2,
          "Distinct inputs have the same hash output."
        ],
        [
          "An attacker searches many candidates for any two matching digests.",
          3,
          "The target is a colliding pair rather than a specified digest’s preimage."
        ]
      ]
    }
  },
  {
    "id": "password-attacks",
    "title": "Password Attacks",
    "objective": "2.4",
    "duration": "7:15",
    "slug": "password-attacks-sy0-701/",
    "recall": "How do spraying, exhaustive guessing, reused breached credentials and offline cracking differ?",
    "questions": [
      {
        "prompt": "A source tries one common password against hundreds of different accounts. Which attack is most specific?",
        "options": [
          "Directory traversal",
          "A DNS zone transfer",
          "Password spraying",
          "A single-account exhaustive brute force"
        ],
        "answer": 2,
        "why": "Spraying distributes a small password set across many accounts, often to avoid per-account thresholds. Cross-account monitoring can still detect it."
      },
      {
        "prompt": "An attacker tests many different password candidates against one account. Which attack pattern is emphasized?",
        "options": [
          "A collision-resistant digital signature",
          "Brute-force guessing",
          "Credential stuffing only because there are many guesses",
          "RFID cloning"
        ],
        "answer": 1,
        "why": "Brute force or candidate guessing focuses on finding a valid password. The pattern differs from a small shared set used across many accounts."
      },
      {
        "prompt": "An attacker tries username-and-password pairs stolen from a different website against the company portal. What is this?",
        "options": [
          "Credential stuffing",
          "Password spraying with one shared candidate",
          "A fileless worm by definition",
          "Certificate revocation"
        ],
        "answer": 0,
        "why": "Credential stuffing exploits password reuse using already exposed credential pairs. Unique passwords and strong MFA reduce the chance those pairs are enough."
      },
      {
        "prompt": "Why do account lockout rules fail to stop guessing against a stolen hash database offline?",
        "options": [
          "All hash functions reveal plaintext immediately",
          "Offline guessing requires each account to approve it",
          "The database’s filename disables lockout",
          "The guesses are checked outside the live sign-in service"
        ],
        "answer": 3,
        "why": "Online rate limits and lockouts only govern requests reaching that service. Offline resistance depends on password strength and appropriate salted, costly password hashing."
      },
      {
        "prompt": "Two users with the same password have different stored password-hash values because each has a unique random salt. What does salting primarily achieve?",
        "options": [
          "It encrypts every authentication session",
          "It prevents all online spraying without other controls",
          "It limits reuse of precomputed work and identical-hash comparisons across users",
          "It makes weak passwords impossible to guess"
        ],
        "answer": 2,
        "why": "Unique salts make attackers do per-salt work and prevent simple same-password hash equality. A salt is not secret and does not replace strong passwords or a suitable password-hashing algorithm."
      },
      {
        "prompt": "Which monitoring approach best detects a low-and-slow password spray?",
        "options": [
          "Treat one successful MFA event as proof all failures are harmless",
          "Correlate failures across many accounts and time windows",
          "Inspect only accounts that have already locked out",
          "Disable collection of failed sign-in events"
        ],
        "answer": 1,
        "why": "An attack can stay below each account’s threshold while creating a broader pattern. Look across users, sources and time, then investigate successful access as well."
      }
    ],
    "activity": {
      "title": "Classify the credential-attack pattern",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Password spraying",
        "Brute force",
        "Credential stuffing",
        "Offline cracking"
      ],
      "items": [
        [
          "A few common passwords are tested across many usernames.",
          0,
          "The pattern spreads attempts across accounts."
        ],
        [
          "Numerous candidates are tried against one target account.",
          1,
          "The attacker searches for the correct secret."
        ],
        [
          "Previously breached credential pairs are reused on a different service.",
          2,
          "Password reuse is what makes the stolen pairs valuable."
        ],
        [
          "Captured password hashes are tested locally without contacting the login server.",
          3,
          "Live-service lockout limits do not control local computations."
        ]
      ]
    }
  },
  {
    "id": "indicators-of-compromise",
    "title": "Indicators of Compromise",
    "objective": "2.4",
    "duration": "10:59",
    "slug": "indicators-of-compromise-sy0-701/",
    "recall": "Which observations warrant investigation, and what evidence would confirm or weaken the hypothesis?",
    "questions": [
      {
        "prompt": "A user shows successful sign-ins from distant countries eight minutes apart. What is the best first interpretation?",
        "options": [
          "Definitive proof of a named attacker",
          "Proof MFA was disabled",
          "Always harmless because both sign-ins succeeded",
          "Suspicious impossible-travel evidence that needs context such as VPN use"
        ],
        "answer": 3,
        "why": "Geolocation and travel timing are useful signals, but VPNs, proxies and inaccurate location data can affect them. Correlate device, session and user context."
      },
      {
        "prompt": "A file-integrity monitor flags a changed system binary outside any approved change window. What should the analyst do?",
        "options": [
          "Assume every changed hash is malicious without review",
          "Overwrite all logs before examining the binary",
          "Validate the change against trusted evidence and investigate unauthorized modification",
          "Ignore it because the system still boots"
        ],
        "answer": 2,
        "why": "The changed hash shows a modification. Authorization, software updates, provenance and endpoint evidence determine whether it is expected or suspicious."
      },
      {
        "prompt": "A workstation sends unusually large outbound transfers to a new external destination after office hours. Which hypothesis deserves investigation?",
        "options": [
          "A physical badge-cloning event",
          "Possible data exfiltration",
          "Guaranteed proof of a DNSSEC failure",
          "A normal backup solely because it is after hours"
        ],
        "answer": 1,
        "why": "Volume, timing and destination are suspicious in context. Check process, user, authorized jobs and data involved; network volume alone does not prove theft."
      },
      {
        "prompt": "CPU use rises to 100% during an approved analytics job. How should this affect the incident assessment?",
        "options": [
          "The authorized workload is a plausible benign explanation to verify",
          "High CPU always proves cryptomining malware",
          "All monitoring should be disabled",
          "An account must have been stolen"
        ],
        "answer": 0,
        "why": "A deviation needs context. Correlating with a known workload can reduce suspicion, while unexpected behavior or persistence can still warrant investigation."
      },
      {
        "prompt": "A terminated employee’s account becomes active again without an approved request. What is the best response?",
        "options": [
          "Assume all account reactivations are routine",
          "Delete the audit trail so the user cannot see it",
          "Grant a new administrator role to test the account",
          "Investigate the reactivation and restrict access under the response procedure"
        ],
        "answer": 3,
        "why": "Unexpected access changes can signal misuse or process failure. Preserve account-change and sign-in evidence while addressing the access risk."
      },
      {
        "prompt": "Several security logs have unexplained gaps while a high-privilege session was active. What concern should be investigated?",
        "options": [
          "An automatic improvement in confidentiality",
          "A requirement to discard all remaining logs",
          "Possible log tampering or loss of visibility",
          "Proof that no suspicious actions occurred"
        ],
        "answer": 2,
        "why": "Missing logs can arise from faults or deliberate interference. Correlate collector health, configuration changes and independent sources rather than treating silence as proof of safety."
      },
      {
        "prompt": "Repeated account lockouts occur even though the user denies attempting to sign in. Which next step is most useful?",
        "options": [
          "Declare successful compromise from failures alone",
          "Correlate authentication sources and check for attack or stale stored credentials",
          "Assume the user is lying",
          "Permanently disable all lockout policies"
        ],
        "answer": 1,
        "why": "Failed authentication may reflect attacks or a service using an old password. Source, timing and success events help distinguish the possibilities."
      },
      {
        "prompt": "An EDR alert, an unusual child process and a new outbound connection share a timestamp. Why is this stronger than considering any one signal alone?",
        "options": [
          "Correlated independent evidence supports a more specific incident hypothesis",
          "Three alerts mathematically guarantee malicious intent",
          "All correlations identify the attacker’s nationality",
          "Multiple logs eliminate the need for preservation"
        ],
        "answer": 0,
        "why": "Related endpoint and network evidence can strengthen or challenge an interpretation. Correlation improves investigation but does not replace validation or establish attribution by itself."
      }
    ],
    "activity": {
      "title": "Connect signals with investigative hypotheses",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Impossible travel",
        "File-integrity change",
        "Possible exfiltration",
        "Potential log tampering"
      ],
      "items": [
        [
          "One account signs in from far-apart regions within an implausible travel interval.",
          0,
          "Check VPN, device and session context before concluding compromise."
        ],
        [
          "A protected binary’s hash differs from its trusted baseline.",
          1,
          "Identify what changed and whether it was authorized."
        ],
        [
          "Sensitive-file access is followed by a large unexplained external upload.",
          2,
          "Correlate data access, process activity and transfer evidence."
        ],
        [
          "Audit records disappear during a privileged session without an approved reason.",
          3,
          "Investigate both collection failures and intentional interference."
        ]
      ]
    }
  },
  {
    "id": "segmentation-and-access-control",
    "title": "Segmentation and Access Control",
    "objective": "2.5",
    "duration": "6:06",
    "slug": "segmentation-and-access-control-sy0-701/",
    "recall": "How do network boundaries, traffic rules and execution rules limit an attacker’s options?",
    "questions": [
      {
        "prompt": "Guest Wi-Fi must reach the internet but never internal file shares. Which design best enforces this?",
        "options": [
          "Separate the guest segment and enforce explicit traffic restrictions at its boundary",
          "Use a different SSID while bridging guests into the same unrestricted LAN",
          "Hide the file-server icon only",
          "Rely only on a sign asking guests not to connect"
        ],
        "answer": 0,
        "why": "Segmentation creates a boundary; ACLs or firewall rules enforce permitted flows. A different name alone does not establish isolation."
      },
      {
        "prompt": "Why does placing systems in different VLANs not by itself guarantee they cannot communicate?",
        "options": [
          "VLANs always disable all routing automatically",
          "Every VLAN uses the same administrator password",
          "VLAN tags encrypt application contents",
          "Inter-VLAN routing may still permit traffic unless policy restricts it"
        ],
        "answer": 3,
        "why": "VLANs separate broadcast domains, but routing can connect them. Enforce and test allowed communication at the relevant boundary."
      },
      {
        "prompt": "A server should accept database traffic only from the application tier. Which ACL is most appropriate?",
        "options": [
          "Allow every port from the entire internet",
          "Block logging while leaving all traffic allowed",
          "Allow the required application sources and port, then deny other unnecessary access",
          "Allow all internal addresses because they are trusted"
        ],
        "answer": 2,
        "why": "Define source, destination and required service according to the business flow. Internal location alone is not sufficient authorization."
      },
      {
        "prompt": "Only vetted applications may execute on a kiosk. Which policy directly matches this requirement?",
        "options": [
          "A warning on the desktop without enforcement",
          "Application allowlisting",
          "A denylist containing only one known malware filename",
          "A longer DHCP lease"
        ],
        "answer": 1,
        "why": "An allowlist permits approved software and rejects unapproved execution according to policy. A limited denylist cannot enforce an approved-only requirement."
      },
      {
        "prompt": "What is a limitation of blocking malicious software only by filename?",
        "options": [
          "An attacker can rename it, so stronger identity and behavior controls are needed",
          "A filename uniquely proves publisher authenticity",
          "Renaming always removes malicious code",
          "The policy becomes a digital signature automatically"
        ],
        "answer": 0,
        "why": "Filenames are weak identifiers. Appropriate publisher, hash, path and behavioral controls offer different tradeoffs and need sound configuration."
      },
      {
        "prompt": "A segmented design is deployed. Which validation is most useful?",
        "options": [
          "Test only whether internet browsing works",
          "Assume the diagram proves enforcement",
          "Temporarily allow all traffic and leave that rule in place",
          "Test both required business flows and prohibited cross-segment flows"
        ],
        "answer": 3,
        "why": "A useful policy must permit intended work and block unwanted access. Testing both positive and negative cases catches overly broad or disruptive rules."
      }
    ],
    "activity": {
      "title": "Match each boundary to its enforcement mechanism",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Segmentation",
        "Network ACL",
        "Application allowlist",
        "Application denylist"
      ],
      "items": [
        [
          "Guest devices and finance servers are placed behind separate enforced boundaries.",
          0,
          "Segmentation limits paths between trust zones."
        ],
        [
          "A rule permits TCP 443 from an approved source range to one service.",
          1,
          "The rule controls a specified network flow."
        ],
        [
          "A kiosk runs only approved signed applications.",
          2,
          "Approved-only execution is an allowlist approach."
        ],
        [
          "A policy blocks a set of identified prohibited executables.",
          3,
          "A denylist identifies what must not execute."
        ]
      ]
    }
  },
  {
    "id": "mitigation-techniques",
    "title": "Mitigation Techniques",
    "objective": "2.5",
    "duration": "6:51",
    "slug": "mitigation-techniques-sy0-701/",
    "recall": "Which safeguard addresses the immediate risk, and what additional work remains?",
    "questions": [
      {
        "prompt": "A service has a known remotely exploitable flaw and a tested vendor fix is available. Which action most directly addresses the flaw?",
        "options": [
          "Assume disk encryption fixes the exposed service",
          "Apply the approved patch and validate the service",
          "Only change the desktop background",
          "Add the vulnerability to a spreadsheet without action"
        ],
        "answer": 1,
        "why": "Patching addresses the vulnerable code. Follow change control and validate operation; unrelated controls may reduce other risks but do not repair that flaw."
      },
      {
        "prompt": "A business-critical legacy system cannot be patched immediately. What is the best interim approach?",
        "options": [
          "Apply approved compensating restrictions and monitoring with a time-bound remediation plan",
          "Treat the exception as permanent and remove monitoring",
          "Expose it publicly to simplify support",
          "Assume risk disappears if the software is old"
        ],
        "answer": 0,
        "why": "Compensating controls reduce exposure while remediation is planned. Document the owner, residual risk and review date rather than silently accepting an indefinite exception."
      },
      {
        "prompt": "A technician needs temporary elevated access for one approved maintenance task. What best reflects least privilege?",
        "options": [
          "Add the technician to every privileged group permanently",
          "Use a shared administrator account for all staff",
          "Disable authorization checks during business hours",
          "Grant scoped, time-limited access and remove it when the task ends"
        ],
        "answer": 3,
        "why": "Limit both what access permits and how long it lasts. Broad persistent privileges increase the impact of mistakes and compromised accounts."
      },
      {
        "prompt": "An infected laptop is quarantined from normal network access. What does quarantine accomplish?",
        "options": [
          "It guarantees no prior data theft occurred",
          "It automatically patches all disconnected machines",
          "It limits exposure while investigation and remediation continue",
          "It proves the operating system is clean"
        ],
        "answer": 2,
        "why": "Quarantine is containment. Verify remediation and health before restoring access; isolation alone is not eradication or proof that earlier damage did not occur."
      },
      {
        "prompt": "Why can endpoint encryption help a lost powered-off laptop but not reliably stop malware running in an unlocked user session?",
        "options": [
          "The laptop’s storage stops existing when unlocked",
          "The authorized running system may already have access to decrypted data",
          "Encryption always prevents application execution",
          "All endpoint encryption keys are public"
        ],
        "answer": 1,
        "why": "Encryption at rest protects stored data under its access model. Running code with authorized access may still read available plaintext, so endpoint and access controls remain necessary."
      },
      {
        "prompt": "A retired server is no longer needed. Which action best reduces its remaining attack surface?",
        "options": [
          "Decommission it through approved data, identity and asset-retirement procedures",
          "Leave it powered on with default accounts",
          "Only hide its shortcut from the service desk",
          "Keep all old credentials enabled indefinitely"
        ],
        "answer": 0,
        "why": "Retirement should address data disposition, network exposure, credentials and inventory. An unused but reachable system can still be exploited."
      }
    ],
    "activity": {
      "title": "Choose a mitigation for the specific exposure",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Patching",
        "Least privilege",
        "Quarantine",
        "Decommissioning"
      ],
      "items": [
        [
          "An approved vendor fix is installed to remove a known vulnerability.",
          0,
          "The affected code is updated and then validated."
        ],
        [
          "A support role receives only the permissions needed for its task.",
          1,
          "Access is constrained to its actual business purpose."
        ],
        [
          "A suspicious endpoint is restricted to remediation resources.",
          2,
          "Containment limits its normal access until it is safe to return."
        ],
        [
          "An obsolete service is retired, with data and credentials handled appropriately.",
          3,
          "Removing the unused resource reduces lingering exposure."
        ]
      ]
    }
  },
  {
    "id": "hardening-techniques",
    "title": "Hardening Techniques",
    "objective": "2.5",
    "duration": "12:11",
    "slug": "hardening-techniques-sy0-701/",
    "recall": "How do you reduce unnecessary services, identities, interfaces and software while preserving required work?",
    "questions": [
      {
        "prompt": "A server exposes an unused remote-management service to the internet. Which hardening step most directly removes that exposure?",
        "options": [
          "Keep it open but publish a warning",
          "Disable auditing on the service",
          "Disable the unused service and close its unnecessary network path",
          "Rename the service shortcut only"
        ],
        "answer": 2,
        "why": "Remove unneeded functionality and restrict access. A visible warning or renamed shortcut does not reduce reachability or stop the listening service."
      },
      {
        "prompt": "A network appliance still uses the vendor’s default administrator password. What should happen?",
        "options": [
          "Only change its display name",
          "Replace default credentials and use individually accountable administration where supported",
          "Keep the default because support technicians know it",
          "Post the default password beside the appliance"
        ],
        "answer": 1,
        "why": "Default credentials are widely known or discoverable. Appropriate unique credentials and accountable identities reduce unauthorized access and improve investigation."
      },
      {
        "prompt": "After imaging, a laptop contains an unused local administrator account and unnecessary software. What is the best next action?",
        "options": [
          "Apply and verify the approved hardened baseline",
          "Assume the image is secure because installation succeeded",
          "Give all users administrator rights",
          "Disable updates permanently to preserve the image"
        ],
        "answer": 0,
        "why": "Hardening includes accounts, software, services and configuration. A successful installation does not establish that the device meets its security baseline."
      },
      {
        "prompt": "Which control most directly reduces unauthorized external peripheral use on a managed endpoint?",
        "options": [
          "A larger monitor",
          "A longer browser history retention period",
          "An open local administrator account",
          "An enforced device-control policy allowing only approved peripherals as needed"
        ],
        "answer": 3,
        "why": "Port and device controls can limit connected hardware according to business need. They should be tested so required devices continue to work."
      },
      {
        "prompt": "Why should unnecessary software be removed from production systems?",
        "options": [
          "Removal eliminates the need to secure remaining applications",
          "An installed application can never introduce a vulnerability",
          "It adds components that must be patched, configured and defended",
          "Every unused application is already proven malware"
        ],
        "answer": 2,
        "why": "More components can increase attack surface and maintenance burden. Removing what is not needed reduces exposure without proving every removed item was malicious."
      },
      {
        "prompt": "A hardened baseline disables an old protocol that a critical application still requires. What is the best response?",
        "options": [
          "Re-enable every legacy protocol on every device",
          "Assess the dependency and approve a scoped mitigation or migration plan",
          "Disable all hardening permanently for the entire organization",
          "Ignore the outage because security settings are always harmless"
        ],
        "answer": 1,
        "why": "Hardening must account for business dependencies. Resolve the specific risk with controlled exceptions and a modernization plan rather than broad unmanaged rollback."
      },
      {
        "prompt": "Which approach best protects administrative access to a switch?",
        "options": [
          "Restrict management to approved secure paths, use strong authentication and keep it patched",
          "Expose its management interface publicly for convenience",
          "Use plaintext remote administration because the network is internal",
          "Share one default password across every device"
        ],
        "answer": 0,
        "why": "Secure management combines limited reachability, protected protocols, appropriate authentication and maintenance. No single change substitutes for all of them."
      },
      {
        "prompt": "An auditor wants evidence that hardening remains effective after deployment. What best meets the request?",
        "options": [
          "Show only the original installation-success screen",
          "Assume security settings never change",
          "Remove monitoring so unexpected differences cannot appear",
          "Compare current settings with the baseline and investigate configuration drift"
        ],
        "answer": 3,
        "why": "Hardening is maintained over time. Baseline comparison and drift review can reveal later changes, missed devices or unauthorized configuration."
      }
    ],
    "activity": {
      "title": "Map hardening actions to the risk they reduce",
      "instruction": "Match each situation to the most specific concept. Labels may be reused.",
      "labels": [
        "Service minimization",
        "Credential hardening",
        "Device control",
        "Configuration drift review"
      ],
      "items": [
        [
          "Unneeded listeners and network-facing features are disabled.",
          0,
          "Removing unnecessary services reduces available attack paths."
        ],
        [
          "Default passwords and unnecessary privileged accounts are addressed.",
          1,
          "Harden the identities that control the system."
        ],
        [
          "Only approved removable peripherals may be used under policy.",
          2,
          "Control physical connection capabilities according to need."
        ],
        [
          "Live settings are compared with the approved secure baseline.",
          3,
          "Detect and address deviations introduced after deployment."
        ]
      ]
    }
  }
]);
