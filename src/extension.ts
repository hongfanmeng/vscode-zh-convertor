import * as vscode from "vscode";
import * as opencc from "opencc-js";

const COMMANDS: { command: string; options: opencc.ConverterOptions }[] = [
  {
    command: "vscode-zh-convertor.zh-hans-to-zh-hant",
    options: { from: "cn", to: "hk" },
  },
  {
    command: "vscode-zh-convertor.zh-hant-to-zh-hans",
    options: { from: "hk", to: "cn" },
  },
];

function process(
  textEditor: vscode.TextEditor,
  options: opencc.ConverterOptions
) {
  let document: vscode.TextDocument = textEditor.document;
  let selection: vscode.Selection | vscode.Range = textEditor.selection;
  if (selection.isEmpty) {
    const fullText = document.getText();
    selection = new vscode.Range(
      document.positionAt(0),
      document.positionAt(fullText.length - 1)
    );
  }

  const converter: opencc.ConvertText = opencc.Converter(options);
  let text = document.getText(selection);
  const result = converter(text);
  textEditor.edit((builder) => {
    builder.replace(selection, result);
  });
}

export function activate(context: vscode.ExtensionContext) {
  COMMANDS.forEach((item) => {
    context.subscriptions.push(
      vscode.commands.registerTextEditorCommand(item.command, (textEditor) => {
        process(textEditor, item.options);
      })
    );
  });
}

export function deactivate() {}
