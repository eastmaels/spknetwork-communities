import axios from "axios";

import { Entry } from "../store/entries/types";
import { Community } from "../store/community/types";

import SERVERS from "../constants/servers.json";

const pickAServer = (): string => SERVERS.sort(() => 0.5 - Math.random())[0];

const bridgeApiCall = <T>(endpoint: string, params: {}): Promise<T> =>
  axios
    .post(pickAServer(), {
      jsonrpc: "2.0",
      method: endpoint,
      params: params,
      id: 1,
    })
    .then((resp) => {
      return resp?.data?.result || null;
    });

export const getPostsRanked = (
  sort: string,
  start_author: string = "",
  start_permlink: string = "",
  limit: number = 20,
  tag: string = "",
  observer: string = ""
): Promise<Entry[] | null> =>
  bridgeApiCall<Entry[] | null>("bridge.get_ranked_posts", {
    sort,
    start_author,
    start_permlink,
    limit,
    tag,
    observer,
  });

export const getAccountPosts = (
  sort: string,
  account: string,
  start_author: string = "",
  start_permlink: string = "",
  limit: number = 20,
  observer: string = ""
): Promise<Entry[] | null> =>
  bridgeApiCall<Entry[] | null>("bridge.get_account_posts", {
    sort,
    account,
    observer,
  });

export const getPost = (author: string = "", permlink: string = "", observer: string = ""): Promise<Entry | null> =>
  bridgeApiCall<Entry | null>("bridge.get_post", {
    author,
    permlink,
    observer,
  });

export const getCommunity = (name: string, observer: string = ""): Promise<Community | null> =>
  bridgeApiCall<Community | null>("bridge.get_community", { name, observer });

export const getCommunities = (
  last: string = "",
  limit: number = 100,
  query: string = "",
  sort: string = "rank",
  observer: string = ""
): Promise<Community[] | null> =>
  bridgeApiCall<Community[] | null>("bridge.list_communities", {
    last,
    limit,
    query,
    sort,
    observer,
  });