import React, { Component } from "react";
import { History, Location } from "history";

import moment from "moment";

import isEqual from "react-fast-compare";

import { Entry } from "../../store/entries/types";
import { State as GlobalState } from "../../store/global/types";

import { Account } from "../../store/accounts/types";

import defaults from "../../constants/defaults.json";

import {
  catchPostImage,
  postBodySummary,
  setProxyBase,
  // @ts-ignore
} from "@esteemapp/esteem-render-helpers";
setProxyBase(defaults.imageServer);

import { State as CommunityState } from "../../store/community/types";

import ProfileLink from "../profile-link/index";
import TagLink from "../tag-link/index";
import UserAvatar from "../user-avatar/index";
import EntryLink from "../entry-link/index";
import EntryVoteBtn from "../entry-vote-btn/index";
import EntryReblogBtn from "../entry-reblog-btn/index";
import EntryPayout from "../entry-payout/index";
import EntryVotes from "../entry-votes";
import Tooltip from "../tooltip";

import parseDate from "../../helper/parse-date";
import parseAsset from "../../helper/parse-asset";
import appName from "../../helper/app-name";

import { _t } from "../../i18n/index";

import _c from "../../util/fix-class-names";

import { repeatSvg, pinSvg, commentSvg } from "../../img/svg";

const fallbackImage = require("../../img/fallback.png");
const noImage = require("../../img/noimage.png");

interface Props {
  history: History;
  location: Location;
  global: GlobalState;
  community?: CommunityState | null;
  entry: Entry;
  asAuthor: string;
  promoted: boolean;
  addAccount: (data: Account) => void;
}

export default class EntryListItem extends Component<Props> {
  public static defaultProps = {
    asAuthor: "",
    promoted: false,
  };

  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
    return (
      !isEqual(this.props.entry, nextProps.entry) ||
      !isEqual(this.props.community, nextProps.community) ||
      !isEqual(this.props.global, nextProps.global)
    );
  }

  render() {
    const { entry, community, asAuthor, promoted } = this.props;
    const img: string = catchPostImage(entry, 600, 500) || noImage;
    const summary: string = postBodySummary(entry, 200);

    const app = appName(entry?.json_metadata?.app);

    const reputation = Math.floor(entry.author_reputation);
    const date = moment(parseDate(entry.created));
    const dateRelative = date.fromNow(true);
    const dateFormatted = date.format("LLLL");

    const isChild = !!entry.parent_author;

    const title = entry.title;

    const isVisited = false;
    const isPinned = community && entry.stats?.is_pinned;

    let reBlogged: string | undefined;
    if (asAuthor && asAuthor !== entry.author && !isChild) {
      reBlogged = asAuthor;
    }

    if (entry.reblogged_by && entry.reblogged_by.length > 0) {
      [reBlogged] = entry.reblogged_by;
    }

    const cls = `entry-list-item ${promoted ? "promoted-item" : ""} ${community ? "with-community" : ""}`;
    return (
      <div className={_c(cls)}>
        <div className="item-header">
          <div className="author-part">
            <ProfileLink {...this.props} username={entry.author}>
              <a className="author-avatar">
                <UserAvatar username={entry.author} size="small" />
              </a>
            </ProfileLink>
            <ProfileLink {...this.props} username={entry.author}>
              <div className="author">
                {entry.author}
                <span className="author-reputation">{reputation}</span>
              </div>
            </ProfileLink>
          </div>
          <TagLink {...this.props} tag={entry.category}>
            <a className="category">{entry.community_title || entry.category}</a>
          </TagLink>
          {!isVisited && <span className="read-mark" />}
          <span className="date" title={dateFormatted}>
            {dateRelative}
          </span>
          {isPinned && (
            <Tooltip content={_t("entry-list-item.pinned")}>
              <span className="pinned">{pinSvg}</span>
            </Tooltip>
          )}
          {reBlogged && (
            <span className="reblogged">
              {repeatSvg} {_t("entry-list-item.reblogged", { n: reBlogged })}
            </span>
          )}
          {promoted && (
            <>
              <span className="space" />
              <div className="promoted">{_t("entry-list-item.promoted")}</div>
            </>
          )}
        </div>
        <div className="item-body">
          <div className="item-image">
            <EntryLink {...this.props} entry={entry}>
              <div>
                <img
                  src={img}
                  alt={title}
                  onError={(e: React.SyntheticEvent) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImage;
                  }}
                />
              </div>
            </EntryLink>
          </div>
          <div className="item-summary">
            <EntryLink {...this.props} entry={entry}>
              <div className="item-title">{title}</div>
            </EntryLink>
            <EntryLink {...this.props} entry={entry}>
              <div className="item-body">{summary}</div>
            </EntryLink>
          </div>
          <div className="item-controls">
            <EntryVoteBtn {...this.props} />
            <EntryPayout {...this.props} entry={entry} />
            <EntryVotes {...this.props} entry={entry} />
            <a className="comments">
              {commentSvg} {entry.children}
            </a>
            <EntryReblogBtn {...this.props} />
            <div className="app">{app}</div>
          </div>
        </div>
      </div>
    );
  }
}
