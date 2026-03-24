import { gql } from '@apollo/client/core';

export const FIND_ALL_INSPECTORS = gql`
  query FindAllInspectors($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    inspectors: findAllInspectors(limit: $limit, offset: $offset, sort: $sort, filters: $filters) {
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
        baseboard
        bios
        os
        cpu
        diskdrive
        memorychip
        netadapter
        printer
        product
        share
        useraccount
        usergroup
        useradmin
        isIpaddress
        baseboardName
        cpuName
        system
        hddSize
        ramSize
        fixupdate
        countUseraccount
        countProduct
        countShare
        expiresAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const FIND_ONE_INSPECTOR = gql`
  query FindOneInspectorById($id: ID!) {
    inspector: findOneInspectorById(id: $id) {
      id
      ipaddress
      baseboard
      bios
      os
      cpu
      diskdrive
      memorychip
      netadapter
      printer
      product
      share
      useraccount
      usergroup
      useradmin
      isIpaddress
      baseboardName
      cpuName
      system
      hddSize
      ramSize
      fixupdate
      countUseraccount
      countProduct
      countShare
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ONE_INSPECTOR = gql`
  mutation CreateOneInspector($input: CreateInspectorInput!) {
    createOneInspector(input: $input)
  }
`;

export const REMOVE_ONE_INSPECTOR = gql`
  mutation RemoveOneInspectorById($id: ID!) {
    inspector: removeOneInspectorById(id: $id) {
      id
      ipaddress
      baseboard
      bios
      os
      cpu
      diskdrive
      memorychip
      netadapter
      printer
      product
      share
      useraccount
      usergroup
      useradmin
      isIpaddress
      baseboardName
      cpuName
      system
      hddSize
      ramSize
      fixupdate
      countUseraccount
      countProduct
      countShare
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const FIND_INSPECTOR_REPORT = gql`
  query FindOneInspectorReportById($id: ID!, $ip: String!) {
    inspector: findOneInspectorById(id: $id) {
      id
      ipaddress
      baseboard
      bios
      os
      cpu
      diskdrive
      memorychip
      netadapter
      printer
      product
      share
      useraccount
      usergroup
      useradmin
      isIpaddress
      baseboardName
      cpuName
      system
      hddSize
      ramSize
      fixupdate
      countUseraccount
      countProduct
      countShare
      expiresAt
      createdAt
      updatedAt
    }
    ipaddress: findOneIpaddressByIP(ip: $ip) {
      id
      ipaddress
      mask
      gateway
      indexip
      cidr {
        value
        mask
      }
      reqnum
      fullname
      phone
      autoanswer
      internet {
        reqnum
        status
        comment
        createdAt
        updatedAt
      }
      comment
      device {
        id
        name
        description
      }
      location {
        id
        name
        region
      }
      organization {
        id
        name
        address
        description
      }
      subdivision {
        id
        code
        name
        address
        description
        organization
      }
      department {
        id
        name
        description
      }
      position {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;
