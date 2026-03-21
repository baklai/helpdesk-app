export const USER_ROLE = Object.freeze(
  Object.fromEntries(['ADMIN', 'MANAGER', 'SUPPORT', 'CLIENT'].map(k => [k, k]))
);

export const USER_STATUS = Object.freeze(
  Object.fromEntries(['PENDING', 'ACTIVE', 'BLOCKED', 'DISABLED'].map(k => [k, k]))
);

export const SEVERITY_STATUS = Object.freeze(
  Object.fromEntries(
    ['SUCCESS', 'INFO', 'WARN', 'ERROR', 'SECONDARY'].map(k => [k, k.toLowerCase()])
  )
);
