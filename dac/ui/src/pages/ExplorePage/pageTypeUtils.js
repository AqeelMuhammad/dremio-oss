/*
 * Copyright (C) 2017-2019 Dremio Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { PageTypes } from "#oss/pages/ExplorePage/pageTypes";
import * as sqlPaths from "dremio-ui-common/paths/sqlEditor.js";
import {
  addProjectBase,
  getProjectBase,
  rmProjectBase,
} from "dremio-ui-common/utilities/projectBase.js";

export const getPathPart = (pageType) =>
  pageType && pageType !== PageTypes.default ? `/${pageType}` : "";

const countSlashes = (str) => {
  if (!str) return 0;
  const matches = str.match(/\//g);
  return matches ? matches.length : 0;
};
// explore page has the following url pattern (see routes.js):
// So page type may or may not be presented.
const isPageTypeContainedInPath = (pathname) => {
  const patternSlashCount = countSlashes(
    pathname.startsWith("/new_query")
      ? sqlPaths.sqlEditor.fullRoute() //Existing (temporary) dataset is also /sql?version=a&tipVersion=b
      : sqlPaths.existingDataset.fullRoute(),
  );
  let validSlashCount = patternSlashCount;
  if (getProjectBase() !== "/") {
    validSlashCount -= countSlashes(getProjectBase());
  }

  return validSlashCount === countSlashes(pathname);
};

export const excludePageType = (pathname) => {
  let pathWithoutPageType = pathname;
  if (isPageTypeContainedInPath(pathname)) {
    // current path contains pageType. We should exclude it
    pathWithoutPageType = pathname.substr(0, pathname.lastIndexOf("/"));
  }
  return pathWithoutPageType;
};

/**
 * Changes page type for explore page
 * @param {string} pathname - current path name
 * @param {PageTypes} newPageType - a new page type. {@see PageTypes}
 */
export const changePageTypeInUrl = (pathname, newPageType) => {
  return addProjectBase(
    excludePageType(rmProjectBase(pathname)) + getPathPart(newPageType),
  );
};
