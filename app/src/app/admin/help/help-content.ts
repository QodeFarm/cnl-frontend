import { HelpSection } from './help-content.model';

/**
 * THE CNL USER GUIDE (HelpBook).
 *
 * Every topic below describes a real screen in CNL. When you add a new module
 * here, first open that module's screen/component and document the actual
 * fields and buttons — keep it factual and simple.
 *
 * Sections are added in this order:
 *   1. User Management   (done)
 *   2. Settings          (done — overview)
 *   ... Dashboard, Sales, Purchase, Finance, Inventory, Leads, Assets,
 *       Reports, HRMS, Production & the rest (added progressively)
 */
export const HELP_SECTIONS: HelpSection[] = [
  // =====================================================================
  // GETTING STARTED
  // =====================================================================
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    summary: 'New here? Read this first.',
    topics: [
      {
        id: 'welcome',
        title: 'Welcome to CNL',
        blocks: [
          { type: 'lead', text: 'CNL runs your whole business in one place — sales, purchases, stock, accounts, people and production. This guide explains every screen in simple steps.' },
          { type: 'subheading', text: 'How to use this guide' },
          { type: 'para', text: 'Pick a topic from the list on the left, or type in the **search box** to jump straight to a screen. Each topic tells you what the screen is for, how to reach it, and what every field means.' },
          { type: 'tip', text: 'Open this guide any time from the ❓ icon at the top-right of the screen.' }
        ]
      },
      {
        id: 'first-15-minutes',
        title: 'Your first 15 minutes',
        blocks: [
          { type: 'lead', text: 'Run one full business cycle to see how CNL fits together. Follow these steps in order.' },
          {
            type: 'steps',
            items: [
              '**Set up your company** — Settings (gear icon) ▸ Company, then add Branches and Users (see User Management).',
              '**Add a Customer and a Vendor** — open the Customers screen, then the Vendors screen.',
              '**Add a Product** with a price — open the Products screen.',
              '**Raise a Purchase Order** and receive the stock — Purchase.',
              '**Create a Sale Order**, then its Invoice — Sales.',
              '**Record the Payment** received — Sales ▸ Payment Receipt.',
              '**Open the Dashboard** — watch your sales, purchases and balances update.'
            ]
          },
          { type: 'tip', text: 'Each step above has its own detailed topic in this guide. Finish this once and you understand the whole system.' }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 1 — USER MANAGEMENT
  // =====================================================================
  {
    id: 'user-management',
    title: 'User Management',
    icon: 'fas fa-users',
    summary: 'Logging in, and controlling who can do what.',
    topics: [
      {
        id: 'big-idea',
        title: 'How access works (start here)',
        blocks: [
          {
            type: 'lead',
            text: 'CNL controls who can do what using three simple words. Learn these and the rest is easy.'
          },
          {
            type: 'table',
            columns: ['Word', 'Meaning'],
            rows: [
              ['User', 'One person who logs in (name, email, mobile, password).'],
              ['Role', 'A job type, e.g. Sales Executive or Accountant. A role is a bundle of permissions.'],
              ['Permission', 'A single tick: this role may View / Add / Edit / Delete a screen.']
            ]
          },
          {
            type: 'para',
            text: 'You give a **Role** its permissions once, then attach that role to as many **Users** as you like. Change the role and everyone with that role updates instantly.'
          },
          {
            type: 'subheading',
            text: 'Setup order'
          },
          {
            type: 'steps',
            items: [
              'Create your Roles (Sales, Purchase, Accounts, HR…).',
              'Open each role and tick its permissions.',
              'Create Users and assign each one a Role.'
            ]
          }
        ]
      },
      {
        id: 'login',
        title: 'Logging In',
        blocks: [
          { type: 'lead', text: 'Securely enter CNL with your personal username and password.' },
          { type: 'path', text: 'Open your company CNL web address → the "C&L – Accounts Book" login screen opens.' },
          {
            type: 'fields',
            fields: [
              { name: 'Username', required: 'Yes', enter: 'The username your admin gave you', why: 'This is your identity in CNL; your actions are recorded against it.' },
              { name: 'Password', required: 'Yes', enter: 'Your secret password', why: 'Protects your account. Never share it.' }
            ]
          },
          {
            type: 'subheading', text: 'Buttons'
          },
          {
            type: 'table',
            columns: ['Button', 'What happens'],
            rows: [
              ['Login', 'Checks your details and opens your Dashboard.'],
              ['Forgot Password', 'Sends a reset link so you can set a new password yourself.']
            ]
          },
          {
            type: 'warn',
            text: 'First-time or temporary-password users are taken straight to the Change Password screen before anything else — set your own password here so only you know it.'
          },
          {
            type: 'tip',
            text: 'You only see the menus your Role allows. If a colleague sees a module you don’t, that’s their role’s permissions — not a bug.'
          }
        ]
      },
      {
        id: 'user-roles',
        title: 'Creating a User Role',
        blocks: [
          { type: 'lead', text: 'Define a job type (Sales, Purchase, Accounts…) you can reuse for many people.' },
          { type: 'path', text: 'Configuration (gear icon) ▸ User Roles' },
          {
            type: 'fields',
            fields: [
              { name: 'Role Name', required: 'Yes', enter: 'A clear job title, e.g. Sales Executive', why: 'This is what you pick later when creating a user. Keep it meaningful.' },
              { name: 'Description', required: 'Yes', enter: 'One line on what the role is for', why: 'Helps the next admin understand the role at a glance.' }
            ]
          },
          { type: 'subheading', text: 'Buttons next to each role' },
          {
            type: 'table',
            columns: ['Action', 'What it does'],
            rows: [
              ['Edit', 'Rename the role or change its description.'],
              ['Delete', 'Removes the role (recoverable — see Restore).'],
              ['Restore', 'Brings back a role you deleted earlier.'],
              ['Config (gear icon)', 'Opens the Permissions screen where you tick what this role can do.']
            ]
          },
          { type: 'tip', text: 'Create the role first with just a name and description. You set the actual permissions in the next step.' }
        ]
      },
      {
        id: 'role-permissions',
        title: 'Setting Role Permissions',
        blocks: [
          { type: 'lead', text: 'Decide exactly which screens a role can use, and what it can do on each.' },
          { type: 'path', text: 'User Roles list → click the gear (Config) icon on a role.' },
          { type: 'subheading', text: 'The grid has three levels' },
          {
            type: 'table',
            columns: ['Tick this', 'When you want to…', 'Effect'],
            rows: [
              ['Module checkbox', 'Give full access to a whole area (e.g. all of Sales)', 'Auto-ticks every section and action under it.'],
              ['Section checkbox', 'Give full access to one screen (e.g. Sales Orders)', 'Auto-ticks every action for that screen.'],
              ['Action checkbox', 'Allow just one capability (e.g. View only)', 'Fine control — this is how you make a read-only role.']
            ]
          },
          {
            type: 'para',
            text: 'The available **Actions** (View, Add, Edit, Delete and any others) are the capabilities your CNL setup defines. Tick only what this role should be allowed to do.'
          },
          { type: 'para', text: 'Click **Save**. You will see "Role permissions saved successfully".' },
          { type: 'tip', text: 'A read-only Auditor role = tick View on every section, leave Add/Edit/Delete unticked. A Sales Executive = full ticks on Sales & Customers, nothing on Finance or HR. This one grid is your whole company’s security.' }
        ]
      },
      {
        id: 'users',
        title: 'Creating a User',
        blocks: [
          { type: 'lead', text: 'Add a real person who can log in, and connect them to a Role.' },
          { type: 'path', text: 'Configuration (gear icon) ▸ Users → Add. The list shows Name, Email, Role, Mobile.' },
          {
            type: 'fields',
            fields: [
              { name: 'Title', required: 'Yes', enter: 'Mr. / Ms.', why: 'Used on greetings and printed documents.' },
              { name: 'First Name', required: 'Yes', enter: 'Person’s first name', why: 'Shown across the app.' },
              { name: 'Last Name', required: 'Yes', enter: 'Person’s surname', why: 'Completes their full name.' },
              { name: 'User Email', required: 'No', enter: 'Work email (optional)', why: 'Decides how they receive their password (see below). Leave blank for staff with no email.' },
              { name: 'Mobile', required: 'Yes', enter: 'Mobile number', why: 'Contact number; must be unique.' },
              { name: 'User Role', required: 'Yes', enter: 'Pick a Role from the list', why: 'This grants their permissions — links the person to the access you set up.' },
              { name: 'Gender', required: 'Yes', enter: 'Male / Female', why: 'Profile / HR record.' },
              { name: 'Date Of Birth', required: 'No', enter: 'Their date of birth', why: 'Used for HR features.' },
              { name: 'User Name', required: 'Yes', enter: 'The login name they will type', why: 'Must be unique; this is their login ID.' },
              { name: 'Profile Pic', required: 'Yes', enter: 'Upload a photo', why: 'Shows in the top bar and personalises the app.' },
              { name: 'Account Status (Active/Inactive)', required: 'Edit only', enter: 'Toggle on/off', why: 'Appears when editing a user — flip to Inactive to block login without deleting the person.' }
            ]
          },
          {
            type: 'warn',
            text: 'You do NOT type the user’s password. CNL handles it securely based on whether you entered an email.'
          },
          {
            type: 'table',
            columns: ['If you…', 'Then CNL…', 'Tell the user'],
            rows: [
              ['Entered an email', 'Sends an activation email with a link', 'Check your email and set your own password.'],
              ['Left email blank', 'Generates a temporary password and shows it on screen (with a Copy button)', 'Share it securely; they must change it on first login.']
            ]
          },
          { type: 'para', text: 'Helper banners on the form tell you which path is active as you type, so you never get stuck.' },
          { type: 'tip', text: 'The logged-in admin and any Admin-role user cannot be deleted from the list — a safety guard so you never lock yourself out.' }
        ]
      },
      {
        id: 'user-groups',
        title: 'User Groups',
        blocks: [
          { type: 'lead', text: 'Group people for organisation (e.g. "Warehouse Team") — separate from Roles, which control permissions.' },
          { type: 'path', text: 'Open the User Groups screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Group Name', required: 'Yes', enter: 'e.g. Warehouse Team', why: 'Identifies the group.' },
              { name: 'Description', required: 'Yes', enter: 'What the group is for', why: 'Explains the group’s purpose.' }
            ]
          },
          { type: 'para', text: 'Then use **Group Members** to add users into the group.' },
          { type: 'tip', text: 'Roles = what you can do. Groups = which team you belong to. Keep the two ideas separate.' }
        ]
      },
      {
        id: 'my-profile',
        title: 'My Profile',
        blocks: [
          { type: 'lead', text: 'Your own account details. Open it any time to update your information.' },
          { type: 'path', text: 'Top-right (your name) ▸ Profile' },
          {
            type: 'fields',
            fields: [
              { name: 'Profile Pic', required: 'No', enter: 'Upload a photo', why: 'Shown in the top bar.' },
              { name: 'First Name / Last Name', required: 'Yes', enter: 'Your name', why: 'Shown across the app.' },
              { name: 'User Email', required: 'No', enter: 'Your email', why: 'Used for notifications and password resets.' },
              { name: 'Mobile', required: 'Yes', enter: 'Your mobile number', why: 'Your contact number.' },
              { name: 'User Role', required: '—', enter: 'Your role', why: 'Set by your admin; controls what you can access.' },
              { name: 'Gender / Date Of Birth', required: 'Gender: Yes', enter: 'Your details', why: 'Profile / HR information.' },
              { name: 'Status', required: '—', enter: 'Account status', why: 'Whether your account is active.' }
            ]
          },
          { type: 'para', text: 'Click **Update Profile** to save your changes.' },
          { type: 'tip', text: 'To change your password, use Change Password (next topic) — it isn’t set from this screen.' }
        ]
      },
      {
        id: 'change-password',
        title: 'Change Password',
        blocks: [
          { type: 'lead', text: 'Update your login password. Choose something strong that only you know.' },
          { type: 'path', text: 'Top-right (your name) ▸ Change Password' },
          {
            type: 'fields',
            fields: [
              { name: 'Old Password', required: 'Yes', enter: 'Your current password', why: 'Confirms it’s really you.' },
              { name: 'New Password', required: 'Yes', enter: 'A strong new password (at least 8 characters)', why: 'CNL shows a strength meter — aim for Strong (mix of upper/lower case, numbers and symbols).' },
              { name: 'Confirm New Password', required: 'Yes', enter: 'Re-type the new password', why: 'Must match the new password exactly.' }
            ]
          },
          { type: 'para', text: 'Click **Change Password** to save. Use **Clear** to reset the form.' },
          { type: 'warn', text: 'If you logged in with a temporary password, CNL takes you here automatically and you must set a new password before you can continue.' }
        ]
      },
      {
        id: 'user-checklist',
        title: 'Quick checklist',
        blocks: [
          {
            type: 'checklist',
            items: [
              'Logged in and changed my temporary password',
              'Created my Roles (Sales, Purchase, Accounts, HR…)',
              'Opened the gear (Config) icon and ticked permissions for each Role',
              'Created Users and assigned each one a Role',
              'Tested: logged in as a test user — they see only their allowed menus'
            ]
          }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 2 — SETTINGS / CONFIGURATION  (overview; deepened per item later)
  // =====================================================================
  {
    id: 'settings',
    title: 'Settings (Configuration)',
    icon: 'fas fa-cog',
    summary: 'The gear icon in the top bar — admin setup options.',
    topics: [
      {
        id: 'settings-overview',
        title: 'The Configuration menu',
        blocks: [
          { type: 'lead', text: 'The gear (cog) icon at the top-right opens Configuration. It is shown to Admin users and gathers all setup screens in one place.' },
          { type: 'path', text: 'Top bar ▸ gear icon (Configuration)' },
          {
            type: 'table',
            columns: ['Option', 'What it is for'],
            rows: [
              ['Company', 'Your company profile and details.'],
              ['Company Settings', 'App-wide preferences for how the company runs.'],
              ['Branches', 'Your company’s branch locations.'],
              ['Users', 'Add and manage the people who log in.'],
              ['User Roles', 'Define job types and their permissions.'],
              ['Custom Fields', 'Add your own extra fields to forms.'],
              ['Reminders', 'Set up reminders and alerts.'],
              ['Workflow', 'Define approval / process flows.'],
              ['Document Print Settings', 'Control how printed documents look.']
            ]
          },
          { type: 'tip', text: 'Users and User Roles are covered in detail in the User Management section. Each of the other options is documented in its own topic below.' }
        ]
      },
      {
        id: 'company',
        title: 'Company',
        blocks: [
          { type: 'lead', text: 'Your company’s master profile — name, address, logo, and tax registration details. These appear on your printed documents.' },
          { type: 'path', text: 'Top bar ▸ gear icon ▸ Company' },
          { type: 'para', text: 'There is one company profile. When you open this screen it loads your existing details for editing.' },
          { type: 'subheading', text: 'Basic details' },
          {
            type: 'fields',
            fields: [
              { name: 'Company Logo', required: 'No', enter: 'Upload your logo image', why: 'Shown on printed documents.' },
              { name: 'Company Name', required: 'Yes', enter: 'Your legal company name', why: 'Used across the app and on documents.' },
              { name: 'Print Name', required: 'Yes', enter: 'The name as it should print', why: 'The exact name shown on invoices/orders.' },
              { name: 'Short Name', required: 'No', enter: 'A short form of the name', why: 'Used where space is limited.' },
              { name: 'Company Code', required: 'No', enter: 'Your internal company code', why: 'Shown in the top bar beside the name.' },
              { name: 'Phone / Email / Website', required: 'No', enter: 'Contact details', why: 'Appear on documents and records.' },
              { name: 'City / State / Country / PIN Code', required: 'City & State: Yes', enter: 'Select location', why: 'Your registered address.' },
              { name: 'Company Address / Billing Address', required: 'No', enter: 'Full address text', why: 'Billing Address is the one printed on bills.' },
              { name: 'Number of Branches / Employees', required: 'No', enter: 'Counts', why: 'Company size information.' },
              { name: 'Authorized Person', required: 'No', enter: 'Name of the authorised signatory', why: 'Used on documents.' }
            ]
          },
          { type: 'subheading', text: 'Tax & registration' },
          {
            type: 'fields',
            fields: [
              { name: 'GST TIN', required: 'No', enter: 'Your GST number', why: 'Used on GST invoices and returns.' },
              { name: 'PAN / TAN / CIN', required: 'No', enter: 'Statutory registration numbers', why: 'Compliance and printed documents.' },
              { name: 'VAT/GST Status', required: 'No', enter: 'Active / Inactive / Pending', why: 'Your current tax registration status.' },
              { name: 'GST Type', required: 'No', enter: 'Goods / Service / Both', why: 'What your business is registered for.' },
              { name: 'Turnover Less Than 5 Crores', required: 'No', enter: 'Tick if applicable', why: 'Affects certain GST rules.' },
              { name: 'License Number / Establishment Code', required: 'No', enter: 'Other licences', why: 'Extra compliance details.' }
            ]
          },
          { type: 'tip', text: 'Fill the Company profile first — Branches, documents and tax features all build on it.' }
        ]
      },
      {
        id: 'company-settings',
        title: 'Company Settings (default accounts)',
        blocks: [
          { type: 'lead', text: 'Tell CNL which ledger accounts to use by default when it posts transactions. Set this once and your sales, purchases and payments post to the right accounts automatically.' },
          { type: 'path', text: 'Top bar ▸ gear icon ▸ Company Settings' },
          { type: 'para', text: 'Settings are grouped by module. **Finance** is available now; Inventory, Sales, Purchase and HRMS appear here as they are enabled.' },
          { type: 'subheading', text: 'Finance — default ledger accounts' },
          {
            type: 'fields',
            fields: [
              { name: 'Sales Ledger Account', required: 'No', enter: 'Pick a ledger', why: 'Where sales income is posted.' },
              { name: 'Purchase Ledger Account', required: 'No', enter: 'Pick a ledger', why: 'Where purchases are posted.' },
              { name: 'Receivables Account', required: 'No', enter: 'Pick a customer ledger', why: 'Money customers owe you.' },
              { name: 'Payables Account', required: 'No', enter: 'Pick a vendor ledger', why: 'Money you owe vendors.' },
              { name: 'Cash Account', required: 'No', enter: 'Pick a cash ledger', why: 'Default account for cash transactions.' },
              { name: 'Bank Account', required: 'No', enter: 'Pick a bank ledger', why: 'Default account for bank transactions.' },
              { name: 'Discount Account', required: 'No', enter: 'Pick a ledger', why: 'Where discounts are recorded.' },
              { name: 'Round Off Account', required: 'No', enter: 'Pick a ledger', why: 'Where rounding differences go.' }
            ]
          },
          { type: 'para', text: 'Click **Save**. You will see "Settings saved successfully."' },
          { type: 'warn', text: 'If you see "Company not found", set up the Company profile first (previous topic).' }
        ]
      },
      {
        id: 'branches',
        title: 'Branches',
        blocks: [
          { type: 'lead', text: 'Add each physical location of your business. Branches let you run and report per location.' },
          { type: 'path', text: 'Top bar ▸ gear icon ▸ Branches' },
          { type: 'subheading', text: 'Key fields' },
          {
            type: 'fields',
            fields: [
              { name: 'Name', required: 'Yes', enter: 'Branch name', why: 'Identifies the branch.' },
              { name: 'Code', required: 'Yes', enter: 'Short branch code', why: 'Used to reference the branch.' },
              { name: 'Company', required: 'Yes', enter: 'Select the company', why: 'Links the branch to your company.' },
              { name: 'City / State / Country', required: 'City & State: Yes', enter: 'Select location', why: 'Branch address.' },
              { name: 'Status', required: 'Yes', enter: 'Select status', why: 'Whether the branch is active.' },
              { name: 'Picture', required: 'Yes', enter: 'Upload an image', why: 'Visual reference for the branch.' },
              { name: 'GST No', required: 'No', enter: 'Branch GST number', why: 'Used for branch-level GST.' },
              { name: 'Phone / Email / PIN Code / Address', required: 'No', enter: 'Contact & address', why: 'Branch contact details.' },
              { name: 'Allowed Warehouse', required: 'No', enter: 'Warehouse(s) for this branch', why: 'Controls which stock locations the branch uses.' }
            ]
          },
          { type: 'para', text: 'Advanced (optional): Longitude, Latitude, E-Way / GSTN usernames & passwords, and extra licences can be filled if you use those features.' }
        ]
      },
      {
        id: 'custom-fields',
        title: 'Custom Fields',
        blocks: [
          { type: 'lead', text: 'Add your own extra fields to CNL’s forms — capture information that is unique to your business without changing the software.' },
          { type: 'path', text: 'Top bar ▸ gear icon ▸ Custom Fields' },
          {
            type: 'fields',
            fields: [
              { name: 'Field Name', required: 'Yes', enter: 'The label for your new field', why: 'What users will see on the form.' },
              { name: 'Entity Name', required: 'No', enter: 'Which form/record to add it to', why: 'Decides where the field appears (e.g. Customer, Product).' },
              { name: 'Field Type', required: 'Yes', enter: 'Text, Select, Radio, Multi-Select, etc.', why: 'Decides how the field behaves.' },
              { name: 'Is Required', required: 'No', enter: 'Tick to make it mandatory', why: 'Forces users to fill it.' }
            ]
          },
          { type: 'tip', text: 'If you choose Select, Multi-Select or Radio, an "Add Option" table appears — enter each choice (Option Value) the user can pick from.' }
        ]
      },
      {
        id: 'reminders-setup',
        title: 'Reminders',
        blocks: [
          { type: 'lead', text: 'Schedule reminders so the right people are alerted at the right time. Reminders also show under the bell icon in the top bar.' },
          { type: 'path', text: 'Top bar ▸ gear icon ▸ Reminders' },
          {
            type: 'fields',
            fields: [
              { name: 'Reminder Types', required: 'Yes', enter: 'Select a type', why: 'Categorises the reminder.' },
              { name: 'Subject', required: 'Yes', enter: 'Short title', why: 'What the reminder is about.' },
              { name: 'Description', required: 'No', enter: 'More detail', why: 'Extra context for the recipient.' },
              { name: 'Reminder Date', required: 'Yes', enter: 'Date and time', why: 'When the reminder fires.' },
              { name: 'Is Recurring', required: 'No', enter: 'Tick to repeat', why: 'Makes the reminder repeat automatically.' },
              { name: 'Recurring Frequency', required: 'No', enter: 'Daily / Weekly / Monthly / Yearly', why: 'How often a recurring reminder repeats.' }
            ]
          },
          { type: 'subheading', text: 'Reminder Recipients (table)' },
          { type: 'para', text: 'Add who should be notified. The current user and their email are filled in automatically; for each row pick the **Recipient User**, confirm the **Recipient Email**, and choose a **Notification Method**.' }
        ]
      },
      {
        id: 'workflow',
        title: 'Workflow',
        blocks: [
          { type: 'lead', text: 'A Workflow defines the ordered stages (statuses) a document moves through from start to finish. When you turn on "Use Workflow" on a Sale Order, the order follows these stages and shows them as a step-by-step progress tracker.' },
          { type: 'path', text: 'Top bar ▸ gear icon ▸ Workflow' },
          { type: 'subheading', text: 'Workflow' },
          {
            type: 'fields',
            fields: [
              { name: 'Workflow Name', required: 'No', enter: 'A name for the flow', why: 'Identifies this workflow.' },
              { name: 'Is Active', required: 'No', enter: 'Tick to turn it on', why: 'Only an active workflow is used by orders.' }
            ]
          },
          { type: 'subheading', text: 'Workflow Stages (table)' },
          { type: 'para', text: 'Add one row per stage. For each stage choose:' },
          {
            type: 'fields',
            fields: [
              { name: 'Section', required: 'Yes', enter: 'The area/screen the stage applies to', why: 'Where this stage belongs.' },
              { name: 'Flow Status', required: 'Yes', enter: 'The status for this stage', why: 'The status the document shows at this stage (e.g. Ready for Invoice, Delivery In progress).' },
              { name: 'Stage Order', required: 'Yes', enter: 'A number (1, 2, 3…)', why: 'The sequence — 1 is first. Stages are shown in this order.' },
              { name: 'Description', required: 'No', enter: 'Notes', why: 'Explains the stage.' }
            ]
          },
          { type: 'subheading', text: 'How it works on a Sale Order' },
          {
            type: 'steps',
            items: [
              'Create a Workflow, mark it **Active**, and add its stages (flow statuses) in order.',
              'When creating or editing a **Sale Order**, tick **Use Workflow**.',
              'The order then shows the workflow’s stages as a **progress stepper**.',
              'The order’s current **Flow Status** marks each stage as completed, current or upcoming.',
              'As the order is processed (for example invoiced or dispatched), its status moves to the next stage automatically.'
            ]
          },
          { type: 'tip', text: 'Stage Order decides the sequence (1 first). The order uses the active workflow, so keep only the workflow you want as Active.' }
        ]
      },
      {
        id: 'document-print-settings',
        title: 'Document Print Settings',
        blocks: [
          { type: 'lead', text: 'Design exactly how each printed document looks — which columns and sections appear, their order, the paper, colours, text and wording. You build reusable Templates per document type, and the one you mark as Default is the one used when printing.' },
          { type: 'path', text: 'Top bar ▸ gear icon ▸ Document Print Settings' },

          { type: 'subheading', text: '1. Choose the document type' },
          { type: 'para', text: 'Tabs across the top let you configure each document separately: **Sale Order, Sale Invoice, Sale Return, Delivery Challan, Purchase Order, Purchase Return, Payment Receipt, Bill Receipt** and **Account Ledger**. A dot on a tab means it has unsaved changes.' },

          { type: 'subheading', text: '2. Create a template and set it as Default' },
          { type: 'para', text: 'For each document you create one or more **templates** (different layouts). Only the **Default** template is used when that document is printed.' },
          {
            type: 'steps',
            items: [
              'In the left panel, click **New** to start a template.',
              'Give it a **Template Name** (at least 2 characters), e.g. *Standard A4* or *Thermal Receipt*.',
              'Configure it using the tabs (Layout & Style, Columns, Sections, Custom Text).',
              'Tick **Set as Default** to make it the one used for printing.',
              'Click **Save Template**.'
            ]
          },
          { type: 'warn', text: 'Only the Default template is used when a document is printed, and there can be just one Default per document — marking a template as Default automatically removes Default from the others. At least one template must be Default.' },
          { type: 'para', text: 'You can keep **different templates** for the same document (for example an A4 version and an 11×16 version) and switch which one is Default. Use the **delete** icon to remove a template, and **Reset** to restore the default settings.' },

          { type: 'subheading', text: '3. Layout & Style tab' },
          {
            type: 'fields',
            fields: [
              { name: 'Paper Size', required: '—', enter: '11×16 inch (Default), A4, A4 Landscape, A5, or Letter', why: 'The page size of the printout.' },
              { name: 'Font Size', required: '—', enter: 'Small, Medium (Default), or Large', why: 'How big the text prints.' },
              { name: 'Colour Theme', required: '—', enter: 'Blue (Professional), Green, Orange, Grey, Purple, Teal, or No Color', why: 'The accent colour of the headings/table.' },
              { name: 'Copies', required: '—', enter: '1 to 4', why: 'How many copies print at once.' },
              { name: 'Copy Labels', required: '—', enter: 'A label for each copy (e.g. Original)', why: 'Names each copy, such as Original / Duplicate.' }
            ]
          },

          { type: 'subheading', text: '4. Columns tab' },
          { type: 'para', text: 'Turn each table column **on/off** with its switch, and use the **up/down arrows** to reorder them. **Required** columns cannot be hidden.' },
          {
            type: 'table',
            columns: ['Document', 'Columns (★ = required, cannot hide)'],
            rows: [
              ['Sales & Purchase documents', 'S.No ★, Product ★, Boxes, Qty ★, Unit, Rate ★, Amount, Disc (%), Disc (Rs) (hidden by default), GST (Rs), Total Amount ★'],
              ['Payment Receipt / Bill Receipt', 'Invoice No. ★, Invoice Date, Payment Method, Reference No., Amount Paid ★, Total Amount ★'],
              ['Account Ledger', 'Date ★, Voucher No., Description ★, Debit ★, Credit ★, Balance ★']
            ]
          },

          { type: 'subheading', text: '5. Sections tab' },
          { type: 'para', text: 'Show or hide whole parts of the document with switches, grouped by area:' },
          {
            type: 'table',
            columns: ['Group', 'Things you can show / hide'],
            rows: [
              ['Header', 'Logo, Company Name, Company Address, Company Phone, Company Email, GSTIN'],
              ['Customer / Vendor block', 'Billing Address, Shipping Address'],
              ['Financial summary', 'Subtotal, Discount, Shipping Charges, Cess, Round Off, Party Balance, Tax Breakdown (CGST/SGST/IGST), Amount in Words'],
              ['Footer', 'Bank Details, Terms, Notes, Signature, Declaration']
            ]
          },
          { type: 'tip', text: 'This is where you hide the logo or any block you don’t want on the printout — just switch it off.' },

          { type: 'subheading', text: '6. Custom Text tab' },
          { type: 'para', text: 'Set the wording printed on the document:' },
          {
            type: 'fields',
            fields: [
              { name: 'Terms & Conditions', required: '—', enter: 'Your terms', why: 'Printed in the terms area.' },
              { name: 'Notes', required: '—', enter: 'A note to the customer', why: 'e.g. "Thank you for your business".' },
              { name: 'Declaration', required: '—', enter: 'Declaration text', why: 'Printed near the signature area.' },
              { name: 'Footer Note', required: '—', enter: 'A short one-line note', why: 'Printed at the bottom of the page.' }
            ]
          },
          { type: 'tip', text: 'After any change, click Save Template — and keep the layout you want marked as Default, since that is the one used for printing.' }
        ]
      }
    ]
  },

  // =====================================================================
  // MASTERS (Customers, Vendors, Products)
  // =====================================================================
  {
    id: 'masters',
    title: 'Masters',
    icon: 'fas fa-address-book',
    summary: 'The core data everything else uses: customers, vendors, products.',
    topics: [
      {
        id: 'masters-overview',
        title: 'What are Masters?',
        blocks: [
          { type: 'lead', text: 'Masters are the building blocks of your data. You set them up once, then pick them on every order, bill and report.' },
          {
            type: 'table',
            columns: ['Master', 'Used in'],
            rows: [
              ['Customers', 'Sales orders, invoices, receivables.'],
              ['Vendors', 'Purchase orders, bills, payables.'],
              ['Products', 'Every sale, purchase and stock record.']
            ]
          },
          { type: 'tip', text: 'Set up your Customers, Vendors and Products before raising any orders — it makes everything afterwards a quick pick from a list.' }
        ]
      },
      {
        id: 'customers',
        title: 'Customers',
        blocks: [
          { type: 'lead', text: 'Everyone you sell to. Set them up once and their details auto-fill onto every sales document. The Customers area has a form to add/edit a customer, a searchable list, Excel import, and bulk tools.' },
          { type: 'path', text: 'Open the Customers screen.' },

          { type: 'subheading', text: 'Buttons at the top' },
          {
            type: 'table',
            columns: ['Button', 'What it does'],
            rows: [
              ['Import', 'Upload an Excel file to add new customers in bulk.'],
              ['Import ▸ Download Excel Format', 'Download the ready-made Excel template to fill in.'],
              ['Import ▸ Import (Update Existing)', 'Upload an Excel file to update customers that already exist.'],
              ['Customer List', 'Open the list of all customers.']
            ]
          },
          { type: 'para', text: 'When you are **editing** a customer who has portal access, two more buttons appear: **Generate** (creates a username/password for the customer) and **Send Credentials** (sends those login details to the customer).' },

          { type: 'subheading', text: 'Creating a customer — General tab' },
          {
            type: 'fields',
            fields: [
              { name: 'Name', required: 'Yes', enter: 'Customer name', why: 'Who you are selling to.' },
              { name: 'Code', required: 'No', enter: 'A short code (filled in automatically)', why: 'CNL generates a customer code for you; you can change it.' },
              { name: 'Customer Category', required: 'Yes', enter: 'Choose the type from your Customer Categories (e.g. Wholesaler, Retailer)', why: 'Classifies the customer; used for pricing and reports. The customer cannot be saved without it.' },
              { name: 'Under Ledger', required: 'Yes', enter: 'The receivables ledger this customer posts to', why: 'Links the customer into your accounts. New customers default to "Sundry Debtors".' },
              { name: 'Customer Common for Sales and Purchase', required: 'No', enter: 'Tick the checkbox', why: 'Use the same party as both a customer and a vendor.' },
              { name: 'Is Sub Customer', required: 'No', enter: 'Tick the checkbox', why: 'Marks this as a sub-customer.' },
              { name: 'Enable Customer Portal Access', required: 'No', enter: 'Tick the checkbox', why: 'Gives the customer a login — reveals Portal Username, Password and the Generate / Send Credentials buttons.' },
              { name: 'Picture', required: 'No', enter: 'Upload an image', why: 'A photo or logo for the customer.' }
            ]
          },
          { type: 'subheading', text: 'Tax Details tab' },
          {
            type: 'fields',
            fields: [
              { name: 'GST Category', required: 'No', enter: 'Registered or Unregistered', why: 'How GST applies to this customer.' },
              { name: 'GST No', required: 'No', enter: 'Their GSTIN', why: 'Printed on GST documents.' },
              { name: 'PAN', required: 'No', enter: 'Their PAN', why: 'Tax record.' },
              { name: 'GST Suspend', required: 'No', enter: 'Tick the checkbox', why: 'Suspends GST for this customer.' },
              { name: 'TDS on GST Applicable', required: 'No', enter: 'Tick the checkbox', why: 'Applies TDS on GST.' },
              { name: 'TDS Applicable', required: 'No', enter: 'Tick the checkbox', why: 'Applies TDS for this customer.' }
            ]
          },
          { type: 'para', text: '**Addresses** (in the Tax Details tab): add the customer’s addresses, e.g. Billing and Shipping. Each address has **Address Type** (required), **Full Address**, **City**, **State**, **Country**, **Pin Code**, **Phone** and **Email**.' },
          { type: 'subheading', text: 'Communication tab' },
          {
            type: 'fields',
            fields: [
              { name: 'Contact Person', required: 'No', enter: 'Main contact name', why: 'Who you deal with at the customer.' },
              { name: 'Phone / Email', required: 'No', enter: 'Contact details', why: 'How to reach them.' },
              { name: 'Communication Address', required: 'No', enter: 'Full Address, City, State, Country, Pin Code', why: 'The address used for communication.' }
            ]
          },
          { type: 'subheading', text: 'Copy address buttons' },
          { type: 'para', text: 'Use the **Copy** buttons so you don’t retype addresses: Billing → Shipping, Shipping → Billing, and copy Billing/Shipping into the Communication Address.' },

          { type: 'subheading', text: 'Customer List' },
          { type: 'para', text: 'Open it with the **Customer List** button. You can:' },
          {
            type: 'table',
            columns: ['Feature', 'How it works'],
            rows: [
              ['Search', 'Search by name, email, phone, GST, city and more.'],
              ['Columns shown', 'Name, Email, Phone, GST, City (sortable).'],
              ['Manage Columns', 'Show/hide extra columns: Customer Code, PAN, Website, Sub Customer, Common Customer, Portal Access, TDS Applicable, GST Suspend, Ledger Account, Pin Code, Shipping Address.'],
              ['Inline edit', 'Click the Name in the list to edit it directly — it saves automatically.'],
              ['Open a record', 'Double-click a row to open the full customer.'],
              ['Row actions', 'Edit (pen), Delete, and Restore (bring back a deleted customer).']
            ]
          },

          { type: 'subheading', text: 'Select, Bulk Edit & Export' },
          { type: 'para', text: 'Tick the checkboxes to select rows. With rows selected, **Bulk Edit** lets you change up to **100** customers at once. **Export** sends customers to Excel — **Export Selected** when some are ticked, otherwise **Export All**.' },
          { type: 'para', text: 'Bulk Edit can change these fields for all selected customers at once:' },
          {
            type: 'table',
            columns: ['Bulk-editable field', 'Value'],
            rows: [
              ['Customer Category', 'From your Customer Categories.'],
              ['Territory', 'From your Territories.'],
              ['Firm Status', 'From your Firm Statuses.'],
              ['GST Category', 'From your GST Categories.'],
              ['Payment Terms', 'From your Customer Payment Terms.'],
              ['Price Category', 'From your Price Categories.'],
              ['Transporter', 'From your Transporters.'],
              ['Tax Type', 'Inclusive, Exclusive or Both.'],
              ['Credit Limit / Max Credit Days', 'Numbers.'],
              ['Interest Rate (%)', 'A number.'],
              ['TDS Applicable / TDS on GST / GST Suspend', 'Yes / No.']
            ]
          },

          { type: 'subheading', text: 'Importing customers from Excel' },
          {
            type: 'steps',
            items: [
              'Click **Import ▸ Download Excel Format** to get the template.',
              'Fill in your customers in that file.',
              'Click **Import** to add new customers, or **Import (Update Existing)** to update ones already in CNL.',
              'A progress bar runs, then a result is shown: **Successful**, **Partial** (some rows failed, with reasons), or **Failed** — from there you can Download Template or Try Again.'
            ]
          },
          { type: 'tip', text: 'Always start from the Download Excel Format template so your columns match what CNL expects.' }
        ]
      },
      {
        id: 'vendors',
        title: 'Vendors',
        blocks: [
          { type: 'lead', text: 'Everyone you buy from. Set them up once and their details auto-fill onto every purchase document. The Vendors area has a form (organised in sections), a searchable list, Excel import, and bulk tools.' },
          { type: 'path', text: 'Open the Vendors screen.' },

          { type: 'subheading', text: 'Buttons at the top' },
          {
            type: 'table',
            columns: ['Button', 'What it does'],
            rows: [
              ['Import', 'Upload an Excel file to add new vendors in bulk.'],
              ['Import ▸ Download Excel Format', 'Download the ready-made Excel template to fill in.'],
              ['Import ▸ Import (Update Existing)', 'Upload an Excel file to update vendors that already exist.'],
              ['Vendor List', 'Open the list of all vendors.']
            ]
          },

          { type: 'subheading', text: 'Creating a vendor — main details' },
          {
            type: 'fields',
            fields: [
              { name: 'Name', required: 'Yes', enter: 'Vendor name', why: 'Who you are buying from.' },
              { name: 'Print Name', required: 'Yes', enter: 'Name as it should print', why: 'The name shown on documents.' },
              { name: 'Code', required: 'No', enter: 'A short code (filled in automatically)', why: 'CNL generates a vendor code; you can change it.' },
              { name: 'Vendor Category', required: 'Yes', enter: 'Choose the type from your Vendor Categories', why: 'Classifies the vendor. The vendor cannot be saved without it.' },
              { name: 'Under Ledger', required: 'Yes', enter: 'The payables ledger this vendor posts to', why: 'Links the vendor into your accounts. New vendors default to "Sundry Creditors".' },
              { name: 'Picture', required: 'No', enter: 'Upload an image', why: 'A photo or logo for the vendor.' }
            ]
          },
          { type: 'subheading', text: 'Form sections' },
          { type: 'para', text: 'Below the main details the form is split into sections you can fill in:' },
          {
            type: 'table',
            columns: ['Section', 'What it holds'],
            rows: [
              ['Addresses', 'Address Type (required), Full Address, City, State, Country, Pin Code, Phone, Email — with Route Map (Longitude, Latitude).'],
              ['Account Details', 'Payment Term, Interest Rate Yearly, Price Category, Credit Limit, Max Credit Days, and the checkboxes Is Sub Vendor and Vendor common for Sales and Purchase.'],
              ['Social Accounts', 'Website, Facebook, Skype, Twitter, LinkedIn.'],
              ['Tax Details', 'GST Category, GST No, CIN, PAN, and the checkboxes GST Suspend, TDS on GST Applicable, TDS Applicable.'],
              ['Transport Details', 'Transporter, Distance.'],
              ['Attachments', 'Upload one or more files for the vendor.'],
              ['Other Details', 'Contact Person, Firm Status, Registration Date, Territory.']
            ]
          },
          { type: 'tip', text: '"Vendor common for Sales and Purchase" makes the vendor also appear when choosing a Customer on Sales Orders.' },

          { type: 'subheading', text: 'Vendor List' },
          {
            type: 'table',
            columns: ['Feature', 'How it works'],
            rows: [
              ['Search', 'Search vendors by name and more.'],
              ['Columns', 'Name, GST No, Email, Phone, City, Vendor Category, Ledger Account, Billing Address.'],
              ['Manage Columns', 'Show or hide the available columns.'],
              ['Open a record', 'Double-click a row to open the full vendor.'],
              ['Row actions', 'Edit, Delete, and Restore.']
            ]
          },

          { type: 'subheading', text: 'Select, Bulk Edit & Export' },
          { type: 'para', text: 'Tick the checkboxes to select rows. With rows selected, **Bulk Edit** lets you change up to **100** vendors at once. **Export** sends vendors to Excel — **Export Selected** when some are ticked, otherwise **Export All**.' },
          { type: 'para', text: 'Bulk Edit can change these fields for all selected vendors at once:' },
          {
            type: 'table',
            columns: ['Bulk-editable field', 'Value'],
            rows: [
              ['Vendor Category', 'From your Vendor Categories.'],
              ['Vendor Agent', 'From your Vendor Agents.'],
              ['Firm Status', 'From your Firm Statuses.'],
              ['Territory', 'From your Territories.'],
              ['GST Category', 'From your GST Categories.'],
              ['Payment Terms', 'From your Vendor Payment Terms.'],
              ['Price Category', 'From your Price Categories.'],
              ['Transporter', 'From your Transporters.'],
              ['Tax Type', 'Inclusive, Exclusive or Both.'],
              ['Credit Limit / Max Credit Days', 'Numbers.'],
              ['Interest Rate (%)', 'A number.'],
              ['TDS Applicable / TDS on GST / GST Suspend', 'Yes / No.']
            ]
          },

          { type: 'subheading', text: 'Importing vendors from Excel' },
          {
            type: 'steps',
            items: [
              'Click **Import ▸ Download Excel Format** to get the template.',
              'Fill in your vendors in that file.',
              'Click **Import** to add new vendors, or **Import (Update Existing)** to update ones already in CNL.',
              'A progress bar runs, then a result is shown: **Successful**, **Partial** (some rows failed, with reasons), or **Failed** — from there you can Try Again.'
            ]
          },
          { type: 'tip', text: 'Vendor Category and Under Ledger are required. New vendors auto-fill Code and default the ledger to Sundry Creditors.' }
        ]
      },
      {
        id: 'products',
        title: 'Products',
        blocks: [
          { type: 'lead', text: 'Everything you sell or stock. Products are used on every order, bill and stock record. The Products area has a detailed form (split into sections), a searchable list with inline editing, Excel import, and bulk tools.' },
          { type: 'path', text: 'Open the Products screen.' },

          { type: 'subheading', text: 'Buttons at the top' },
          {
            type: 'table',
            columns: ['Button', 'What it does'],
            rows: [
              ['Import', 'Upload an Excel file to add new products in bulk.'],
              ['Import ▸ Download Excel Format', 'Download the ready-made Excel template to fill in.'],
              ['Import ▸ Import (Update Existing)', 'Upload an Excel file to update products that already exist.'],
              ['Products List', 'Open the list of all products.']
            ]
          },

          { type: 'subheading', text: 'Creating a product — main details' },
          {
            type: 'fields',
            fields: [
              { name: 'Product Mode', required: 'Yes', enter: 'Select the mode', why: 'Sets the kind of product. Required.' },
              { name: 'Name', required: 'Yes', enter: 'Product name', why: 'What the product is called.' },
              { name: 'Print Name', required: 'Yes', enter: 'Name as it should print', why: 'The name shown on documents.' },
              { name: 'Code', required: 'Yes', enter: 'Product code', why: 'Unique identifier for the product.' },
              { name: 'Product Group', required: 'Yes', enter: 'Choose the group', why: 'Groups products for pricing and reports. Required.' },
              { name: 'Category', required: 'No', enter: 'Choose a category', why: 'Further classifies the product.' },
              { name: 'GST Percentage', required: 'No', enter: '3% / 5% / 9% / 12% / 18%', why: 'The GST rate for this product.' },
              { name: 'Stock Level Unit', required: 'No', enter: 'Unit of measure', why: 'How the product is counted.' },
              { name: 'HSN', required: 'No', enter: 'HSN code', why: 'Needed for correct GST.' },
              { name: 'Opening Balance', required: 'No', enter: 'Yes/No, then Balance, Physical Balance, Balance Diff.', why: 'Sets the starting stock for the product.' },
              { name: 'Picture', required: 'No', enter: 'Upload an image', why: 'A photo of the product.' }
            ]
          },
          { type: 'subheading', text: 'Form sections' },
          { type: 'para', text: 'Below the main details the form is split into sections:' },
          {
            type: 'table',
            columns: ['Section', 'What it holds'],
            rows: [
              ['Advanced info', 'GST Percentage, Brand, Item Type, Type, Unit Level, Pack Unit (required), Pack vs Stock, GPack Unit (required), GPack vs Stock, Packet Barcode, Barcode and Print Barcode.'],
              ['Variations', 'Per-variant rows: Warehouse Location, Size, Color, SKU, Price, Quantity.'],
              ['Warehouse Locations', 'Stock per location: Warehouse Location / Location and Quantity.'],
              ['Sale Info', 'Sales Description, Sales GL, MRP, Min Price, Retail Rate, Wholesale Rate, Dealer Rate, Rate Factor, Discount, Disc Amt.'],
              ['Purchase Info', 'Purchase Description, Purchase GL, Min Purchase Price, Purchase Rate, Purchase Rate Factor, Purchase Discount.'],
              ['Attributes Info', 'Minimum Level, Maximum Level, Weighscale Mapping Code, Drug Type, Salt Composition.']
            ]
          },

          { type: 'subheading', text: 'Products List' },
          {
            type: 'table',
            columns: ['Feature', 'How it works'],
            rows: [
              ['Search', 'Search products.'],
              ['Columns', 'Name, Code, Type, Group, Category, Stock Unit, Sales Rate, Wholesale Rate, Dealer Rate, Disc(%).'],
              ['Inline edit', 'Edit Sales Rate, Wholesale Rate, Dealer Rate and Disc(%) directly in the list — they save automatically.'],
              ['Open a record', 'Double-click a row to open the full product.'],
              ['Row actions', 'Edit, Delete, and Restore.']
            ]
          },

          { type: 'subheading', text: 'Select, Bulk Edit & Export' },
          { type: 'para', text: 'Tick the checkboxes to select rows. With rows selected, **Bulk Edit** lets you change up to **100** products at once. **Export** sends products to Excel — **Export Selected** when some are ticked, otherwise **Export All**.' },
          { type: 'para', text: 'Bulk Edit can change these fields for all selected products at once:' },
          {
            type: 'table',
            columns: ['Bulk-editable field', 'Value'],
            rows: [
              ['Product Type / Product Group / Category / Brand', 'From your masters.'],
              ['Stock Unit / Item Type / Drug Type', 'From your masters.'],
              ['GST Classification', 'From your GST Classifications.'],
              ['Sales GL / Purchase GL', 'Ledger accounts.'],
              ['Product Mode', 'The product mode.'],
              ['Sales Rate / MRP / Wholesale Rate / Dealer Rate / Purchase Rate', 'Prices.'],
              ['Discount (%) / GST Input (%) / GST Output (%)', 'Percentages.'],
              ['Min Level / Max Level', 'Stock levels.']
            ]
          },

          { type: 'subheading', text: 'Importing products from Excel' },
          {
            type: 'steps',
            items: [
              'Click **Import ▸ Download Excel Format** to get the template.',
              'Fill in your products in that file.',
              'Click **Import** to add new products, or **Import (Update Existing)** to update ones already in CNL.',
              'A progress bar runs, then a result is shown: **Successful**, **Partial** (some rows failed, with reasons), or **Failed** — from there you can Try Again.'
            ]
          },
          { type: 'tip', text: 'Product Mode, Name, Print Name, Code and Product Group are required (plus Pack Unit and GPack Unit in Advanced info). Set the HSN and GST Percentage so tax is correct on every document.' }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 3 — DASHBOARD
  // =====================================================================
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    summary: 'Your business at a glance — the first screen after login.',
    topics: [
      {
        id: 'dashboard-overview',
        title: 'Dashboard overview',
        blocks: [
          { type: 'lead', text: 'The Dashboard is the home screen after you log in. It shows your key numbers, breakdown charts, smart insights, and any custom graphs you add.' },
          { type: 'path', text: 'Top bar ▸ C&L logo, or Menu ▸ Dashboard' },
          { type: 'tip', text: 'This is the screen to show a prospect first — it makes the whole business visible in one view.' }
        ]
      },
      {
        id: 'dashboard-tiles',
        title: 'Key number tiles',
        blocks: [
          { type: 'lead', text: 'Across the top are summary tiles. Each shows a value (in Rs.) and an up/down change. Click a tile to see its breakdown.' },
          {
            type: 'table',
            columns: ['Tile', 'What it shows'],
            rows: [
              ['Sales', 'This week’s sales and the growth compared with the previous week.'],
              ['Purchase', 'This week’s purchases and the change compared with the previous week.'],
              ['Receivables', 'Money customers still owe you (outstanding sales).'],
              ['Payables', 'Money you still owe vendors (outstanding purchases).'],
              ['Cash / Bank', 'Your available cash and bank balance.']
            ]
          },
          { type: 'tip', text: 'Each tile shows the % change from last week — an up arrow is growth, a down arrow is a drop. Click any tile to open its chart.' }
        ]
      },
      {
        id: 'dashboard-charts',
        title: 'Tile charts (click a tile)',
        blocks: [
          { type: 'lead', text: 'Clicking a tile opens a pop-up chart with the detail behind that number.' },
          {
            type: 'table',
            columns: ['Click this tile', 'Opens'],
            rows: [
              ['Sales', 'Sales Over the Last 6 Months.'],
              ['Purchase', 'Purchase Over the Last 6 Months.'],
              ['Receivables', 'Receivables Breakdown — how much each customer owes you.'],
              ['Payables', 'Payables Breakdown — how much you owe each vendor.'],
              ['Cash / Bank', 'Liquidity In the Banks — balance across your bank accounts.']
            ]
          }
        ]
      },
      {
        id: 'dashboard-smart-insights',
        title: 'Smart Insights',
        blocks: [
          { type: 'lead', text: 'The Smart Insights button (top-right) highlights things that need your attention automatically. It shows a count badge of how many alerts there are (highlighted when any are critical); click it to open the Smart Insights panel.' },
          { type: 'tip', text: 'Glance at the Smart Insights badge each morning — if the number is up (especially in red), open it to see what needs action.' }
        ]
      },
      {
        id: 'dashboard-custom-graphs',
        title: 'Add your own graphs',
        blocks: [
          { type: 'lead', text: 'Build your own charts on the dashboard with "Add Custom Graph" — choose what to plot and it stays on your dashboard.' },
          { type: 'path', text: 'Dashboard ▸ "➕ Add Custom Graph" (top-right)' },
          {
            type: 'fields',
            fields: [
              { name: 'Select Module', required: 'Yes', enter: 'Pick the area (e.g. Sales, Purchase)', why: 'Tells CNL which part of the business to chart.' },
              { name: 'Select Report', required: 'Yes', enter: 'Pick the report to plot', why: 'The data the graph is built from.' },
              { name: 'Chart Type', required: 'Yes', enter: 'Bar, line, pie, etc.', why: 'How the data is drawn.' },
              { name: 'Graph Title', required: 'No', enter: 'A custom title', why: 'Names the graph on your dashboard.' }
            ]
          },
          { type: 'para', text: 'Each custom graph card has a **Refresh** (🔄) button to reload its data and a **Remove** (❌) button to delete it. If a graph fails to load, a **Retry** button appears.' }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 4 — SALES
  // =====================================================================
  {
    id: 'sales',
    title: 'Sales',
    icon: 'fas fa-shopping-cart',
    summary: 'From customer order to dispatch, invoice and payment.',
    topics: [
      {
        id: 'sales-flow',
        title: 'The sales flow (start here)',
        blocks: [
          { type: 'lead', text: 'Sales in CNL follows a simple chain. Each step can be created from the one before it, so you never re-type details.' },
          {
            type: 'steps',
            items: [
              '**Sale Order** — record what the customer wants to buy.',
              '**Dispatch** — pack and send the goods.',
              '**Sales Invoice** — bill the customer for what was sent.',
              '**Payment Receipt** — record the money received.'
            ]
          },
          { type: 'para', text: 'Supporting documents: **Delivery Challan** (goods sent note), **Sale Return** (goods coming back), and **Credit / Debit Notes** (money adjustments).' },
          { type: 'tip', text: 'On a saved Sale Order you’ll see "Create Sales Invoice →" and "Open Dispatch →" buttons — use them to move to the next step with all details carried over.' }
        ]
      },
      {
        id: 'sale-order',
        title: 'Sale Order',
        blocks: [
          { type: 'lead', text: 'The starting document — what a customer has ordered. Everything else in the sales flow is built from it, and it moves through stages using its Flow Status (see below).' },
          { type: 'path', text: 'Open the Sales screen (Sale Order).' },
          { type: 'subheading', text: 'Order details (top of the form)' },
          {
            type: 'fields',
            fields: [
              { name: 'Sale Type', required: 'Yes', enter: 'Pick the type of sale', why: 'Classifies the order (e.g. standard, export).' },
              { name: 'Customer', required: 'Yes', enter: 'Select the customer', why: 'Pulls in their billing/shipping details automatically.' },
              { name: 'Order No', required: 'Auto/Yes', enter: 'Order number', why: 'Unique reference for this order.' },
              { name: 'Order Date', required: 'Yes', enter: 'Date of the order', why: 'When the order was placed.' },
              { name: 'Delivery Date', required: 'No', enter: 'Promised delivery date', why: 'When the customer expects the goods.' },
              { name: 'Ref No / Ref Date', required: 'No', enter: 'Customer’s reference', why: 'Links to the customer’s own PO/reference.' },
              { name: 'Tax', required: 'Yes', enter: 'Inclusive or Exclusive', why: 'Whether prices already include tax or tax is added on top.' },
              { name: 'Use Workflow', required: 'No', enter: 'Tick to follow your Workflow', why: 'Shows the order’s progress as a stepper through the stages you set in Settings ▸ Workflow. See the Workflow topic.' },
              { name: 'Flow Status', required: 'No', enter: 'The current status', why: 'Marks where the order is in the workflow (completed / current / upcoming stages).' },
              { name: 'Remarks', required: 'No', enter: 'Any notes', why: 'Free notes about the order.' }
            ]
          },
          { type: 'subheading', text: 'Items (products) table' },
          { type: 'para', text: 'Click **Add Product** to add a row. In the **Product** column, search and pick a product (the list loads from your Products). Selecting a product fills in its Code, Print Name, Size, Color, available stock, MRP and rates automatically. Add as many rows as you need.' },
          { type: 'subheading', text: 'Item columns' },
          {
            type: 'table',
            columns: ['Column', 'What it is'],
            rows: [
              ['Select (checkbox)', 'Shown only when editing a saved order — tick specific line items (e.g. to invoice or make just those). It is disabled once a line has been invoiced or a work order was created for it.'],
              ['Product', 'The product (searchable dropdown). Required to make a valid row.'],
              ['Code', 'The product code (filled from the product).'],
              ['Size / Color', 'The product’s variant (filled from the product).'],
              ['Total Boxes', 'Number of boxes.'],
              ['Unit', 'Unit of measure.'],
              ['Quantity', 'How many you are ordering.'],
              ['Price / Rate', 'Unit price/rate for the line.'],
              ['Discount', 'Line discount — by % or ₹ (choose the Discount Type).'],
              ['Amount', 'The line total — calculated.'],
              ['MRP, CGST, SGST, IGST', 'Calculated for the line.'],
              ['Available / Need Production', 'Shows current stock and flags if the item must be produced.']
            ]
          },
          { type: 'subheading', text: 'Column settings (gear icon)' },
          { type: 'para', text: 'A **gear icon** next to "Add Product" lets you personalise the table: **show or hide columns**, and **drag to resize** them. Your choices are remembered for next time. **Product, Quantity, Rate and Amount are locked** — they’re always shown and can’t be hidden.' },
          { type: 'subheading', text: 'Billing details' },
          {
            type: 'fields',
            fields: [
              { name: 'GST Type', required: 'No', enter: 'Select GST type', why: 'Decides how tax is applied.' },
              { name: 'Payment Term', required: 'No', enter: 'Select terms', why: 'When payment is due.' },
              { name: 'Ledger Account', required: 'No', enter: 'Select account', why: 'Where the sale is posted.' },
              { name: 'Order Status', required: 'No', enter: 'Current status', why: 'Tracks progress of the order.' },
              { name: 'Overall Discount', required: 'No', enter: 'Discount on the whole order', why: 'Reduces the total beyond line discounts.' },
              { name: 'Shipping Charges', required: 'No', enter: 'Freight/shipping cost', why: 'Added to the total.' },
              { name: 'Advance Amount', required: 'No', enter: 'Amount paid upfront', why: 'Reduces the balance due.' },
              { name: 'Items Value / Tax Amount / Total Amount', required: 'Auto', enter: '— calculated —', why: 'CNL totals everything for you.' }
            ]
          },
          { type: 'subheading', text: 'Shipping details (optional)' },
          { type: 'para', text: 'For deliveries/exports you can record **Destination**, **Shipping Mode**, **Shipping Company**, **Port of Loading/Discharge**, **No. of Packets**, **Weight**, **Shipping Tracking No.** and **Shipping Date**.' },
          { type: 'para', text: 'Click **Submit** to save the order.' },

          { type: 'subheading', text: 'Buttons on the Sale Order screen' },
          {
            type: 'table',
            columns: ['Button', 'What it does'],
            rows: [
              ['Copy', 'Copy this order’s details into another document — Sale Invoice, Sale Return, Purchase Order, Purchase Invoice or Purchase Return.'],
              ['Past Orders', 'Browse earlier orders.'],
              ['Sales Order List', 'Open the list of all sale orders.'],
              ['Create Invoice', 'Appears when the flow status is Ready for Invoice — creates the Sales Invoice.'],
              ['Create Work Order', 'Appears when the status is Review Inventory or Production — sends items to production.'],
              ['Go to Dispatch', 'Appears when the status is Dispatch — opens the Dispatch screen for this order.'],
              ['View Invoices', 'Appears once an invoice exists (Ready for Invoice onwards).'],
              ['Order Acknowledgement', 'Appears at Delivery In progress / Partially Delivered — confirm delivery.']
            ]
          },

          { type: 'subheading', text: 'Use Workflow & Flow Status (how an order moves)' },
          { type: 'para', text: 'Tick **Use Workflow** on the order to follow your defined stages (set in Settings ▸ Workflow). In edit mode a **progress stepper** appears showing the stages, with the current one highlighted. The order’s **Flow Status** drives everything — the right buttons and guidance show for each status.' },
          { type: 'para', text: 'To move an order on: open it (double-click it in the Sale Order list), pick a new **Flow Status**, then click **Update**. CNL then shows the next button to click.' },
          {
            type: 'table',
            columns: ['Flow Status', 'What it means / what to do next'],
            rows: [
              ['Pending', 'Review the details and update the flow status.'],
              ['Review Inventory', 'Review stock levels. Click Create Work Order if production is needed, or move the status on to skip.'],
              ['Production', 'Items are being made — click Create Work Order.'],
              ['Ready for Invoice', 'Click Create Invoice to bill the customer.'],
              ['Dispatch', 'Click Update to create the dispatch, then Go to Dispatch to open the Dispatch screen.'],
              ['Delivery In progress', 'Goods are on the way — use Order Acknowledgement or View Invoices.'],
              ['Partially Delivered', 'Some items are still in production; the order auto-completes when they are done.'],
              ['Completed', 'The order is fully completed.']
            ]
          },
          { type: 'tip', text: 'Typical path: Pending → Review Inventory → (Production) → Ready for Invoice → Dispatch → Delivery In progress → Completed. Change the Flow Status, click Update, and follow the button CNL shows next.' },

          { type: 'subheading', text: 'Sale Order List' },
          {
            type: 'table',
            columns: ['Feature', 'How it works'],
            rows: [
              ['Columns', 'Order Date, Order No, Sale Type, Customer, Sale Estimate, Total Amount, Tax, Advance Amt, Status, Flow Status.'],
              ['Search', 'Search by order no, customer, status, flow status and more.'],
              ['Inline edit', 'Edit Total Amount directly in the list — it saves automatically.'],
              ['Open a record', 'Double-click a row to open the order, then change its Flow Status.'],
              ['Row actions', 'Delete, Restore, and Edit.']
            ]
          }
        ]
      },
      {
        id: 'sales-invoice',
        title: 'Sales Invoice',
        blocks: [
          { type: 'lead', text: 'The bill you give the customer for goods/services. It can be created directly, from a Sale Order (Create Invoice when the order is Ready for Invoice), or from the Dispatch screen (Create Sales Invoice).' },
          { type: 'path', text: 'Open the Sales Invoice screen.' },
          { type: 'subheading', text: 'Invoice details' },
          {
            type: 'fields',
            fields: [
              { name: 'Bill Type', required: 'Yes', enter: 'Cash, Credit or Others', why: 'Cash = paid now; Credit = pay later.' },
              { name: 'Customer', required: 'Yes', enter: 'Select the customer', why: 'Pulls in their details.' },
              { name: 'Invoice No', required: 'Auto/Yes', enter: 'Invoice number', why: 'Unique reference for the bill.' },
              { name: 'Invoice Date', required: 'Yes', enter: 'Date of the invoice', why: 'The billing date.' },
              { name: 'Due Date', required: 'No', enter: 'When payment is due', why: 'Used for receivables/ageing.' },
              { name: 'Ref No / Ref Date', required: 'No', enter: 'Customer reference', why: 'Links to the customer’s reference.' },
              { name: 'Tax', required: 'Yes', enter: 'Inclusive or Exclusive', why: 'How tax is treated on prices.' },
              { name: 'Remarks', required: 'No', enter: 'Notes', why: 'Free notes on the invoice.' }
            ]
          },
          { type: 'subheading', text: 'Items & totals' },
          { type: 'para', text: 'Add products the same way as a Sale Order — **Add Product**, search the product, set Quantity, Rate and Discount. The same **column-settings gear** (show/hide and resize columns) is available. CNL calculates **Items Total**, **Taxable Amount**, **Output CGST/SGST/IGST**, **Cess**, **Shipping**, **Discount**, **Advance** and the final **Total Value**.' },
          { type: 'subheading', text: 'How invoicing moves the order' },
          { type: 'para', text: 'When an invoice is created from a Sale Order: invoicing **all** the items moves the order to **Delivery In progress**; invoicing only **some** items moves it to **Partially Delivered** (the rest stay in production and the order completes automatically when they are done).' },
          { type: 'tip', text: 'Bill Type "Credit" creates a receivable (money owed) that shows on your Dashboard and ageing reports until a Payment Receipt is recorded.' }
        ]
      },
      {
        id: 'sales-dispatch',
        title: 'Dispatch & Delivery',
        blocks: [
          { type: 'lead', text: 'When a Sale Order’s Flow Status is set to Dispatch, the order appears on the Sales Dispatch screen ready to send.' },
          { type: 'path', text: 'From a Sale Order at "Dispatch" status click Go to Dispatch — or open the Sales Dispatch screen.' },
          { type: 'subheading', text: 'Sales Dispatch list' },
          { type: 'para', text: 'Shows the orders waiting to be dispatched, with **Customer**, **Order No** and **Products** (each product name and quantity). Search by customer, order number or product.' },
          { type: 'subheading', text: 'Confirm a dispatch' },
          {
            type: 'steps',
            items: [
              'Find the order and click **Confirm Dispatch**.',
              'A dialog asks "Are you sure you want to confirm dispatch for the order …?" — click **Confirm** (or Cancel).',
              'The order moves to the next stage, and a "Dispatch successful" message appears with a **Create Sales Invoice** button.',
              'Click **Create Sales Invoice** to jump straight to billing that order — the invoice is started for you.'
            ]
          },
          { type: 'subheading', text: 'Delivery Challan' },
          { type: 'para', text: 'A note that accompanies goods being delivered (before or without the invoice).' },
          {
            type: 'fields',
            fields: [
              { name: 'Customer', required: 'Yes', enter: 'Select the customer', why: 'Who the goods go to.' },
              { name: 'Challan No / Challan Date', required: 'No', enter: 'Number and date', why: 'Reference for the challan.' },
              { name: 'Tax', required: 'No', enter: 'Inclusive or Exclusive', why: 'How tax is treated on prices.' },
              { name: 'GST Type / Salesman / Remarks', required: 'No', enter: 'Tax type, salesman and notes', why: 'Extra details.' }
            ]
          },
          { type: 'para', text: 'Add the products being delivered; totals (Items Total, Discount, Taxable, Output CGST/SGST/IGST, Cess) are calculated like other documents.' },
          { type: 'subheading', text: 'Sale Receipt / Delivery Acknowledgement' },
          { type: 'para', text: 'The **Delivery Acknowledgement List** lets you confirm the customer received the goods. Click **Confirm Delivery** to mark the order **Delivered** (this advances the order), and you can **Upload** proof of delivery.' }
        ]
      },
      {
        id: 'sales-payment-receipt',
        title: 'Payment Receipt',
        blocks: [
          { type: 'lead', text: 'Record money received from a customer. When you pick the customer, CNL shows their unpaid invoices so you can see exactly what is owed.' },
          { type: 'path', text: 'Open the Payment Receipt screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Date', required: 'Yes', enter: 'Date money was received', why: 'When the payment came in.' },
              { name: 'Voucher No', required: 'Yes', enter: 'Receipt number', why: 'Unique reference for this receipt.' },
              { name: 'Customer', required: 'Yes', enter: 'Select the customer', why: 'Who paid — also loads their unpaid invoices below.' },
              { name: 'Cash/Bank A/c', required: 'Yes', enter: 'Account that received the money', why: 'Which cash/bank account the payment went into.' },
              { name: 'Amount', required: 'Yes', enter: 'Amount received', why: 'How much was paid.' },
              { name: 'Payment Method', required: 'Yes', enter: 'Cash / Bank Transfer / Cheque / Credit Card', why: 'How the customer paid.' },
              { name: 'Payment Status', required: 'Yes', enter: 'Pending / Completed / Failed', why: 'Whether the payment has cleared.' },
              { name: 'Cheque No / Party Bank Ref.', required: 'No', enter: 'Reference details', why: 'For cheque/transfer tracking.' },
              { name: 'Salesman', required: 'No', enter: 'Select a salesman', why: 'Who handled the sale.' },
              { name: 'Description', required: 'No', enter: 'Notes', why: 'Free notes on the receipt.' }
            ]
          },
          { type: 'subheading', text: 'Customer’s unpaid invoices' },
          { type: 'para', text: 'After you select the customer, a table lists their invoices: **Sale Invoice**, **Bill Date**, **Due Date**, **Total Amount** and **Outstanding (₹)** — so you can match the payment to what’s due.' },
          { type: 'tip', text: 'Recording a receipt reduces the customer’s outstanding balance, which lowers Receivables on the Dashboard.' },

          { type: 'subheading', text: 'Payment Receipt List' },
          { type: 'para', text: 'Open the **Payment Receipt List** to see all receipts (the example shows columns and totals across pages).' },
          {
            type: 'table',
            columns: ['Feature', 'How it works'],
            rows: [
              ['Columns', 'Customer Name, Invoice No, Receipt No, Total Amount, Outstanding, Adjust Now (₹), Payment Status, Payment Date.'],
              ['Adjust Now (₹)', 'Edit this column directly in the list to allocate/adjust how much of the payment is applied to that invoice — it saves automatically.'],
              ['Search & Columns', 'Search receipts; use the Columns button to show or hide columns.'],
              ['Select rows', 'Tick the checkboxes to choose receipts for the actions below.'],
              ['Open a record', 'Double-click a row, or click the Edit pencil, to open the receipt.']
            ]
          },
          { type: 'subheading', text: 'Send Mail & Print Document' },
          { type: 'para', text: 'From the list you can **Send Mail** to email a receipt to the customer, and **Print Document** to generate and print the receipt as a PDF.' }
        ]
      },
      {
        id: 'sales-returns-notes',
        title: 'Returns, Credit & Debit Notes',
        blocks: [
          { type: 'lead', text: 'Handle goods coming back and money adjustments after a sale.' },

          { type: 'subheading', text: 'Sale Return' },
          { type: 'para', text: 'Record goods a customer sends back.' },
          {
            type: 'fields',
            fields: [
              { name: 'Bill Type', required: 'Yes', enter: 'Cash / Credit / Others', why: 'The type of the original sale.' },
              { name: 'Customer', required: 'Yes', enter: 'Select the customer', why: 'Who is returning goods.' },
              { name: 'Against Bill / Against Bill Date', required: 'No', enter: 'The original invoice being returned', why: 'Links the return to the sale it reverses.' },
              { name: 'Return No / Return Date', required: 'Yes', enter: 'Number and date', why: 'Reference for the return.' },
              { name: 'Return Option / Return Reason', required: 'No', enter: 'How and why goods are returned', why: 'Records the reason (e.g. damaged).' },
              { name: 'Ref No / Ref Date / Tax / Remarks', required: 'No', enter: 'References and notes', why: 'Extra details.' }
            ]
          },
          { type: 'para', text: 'Add the returned items; CNL calculates Items Total, Discount, Cess, Shipping and Output CGST/SGST/IGST.' },

          { type: 'subheading', text: 'Credit Note' },
          { type: 'para', text: 'Reduce what a customer owes you (e.g. for a return or over-charge).' },
          {
            type: 'fields',
            fields: [
              { name: 'Customer', required: 'Yes', enter: 'Select the customer', why: 'Whose balance to reduce.' },
              { name: 'Sale Invoice', required: 'No', enter: 'The related invoice', why: 'Links the note to the bill.' },
              { name: 'Credit Note No / Credit Date', required: 'No', enter: 'Number and date', why: 'Reference for the note.' },
              { name: 'Total Amount / Order Status / Reason', required: 'No', enter: 'Amount, status and reason', why: 'How much credit and why.' }
            ]
          },
          { type: 'para', text: 'Add the affected products (Product, Quantity, Rate, Amount).' },

          { type: 'subheading', text: 'Debit Note' },
          { type: 'para', text: 'Increase what a customer owes you (e.g. an extra charge). It has the same fields as a Credit Note — Customer, Sale Invoice, Number, Debit Date, Total Amount, Order Status, Reason and products.' },
          { type: 'tip', text: 'Credit Note = the customer owes less. Debit Note = the customer owes more.' }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 5 — PURCHASE
  // =====================================================================
  {
    id: 'purchase',
    title: 'Purchase',
    icon: 'fas fa-shopping-bag',
    summary: 'Buying from vendors — order, bill and pay.',
    topics: [
      {
        id: 'purchase-flow',
        title: 'The purchase flow (start here)',
        blocks: [
          { type: 'lead', text: 'Buying follows the mirror of selling. Each step flows into the next.' },
          {
            type: 'steps',
            items: [
              '**Purchase Order** — tell a vendor what you want to buy.',
              '**Receive goods** — stock comes in (updates Inventory).',
              '**Purchase Invoice (Bill)** — record the vendor’s bill.',
              '**Bill Payment** — pay the vendor.'
            ]
          },
          { type: 'para', text: 'Supporting document: **Purchase Return** — goods you send back to a vendor.' }
        ]
      },
      {
        id: 'purchase-order',
        title: 'Purchase Order',
        blocks: [
          { type: 'lead', text: 'The order you raise on a vendor for goods you want to buy.' },
          { type: 'path', text: 'Open the Purchase screen (Purchase Order).' },
          { type: 'subheading', text: 'Order details' },
          {
            type: 'fields',
            fields: [
              { name: 'Purchase Type', required: 'No', enter: 'Pick the type', why: 'Classifies the purchase.' },
              { name: 'Vendor', required: 'Yes', enter: 'Select the supplier', why: 'Pulls in their details and address.' },
              { name: 'Order No', required: 'Yes', enter: 'Order number', why: 'Unique reference for this PO.' },
              { name: 'Order Date', required: 'Yes', enter: 'Date raised', why: 'When you placed the order.' },
              { name: 'Delivery Date', required: 'Yes', enter: 'Expected delivery', why: 'When you expect the goods.' },
              { name: 'Ref Date', required: 'Yes', enter: 'Reference date', why: 'Date of your reference document.' },
              { name: 'Ref No', required: 'No', enter: 'Your reference', why: 'Links to your own reference.' },
              { name: 'Tax', required: 'No', enter: 'Inclusive or Exclusive', why: 'Whether prices include tax.' },
              { name: 'Remarks', required: 'No', enter: 'Notes', why: 'Free notes about the order.' }
            ]
          },
          { type: 'subheading', text: 'Items (products) table' },
          { type: 'para', text: 'Click **Add Product** to add a row, then pick the **Product** (Code, Size, Color fill in), choose **Unit**, enter **Quantity** and **Price/Rate**, apply a **Discount**. CGST/SGST/IGST and the line **Amount** are calculated.' },
          { type: 'subheading', text: 'Billing details' },
          { type: 'para', text: 'CNL totals **Items Total**, **Product Discount**, **Taxable**, **Cess**, **Output CGST/SGST/IGST**, **Discount**, **Advance** and the grand total for you.' },
          { type: 'subheading', text: 'Buttons on the screen' },
          {
            type: 'table',
            columns: ['Button', 'What it does'],
            rows: [
              ['Copy', 'Copy this order’s details into another document (you pick the target).'],
              ['Past Orders', 'Browse earlier orders.'],
              ['Purchase Order List', 'Open the list of all purchase orders.']
            ]
          },
          { type: 'subheading', text: 'Purchase Order List' },
          {
            type: 'table',
            columns: ['Feature', 'How it works'],
            rows: [
              ['Columns', 'Purchase Type, Order Date, Order No, Tax, Tax Amount, Total Amount, Vendor, Status, Remarks.'],
              ['Search', 'Search the orders.'],
              ['Open a record', 'Double-click a row to open the order.'],
              ['Row actions', 'Delete, Restore, and Edit.']
            ]
          }
        ]
      },
      {
        id: 'purchase-invoice',
        title: 'Purchase Invoice (Bill)',
        blocks: [
          { type: 'lead', text: 'Record the bill you receive from a vendor for goods supplied.' },
          { type: 'path', text: 'Open the Purchase Invoice screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Purchase Type', required: 'Yes', enter: 'Pick the type', why: 'Classifies the purchase.' },
              { name: 'Vendor', required: 'Yes', enter: 'Select the supplier', why: 'Whose bill this is.' },
              { name: 'Invoice No / Invoice Date', required: 'Yes', enter: 'Your internal bill number & date', why: 'Your record of the bill.' },
              { name: 'Delivery Date', required: 'Yes', enter: 'Delivery date', why: 'When the goods are delivered.' },
              { name: 'Supplier Invoice No / Date', required: 'No', enter: 'The number printed on the vendor’s bill', why: 'Matches your record to their document.' },
              { name: 'Due Date', required: 'Yes', enter: 'When payment is due', why: 'Used for payables/ageing.' },
              { name: 'Voucher', required: 'No', enter: 'GST Purchase / Purchase', why: 'How the bill is posted in accounts.' },
              { name: 'Tax / Tax Code', required: 'No', enter: 'Tax treatment', why: 'Applies the right tax.' },
              { name: 'Remarks', required: 'No', enter: 'Notes', why: 'Free notes.' }
            ]
          },
          { type: 'para', text: 'Add items and CNL calculates the totals exactly like the Purchase Order.' },
          { type: 'tip', text: 'A purchase bill creates a payable (money you owe) that shows in Payables on the Dashboard until you record a Bill Payment.' }
        ]
      },
      {
        id: 'bill-payment',
        title: 'Bill Payment',
        blocks: [
          { type: 'lead', text: 'Record money you pay to a vendor against their bills.' },
          { type: 'path', text: 'Open the Bill Payments screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Date', required: 'Yes', enter: 'Payment date', why: 'When you paid.' },
              { name: 'Voucher No', required: 'Auto/Yes', enter: 'Voucher number', why: 'Reference for this payment.' },
              { name: 'Vendor', required: 'Yes', enter: 'Who you paid', why: 'Reduces that vendor’s balance.' },
              { name: 'Cash/Bank A/c', required: 'Yes', enter: 'Account paid from', why: 'Which cash/bank account was used.' },
              { name: 'Amount', required: 'Yes', enter: 'Amount paid', why: 'How much was paid.' },
              { name: 'Payment Method', required: 'No', enter: 'Cash / Bank Transfer / Cheque / Credit Card', why: 'How you paid.' },
              { name: 'Cheque No / Party Bank Ref.', required: 'No', enter: 'Reference details', why: 'For cheque/transfer tracking.' },
              { name: 'Payment Status', required: 'No', enter: 'Pending / Completed / Failed', why: 'Tracks whether the payment cleared.' },
              { name: 'Salesman', required: 'No', enter: 'Select a salesman', why: 'Who handled it.' },
              { name: 'Description', required: 'No', enter: 'Notes', why: 'Free notes on the payment.' }
            ]
          },
          { type: 'subheading', text: 'Bill Payments List' },
          { type: 'para', text: 'Open the **Bill Payments List** to see all payments.' },
          {
            type: 'table',
            columns: ['Feature', 'How it works'],
            rows: [
              ['Columns', 'Invoice No, Receipt No, Total Amount, Outstanding, Adjust Now (₹), Payment Status, Payment Date.'],
              ['Adjust Now (₹)', 'Edit this column directly in the list to allocate/adjust how much is applied to that bill — it saves automatically.'],
              ['Search & Columns', 'Search by invoice no, receipt no, vendor, payment method/status; show or hide columns.'],
              ['Send Mail / Print Document', 'Email a payment to the vendor, or generate and print it as a PDF.']
            ]
          }
        ]
      },
      {
        id: 'purchase-return',
        title: 'Purchase Return',
        blocks: [
          { type: 'lead', text: 'Record goods you send back to a vendor.' },
          { type: 'path', text: 'Open the Purchase Return Orders screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Purchase Type / Vendor', required: 'Yes', enter: 'Type and supplier', why: 'Who the return is to.' },
              { name: 'Return No / Return Date', required: 'Yes', enter: 'Return number & date', why: 'Reference for the return.' },
              { name: 'Return Reason', required: 'No', enter: 'Why goods are returned', why: 'Records the reason (e.g. damaged).' },
              { name: 'Ref No / Ref Date / Due Date', required: 'No', enter: 'References', why: 'Links to the original purchase.' }
            ]
          },
          { type: 'para', text: 'Add the items being returned; totals are calculated the same way as a purchase.' }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 6 — FINANCE
  // =====================================================================
  {
    id: 'finance',
    title: 'Finance',
    icon: 'fas fa-coins',
    summary: 'Accounts, ledgers, vouchers, budgets and tax.',
    topics: [
      {
        id: 'finance-overview',
        title: 'Finance overview',
        blocks: [
          { type: 'lead', text: 'Finance is where every sale, purchase and payment turns into accounting. Set up your accounts once, and CNL keeps the books as you work.' },
          {
            type: 'table',
            columns: ['Screen', 'Use it to…'],
            rows: [
              ['Chart of Accounts', 'Define your list of accounts (the backbone of the books).'],
              ['Account Ledger', 'See all transactions for an account.'],
              ['Bank Account', 'Record your bank accounts and balances.'],
              ['Journal Entry / Journal Voucher', 'Post accounting entries directly.'],
              ['Payment Transaction', 'Record payments against sales/purchases.'],
              ['Expense Claim', 'Track employee expense claims.'],
              ['Budget', 'Plan and track spending per account.'],
              ['Tax Configuration', 'Define your tax rates.'],
              ['Financial Report', 'View financial statements and summaries.']
            ]
          },
          { type: 'tip', text: 'Set up the Chart of Accounts and Tax Configuration first — the rest of Finance builds on them.' }
        ]
      },
      {
        id: 'chart-of-accounts',
        title: 'Chart of Accounts',
        blocks: [
          { type: 'lead', text: 'Your master list of accounts. Every transaction is posted to one of these.' },
          { type: 'path', text: 'Open the Chart of Accounts screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Account Code', required: 'Yes', enter: 'A unique code', why: 'Short identifier for the account.' },
              { name: 'Account Name', required: 'Yes', enter: 'The account’s name', why: 'What you see in lists and reports.' },
              { name: 'Account Type', required: 'Yes', enter: 'Asset, Liability, Equity, Revenue or Expense', why: 'Decides where the account appears in your statements.' },
              { name: 'Parent Account', required: 'No', enter: 'A higher-level account', why: 'Groups accounts into a hierarchy.' },
              { name: 'Bank Account', required: 'No', enter: 'Link a bank account', why: 'Marks this as a bank ledger.' },
              { name: 'Is Active', required: 'No', enter: 'Tick to keep it usable', why: 'Inactive accounts are hidden from new entries.' }
            ]
          }
        ]
      },
      {
        id: 'ledger-accounts',
        title: 'Ledger Accounts',
        blocks: [
          { type: 'lead', text: 'Create the ledger accounts (parties and heads) your transactions post to. Each account sits under a group, and its code is generated for you.' },
          { type: 'path', text: 'Open the Ledger Accounts (Chart Accounts) screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Name', required: 'Yes', enter: 'The account name', why: 'What you see in lists and reports.' },
              { name: 'Code', required: 'Auto', enter: 'Generated automatically (read-only)', why: 'Set for you based on the group you choose.' },
              { name: 'Type', required: 'Yes', enter: 'General, Cash or Bank', why: 'The kind of ledger account.' },
              { name: 'Under Group', required: 'Yes', enter: 'Select a ledger group', why: 'Where the account sits in the hierarchy; also drives the code.' },
              { name: 'Account No', required: 'No', enter: 'Bank / account number', why: 'For bank or cash accounts.' },
              { name: 'RTGS IFSC Code', required: 'No', enter: 'IFSC code', why: 'For bank transfers.' },
              { name: 'Classification', required: 'No', enter: 'A classification', why: 'Extra grouping detail.' },
              { name: 'Address / PAN', required: 'No', enter: 'Party address and PAN', why: 'Used for party ledgers.' },
              { name: 'TDS Applicable / Is Subledger / Inactive / Is Loan Account', required: 'No', enter: 'Tick as needed', why: 'Flags that control how the account behaves.' }
            ]
          },
          { type: 'para', text: 'Click **Submit** to save. Use **Chart Accounts List** to view existing accounts; double-click a row to edit it.' }
        ]
      },
      {
        id: 'account-ledger',
        title: 'Account Ledger',
        blocks: [
          { type: 'lead', text: 'A statement of every debit and credit for a chosen account, with the running balance — so you can see exactly how its balance was built up.' },
          { type: 'path', text: 'Open the Account Ledger screen.' },
          { type: 'subheading', text: 'Pick an account' },
          { type: 'para', text: 'Select the account to view — it can be a **Customer**, a **Vendor**, or a **Ledger Account**. The statement loads for that account.' },
          { type: 'subheading', text: 'The ledger table' },
          {
            type: 'table',
            columns: ['Column', 'Shows'],
            rows: [
              ['Voucher No', 'The voucher / reference for the entry.'],
              ['Date', 'When it was posted.'],
              ['Description', 'What the entry was.'],
              ['Debit / Credit', 'The amount on each side (₹).'],
              ['Balance', 'The running balance after each entry, tagged Dr or Cr.']
            ]
          },
          { type: 'para', text: 'A summary shows **Opening Balance**, **Total Debit**, **Total Credit** and **Closing Balance**.' },
          { type: 'subheading', text: 'Useful actions' },
          {
            type: 'table',
            columns: ['Action', 'What it does'],
            rows: [
              ['Double-click a row', 'Jumps to the source document that created the entry (sale invoice, sale order, credit/debit note, purchase invoice, journal entry, etc.).'],
              ['Filters', 'Narrow the statement by Period or a From / To date range (and City for a customer/vendor).'],
              ['Preview', 'Open the ledger as a PDF in a new tab.'],
              ['Print', 'Open and print the ledger PDF.'],
              ['Export', 'Download the ledger to Excel.']
            ]
          },
          { type: 'tip', text: 'The running balance is tagged **Dr** (debit side) or **Cr** (credit side) so you can see which way the account stands at a glance.' }
        ]
      },
      {
        id: 'bank-account',
        title: 'Bank Account',
        blocks: [
          { type: 'lead', text: 'Record each of your bank accounts so payments and balances can be tracked.' },
          { type: 'path', text: 'Open the Bank Account screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Account Name', required: 'Yes', enter: 'Name of the account', why: 'Identifies the bank account.' },
              { name: 'Account Number', required: 'Yes', enter: 'Bank account number', why: 'The actual account.' },
              { name: 'Bank Name', required: 'Yes', enter: 'The bank', why: 'Where the account is held.' },
              { name: 'Branch Name / IFSC Code', required: 'No', enter: 'Branch and IFSC', why: 'For transfers.' },
              { name: 'Account Type', required: 'Yes', enter: 'Savings or Current', why: 'Type of account.' },
              { name: 'Balance', required: 'Yes', enter: 'Opening balance', why: 'Starting balance for tracking.' }
            ]
          }
        ]
      },
      {
        id: 'journal-entry',
        title: 'Journal Entry',
        blocks: [
          { type: 'lead', text: 'Post accounting entries directly — for expenses, payments, receipts and other vouchers.' },
          { type: 'path', text: 'Open the Journal Entry screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Voucher Type', required: 'Yes', enter: 'Common, Expense, Payment, Receipt or Other', why: 'The kind of entry you are posting.' },
              { name: 'Entry Date', required: 'Yes', enter: 'Date of the entry', why: 'When it is posted.' },
              { name: 'Voucher No', required: 'No', enter: 'Voucher number', why: 'Reference for the entry.' },
              { name: 'Cash/Bank Posting', required: 'Yes', enter: 'Single or Line Wise', why: 'Whether one total or each line posts to cash/bank.' },
              { name: 'Cash/Bank A/c', required: 'Yes', enter: 'Select account', why: 'Which account the money moves through.' },
              { name: 'Reference No / Reference', required: 'No', enter: 'A reference', why: 'Links to a source document.' },
              { name: 'Description', required: 'No', enter: 'Notes', why: 'Explains the entry.' }
            ]
          },
          { type: 'subheading', text: 'Entry lines (table)' },
          { type: 'para', text: 'Add a row per posting: choose the **Account** (a Customer, Vendor or ledger account), enter the **Debit** or **Credit** amount, and an optional **Description**.' }
        ]
      },
      {
        id: 'journal-voucher',
        title: 'Journal Voucher',
        blocks: [
          { type: 'lead', text: 'A classic double-entry voucher with multiple debit/credit lines.' },
          { type: 'path', text: 'Open the Journal Voucher screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Voucher Type', required: 'Yes', enter: 'Journal, Contra, Receipt, Payment, Debit Note or Credit Note', why: 'The type of accounting voucher.' },
              { name: 'Date / Voucher No', required: 'No', enter: 'Date and number', why: 'Identifies the voucher.' },
              { name: 'Reference No / Reference Date', required: 'No', enter: 'Reference details', why: 'Links to a source document.' },
              { name: 'Narration', required: 'No', enter: 'A description of the voucher', why: 'Explains the entry.' }
            ]
          },
          { type: 'subheading', text: 'Voucher Lines (table)' },
          { type: 'para', text: 'Add a row per posting: choose the **Ledger Account**, set **Dr/Cr**, and enter the **Dr** or **Cr** amount. Each line can also have a **Party**, **Bill No**, **Remark** and **Attachments**. Total debits must equal total credits.' }
        ]
      },
      {
        id: 'payment-transaction',
        title: 'Payment Transaction',
        blocks: [
          { type: 'lead', text: 'Record a payment received or made against a sale or purchase.' },
          { type: 'path', text: 'Open the Payment Transaction screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Order Type', required: 'Yes', enter: 'Sale or Purchase', why: 'What the payment is for.' },
              { name: 'Invoice', required: 'No', enter: 'Select the invoice', why: 'Which bill the payment applies to.' },
              { name: 'Transaction Type', required: 'Yes', enter: 'Credit or Debit', why: 'Whether money comes in or goes out.' },
              { name: 'Payment Date', required: 'Yes', enter: 'Date of payment', why: 'When it happened.' },
              { name: 'Payment Method', required: 'Yes', enter: 'Cash / Bank Transfer / Credit Card / Cheque', why: 'How it was paid.' },
              { name: 'Payment Status', required: 'Yes', enter: 'Pending / Completed / Failed', why: 'Whether it cleared.' },
              { name: 'Amount', required: 'Yes', enter: 'Amount', why: 'How much.' },
              { name: 'Currency / Reference Number / Notes', required: 'No', enter: 'Currency, a reference, and notes', why: 'Extra details for the payment.' }
            ]
          }
        ]
      },
      {
        id: 'expense-claim',
        title: 'Expense Claim',
        blocks: [
          { type: 'lead', text: 'Let employees claim expenses and track approval.' },
          { type: 'path', text: 'Open the Expense Claim screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Employee', required: 'No', enter: 'Who is claiming', why: 'Whose expense it is.' },
              { name: 'Claim Date', required: 'Yes', enter: 'Date of the claim', why: 'When it was raised.' },
              { name: 'Total Amount', required: 'Yes', enter: 'Amount claimed', why: 'How much to reimburse.' },
              { name: 'Status', required: 'No', enter: 'Pending / Approved / Rejected', why: 'Tracks the approval.' },
              { name: 'Description', required: 'No', enter: 'What it was for', why: 'Explains the claim.' }
            ]
          }
        ]
      },
      {
        id: 'expense-item',
        title: 'Expense',
        blocks: [
          { type: 'lead', text: 'Record a business expense — the amount, who it was for, and the ledger account it posts against. Mark it taxable to capture the tax too.' },
          { type: 'path', text: 'Open the Expense screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Expense Date', required: 'Yes', enter: 'The date of the expense', why: 'When the expense was incurred.' },
              { name: 'Amount', required: 'Yes', enter: 'The expense amount', why: 'How much was spent.' },
              { name: 'Description', required: 'No', enter: 'What it was for', why: 'Explains the expense.' },
              { name: 'Ledger Account', required: 'Yes', enter: 'Select a ledger account', why: 'The account the expense is posted against.' },
              { name: 'Vendor', required: 'No', enter: 'Select a vendor', why: 'Who the expense was paid to, if applicable.' },
              { name: 'Employee', required: 'No', enter: 'Select an employee', why: 'The employee linked to the expense, if any.' },
              { name: 'Status', required: 'No', enter: 'Pending / Paid / Rejected', why: 'Tracks whether the expense has been paid.' },
              { name: 'Reference Number', required: 'No', enter: 'A reference / bill number', why: 'Links to a bill or receipt.' },
              { name: 'Taxable', required: 'No', enter: 'Tick if the expense has tax (ticked by default)', why: 'When ticked, Tax Configuration and Tax Amount appear.' },
              { name: 'Tax Configuration', required: 'No', enter: 'Select a tax (shown when Taxable)', why: 'Which tax rate applies.' },
              { name: 'Tax Amount', required: 'No', enter: 'The tax amount (shown when Taxable)', why: 'The tax portion of the expense.' }
            ]
          },
          { type: 'para', text: 'Click **Submit** to save. Use **Expense List** to view saved expenses; double-click a row to edit it.' }
        ]
      },
      {
        id: 'budget',
        title: 'Budget',
        blocks: [
          { type: 'lead', text: 'Plan how much to spend on an account and track actual spend against it.' },
          { type: 'path', text: 'Open the Budget screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Account', required: 'No', enter: 'Which account to budget', why: 'What you are planning for.' },
              { name: 'Fiscal Year', required: 'Yes', enter: 'The financial year', why: 'The budget period.' },
              { name: 'Allocated Amount', required: 'Yes', enter: 'Planned amount', why: 'Your budget figure.' },
              { name: 'Spent Amount', required: 'No', enter: 'Actual spent', why: 'Compares against the plan.' }
            ]
          }
        ]
      },
      {
        id: 'tax-configuration',
        title: 'Tax Configuration',
        blocks: [
          { type: 'lead', text: 'Define the tax rates CNL applies on documents.' },
          { type: 'path', text: 'Open the Tax Configuration screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Name', required: 'Yes', enter: 'Tax name (e.g. GST 18%)', why: 'What you pick on documents.' },
              { name: 'Rate', required: 'Yes', enter: 'The rate value', why: 'How much tax to apply.' },
              { name: 'Tax Type', required: 'Yes', enter: 'Percentage or Fixed', why: 'Whether the rate is a % or a fixed amount.' },
              { name: 'Is Active', required: 'No', enter: 'Tick to keep it usable', why: 'Inactive taxes are hidden.' }
            ]
          }
        ]
      },
      {
        id: 'financial-report',
        title: 'Financial Report',
        blocks: [
          { type: 'lead', text: 'A Profit & Loss style report — your income, expenses and net profit for a period, built automatically from your transactions.' },
          { type: 'path', text: 'Open the Financial Report screen.' },
          { type: 'subheading', text: 'Generate a report' },
          { type: 'para', text: 'Pick a **Quick Period** — Today, Yesterday, Last Week, Current Month, Last Month, Last Six Months, Current Quarter or Year to Date — or set a custom **From date** / **To date**, then click **Generate Report**.' },
          { type: 'subheading', text: 'What it shows' },
          {
            type: 'table',
            columns: ['Section', 'Includes'],
            rows: [
              ['Income', 'Sales Invoices (billed to customers), Sales Credit Notes (refunds/returns), Sales Debit Notes → Total Sales.'],
              ['Expenses', 'Purchase Invoices, General Expenses, Salaries (payroll) → Total Expenses.'],
              ['Net Profit', 'Total income minus total expenses.']
            ]
          },
          { type: 'para', text: 'Generated reports are saved and listed (Report Name, Report Type, Generated At) so you can re-open them.' }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 7 — INVENTORY
  // =====================================================================
  {
    id: 'inventory',
    title: 'Inventory',
    icon: 'fas fa-boxes',
    summary: 'Track stock, locations and stock movements.',
    topics: [
      {
        id: 'inventory-overview',
        title: 'Inventory overview',
        blocks: [
          { type: 'lead', text: 'The Inventory menu keeps your stock accurate. It groups these screens:' },
          {
            type: 'table',
            columns: ['In the Inventory menu', 'Use it to…'],
            rows: [
              ['Inventory', 'See the current stock balance of every product (read-only view).'],
              ['Products', 'Add and edit products (see the Products topic in Masters).'],
              ['Warehouses', 'Define the physical locations where stock is kept.'],
              ['Quick Packs', 'Define fixed product bundles (see the Quick Packs topic).']
            ]
          },
          { type: 'tip', text: 'Stock goes up automatically when you receive a purchase and down when you make a sale. To adjust stock manually, use the Stock Journal screen (in the Production menu).' }
        ]
      },
      {
        id: 'inventory-stock',
        title: 'Inventory (stock view)',
        blocks: [
          { type: 'lead', text: 'A live, read-only view of your products and how much is in stock — use it to check availability before promising goods, and to spot items running low.' },
          { type: 'path', text: 'Open the Inventory screen.' },
          { type: 'subheading', text: 'Three tabs' },
          {
            type: 'table',
            columns: ['Tab', 'Shows'],
            rows: [
              ['Inventory', 'Products tracked as physical stock, with their balance and locations.'],
              ['Non Inventory', 'Products that are not stock-tracked (Name, Code, Category).'],
              ['Services', 'Service items (Name, Code).']
            ]
          },
          { type: 'subheading', text: 'Inventory tab columns' },
          { type: 'para', text: 'Name, Code, Type, Group, Category, Unit, MRP, Purchase Rate, Sales Rate, Wholesale Rate, Dealer Rate, **Balance** (current stock), Warehouse and Location.' },
          { type: 'para', text: 'Search across all of those, and **Export** the list to Excel. **Double-click** a row to open that **Product** to edit it (this screen itself is view-only — there is no Add here).' }
        ]
      },
      {
        id: 'warehouses',
        title: 'Warehouses',
        blocks: [
          { type: 'lead', text: 'Each place you store stock. Branches use warehouses to know where their stock is.' },
          { type: 'path', text: 'Open the Warehouses screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Name', required: 'Yes', enter: 'Warehouse name', why: 'Identifies the location.' },
              { name: 'City', required: 'Yes', enter: 'Select the city', why: 'Where the warehouse is.' },
              { name: 'State', required: 'Yes', enter: 'Select the state', why: 'Where the warehouse is.' },
              { name: 'Code', required: 'No', enter: 'Short code', why: 'Used to reference the warehouse.' },
              { name: 'Item Type', required: 'No', enter: 'Type of items stored', why: 'Categorises the warehouse.' },
              { name: 'Address / Country / Pin Code', required: 'No', enter: 'Location details', why: 'Full address of the warehouse.' },
              { name: 'Phone / Email', required: 'No', enter: 'Contact details', why: 'Who to reach at this location.' },
              { name: 'Longitude / Latitude', required: 'No', enter: 'Map coordinates', why: 'For mapping the location.' }
            ]
          },
          { type: 'para', text: 'The list shows Name, Code, Phone, City and State; double-click a row to open it, and Export to Excel.' }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 12 — PRODUCTION & MORE
  // =====================================================================
  {
    id: 'production',
    title: 'Production & More',
    icon: 'fas fa-industry',
    summary: 'Manufacturing, quick packs and tasks.',
    topics: [
      {
        id: 'production-overview',
        title: 'Production overview',
        blocks: [
          { type: 'lead', text: 'Production turns raw materials into finished goods. The Production menu has these screens:' },
          {
            type: 'table',
            columns: ['In the Production menu', 'Use it to…'],
            rows: [
              ['Work Order', 'Create a job to make a product from its BOM.'],
              ['Work Order Board', 'Track and complete work orders that are in production.'],
              ['BOM', 'Define what a product is made of (its recipe).'],
              ['Stock Journal', 'Manually adjust stock (covered in the Stock Journal topic).'],
              ['Materials Issue To Production Floor', 'Send raw materials out to the floor.'],
              ['Materials Received From Production Floor', 'Receive finished/leftover goods back from the floor.'],
              ['Stock Summary', 'See opening, received, issued and closing stock per product.']
            ]
          }
        ]
      },
      {
        id: 'work-order',
        title: 'Work Order',
        blocks: [
          { type: 'lead', text: 'A job to manufacture a product. It pulls the materials from the product’s BOM and tracks the work, workers, machines and stages.' },
          { type: 'path', text: 'Open the Work Order screen.' },
          { type: 'subheading', text: 'Main details' },
          {
            type: 'fields',
            fields: [
              { name: 'BOM Name', required: 'Yes', enter: 'Pick the BOM', why: 'The recipe used to make the product.' },
              { name: 'Product', required: 'Yes', enter: 'What you are making', why: 'The finished product.' },
              { name: 'Quantity', required: 'Yes', enter: 'How many to make', why: 'The production quantity.' },
              { name: 'Notes', required: 'Yes', enter: 'Notes about the job', why: 'Details for the floor.' },
              { name: 'Creating for Sale Order?', required: 'Yes', enter: 'Yes or No', why: 'If Yes, link it to an Order No so the goods fulfil that sale.' },
              { name: 'Order No', required: 'If for a sale order', enter: 'The sale order', why: 'Which order this production is for.' },
              { name: 'Status / Start date / End date', required: 'No', enter: 'Progress and dates', why: 'Track the job — Completed and Pending quantities update as work is done.' }
            ]
          },
          { type: 'subheading', text: 'Sections' },
          {
            type: 'table',
            columns: ['Section', 'What it holds'],
            rows: [
              ['Bill Of Material', 'The materials consumed: Product, Size, Color, Quantity, Unit Cost, Total Cost — pulled from the BOM.'],
              ['Workers', 'Worker and Hours Worked.'],
              ['Machines', 'Machine, Work Stage, Hours and Worker.'],
              ['Work Stages', 'Stage Name, Description, Start/End Date and Notes.']
            ]
          },
          { type: 'para', text: 'The Work Order list shows Product, Size, Color, Quantity, Completed QTY, Pending QTY, Status, Sale Order, Flow Status and End Date. Double-click a row to open it.' }
        ]
      },
      {
        id: 'work-order-board',
        title: 'Work Order Board',
        blocks: [
          { type: 'lead', text: 'A board of the work orders that are in production, so you can track and complete them at a glance.' },
          { type: 'path', text: 'Open the Work Order Board screen.' },
          { type: 'para', text: 'Each row/card shows **Customer, Product, Color, Size, Quantity, Available Qty, Status, Start/End Date** and **Remarks**. Use **Done** to mark a job complete, or **View** to open it.' }
        ]
      },
      {
        id: 'production-bom',
        title: 'Bill of Materials (BOM)',
        blocks: [
          { type: 'lead', text: 'The recipe for a product — the materials and quantities needed to make it. Work Orders use the BOM to know what to consume.' },
          { type: 'path', text: 'Open the BOM screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'BOM Name', required: 'Yes', enter: 'A name', why: 'Identifies the recipe.' },
              { name: 'Product', required: 'Yes', enter: 'The finished product', why: 'What the BOM makes.' },
              { name: 'Notes', required: 'No', enter: 'Notes', why: 'Any extra detail.' }
            ]
          },
          { type: 'subheading', text: 'Material lines (table)' },
          { type: 'para', text: 'Add a row per component material: **Product** (required), **Size**, **Color**, **Quantity** (required), **Unit Cost** (required), **Total Cost** and **Notes**.' }
        ]
      },
      {
        id: 'stock-journal',
        title: 'Stock Journal',
        blocks: [
          { type: 'lead', text: 'Manually adjust stock — for example to record damage, correct a count, or move stock between locations.' },
          { type: 'path', text: 'Open the Stock Journal screen (in the Production menu).' },
          {
            type: 'fields',
            fields: [
              { name: 'Product', required: 'Yes', enter: 'The item to adjust', why: 'Which product’s stock changes.' },
              { name: 'Transaction Type', required: 'Yes', enter: 'Issue, Receipt or Transfer', why: 'Issue = stock out, Receipt = stock in, Transfer = move between locations.' },
              { name: 'Quantity', required: 'Yes', enter: 'How much', why: 'The amount to adjust.' },
              { name: 'Reference ID', required: 'No', enter: 'A reference', why: 'Links the adjustment to a document.' },
              { name: 'Remarks', required: 'No', enter: 'Reason / notes', why: 'Why the adjustment was made.' }
            ]
          },
          { type: 'tip', text: 'Always add a Remark explaining a manual adjustment — it makes stock audits much easier later.' }
        ]
      },
      {
        id: 'material-issue',
        title: 'Materials Issue To Production Floor',
        blocks: [
          { type: 'lead', text: 'Send raw materials out from the store to the production floor.' },
          { type: 'path', text: 'Open the Materials Issue To Production Floor screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Production Floor', required: 'Yes', enter: 'Where the materials go', why: 'The floor receiving the materials.' },
              { name: 'Issue Date / Issue No', required: 'Yes', enter: 'Date and number', why: 'Identifies the issue.' },
              { name: 'Reference No / Reference Date / Remarks', required: 'No', enter: 'References and notes', why: 'Links to a source order.' }
            ]
          },
          { type: 'para', text: 'Add the items being issued (Product, Unit, No. of Boxes, Quantity, Rate, Amount, MRP, Remark).' }
        ]
      },
      {
        id: 'material-received',
        title: 'Materials Received From Production Floor',
        blocks: [
          { type: 'lead', text: 'Receive finished or leftover goods back from the production floor into the store.' },
          { type: 'path', text: 'Open the Materials Received From Production Floor screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Production Floor', required: 'Yes', enter: 'Where the goods come from', why: 'The floor returning the goods.' },
              { name: 'Receipt Date / Receipt No', required: 'Yes', enter: 'Date and number', why: 'Identifies the receipt.' },
              { name: 'Reference No / Reference Date / Remarks', required: 'No', enter: 'References and notes', why: 'Links to a source.' }
            ]
          },
          { type: 'para', text: 'Add the items received (Product, Unit, No. of Boxes, Quantity, Rate, Amount, MRP, Remark).' }
        ]
      },
      {
        id: 'stock-summary',
        title: 'Stock Summary',
        blocks: [
          { type: 'lead', text: 'A stock movement summary per product — how stock changed over the period.' },
          { type: 'path', text: 'Open the Stock Summary screen.' },
          { type: 'para', text: 'Columns: **Product, Unit, Group, Opening, Received, Issued, Closing, Trend** and **Last Transaction** — so you see opening stock, what came in and went out, and the closing balance.' }
        ]
      },
      {
        id: 'quickpacks',
        title: 'Quick Packs',
        blocks: [
          { type: 'lead', text: 'Define a "pack" — a fixed bundle of products you sell or move together as one unit.' },
          { type: 'path', text: 'Menu ▸ Quick Packs' },
          {
            type: 'fields',
            fields: [
              { name: 'Quick Pack Name', required: 'Yes', enter: 'A name', why: 'Identifies the pack.' },
              { name: 'Lot Quantity', required: 'No', enter: 'Units per lot', why: 'Size of the pack.' },
              { name: 'Active', required: 'No', enter: 'Yes / No', why: 'Whether the pack can be used.' },
              { name: 'Description', required: 'No', enter: 'Details', why: 'About the pack.' }
            ]
          },
          { type: 'para', text: 'Add the products in the pack (Product, Size, Color, Quantity).' }
        ]
      },
      {
        id: 'tasks',
        title: 'Tasks',
        blocks: [
          { type: 'lead', text: 'Assign and track to-dos for your team, with comments and attachments.' },
          { type: 'path', text: 'Menu ▸ Tasks' },
          {
            type: 'fields',
            fields: [
              { name: 'Title', required: 'Yes', enter: 'What needs doing', why: 'The task name.' },
              { name: 'Assign To', required: 'No', enter: 'A User or a Group', why: 'Who is responsible.' },
              { name: 'Priorities', required: 'No', enter: 'Select priority', why: 'How urgent it is.' },
              { name: 'Due Date', required: 'No', enter: 'When it’s due', why: 'The deadline.' },
              { name: 'Statuses', required: 'No', enter: 'Select status', why: 'Progress of the task.' },
              { name: 'Description', required: 'No', enter: 'Details', why: 'What the task involves.' }
            ]
          },
          { type: 'para', text: 'Use **Task Comments** to discuss and **Task Attachments** to add files.' }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 8 — LEADS (CRM)
  // =====================================================================
  {
    id: 'leads',
    title: 'Leads',
    icon: 'fas fa-user-plus',
    summary: 'Capture and follow up potential customers.',
    topics: [
      {
        id: 'leads-overview',
        title: 'Leads',
        blocks: [
          { type: 'lead', text: 'A lead is a potential customer. Track every enquiry here so none slips through, and follow up until it becomes a sale.' },
          { type: 'path', text: 'Open the Leads screen.' },
          { type: 'subheading', text: 'Lead details' },
          {
            type: 'fields',
            fields: [
              { name: 'Name', required: 'Yes', enter: 'Lead’s name', why: 'Who the enquiry is from.' },
              { name: 'Email', required: 'Yes', enter: 'Email address', why: 'How to reach them.' },
              { name: 'Phone', required: 'Yes', enter: 'Phone number', why: 'How to reach them.' },
              { name: 'Score', required: 'Yes', enter: 'A number', why: 'How promising the lead is.' },
              { name: 'Assigned', required: 'Yes', enter: 'Select an employee', why: 'Who is following it up.' },
              { name: 'Lead Status', required: 'Yes', enter: 'Select status', why: 'Where the lead is in your pipeline.' }
            ]
          },
          { type: 'subheading', text: 'Interactions (table)' },
          { type: 'para', text: 'Log each contact with the lead. Add a row per interaction: **Interaction Type** (required — e.g. Call, Email), **Interaction Date** (required) and **Notes** (required).' },
          { type: 'subheading', text: 'Leads List' },
          { type: 'para', text: 'Click **Leads List** to open the list. Columns: **Name, Email, Phone, Lead Status, Score, Assigned, Interaction Date, Notes**. Double-click a row to open it; each row has **Delete** and **Restore**; and you can **Export** the list.' },
          { type: 'tip', text: 'Keep logging interactions and updating the Lead Status after each call — that’s how a lead moves towards becoming a customer.' },
          { type: 'para', text: 'Supporting lists you set up once: **Interaction Types** and **Lead Statuses**.' }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 9 — ASSETS
  // =====================================================================
  {
    id: 'assets',
    title: 'Assets',
    icon: 'fas fa-laptop-house',
    summary: 'Track company assets and their maintenance.',
    topics: [
      {
        id: 'assets-register',
        title: 'Asset register',
        blocks: [
          { type: 'lead', text: 'Record the things your company owns — machines, computers, vehicles — and where they are.' },
          { type: 'path', text: 'Open the Assets screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Name', required: 'Yes', enter: 'Asset name', why: 'Identifies the asset.' },
              { name: 'Asset Category', required: 'Yes', enter: 'Select a category', why: 'Groups similar assets.' },
              { name: 'Asset Status', required: 'Yes', enter: 'Select status', why: 'Whether it’s in use, idle, etc.' },
              { name: 'Unit Options', required: 'Yes', enter: 'Unit of measure', why: 'How the asset is counted.' },
              { name: 'Location', required: 'Yes', enter: 'Where the asset is', why: 'Helps locate it.' },
              { name: 'Purchase Date / Price', required: 'No', enter: 'When bought and cost', why: 'For value tracking.' }
            ]
          },
          { type: 'para', text: 'The list shows **Name, Price, Category, Unit Options, Purchase Date, Location, Status**; double-click a row to open it, with Edit/Delete/Restore.' },
          { type: 'para', text: 'Supporting lists you set up once: **Asset Categories, Asset Statuses** and **Locations**.' }
        ]
      },
      {
        id: 'asset-maintenance',
        title: 'Asset Maintenance',
        blocks: [
          { type: 'lead', text: 'Log servicing and repairs for an asset, with the cost.' },
          { type: 'path', text: 'Open the Asset Maintenance screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Asset', required: 'Yes', enter: 'Which asset', why: 'What was serviced.' },
              { name: 'Cost', required: 'No', enter: 'Maintenance cost', why: 'What it cost to maintain.' },
              { name: 'Maintenance Date', required: 'No', enter: 'When', why: 'Date of service.' },
              { name: 'Maintenance Description', required: 'No', enter: 'What was done', why: 'Record of the work.' }
            ]
          }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 10 — REPORTS
  // =====================================================================
  {
    id: 'reports',
    title: 'Reports',
    icon: 'fas fa-chart-bar',
    summary: 'Ready-made reports across sales, stock and accounts.',
    topics: [
      {
        id: 'reports-overview',
        title: 'Reports overview',
        blocks: [
          { type: 'lead', text: 'CNL comes with a full set of ready-made reports, grouped by area. Pick a report, set the date range/filters, and view or print it — nothing to build.' },
          { type: 'path', text: 'Open the Reports screen.' },
          {
            type: 'table',
            columns: ['Report group', 'For…'],
            rows: [
              ['Sales Reports', 'How much you’re selling, and to whom.'],
              ['Purchase Reports', 'What you’re buying and from which vendors.'],
              ['Inventory Reports', 'Stock levels and forecasts.'],
              ['Customer Reports', 'Each customer’s sales, balance and history.'],
              ['Vendor Reports', 'Each vendor’s purchases, balance and performance.'],
              ['Ledgers Reports', 'Accounting statements (Trial Balance, P&L, Balance Sheet…).'],
              ['GST Reports', 'GST collected, paid and net.'],
              ['Production Reports', 'Work orders, materials and production cost.']
            ]
          }
        ]
      },
      {
        id: 'reports-sales',
        title: 'Sales Reports',
        blocks: [
          { type: 'lead', text: 'See your sales from every angle.' },
          {
            type: 'table',
            columns: ['Report', 'Shows'],
            rows: [
              ['General Register / Detailed Register', 'A list of sales, summary or fully detailed.'],
              ['Daily Sales Summary / Monthly Sales Summary', 'Sales totalled by day or month.'],
              ['Columnar — Product Group / Category / Brand / HSN Code Wise', 'Sales broken down by that product grouping.'],
              ['Sales Invoice / All Sales Orders', 'Lists of invoices and orders.']
            ]
          }
        ]
      },
      {
        id: 'reports-purchase',
        title: 'Purchase Reports',
        blocks: [
          { type: 'lead', text: 'Track what you buy and what you owe.' },
          {
            type: 'table',
            columns: ['Report', 'Shows'],
            rows: [
              ['Purchase / Purchase Invoice', 'Your purchases and bills.'],
              ['Purchases by Vendor', 'Totals grouped by vendor.'],
              ['Purchase Return', 'Goods returned to vendors.'],
              ['Outstanding Purchase', 'Amounts still owed to vendors.'],
              ['Purchase Order Status', 'Where each PO stands.'],
              ['Landed Cost / Purchase Price Variance / Stock Replenishment', 'Costing and re-order analysis.']
            ]
          }
        ]
      },
      {
        id: 'reports-inventory',
        title: 'Inventory Reports',
        blocks: [
          { type: 'lead', text: 'Keep stock under control.' },
          { type: 'para', text: '**Stock Forecast** compares current stock with average sales to predict what you’ll need. A stock health view flags each product as **Critical**, **Warning** or **Healthy** with a recommended action (e.g. reorder).' },
          { type: 'tip', text: 'Check stock health regularly — it tells you what to reorder before you run out.' }
        ]
      },
      {
        id: 'reports-customer',
        title: 'Customer Reports',
        blocks: [
          { type: 'lead', text: 'Everything about each customer.' },
          {
            type: 'table',
            columns: ['Report', 'Shows'],
            rows: [
              ['Customer Summary', 'Total sales and balance per customer.'],
              ['Customer Ledger', 'Every transaction with a running balance.'],
              ['Customer Outstanding', 'How much each customer owes.'],
              ['Customer Order History', 'What they’ve bought over time.'],
              ['Customer Credit / Customer Payment', 'Credit position and payments received.']
            ]
          }
        ]
      },
      {
        id: 'reports-vendor',
        title: 'Vendor Reports',
        blocks: [
          { type: 'lead', text: 'Everything about each vendor.' },
          {
            type: 'table',
            columns: ['Report', 'Shows'],
            rows: [
              ['Vendor Summary', 'Total purchases and balance per vendor.'],
              ['Vendor Ledger', 'Every transaction with a running balance.'],
              ['Vendor Outstanding', 'How much you owe each vendor.'],
              ['Vendor Performance', 'How your vendors are doing.'],
              ['Vendor Payment', 'Payments made to vendors.']
            ]
          }
        ]
      },
      {
        id: 'reports-ledgers',
        title: 'Ledgers Reports (Accounting)',
        blocks: [
          { type: 'lead', text: 'The standard accounting statements, built from your transactions.' },
          {
            type: 'table',
            columns: ['Report', 'Shows'],
            rows: [
              ['Bank Book / Cash Book', 'Bank and cash transactions and balances.'],
              ['General Ledger', 'All entries for every account.'],
              ['Trial Balance', 'Debit/credit balance of all accounts.'],
              ['Profit & Loss Statement', 'Income, expenses and net profit.'],
              ['Balance Sheet', 'Assets, liabilities and equity.'],
              ['Journal Entry / Bank Reconciliation', 'Journal listing and bank matching.']
            ]
          }
        ]
      },
      {
        id: 'reports-gst',
        title: 'GST Reports',
        blocks: [
          { type: 'lead', text: 'Your GST position at a glance.' },
          { type: 'para', text: '**GST Summary** shows **GST Collected** (on sales), **GST Paid** (on purchases) and the **Net GST**, by GST type — so you know what’s payable.' }
        ]
      },
      {
        id: 'reports-production',
        title: 'Production Reports',
        blocks: [
          { type: 'lead', text: 'See how manufacturing is performing.' },
          {
            type: 'table',
            columns: ['Report', 'Shows'],
            rows: [
              ['Production Summary', 'Overall production output.'],
              ['Bill of Materials', 'The materials each product needs.'],
              ['Work Order Status', 'Where each work order stands.'],
              ['Raw Material Consumption / Finished Goods', 'Materials used and goods produced.'],
              ['Production Cost', 'What production costs.'],
              ['Machine Utilization / WIP', 'Machine usage and work-in-progress.']
            ]
          }
        ]
      }
    ]
  },

  // =====================================================================
  // SECTION 11 — HRMS (Human Resources)
  // =====================================================================
  {
    id: 'hrms',
    title: 'HRMS',
    icon: 'fas fa-user-tie',
    summary: 'Employees, attendance, leave, salary and shifts.',
    topics: [
      {
        id: 'hrms-overview',
        title: 'HRMS overview',
        blocks: [
          { type: 'lead', text: 'HRMS manages your people — the employee record, time, attendance, leave and pay.' },
          {
            type: 'table',
            columns: ['Screen', 'Use it to…'],
            rows: [
              ['Employees', 'Hold each person’s record (job, department, designation, shift, manager).'],
              ['Timesheets', 'Log hours worked over a period, optionally billable to a customer.'],
              ['Timesheet Approvals', 'Manager approves or rejects submitted timesheets.'],
              ['Billable Hours', 'Turn approved billable hours into a customer invoice.'],
              ['Attendance', 'Mark who was present and for how long.'],
              ['Leaves', 'Apply for and record leave.'],
              ['Leave Balance', 'See remaining leave per employee.'],
              ['Leave Approvals', 'Approve or reject leave requests.'],
              ['Salary', 'Set each employee’s pay.'],
              ['Swipes', 'Record clock-in / clock-out times.']
            ]
          },
          { type: 'para', text: 'Supporting lists you set up once: **Departments, Designations, Job Types, Job Codes, Shifts, Leave Types, Salary Components** and **Employee Salary Components**.' }
        ]
      },
      {
        id: 'hrms-employee',
        title: 'Employees',
        blocks: [
          { type: 'lead', text: 'The master record for each person in your company.' },
          { type: 'path', text: 'Open the Employees screen.' },
          { type: 'subheading', text: 'Main details' },
          {
            type: 'fields',
            fields: [
              { name: 'First Name / Last Name', required: 'Yes', enter: 'Employee’s name', why: 'Identifies the person.' },
              { name: 'Phone', required: 'Yes', enter: 'Contact number', why: 'How to reach them.' },
              { name: 'Gender', required: 'Yes', enter: 'Male / Female', why: 'HR record.' },
              { name: 'Email / Address / Date Of Birth / Nationality', required: 'No', enter: 'Personal details', why: 'The employee’s profile.' }
            ]
          },
          { type: 'subheading', text: 'Job details' },
          {
            type: 'fields',
            fields: [
              { name: 'Job Type', required: 'No', enter: 'Select', why: 'Type of employment.' },
              { name: 'Designation', required: 'No', enter: 'Select', why: 'Their role / title.' },
              { name: 'Job Code', required: 'No', enter: 'Select', why: 'Internal job code.' },
              { name: 'Department', required: 'No', enter: 'Select', why: 'Which department.' },
              { name: 'Shift', required: 'No', enter: 'Select', why: 'Their working shift.' },
              { name: 'Manager', required: 'No', enter: 'Select an employee', why: 'Who they report to.' },
              { name: 'Hire Date', required: 'No', enter: 'Joining date', why: 'When they joined.' }
            ]
          },
          { type: 'para', text: 'Phone defaults to **+91**. You can also record an **Emergency Contact** (and relationship) and upload one or more **Govt. Id** documents.' },
          { type: 'subheading', text: 'Employee List' },
          { type: 'para', text: 'Click **Employee List** (top of the screen) to open the list. Columns: **Name, Email, Phone, Address, Hire Date, Job Type, Designation, Department, Shift, Manager**. Double-click a row to open it; each row has **Edit, Delete** and **Restore**; and you can **Export** the list to Excel.' }
        ]
      },
      {
        id: 'hrms-timesheets',
        title: 'Timesheets',
        blocks: [
          { type: 'lead', text: 'Log the hours an employee works over a period — optionally chargeable to a customer at an hourly rate — then submit it for approval.' },
          { type: 'path', text: 'Open the Timesheets screen.' },
          { type: 'subheading', text: 'Timesheet details' },
          {
            type: 'fields',
            fields: [
              { name: 'Employee', required: 'Yes', enter: 'Whose time this is', why: 'Who did the work.' },
              { name: 'Start Date / End Date', required: 'Yes', enter: 'The timesheet period', why: 'The range the hours cover.' },
              { name: 'Customer (Bill To)', required: 'No', enter: 'Select a customer', why: 'Who the work is billed to, if billable.' },
              { name: 'Billing Rate (per hour)', required: 'No', enter: 'Hourly rate', why: 'What the time is charged at.' },
              { name: 'Billable', required: 'No', enter: 'Tick if chargeable to the client', why: 'Marks the time as billable and shows a Billable Amount.' },
              { name: 'Notes', required: 'No', enter: 'Notes', why: 'Anything extra.' }
            ]
          },
          { type: 'subheading', text: 'Daily Time Entries' },
          { type: 'para', text: 'Add a row per day worked: **Date** (required), **Day**, **Hours** and a **Description / Task**.' },
          { type: 'subheading', text: 'Live summary' },
          { type: 'para', text: 'As you fill it in, a strip shows **Total Hours**, **Days Logged**, the **Period**, and — when **Billable** is ticked — the **Billable Amount** (hours × rate). A coloured **status tag** shows the timesheet’s state.' },
          { type: 'subheading', text: 'Status & approval' },
          { type: 'para', text: 'A timesheet moves through these states:' },
          {
            type: 'table',
            columns: ['Status', 'Meaning'],
            rows: [
              ['Draft', 'Being created/edited — not yet sent.'],
              ['Open', 'Submitted and waiting for approval.'],
              ['Approved', 'Approved by the manager.'],
              ['Rejected', 'Sent back by the manager.']
            ]
          },
          { type: 'subheading', text: 'Timesheets List' },
          { type: 'para', text: 'Click **Timesheets List** (top of the screen) to open the list. Columns: **Employee, Start Date, End Date, Total Hours, Notes, Created**. Tick rows with the checkboxes, search, and Export to Excel.' },
          {
            type: 'table',
            columns: ['Row action', 'What it does'],
            rows: [
              ['✈ Submit for approval', 'Sends the timesheet to the manager ("Submit this timesheet for approval?") — its status becomes Open.'],
              ['✎ Edit', 'Open the timesheet to change it.'],
              ['Delete / Restore', 'Remove or bring back a timesheet.']
            ]
          },
          { type: 'tip', text: 'Flow: create the timesheet (Draft) → add daily hours → from the list click Submit for approval → the manager approves or rejects it (Timesheet Approvals screen).' }
        ]
      },
      {
        id: 'hrms-timesheet-approvals',
        title: 'Timesheet Approvals',
        blocks: [
          { type: 'lead', text: 'The manager’s screen to review the timesheets employees have submitted, and approve or reject them.' },
          { type: 'path', text: 'Open the Timesheet Approvals screen.' },
          { type: 'subheading', text: 'The list' },
          { type: 'para', text: 'Shows submitted timesheets with columns **Employee, Start Date, End Date, Total Hours, Status** (Open / Approved / Rejected), **Approver, Action Date** and **Rejection Reason**. Search and Export to Excel.' },
          { type: 'subheading', text: 'Approve or reject' },
          {
            type: 'table',
            columns: ['Action', 'What it does'],
            rows: [
              ['✓ Approve', 'Approve a timesheet ("Approve this timesheet?") — its status becomes Approved.'],
              ['✗ Reject', 'Opens a box to type a Rejection Reason (required), then Confirm Rejection — status becomes Rejected and the employee is notified.']
            ]
          },
          { type: 'para', text: 'Approve and Reject only appear on timesheets that are **Open** (awaiting review).' },
          { type: 'subheading', text: 'Bulk approve' },
          { type: 'para', text: 'Tick several Open timesheets and use **Bulk Approve** to approve them all at once (it confirms "Approve N Timesheets" first).' }
        ]
      },
      {
        id: 'hrms-billable-hours',
        title: 'Billable Hours',
        blocks: [
          { type: 'lead', text: 'Turn approved, billable timesheet hours into a customer invoice — the bridge from time tracking to billing.' },
          { type: 'path', text: 'Open the Billable Hours screen.' },
          { type: 'subheading', text: 'The list' },
          { type: 'para', text: 'Shows billable timesheets ready to invoice: **Employee, Customer, Start Date, End Date, Total Hours, Rate / hr** and **Billable Amount**. Search and Export to Excel.' },
          { type: 'subheading', text: 'Create an invoice from hours' },
          {
            type: 'steps',
            items: [
              'Tick the timesheets to bill — they must all be for the **same customer** (one invoice = one client).',
              'Click **Create Invoice** — a box shows the customer, number of timesheets, total hours and total amount.',
              'Pick the **service item** for the invoice line (e.g. Professional Services).',
              'Confirm — CNL creates a **Sales Invoice** ("Invoice … created"), then opens the Sales Invoice list so you can print or send it.'
            ]
          },
          { type: 'tip', text: 'Only hours marked **Billable** (with a Customer and Rate on the timesheet) appear here. Once invoiced, they drop off the list.' }
        ]
      },
      {
        id: 'hrms-attendance',
        title: 'Attendance',
        blocks: [
          { type: 'lead', text: 'Record an employee’s attendance for a day.' },
          { type: 'path', text: 'Open the Employee Attendance screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Employee', required: 'Yes', enter: 'Who', why: 'Whose attendance.' },
              { name: 'Attendance Date', required: 'Yes', enter: 'The date', why: 'Which day.' },
              { name: 'Leave Duration', required: 'No', enter: 'First Half / Full Day / Second Half', why: 'How much of the day was attended / on leave.' }
            ]
          },
          { type: 'para', text: 'The list shows **Employee, Attendance Date, Absent** and **Leave Duration**; each row has **Edit, Delete** and **Restore**.' }
        ]
      },
      {
        id: 'hrms-leaves',
        title: 'Leaves',
        blocks: [
          { type: 'lead', text: 'Apply for or record an employee’s leave.' },
          { type: 'path', text: 'Open the Employee Leaves screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Employee', required: 'Yes', enter: 'Who', why: 'Whose leave.' },
              { name: 'Leave Type', required: 'Yes', enter: 'Select type', why: 'Casual, sick, etc.' },
              { name: 'Start Date / End Date', required: 'Yes', enter: 'Leave period', why: 'How long the leave is.' },
              { name: 'Comments', required: 'No', enter: 'Reason / notes', why: 'Why leave is taken.' }
            ]
          }
        ]
      },
      {
        id: 'hrms-leave-balance',
        title: 'Leave Balance',
        blocks: [
          { type: 'lead', text: 'See how much leave each employee has left.' },
          { type: 'path', text: 'Open the Employee Leave Balance screen.' },
          { type: 'para', text: 'A list of balances with columns **Employee, Leave Type, Leave Balance** and **Year** — so you can check remaining leave before approving a request.' }
        ]
      },
      {
        id: 'hrms-leave-approvals',
        title: 'Leave Approvals',
        blocks: [
          { type: 'lead', text: 'Approve or reject employees’ leave requests.' },
          { type: 'path', text: 'Open the Leave Approvals screen.' },
          { type: 'para', text: 'A list of requests with columns **Employee, Leave Type, Start Date, End Date, Status, Approval Date** and **Approver**. Each row has actions to **Approve** or **Reject** the request; the Status and Approval Date update accordingly.' }
        ]
      },
      {
        id: 'hrms-salary',
        title: 'Employee Salary',
        blocks: [
          { type: 'lead', text: 'Set an employee’s overall salary and the period it applies to. You then break it into components (see Employee Salary Components).' },
          { type: 'path', text: 'Open the Employee Salary screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Salary Amount', required: 'Yes', enter: 'The pay figure', why: 'How much they are paid.' },
              { name: 'Salary Currency', required: 'Yes', enter: 'The currency', why: 'Currency of the pay.' },
              { name: 'Salary Start Date / End Date', required: 'Yes', enter: 'The period', why: 'When this salary applies.' },
              { name: 'Employee', required: 'No', enter: 'Select the employee', why: 'Whose salary this is.' }
            ]
          },
          { type: 'para', text: 'Click **Employee Salary List** to open the list — columns: Salary Start Date, Salary End Date, Salary Amount, Salary Currency, Employee; double-click to open, with Edit/Delete/Restore and Export.' }
        ]
      },
      {
        id: 'hrms-salary-components',
        title: 'Salary Components',
        blocks: [
          { type: 'lead', text: 'Define the parts that make up pay — for example Basic, HRA, Allowance, PF. You reuse these across employees.' },
          { type: 'path', text: 'Open the Salary Components screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Component Name', required: 'Yes', enter: 'The component (e.g. Basic, HRA)', why: 'Names the pay component.' }
            ]
          },
          { type: 'para', text: 'The list shows each Component Name, with Edit, Delete and Restore.' }
        ]
      },
      {
        id: 'hrms-employee-salary-components',
        title: 'Employee Salary Components',
        blocks: [
          { type: 'lead', text: 'Break an employee’s salary into its components — assign an amount to each part of their pay.' },
          { type: 'path', text: 'Open the Employee Salary Components screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Salary', required: 'Yes', enter: 'The employee’s salary record', why: 'Which salary this component belongs to.' },
              { name: 'Component', required: 'Yes', enter: 'Pick a Salary Component (Basic, HRA…)', why: 'Which part of pay.' },
              { name: 'Component Amount', required: 'No', enter: 'The amount for this part', why: 'How much this component is worth.' }
            ]
          },
          { type: 'para', text: 'The list shows the Salary Component, Component Amount and Salary, with Edit, Delete and Restore.' },
          { type: 'tip', text: 'Pay setup order: 1) Salary Components (define Basic/HRA/…), 2) Employee Salary (set the total + period), 3) Employee Salary Components (split the total into components).' }
        ]
      },
      {
        id: 'hrms-swipes',
        title: 'Swipes',
        blocks: [
          { type: 'lead', text: 'Record an employee’s clock-in / clock-out times.' },
          { type: 'path', text: 'Open the Swipes screen.' },
          {
            type: 'fields',
            fields: [
              { name: 'Employee', required: 'Yes', enter: 'Who', why: 'Whose swipe.' },
              { name: 'Swipe Time', required: 'Yes', enter: 'The time', why: 'When they swiped in/out.' }
            ]
          }
        ]
      }
    ]
  },

  // =====================================================================
  // SMART / AI
  // =====================================================================
  {
    id: 'ai',
    title: 'AI & Smart Insights',
    icon: 'fas fa-robot',
    summary: 'Automatic alerts, forecasts and a voice assistant.',
    topics: [
      {
        id: 'ai-dashboard',
        title: 'AI Dashboard',
        blocks: [
          { type: 'lead', text: 'The AI Dashboard watches your data and tells you what needs attention — so problems surface before they cost you.' },
          { type: 'path', text: 'Menu ▸ AI Dashboard' },
          { type: 'subheading', text: 'What it surfaces' },
          {
            type: 'table',
            columns: ['Insight', 'What it tells you'],
            rows: [
              ['Needs Your Attention', 'The most important issues right now, including cash-flow risk (High / Medium).'],
              ['Low Stock Alerts / Stock Forecast', 'Items running low and what stock to expect.'],
              ['Dead Stock', 'Products that aren’t moving.'],
              ['Debt Defaulters', 'Customers overdue on payment.'],
              ['Inactive Customers', 'Customers who’ve stopped buying.'],
              ['Best Vendors', 'Your strongest suppliers.'],
              ['Work Orders', 'Production work that needs attention.']
            ]
          },
          { type: 'para', text: 'Use **What-If** to test scenarios, and **Customize Dashboard** to choose which insights you see.' },
          { type: 'tip', text: 'Start your day on the AI Dashboard — "Needs Your Attention" is the fastest way to know what to act on.' }
        ]
      },
      {
        id: 'voice-assistant',
        title: 'Voice Assistant',
        blocks: [
          { type: 'lead', text: 'Use your voice to work with CNL instead of typing.' },
          { type: 'path', text: 'Menu ▸ Voice Assistant (or the microphone in the top bar)' },
          { type: 'para', text: 'Click **Start Voice Recognition** and speak your request.' },
          { type: 'tip', text: 'Handy when your hands are busy — for example on the shop floor or warehouse.' }
        ]
      }
    ]
  },

  // =====================================================================
  // CUSTOMER PORTAL
  // =====================================================================
  {
    id: 'customer-portal',
    title: 'Customer Portal',
    icon: 'fas fa-user-circle',
    summary: 'A self-service login for your customers.',
    topics: [
      {
        id: 'customer-portal-overview',
        title: 'Customer Portal',
        blocks: [
          { type: 'lead', text: 'A separate login where your customers can see their own orders and payments — reducing calls and emails to your team.' },
          { type: 'path', text: 'Customers log in at the Customer Portal login page (separate from your admin login).' },
          { type: 'subheading', text: 'What customers can see' },
          {
            type: 'table',
            columns: ['Screen', 'Shows the customer'],
            rows: [
              ['Dashboard', 'A summary of their account.'],
              ['Sales Orders', 'Orders they placed with you.'],
              ['Invoices', 'Their bills.'],
              ['Returns / Credit Notes', 'Returns and adjustments.'],
              ['Payment Receipts', 'Payments they’ve made.'],
              ['Downloads', 'Documents they can download.'],
              ['My Profile', 'Their own details.']
            ]
          }
        ]
      }
    ]
  },

  // =====================================================================
  // AUDIT LOGS
  // =====================================================================
  {
    id: 'audit-logs',
    title: 'Audit Logs',
    icon: 'fas fa-history',
    summary: 'A record of who did what, and when.',
    topics: [
      {
        id: 'audit-logs-overview',
        title: 'Audit Logs',
        blocks: [
          { type: 'lead', text: 'Audit Logs record changes made in CNL — who made them and when — for security and accountability.' },
          { type: 'path', text: 'Top bar ▸ gear icon ▸ (or Menu ▸) Audit Logs' },
          { type: 'para', text: 'This is a view-only record. Use it to check what happened to a record, or to review user activity.' },
          { type: 'tip', text: 'If a figure changes unexpectedly, the Audit Logs show who changed it and when.' }
        ]
      }
    ]
  }
];
