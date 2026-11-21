/**
 * @maataa/ui/forms/FormulaInput
 * Arithmetic formulas over named values (e.g. "days * day_rate * 1.18"), with a
 * safe parser (no eval) and the result or error in words
 */

import React, { useRef } from "react";
import { colorTokens, spacingTokens, typographyTokens } from "../tokens";
import { FieldFrame, controlStyle, smallButtonStyle } from "./fieldKit";

export type FormulaResult = { ok: true; value: number } | { ok: false; error: string };

const FUNCS: Record<string, (...a: number[]) => number> = {
  min: Math.min,
  max: Math.max,
  round: (x, d = 0) => Math.round(x * 10 ** d) / 10 ** d,
  floor: Math.floor,
  ceil: Math.ceil,
  abs: Math.abs,
  sqrt: Math.sqrt,
};

/**
 * Evaluate + - * / ^ %, parentheses, numbers, variables and the functions
 * min, max, round, floor, ceil, abs, sqrt.
 */
export function evaluateFormula(expr: string, vars: Record<string, number>): FormulaResult {
  const src = expr.trim();
  if (!src) return { ok: false, error: "The formula is empty." };
  let i = 0;
  const peek = () => {
    while (src[i] === " ") i++;
    return src[i];
  };
  const fail = (msg: string): never => {
    throw new Error(msg);
  };
  const primary = (): number => {
    const c = peek();
    if (c === "(") {
      i++;
      const v = add();
      if (peek() !== ")") fail("A bracket is not closed.");
      i++;
      return v;
    }
    if (c === "-") {
      i++;
      return -power();
    }
    if (c === "+") {
      i++;
      return power();
    }
    const num = /^\d+(\.\d+)?/.exec(src.slice(i));
    if (num) {
      i += num[0].length;
      return Number(num[0]);
    }
    const name = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i));
    if (name) {
      i += name[0].length;
      const n = name[0];
      if (peek() === "(") {
        const fn = FUNCS[n.toLowerCase()];
        if (!fn) fail(`There is no function called ${n}.`);
        i++;
        const args: number[] = [];
        if (peek() !== ")") {
          args.push(add());
          while (peek() === ",") {
            i++;
            args.push(add());
          }
        }
        if (peek() !== ")") fail(`The bracket after ${n} is not closed.`);
        i++;
        return fn!(...args);
      }
      if (!(n in vars)) fail(`Unknown value “${n}”.`);
      return vars[n]!;
    }
    if (c === undefined) fail("The formula ends too early.");
    return fail(`Unexpected “${c}” at position ${i + 1}.`);
  };
  const power = (): number => {
    const b = primary();
    if (peek() === "^") {
      i++;
      return b ** power();
    }
    return b;
  };
  const mul = (): number => {
    let v = power();
    for (;;) {
      const c = peek();
      if (c === "*" || c === "/" || c === "%") {
        i++;
        const r = power();
        if (c === "/" && r === 0) fail("Division by zero.");
        v = c === "*" ? v * r : c === "/" ? v / r : v % r;
      } else return v;
    }
  };
  const add = (): number => {
    let v = mul();
    for (;;) {
      const c = peek();
      if (c === "+" || c === "-") {
        i++;
        const r = mul();
        v = c === "+" ? v + r : v - r;
      } else return v;
    }
  };
  try {
    const v = add();
    if (peek() !== undefined) fail(`Unexpected “${src[i]}” at position ${i + 1}.`);
    if (!Number.isFinite(v)) fail("The result is not a finite number.");
    return { ok: true, value: v };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export interface FormulaVariable {
  name: string;
  value: number;
  /** Human label, e.g. "Shoot days" */
  label?: string;
}

export interface FormulaInputProps {
  label: string;
  value: string;
  onChange: (value: string, result: FormulaResult) => void;
  variables: FormulaVariable[];
  /** Format the result @default en-IN number */
  formatResult?: (n: number) => string;
  hint?: React.ReactNode;
}

/**
 * FormulaInput
 * Variable buttons insert names at the caret. The result line is a polite live
 * region, so the outcome is heard after typing stops.
 */
export function FormulaInput({
  label,
  value,
  onChange,
  variables,
  formatResult = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 }),
  hint,
}: FormulaInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const vars = Object.fromEntries(variables.map((v) => [v.name, v.value]));
  const result = value.trim() ? evaluateFormula(value, vars) : null;
  const err = result && !result.ok ? result.error : undefined;

  const insert = (text: string) => {
    const el = ref.current;
    const s = el?.selectionStart ?? value.length;
    const e = el?.selectionEnd ?? value.length;
    const next = value.slice(0, s) + text + value.slice(e);
    onChange(next, evaluateFormula(next, vars));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(s + text.length, s + text.length);
    });
  };

  return (
    <FieldFrame
      label={label}
      hint={hint ?? "Use + − × ÷ (as * and /), brackets and the values below."}
      error={err}
    >
      {(ids) => (
        <div style={{ display: "flex", flexDirection: "column", gap: spacingTokens.xs }}>
          <input
            ref={ref}
            id={ids.id}
            value={value}
            spellCheck={false}
            autoCapitalize="off"
            onChange={(e) => onChange(e.target.value, evaluateFormula(e.target.value, vars))}
            aria-invalid={err ? true : undefined}
            aria-describedby={ids.describedBy}
            style={{ ...controlStyle(!!err), fontFamily: "ui-monospace, Menlo, monospace" }}
          />
          <div
            role="group"
            aria-label="Insert a value"
            style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens.xs }}
          >
            {variables.map((v) => (
              <button
                key={v.name}
                type="button"
                onClick={() => insert(v.name)}
                style={{ ...smallButtonStyle, minHeight: 36 }}
              >
                <code>{v.name}</code>
                {v.label && (
                  <>
                    {" "}
                    <span style={{ color: colorTokens.text.secondary }}>· {v.label}</span>
                  </>
                )}{" "}
                <span style={{ color: colorTokens.text.secondary }}>= {formatResult(v.value)}</span>
              </button>
            ))}
          </div>
          <output
            htmlFor={ids.id}
            aria-live="polite"
            style={{
              fontSize: typographyTokens.fontSize.lg,
              fontWeight: 600,
              color: colorTokens.text.primary,
            }}
          >
            {result?.ok ? `Result: ${formatResult(result.value)}` : result ? "No result" : ""}
          </output>
        </div>
      )}
    </FieldFrame>
  );
}
