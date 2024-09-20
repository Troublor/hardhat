import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { HardhatError } from "@ignored/hardhat-vnext-errors";
import { getRealPath } from "@ignored/hardhat-vnext-utils/fs";
import {
  assertRejectsWithHardhatError,
  useFixtureProject,
} from "@nomicfoundation/hardhat-test-utils";

import { builtinPlugins } from "../../src/internal/builtin-plugins/index.js";
import { resolveHardhatConfigPath } from "../../src/internal/config-loading.js";
import {
  getGlobalHardhatRuntimeEnvironment,
  resetGlobalHardhatRuntimeEnvironment,
  setGlobalHardhatRuntimeEnvironment,
} from "../../src/internal/global-hre-instance.js";
import {
  createHardhatRuntimeEnvironment,
  getOrCreateGlobalHardhatRuntimeEnvironment,
} from "../../src/internal/hre-intialization.js";

describe("HRE intialization", () => {
  afterEach(() => {
    resetGlobalHardhatRuntimeEnvironment();
  });

  describe("createHardhatRuntimeEnvironment", () => {
    it("should include the built-in plugins", async () => {
      const hre = await createHardhatRuntimeEnvironment({});

      assert.deepEqual(hre.config.plugins, builtinPlugins);
    });
  });

  describe("getGlobalHardhatRuntimeEnvironment", () => {
    it("Should return undefined if the global instance isn't set", () => {
      assert.equal(getGlobalHardhatRuntimeEnvironment(), undefined);
      assert.equal(getGlobalHardhatRuntimeEnvironment(), undefined);
    });

    it("should return the same instance after it's set", async () => {
      const hre = await createHardhatRuntimeEnvironment({});
      setGlobalHardhatRuntimeEnvironment(hre);

      const hre1 = getGlobalHardhatRuntimeEnvironment();
      const hre2 = getGlobalHardhatRuntimeEnvironment();

      assert.ok(hre1 === hre, "The instances are not the same");
      assert.ok(hre2 === hre, "The instances are not the same");
    });

    it("should include the builtin plugins when initialized using createHardhatRuntimeEnvironment", async () => {
      const hre = await createHardhatRuntimeEnvironment({});
      setGlobalHardhatRuntimeEnvironment(hre);
      const globalHre = getGlobalHardhatRuntimeEnvironment();

      assert.ok(globalHre === hre, "The instances are not the same");
      assert.deepEqual(globalHre.config.plugins, builtinPlugins);
    });
  });

  describe("config loading", () => {
    describe("resolveConfigPath", async () => {
      describe("With custom config path", () => {
        useFixtureProject("config-custom-path");

        it("should return the HARDHAT_CONFIG env variable if it is set", async () => {
          try {
            // We set the env var to a hardhat config and then clean it up
            process.env.HARDHAT_CONFIG = "other.config.js";

            assert.equal(
              await resolveHardhatConfigPath(),
              await getRealPath("other.config.js"),
            );
          } finally {
            delete process.env.HARDHAT_CONFIG;
          }
        });

        it("should noramlize and return the provided path", async () => {
          assert.equal(
            await resolveHardhatConfigPath("other.config.js"),
            await getRealPath("other.config.js"),
          );
        });

        it("should throw if the config file is not found", async () => {
          await assertRejectsWithHardhatError(
            resolveHardhatConfigPath("non-existent.config.js"),
            HardhatError.ERRORS.GENERAL.INVALID_CONFIG_PATH,
            {
              configPath: "non-existent.config.js",
            },
          );
        });
      });

      it("should throw if the config file is not found", async () => {
        await assertRejectsWithHardhatError(
          resolveHardhatConfigPath(),
          HardhatError.ERRORS.GENERAL.NO_CONFIG_FILE_FOUND,
          {},
        );
      });

      describe("javascript config", () => {
        describe("current dir", () => {
          useFixtureProject("config-js");

          it("should load a config file in the current directory", async () => {
            const configPath = await resolveHardhatConfigPath();

            assert(
              configPath.endsWith("hardhat.config.js"),
              `expected configPath to end with hardhat.config.js, but got ${configPath}`,
            );
          });
        });

        describe("nested dir", () => {
          useFixtureProject("config-js", "nested-folder");

          it("should load a config file in the parent directory", async () => {
            const configPath = await resolveHardhatConfigPath();

            assert(
              configPath.endsWith("hardhat.config.js"),
              `expected configPath to end with hardhat.config.js, but got ${configPath}`,
            );
          });
        });
      });

      describe("typescript config", () => {
        describe("current dir", () => {
          useFixtureProject("config-ts");

          it("should load a config file in the current directory", async () => {
            const configPath = await resolveHardhatConfigPath();

            assert(
              configPath.endsWith("hardhat.config.ts"),
              `expected configPath to end with hardhat.config.js, but got ${configPath}`,
            );
          });
        });

        describe("nested dir", () => {
          useFixtureProject("config-ts", "nested-folder");

          it("should load a config file in the parent directory", async () => {
            const configPath = await resolveHardhatConfigPath();

            assert(
              configPath.endsWith("hardhat.config.ts"),
              `expected configPath to end with hardhat.config.js, but got ${configPath}`,
            );
          });
        });
      });
    });

    describe("programmatic API", () => {
      useFixtureProject("loaded-config");

      afterEach(() => {
        resetGlobalHardhatRuntimeEnvironment();
      });

      it("should load the plugins from the config file", async () => {
        const hre = await getOrCreateGlobalHardhatRuntimeEnvironment();
        const { testPlugin } = await import(
          "../fixture-projects/loaded-config/hardhat.config.js"
        );

        assert.deepEqual(hre.config.plugins, [...builtinPlugins, testPlugin]);
      });

      it("should load the global options", async () => {
        const hre = await getOrCreateGlobalHardhatRuntimeEnvironment();

        const configPath = await getRealPath("hardhat.config.ts");

        assert.deepEqual(hre.globalOptions, {
          buildProfile: "default",
          config: configPath,
          help: false,
          init: false,
          showStackTraces: false,
          version: false,
          myGlobalOption: "default",
          network: "",
        });
      });
    });
  });
});
