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
package com.dremio.exec.store;

import com.google.errorprone.annotations.FormatMethod;

/**
 * Thrown if Nessie client is not authorized (one of the reason can be due to expired token or
 * invalid token)
 */
public class UnAuthenticatedException extends RuntimeException {
  private static final long serialVersionUID = 1L;

  public UnAuthenticatedException() {
    super();
  }

  public UnAuthenticatedException(String errorMessage) {
    super(errorMessage);
  }

  @FormatMethod
  public UnAuthenticatedException(Throwable cause, String message, Object... args) {
    super(String.format(message, args), cause);
  }
}
