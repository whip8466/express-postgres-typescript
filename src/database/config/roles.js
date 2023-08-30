const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
}

const ROLE_RIGHTS = {
  CUSTOMER: [],
  ADMIN: [
    '/orders/status/:status',
  ],
};

module.exports = {
  ROLES,
  ROLE_RIGHTS,
}