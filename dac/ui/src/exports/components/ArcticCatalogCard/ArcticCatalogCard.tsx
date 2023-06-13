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

import { type FunctionComponent } from "react";
import { Avatar, Card, IconButton } from "dremio-ui-lib/components";
import { intl } from "@app/utils/intl";
import type { ArcticCatalog } from "../../endpoints/ArcticCatalogs/ArcticCatalog.type";
import classes from "./ArcticCatalogCard.less";
import { nameToInitials } from "../../utilities/nameToInitials";
import { formatFixedDateTimeLong } from "../../utilities/formatDate";
import * as PATHS from "@app/exports/paths";
//@ts-ignore
import { Tooltip } from "dremio-ui-lib";
import LinkWithRef from "@app/components/LinkWithRef/LinkWithRef";

type ArcticCatalogCardProps = {
  catalog: ArcticCatalog;
};

export const ArcticCatalogCard: FunctionComponent<ArcticCatalogCardProps> = (
  props
) => {
  const { catalog } = props;
  const { formatMessage } = intl;

  return (
    <Card
      title={
        <>
          <dremio-icon
            name="brand/arctic-catalog-source"
            class={classes["arctic-catalog-card__title-icon"]}
            alt=""
          ></dremio-icon>
          <h2 className={classes["arctic-catalog-card__title"]}>
            <Tooltip title={catalog.name}>
              <p className="text-ellipsis">{catalog.name}</p>
            </Tooltip>
          </h2>
        </>
      }
      toolbar={
        <IconButton
          as={LinkWithRef}
          className="arctic-catalog-card__settings"
          to={PATHS.arcticCatalogSettings({ arcticCatalogId: catalog.id })}
          tooltip={formatMessage({ id: "Settings.Catalog" })}
        >
          <dremio-icon
            name="interface/settings"
            alt={formatMessage({ id: "Settings.Catalog" })}
          />
        </IconButton>
      }
    >
      <dl className="dremio-description-list">
        <dt>{formatMessage({ id: "Common.Owner" })}</dt>
        <dd>
          <Avatar
            initials={nameToInitials(catalog.ownerName)}
            style={{ marginRight: "var(--dremio--spacing--05)" }}
          />
          {catalog.ownerName}
        </dd>
        <dt>{formatMessage({ id: "Common.CreatedOn" })}</dt>
        <dd>{formatFixedDateTimeLong(catalog.createdAt)}</dd>
      </dl>
    </Card>
  );
};
