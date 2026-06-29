declare module "vscode" {
  export interface ExtensionContext {
    subscriptions: { dispose(): unknown }[];
  }

  export const commands: {
    registerCommand(command: string, callback: (...args: unknown[]) => unknown): { dispose(): unknown };
  };

  export const window: {
    showInformationMessage(message: string): Thenable<string | undefined>;
  };
}
