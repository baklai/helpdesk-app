import { gql } from '@apollo/client/core';

export const FIND_ALL_SYSCONFS = gql`
  query FindAllSysConfs {
    sysconfs: findAllSysConfs {
      id
      key
      value
    }
  }
`;

export const UPSERT_ONE_SYSCONF = gql`
  mutation UpsertOneSysConf($input: UpsertSysConfInput!) {
    sysconf: upsertOneSysConf(input: $input) {
      id
      key
      value
    }
  }
`;

export const FIND_ALL_SYSLOGS = gql`
  query FindAllSysLogs($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    syslogs: findAllSysLogs(limit: $limit, offset: $offset, sort: $sort, filters: $filters) {
      totalDocs
      limit
      offset
      totalPages
      page
      prevPage
      nextPage
      hasPrevPage
      hasNextPage
      pagingCounter
      docs {
        id
        ipaddress
        user {
          id
          fullname
        }
        method
        methodName
        status
        userAgent
        error
        expiresAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const FIND_ONE_SYSLOG = gql`
  query FindOneSysLogById($id: ID!) {
    syslog: findOneSysLogById(id: $id) {
      id
      ipaddress
      user {
        id
        fullname
      }
      method
      methodName
      status
      userAgent
      error
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ONE_SYSLOG = gql`
  mutation RemoveOneSysLogById($id: ID!) {
    syslog: removeOneSysLogById(id: $id) {
      id
    }
  }
`;

export const REMOVE_ALL_SYSLOGS = gql`
  mutation RemoveAllSysLogs {
    removeAllSysLogs
  }
`;
