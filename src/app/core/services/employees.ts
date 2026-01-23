import { Injectable } from '@angular/core';


// UI-only dummy type (NOT a service)
export type Employees = {
  id: string;
  employeeCode: string;

  name: string;
  department?: string;
  role?: string;

  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string; // YYYY-MM-DD
};

