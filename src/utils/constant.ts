export const USER_ROLE_ADMIN = 'ADMIN'
export const USER_ROLE_USER = 'USER'

export const TRANSACTION_TYPE_DEBIT = 1;
export const TRANSACTION_TYPE_KREDIT = -1;

export const VALIDATION_MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB
export const VALIDATION_ALLOWED_FILE_TYPE = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export const MENU_USER = [
  {
    name: 'Dashboard',
    icon: 'BiAbacus',
    path: '/dashboard',
  },
  {
    name: 'Ktp',
    icon: 'BiAbacus',
    path: '/ktp',
  },
];

export const GENDER = {
  'MALE': {
    value: 'MALE',
    label: 'Male',
  },
  'FEMALE': {
    value: 'FEMALE',
    label: 'Female',
  },
};