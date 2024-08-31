import type { UserInterruptionManager } from "@ignored/hardhat-vnext/types/user-interruptions";

import { HardhatPluginError } from "@ignored/hardhat-vnext/plugins";

import { PLUGIN_ID } from "../constants.js";

/**
 * A class that handles user interruptions directly on the console
 * and explicitly does NOT go through the user interruptions
 * system of the Hook system.
 */
export class DirectUserInterruptions implements UserInterruptionManager {
  readonly #console: Console;

  constructor(givenConsole?: Console) {
    this.#console = givenConsole ?? console;
  }

  public async displayMessage(
    _interruptor: string,
    message: string,
  ): Promise<void> {
    this.#console.log(message);
  }

  public async requestSecretInput(
    _interruptor: string,
    inputDescription: string,
  ): Promise<string> {
    const { createInterface } = await import("node:readline");

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
    We need to access a private property of the readline interface. */
    const rlAsAny = rl as any;

    let initialMessage: string | undefined;

    rlAsAny._writeToOutput = (out: string) => {
      if (initialMessage === undefined || out.length !== 1) {
        if (initialMessage === undefined) {
          initialMessage = out;
        }

        if (rlAsAny.output === undefined) {
          throw new HardhatPluginError(
            PLUGIN_ID,
            "Expected readline output to be defined",
          );
        }

        // We show the initial message as is
        if (out.startsWith(initialMessage)) {
          rlAsAny.output.write(initialMessage);
          out = out.slice(initialMessage.length);
        } else if (out.trim() === "") {
          rlAsAny.output.write(out);
          out = "";
        }
      }

      // We show the rest of the chars as "*"
      for (const _ of out) {
        rlAsAny.output.write("*");
      }
    };

    return new Promise<string>((resolve) => {
      rl.question(inputDescription, (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  }

  public async requestInput(
    _interruptor: string,
    _inputDescription: string,
  ): Promise<string> {
    throw new HardhatPluginError(PLUGIN_ID, "Uninterrupted not implemented");
  }

  public async uninterrupted<ReturnT>(
    _f: () => ReturnT,
  ): Promise<Awaited<ReturnT>> {
    throw new HardhatPluginError(PLUGIN_ID, "Uninterrupted not implemented");
  }
}
