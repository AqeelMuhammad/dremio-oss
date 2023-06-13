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

import { Card, Skeleton } from "dremio-ui-lib/components";
import classes from "./ArcticCatalogCard.less";
export const ArcticCatalogCardSkeleton = () => {
  return (
    <Card
      title={
        <>
          <Skeleton
            type="custom"
            width="20px"
            height="20px"
            className={classes["arctic-catalog-card__title-icon"]}
          />
          <h2>
            <Skeleton width="18ch" />
          </h2>
        </>
      }
    >
      <dl className="dremio-description-list">
        <dt>
          <Skeleton width="9ch" />
        </dt>
        <dd>
          <Skeleton
            type="custom"
            width="24px"
            height="24px"
            style={{
              borderRadius: "100%",
              marginRight: "var(--dremio--spacing--05)",
            }}
          />
          <Skeleton width="12ch" />
        </dd>
        <dt>
          <Skeleton width="9ch" />
        </dt>
        <dd>
          <Skeleton width="13ch" />
        </dd>
      </dl>
    </Card>
  );
};
