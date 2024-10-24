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
import { shallow } from "enzyme";

import FormProgressWrapper from "./FormProgressWrapper";

describe("FormProgressWrapper", () => {
  let minimalProps;
  beforeEach(() => {
    minimalProps = {};
  });

  it("should render with minimal props without exploding", () => {
    const wrapper = shallow(<FormProgressWrapper {...minimalProps} />);
    expect(wrapper).to.have.length(1);
  });

  it("should render children", () => {
    const wrapper = shallow(
      <FormProgressWrapper>
        <span>foo</span>
      </FormProgressWrapper>,
    );
    expect(wrapper.find("span").first().text()).to.eql("foo");
  });

  it("should render overlay when submitting", () => {
    const wrapper = shallow(
      <FormProgressWrapper>
        <span>foo</span>
      </FormProgressWrapper>,
    );
    expect(wrapper.find(".submitting-overlay")).to.have.length(0);
    wrapper.setProps({ submitting: true });
    expect(wrapper.find(".submitting-overlay")).to.have.length(1);
    expect(wrapper.find("span").first().text()).to.eql("foo");
  });
});
