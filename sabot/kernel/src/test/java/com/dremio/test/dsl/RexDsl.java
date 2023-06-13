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
package com.dremio.test.dsl;

import static com.dremio.test.scaffolding.ScaffoldingRel.DATE_TYPE;
import static com.dremio.test.scaffolding.ScaffoldingRel.FLOAT_TYPE;
import static com.dremio.test.scaffolding.ScaffoldingRel.INT_NULL_TYPE;
import static com.dremio.test.scaffolding.ScaffoldingRel.INT_TYPE;
import static com.dremio.test.scaffolding.ScaffoldingRel.REX_BUILDER;
import static com.dremio.test.scaffolding.ScaffoldingRel.VARCHAR_NULL_TYPE;
import static com.dremio.test.scaffolding.ScaffoldingRel.VARCHAR_TYPE;

import java.util.List;

import org.apache.calcite.avatica.util.ByteString;
import org.apache.calcite.rel.core.CorrelationId;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rex.RexInputRef;
import org.apache.calcite.rex.RexLiteral;
import org.apache.calcite.rex.RexNode;
import org.apache.calcite.sql.fun.SqlStdOperatorTable;
import org.apache.calcite.util.DateString;

/**
 * Convince functions for build in line {@link RexNode}.
 */
public class RexDsl {
  public static RexNode and(RexNode...exprs) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.AND, exprs);
  }

  public static RexNode or(RexNode...exprs) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.OR, exprs);
  }

  public static RexNode or(List<RexNode> exprs) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.OR, exprs);
  }

  /**
   * Equals(=).
   */
  public static RexNode eq(RexNode expr1, RexNode expr2) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.EQUALS, expr1, expr2);
  }

  /**
   * Not Equals(!=).
   */
  public static RexNode notEq(RexNode expr1, RexNode expr2) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.NOT_EQUALS, expr1, expr2);
  }

  /**
   * Less than or equals to(<=).
   */
  public static RexNode lte(RexNode expr1, RexNode expr2) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.LESS_THAN_OR_EQUAL, expr1, expr2);
  }

  /**
   * Less than(<).
   **/
  public static RexNode lt(RexNode expr1, RexNode expr2) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.LESS_THAN, expr1, expr2);
  }

  /**
   * Greater than(>).
   */
  public static RexNode gt(RexNode expr1, RexNode expr2) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.GREATER_THAN, expr1, expr2);
  }

  /**
   * Greater than or Equal to(>=).
   */
  public static RexNode gte(RexNode expr1, RexNode expr2) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.GREATER_THAN_OR_EQUAL, expr1, expr2);
  }

  /**
   * Modules(expr1 % expr2).
   */
  public static RexNode mod(RexNode expr1, RexNode expr2) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.MOD,expr1, expr2);
  }

  public static RexNode literal(int value) {
    return REX_BUILDER.makeLiteral(value, INT_TYPE, false);
  }

  public static RexNode literal(float value) {
    return REX_BUILDER.makeLiteral(value, FLOAT_TYPE, false);
  }

  public static RexNode literalDate(String value) {
    return REX_BUILDER.makeDateLiteral(new DateString(value));
  }

  public static RexLiteral literalBinary(String base16Value) {
    return REX_BUILDER.makeBinaryLiteral(ByteString.of(base16Value, 16));
  }

  public static RexNode literalNullable(int value) {
    return REX_BUILDER.makeLiteral(value, INT_NULL_TYPE, false);
  }

  public static RexNode literal(String value) {
    return REX_BUILDER.makeLiteral(value);
  }

  public static RexNode literal(boolean value) {
    return REX_BUILDER.makeLiteral(value);
  }

  public static RexInputRef intNullInput(int i) {
    return REX_BUILDER.makeInputRef(INT_NULL_TYPE, i);
  }

  public static RexInputRef intInput(int i) {
    return REX_BUILDER.makeInputRef(INT_TYPE, i);
  }

  public static RexInputRef dateInput(int i) {
    return REX_BUILDER.makeInputRef(DATE_TYPE, i);
  }

  public static RexNode intCorrel(CorrelationId correlationId) {
    return REX_BUILDER.makeCorrel(INT_TYPE, correlationId);
  }

  public static RexInputRef varcharInput(int i) {
    return REX_BUILDER.makeInputRef(VARCHAR_TYPE, i);
  }

  public static RexInputRef varcharNullInput(int i) {
    return REX_BUILDER.makeInputRef(VARCHAR_NULL_TYPE, i);
  }

  public static RexNode cast(RelDataType type, RexNode exp) {
    return REX_BUILDER.makeCast(type, exp);
  }

  public static RexNode caseExpr(RexNode... exp) {
    return REX_BUILDER.makeCall(SqlStdOperatorTable.CASE, exp);
  }
}
