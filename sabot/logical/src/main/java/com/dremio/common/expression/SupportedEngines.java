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

package com.dremio.common.expression;

import java.util.HashSet;
import java.util.Set;

/**
 * Class to capture the supported execution engines
 * for an expression.
 * Supported engines are Gandiva and Java.
 */
public class SupportedEngines {
  public enum CodeGenOption {
    // use Gandiva only to generate code
    // This is a test-hook to be used by test code
    GandivaOnly,
    // prefer Java to generate code
    Java,
    // prefer Gandiva to generate code
    Gandiva;

    public static final CodeGenOption DEFAULT = Gandiva;

    // Converts optionName to an enum
    public static CodeGenOption getCodeGenOption(String optionName) {
      try {
        return CodeGenOption.valueOf(optionName);
      } catch (Exception e) {
        // The optionName may be the lower case string (e.g. java)
        for(CodeGenOption option : CodeGenOption.values()) {
          if (optionName.equalsIgnoreCase(option.toString())) {
            return option;
          }
        }
      }

      // unreachable code. The validator ensures that the value is one of the available choices
      return DEFAULT;
    }
  }

  public enum Engine {
    JAVA,
    GANDIVA;
  }

  public final Set<Engine> supportedEngines;

  public SupportedEngines() {
    this.supportedEngines = new HashSet<>();
  }

  public SupportedEngines duplicate() {
    final SupportedEngines duplicate = new SupportedEngines();
    duplicate.supportedEngines.addAll(supportedEngines);
    return duplicate;
  }

  /**
   * Checks if an evaluation type is supported
   * @param engine Evaluation type to check
   * @return true if evaluation type is supported
   */
  public boolean contains(Engine engine) {
    return supportedEngines.contains(engine);
  }

  /**
   * Marks an execution engine as supported
   * @param engine Evaluation type to be added
   */
  public void add(Engine engine) {
    supportedEngines.add(engine);
  }

  /**
   * Removes an execution engine
   * @param engine Engine to be removed
   */
  public void remove(Engine engine) {
    supportedEngines.remove(engine);
  }

  /**
   * Clears all supported engines.
   */
  public void clear() {
    supportedEngines.clear();
  }

  public boolean isEmpty() {
    return supportedEngines.isEmpty();
  }
}
