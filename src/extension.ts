import * as vscode from "vscode";
import { OpenCC } from "opencc";

const COMMANDS: { command: string; configFile: string }[] = [
  {
    command: "vscode-zh-convertor.zh-hans-to-zh-hant",
    configFile: "s2t.json",
  },
  {
    command: "vscode-zh-convertor.zh-hant-to-zh-hans",
    configFile: "t2s.json",
  },
];

function process(textEditor: vscode.TextEditor, configFile: string) {
  let document: vscode.TextDocument = textEditor.document;
  let selection: vscode.Selection | vscode.Range = textEditor.selection;
  if (selection.isEmpty) {
    const fullText = document.getText();
    selection = new vscode.Range(
      document.positionAt(0),
      document.positionAt(fullText.length - 1)
    );
  }

  const converter: OpenCC = new OpenCC(configFile);
  let text = document.getText(selection);
  const result = converter.convertSync(text);
  textEditor.edit((builder) => {
    builder.replace(selection, result);
  });
}

export function activate(context: vscode.ExtensionContext) {
  COMMANDS.forEach((item) => {
    context.subscriptions.push(
      vscode.commands.registerTextEditorCommand(item.command, (textEditor) => {
        process(textEditor, item.configFile);
      })
    );
  });
}

export function deactivate() {}
