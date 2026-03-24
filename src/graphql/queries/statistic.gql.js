import { gql } from '@apollo/client/core';

export const GET_STATISTIC_NETWORK = gql`
  query GetNetworkStatistic {
    network: getNetworkStatistic
  }
`;

export const GET_STATISTIC_MAILBOX = gql`
  query GetMailboxStatistic {
    mailbox: getMailboxStatistic
  }
`;

export const GET_STATISTIC_REQUEST = gql`
  query GetRequestStatistic {
    request: getRequestStatistic
  }
`;

export const GET_STATISTIC_INSPECTOR = gql`
  query GetInspectorStatistic {
    inspector: getInspectorStatistic
  }
`;

export const GET_DASHBOARD_STATISTIC = gql`
  query GetDashboardStatistic {
    dashboard: getDashboardStatistic
  }
`;
