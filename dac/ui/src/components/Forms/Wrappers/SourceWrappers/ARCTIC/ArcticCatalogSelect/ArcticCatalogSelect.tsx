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
import * as React from "react";
import { useContext, useCallback, useMemo, memo } from "react";
import { RequestStatus } from "smart-resource";
import { orderBy } from "lodash";
import { FieldWithError } from "@app/components/Fields";
import { ElementConfig } from "@app/types/Sources/SourceFormTypes";
import { FieldProp } from "redux-form";
import { Select, SelectItem } from "@mantine/core";
import {
  ModalContainer,
  Skeleton,
  Spinner,
  useModalContainer,
} from "dremio-ui-lib/components";

import { fieldWithError } from "../../../FormWrappers.less";
import { ArcticCatalog } from "@app/exports/endpoints/ArcticCatalogs/ArcticCatalog.type";
import { NewArcticCatalogDialog } from "@app/exports/components/NewArcticCatalogDialog/NewArcticCatalogDialog";
import { intl } from "@app/utils/intl";
import { FormContext } from "@app/pages/HomePage/components/modals/formContext";
import sentryUtil from "@app/utils/sentryUtil";
import { useFeatureFlag } from "@app/exports/providers/useFeatureFlag";
import { ARCTIC_CATALOG_CREATION } from "@app/exports/flags/ARCTIC_CATALOG_CREATION";
import { useArcticCatalogs } from "@app/exports/providers/useArcticCatalogs";
import { useSelector } from "react-redux";
import { getSortedSources } from "@app/selectors/home";
import { ARCTIC } from "@app/constants/sourceTypes";

import * as classes from "./ArcticCatalogSelect.less";

type ArcticCatalogSelectWrapperProps = {
  elementConfig: ElementConfig;
  fields: any;
  field: FieldProp<string>;
  disabled?: boolean;
  editing?: boolean;
};

type ArcticCatalogSelectProps = {
  onChange?: (value: string | null, name?: string | null) => void;
  value?: string | null;
  placeholder?: string;
};

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label?: string;
  value: string;
}

const NEW_CATALOG_ITEM = "NEW_CATALOG_ITEM";
const ERROR_ITEM = "ERROR_ITEM";
const LOADING_ITEM = "LOADING_ITEM";

const Skeletons = new Array(5)
  .fill(null)
  .map((v, i) => ({ label: LOADING_ITEM, value: `${LOADING_ITEM}-${i}` }));

const ArcticCatalogSelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ label, value, ...others }: ItemProps, ref) => {
    function getContent() {
      if (label === LOADING_ITEM) {
        return <Skeleton width="18ch" />;
      } else if (value === ERROR_ITEM) {
        return (
          <span>
            {intl.formatMessage({ id: "ArcticSource.ErrorCatalogItem" })}
          </span>
        );
      } else if (value === NEW_CATALOG_ITEM) {
        return (
          <span>
            <dremio-icon name="interface/plus" />{" "}
            <span>
              {intl.formatMessage({ id: "ArcticSource.NewCatalogItem" })}
            </span>
          </span>
        );
      } else {
        return label;
      }
    }
    return (
      <div ref={ref} {...others}>
        {getContent()}
      </div>
    );
  }
);

function getOptions(
  catalogs: ArcticCatalog[] | null,
  status: RequestStatus,
  enableNewCatalogItem: boolean,
  arcticSourceIds: string[],
  canAddCatalog: boolean
) {
  if (status === "pending") {
    return Skeletons;
  } else if (catalogs) {
    const options: (string | SelectItem)[] = orderBy(catalogs, "name").map(
      (cur) => ({
        value: cur.id,
        label: cur.name,
        disabled: arcticSourceIds.includes(cur.id),
      })
    );
    if (enableNewCatalogItem && canAddCatalog) {
      options.push({
        value: NEW_CATALOG_ITEM,
        label: "",
      });
    }
    return options;
  } else {
    return [
      {
        value: ERROR_ITEM,
        label: "",
      },
    ];
  }
}

function ArcticCatalogSelect({
  onChange,
  value,
  placeholder,
}: ArcticCatalogSelectProps) {
  const { editing } = useContext(FormContext);
  const sources = useSelector(getSortedSources);
  const canAddCatalog = useSelector(
    (state: Record<string, any>) =>
      state.privileges.organization?.arcticCatalogs?.canCreate
  );

  const arcticSourceIds = useMemo(() => {
    return sources
      .toJS()
      .filter((cur: { type: string }) => cur.type === ARCTIC)
      .map((cur: any) => cur.config.arcticCatalogId);
  }, [sources]);
  const [catalogs, , status] = useArcticCatalogs();
  const newArcticCatalog = useModalContainer();
  const [result] = useFeatureFlag(ARCTIC_CATALOG_CREATION);

  const handleArcticCatalogCreation = useCallback(
    (createdCatalog: ArcticCatalog) => {
      try {
        sessionStorage.setItem("newCatalogId", createdCatalog.id);
        onChange?.(createdCatalog.id, createdCatalog.name);
      } catch (e) {
        sentryUtil.logException(e);
      } finally {
        newArcticCatalog.close();
      }
    },
    [newArcticCatalog, onChange]
  );

  const onSelectChange = useCallback(
    (value: string) => {
      if (status === "pending" || status === "error") return;
      if (value === NEW_CATALOG_ITEM) {
        newArcticCatalog.open();
      } else if (catalogs) {
        const name = catalogs.find(
          (cur: ArcticCatalog) => cur.id === value
        )?.name;
        onChange?.(value, name);
      }
    },
    [onChange, newArcticCatalog, catalogs, status]
  );

  const options = useMemo(
    () =>
      getOptions(catalogs, status, !!result, arcticSourceIds, canAddCatalog),
    [catalogs, status, result, arcticSourceIds, canAddCatalog]
  );

  return (
    <>
      <Select
        // searchable
        className={classes["arctic-catalog-select"]}
        disabled={status === "pending" || editing}
        placeholder={status === "pending" ? "" : placeholder}
        itemComponent={ArcticCatalogSelectItem}
        data={options}
        // maxDropdownHeight={200}
        value={value}
        onChange={onSelectChange}
        rightSection={<dremio-icon name="interface/caretDown" />}
        {...(status === "pending" && {
          icon: <Spinner />,
        })}
      />
      <ModalContainer {...newArcticCatalog}>
        <NewArcticCatalogDialog
          onCancel={newArcticCatalog.close}
          onSuccess={handleArcticCatalogCreation}
        />
      </ModalContainer>
    </>
  );
}
const ArcticCatalogSelectMemo = memo(ArcticCatalogSelect); //Rerender on hover

function ArcticCatalogSelectWrapper({
  field,
  elementConfig,
  fields,
}: ArcticCatalogSelectWrapperProps) {
  const handleChange = useCallback(
    (value: string | null, name?: string | null) => {
      field.onChange(value);
      fields.name.onChange(name);
    },
    [field, fields.name]
  );
  return (
    <FieldWithError
      {...field}
      label={intl.formatMessage({
        id: "ArcticSource.SelectCatalogFormItemLabel",
      })}
      name={elementConfig.getPropName()}
      className={fieldWithError}
    >
      <ArcticCatalogSelectMemo
        value={field.value}
        onChange={handleChange}
        placeholder={intl.formatMessage({
          id: "ArcticSource.SelectCatalogPlaceholder",
        })}
      />
    </FieldWithError>
  );
}

export default ArcticCatalogSelectWrapper;
