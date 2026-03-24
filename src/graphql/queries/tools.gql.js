import { gql } from '@apollo/client/core';

export const GET_LINK_PING = gql`
  query GetLinkPing($host: String!) {
    getLinkPing(host: $host)
  }
`;

export const GET_LINK_RDP = gql`
  query GetLinkRDP($host: String!) {
    getLinkRDP(host: $host)
  }
`;

export const GET_LINK_VNC = gql`
  query GetLinkVNC($host: String!) {
    getLinkVNC(host: $host)
  }
`;
