import { gql } from '@apollo/client/core';

export const FIND_ALL_IPADDRESSES = gql`
  query FindAllIpaddresses($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    ipaddresses: findAllIpaddresses(
      limit: $limit
      offset: $offset
      sort: $sort
      filters: $filters
    ) {
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
        email
        inventory
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
  }
`;

export const FIND_ONE_IPADDRESS = gql`
  query FindOneIpaddressById($id: ID!) {
    ipaddress: findOneIpaddressById(id: $id) {
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
      email
      inventory
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

export const FIND_ONE_IPADDRESS_BY_IP = gql`
  query FindOneIpaddressByIP($ip: String!) {
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
      email
      inventory
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

export const CREATE_ONE_IPADDRESS = gql`
  mutation CreateOneIpaddress($input: CreateIpaddressInput!) {
    ipaddress: createOneIpaddress(input: $input) {
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
      email
      inventory
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

export const UPDATE_ONE_IPADDRESS = gql`
  mutation UpdateOneIpaddressById($id: ID!, $input: UpdateIpaddressInput!) {
    ipaddress: updateOneIpaddressById(id: $id, input: $input) {
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
      email
      inventory
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

export const REMOVE_ONE_IPADDRESS = gql`
  mutation RemoveOneIpaddressById($id: ID!) {
    ipaddress: removeOneIpaddressById(id: $id) {
      id
      ipaddress
      createdAt
      updatedAt
    }
  }
`;
