import { gql } from '@apollo/client/core';

export const NOTICE_SUBSCRIPTION = gql`
  subscription onNotice {
    notice: notice {
      id
      title
      message
      status
      createdAt
    }
  }
`;
