import * as vscode from "vscode";
import {
  Node,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  identifier,
} from "@babel/types";

type DebounceFunction<T extends any[]> = (...args: T) => void;

export function debounce<T extends any[]>(
  func: DebounceFunction<T>,
  delay: number
): DebounceFunction<T> {
  let timeoutId: NodeJS.Timeout;

  return function (...args: T) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function setCursorPosition(line: number, column: number) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const newPosition = new vscode.Position(line, column);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    editor.revealRange(newSelection);
  }
}

export function variableDeclaratorCallExpression(node: any) {
  const { type, init } = node;
  return (
    type === "VariableDeclarator" && init && init.type === "CallExpression"
  );
}

export function expressionStatementCallExpression(node: any) {
  const { type, expression } = node;
  return type === "ExpressionStatement" && expression.type === "CallExpression";
}

export function calleeNameNode(name: string, node: any) {
  return (
    isCallExpression(node.init) &&
    isIdentifier(node.init.callee, { name })
  );
}

export function isVariable(node: Node, varList: string[]) {
  return varList.some(
    (name) =>
      isMemberExpression(node) && isIdentifier(node.object, { name: name })
  );
}
