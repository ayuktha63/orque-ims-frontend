export const MENU = [

  { icon:'dashboard', route:'/app/dashboard', roles:['ADMIN','EMPLOYEE'] },

  { icon:'people', route:'/app/employees', roles:['ADMIN'] },

  { icon:'paid', route:'/app/finance', roles:['ADMIN'] },

  { icon:'payments', route:'/app/payroll', roles:['ADMIN','HR'] },

  { icon:'assignment', route:'/app/duties', roles:['ADMIN'] },

  { icon:'task_alt', route:'/app/my-work', roles:['EMPLOYEE'] },

  { icon:'bug_report', route:'/app/defects', roles:['ADMIN','EMPLOYEE'] },

  { icon:'groups', route:'/app/clients', roles:['ADMIN'] },

  { icon:'admin_panel_settings', route:'/app/credentials', roles:['ADMIN'] }

];
