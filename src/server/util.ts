  
import axios, {AxiosRequestConfig, AxiosResponse, Method} from "axios";

import {Response} from "express";
import { Entry } from "webpack";
import { Entries } from "../common/store/entries/types";

export const pipe = (promise: Promise<AxiosResponse>, res: Response) => {
  promise
    .then((r) => {
      res.status(r.status).send(r.data);
    })
    .catch(() => {
      res.status(500).send("Server Error");
    });
};

export const baseApiRequest = (
  url: string,
  method: Method,
  headers: any = {},
  payload: any = {}
): Promise<AxiosResponse> => {
  const requestConf: AxiosRequestConfig = {
    url,
    method,
    validateStatus: () => true,
    responseType: "json",
    headers: { ...headers },
    data: { ...payload },
  };

  return axios(requestConf);
};

export const getBlacklist = () =>
  axios
    .get("https://spaminator.me/api/bl/all.txt")
    .then(({ data }) => data.split(/\r?\n/));

export const windowExists = typeof window !== undefined