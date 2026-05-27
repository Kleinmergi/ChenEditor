import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand('chen.preview', async () => {
    vscode.window.showInformationMessage('Chen preview scaffold is installed.');
  });
  context.subscriptions.push(cmd);
}

export function deactivate() {}
