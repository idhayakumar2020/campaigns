export const rootPaths = {
  root: '/',
  pageRoot: 'pages',
  authRoot: 'auth',
  errorRoot: 'error',
  campaignsRoot: 'campaigns',
};

export default {
  dashboard: `/`,
  campaignDetail: `/campaigns/:id`,
  // invoice: `/${rootPaths.pageRoot}/invoice`,
  // schedule: `/${rootPaths.pageRoot}/schedule`,
  // calendar: `/${rootPaths.pageRoot}/calendar`,
  // messages: `/${rootPaths.pageRoot}/messages`,
  // notification: `/${rootPaths.pageRoot}/notification`,
  // settings: `/${rootPaths.pageRoot}/settings`,

  // signin: `/${rootPaths.authRoot}/signin`,
  // signup: `/${rootPaths.authRoot}/signup`,
  // resetPassword: `/${rootPaths.authRoot}/reset-password`,
  404: `/${rootPaths.errorRoot}/404`,
};
