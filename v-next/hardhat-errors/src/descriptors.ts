/**
 * A description of a kind of error that Hardhat can throw.
 */
export interface ErrorDescriptor {
  /**
   * The error number, which should be unique.
   */
  number: number;

  /**
   * The id of the plugin that throws this error.
   */
  pluginId?: string;

  /**
   * A tempalte of the message of the error.
   *
   * This should be a short description. If possible, it should tell the user
   * how to solve their problem.
   *
   * @see The `applyErrorMessageTemplate` function.
   */
  messageTemplate: string;

  /**
   * `true` if this error should be reported
   */
  shouldBeReported?: true;

  /**
   * The title to use on the website section explaining this error, which can
   * use markdown.
   */
  websiteTitle: string;

  /**
   * The description to use on the website section explaining this error, which
   * can use markdown.
   */
  websiteDescription: string;
}

export const ERROR_CATEGORIES: {
  [categoryName: string]: {
    min: number;
    max: number;
    websiteTitle: string;
  };
} = {
  GENERAL: { min: 1, max: 99, websiteTitle: "General errors" },
  INTERNAL: { min: 100, max: 199, websiteTitle: "Internal Hardhat errors" },
  PLUGINS: {
    min: 200,
    max: 299,
    websiteTitle: "Plugin errors",
  },
  HOOKS: {
    min: 300,
    max: 399,
    websiteTitle: "Hooks errors",
  },
  TASK_DEFINITIONS: {
    min: 400,
    max: 499,
    websiteTitle: "Task definition errors",
  },
  ARGUMENTS: { min: 500, max: 599, websiteTitle: "Arguments related errors" },
  BUILTIN_TASKS: { min: 600, max: 699, websiteTitle: "Built-in tasks errors" },
  NETWORK: { min: 700, max: 799, websiteTitle: "Network errors" },
  KEYSTORE: { min: 800, max: 899, websiteTitle: "Keystore errors" },
  NETWORK_HELPERS: {
    min: 900,
    max: 999,
    websiteTitle: "Network-helpers errors",
  },
  SOLIDITY: { min: 1000, max: 1099, websiteTitle: "Solidity errors" },
};

export const ERRORS = {
  GENERAL: {
    NOT_INSIDE_PROJECT: {
      number: 1,
      messageTemplate: "You are not inside a Hardhat project.",
      websiteTitle: "You are not inside a Hardhat project",
      websiteDescription: `You are trying to run Hardhat outside of a Hardhat project.

You can learn how to use Hardhat by reading the [Getting Started guide](/hardhat-runner/docs/getting-started).`,
    },
    DUPLICATED_PLUGIN_ID: {
      number: 2,
      messageTemplate:
        'Duplicated plugin id "{id}" found. Did you install multiple versions of the same plugin?',
      websiteTitle: "Duplicated plugin id",
      websiteDescription: `While loading the plugins, two different plugins where found with the same id.

Please double check whether you have multiple versions of the same plugin installed.`,
    },
    NO_CONFIG_FILE_FOUND: {
      number: 3,
      messageTemplate: "No Hardhat config file found",
      websiteTitle: "No Hardhat config file found",
      websiteDescription:
        "Hardhat couldn't find a config file in the current directory or any of its parents.",
    },
    INVALID_CONFIG_PATH: {
      number: 4,
      messageTemplate: "Config file {configPath} not found",
      websiteTitle: "Invalid config path",
      websiteDescription: "The config file doesn't exist at the provided path.",
    },
    NO_CONFIG_EXPORTED: {
      number: 5,
      messageTemplate: "No config exported in {configPath}",
      websiteTitle: "No config exported",
      websiteDescription: "There is nothing exported from the config file.",
    },
    INVALID_CONFIG_OBJECT: {
      number: 6,
      messageTemplate: "Invalid config exported in {configPath}",
      websiteTitle: "Invalid config object",
      websiteDescription:
        "The config file doesn't export a valid configuration object.",
    },
    ENV_VAR_NOT_FOUND: {
      number: 7,
      messageTemplate: "Configuration variable not found as an env variable",
      websiteTitle: "Configuration variable not found",
      websiteDescription: `A configuration variable was expected to be set as an environment variable, but it wasn't.`,
    },
    INVALID_URL: {
      number: 8,
      messageTemplate: "Invalid URL: {url}",
      websiteTitle: "Invalid URL",
      websiteDescription: `Given value was not a valid URL.`,
    },
    INVALID_BIGINT: {
      number: 9,
      messageTemplate: "Invalid BigInt: {value}",
      websiteTitle: "Invalid BigInt",
      websiteDescription: `Given value was not a valid BigInt.`,
    },
    HARDHAT_PROJECT_ALREADY_CREATED: {
      number: 10,
      messageTemplate:
        "You are trying to initialize a project inside an existing Hardhat project. The path to the project's configuration file is: {hardhatProjectRootPath}.",
      websiteTitle: "Hardhat project already created",
      websiteDescription: `Cannot create a new Hardhat project, the current folder is already associated with a project.`,
    },
    NOT_INSIDE_PROJECT_ON_WINDOWS: {
      number: 11,
      messageTemplate: `You are not inside a project and Hardhat failed to initialize a new one.

If you were trying to create a new project, please try again using Windows Subsystem for Linux (WSL) or PowerShell.
`,
      websiteTitle:
        "You are not inside a Hardhat project and Hardhat failed to initialize a new one",
      websiteDescription: `You are trying to run Hardhat outside of a Hardhat project, and we couldn't initialize one.

If you were trying to create a new project, please try again using Windows Subsystem for Linux (WSL) or PowerShell.

You can learn how to use Hardhat by reading the [Getting Started guide](/hardhat-runner/docs/getting-started).`,
    },
    NOT_IN_INTERACTIVE_SHELL: {
      number: 12,
      messageTemplate:
        "You are trying to initialize a project but you are not in an interactive shell.",
      websiteTitle: "Not inside an interactive shell",
      websiteDescription: `You are trying to initialize a project but you are not in an interactive shell.

Please re-run the command inside an interactive shell.`,
    },
    UNSUPPORTED_OPERATION: {
      number: 13,
      messageTemplate: "{operation} is not supported in Hardhat.",
      websiteTitle: "Unsupported operation",
      websiteDescription: `You are trying to perform an unsupported operation.

Unless you are creating a task or plugin, this is probably a bug.

Please [report it](https://github.com/nomiclabs/hardhat/issues/new) to help us improve Hardhat.`,
    },
    ONLY_ESM_SUPPORTED: {
      number: 14,
      messageTemplate: `Hardhat only supports ESM projects. Please be sure to specify "'type': 'module'" in your package.json`,
      websiteTitle: "Only ESM projects are supported",
      websiteDescription: `You are trying to initialize a new Hardhat project, but your package.json does not have the property "type" set to "module".

Currently, Hardhat only supports ESM projects.

Please add the property "type" with the value "module" in your package.json to ensure that your project is recognized as an ESM project.`,
    },
    GLOBAL_OPTION_ALREADY_DEFINED: {
      number: 15,
      messageTemplate:
        "Plugin {plugin} is trying to define the global option {globalOption} but it is already defined by plugin {definedByPlugin}",
      websiteTitle: "Global option already defined",
      websiteDescription:
        "The global option is already defined by another plugin. Please ensure that global options are uniquely named to avoid conflicts.",
    },
    INVALID_CONFIG: {
      number: 16,
      messageTemplate: `Invalid config:
{errors}`,
      websiteTitle: "Invalid config",
      websiteDescription: `The configuration you provided is invalid. Please check the documentation to learn how to configure Hardhat correctly.`,
    },
  },
  INTERNAL: {
    ASSERTION_ERROR: {
      number: 100,
      messageTemplate: "An internal invariant was violated: {message}",
      websiteTitle: "Invariant violation",
      websiteDescription: `An internal invariant was violated. This is probably caused by a programming error in Hardhat or in one of the used plugins.

Please [report it](https://github.com/nomiclabs/hardhat/issues/new) to help us improve Hardhat.`,
      shouldBeReported: true,
    },
    NOT_IMPLEMENTED_ERROR: {
      number: 101,
      messageTemplate: "Not implemented: {message}",
      websiteTitle: "Not implemented",
      websiteDescription: `A code path that has not been implemented was unexpectedly triggered.

Please [report it](https://github.com/nomiclabs/hardhat/issues/new) to help us improve Hardhat.`,
      shouldBeReported: true,
    },
  },
  PLUGINS: {
    PLUGIN_NOT_INSTALLED: {
      number: 200,
      messageTemplate: 'Plugin "{pluginId}" is not installed.',
      websiteTitle: "Plugin not installed",
      websiteDescription: `A plugin was included in the Hardhat config but has not been installed into "node_modules".`,
    },
    PLUGIN_MISSING_DEPENDENCY: {
      number: 201,
      messageTemplate:
        'Plugin "{pluginId}" is missing a peer dependency "{peerDependencyName}".',
      websiteTitle: "Plugin missing peer dependency",
      websiteDescription: `A plugin's peer dependency has not been installed.`,
    },
    DEPENDENCY_VERSION_MISMATCH: {
      number: 202,
      messageTemplate:
        'Plugin "{pluginId}" has a peer dependency "{peerDependencyName}" with expected version "{expectedVersion}" but the installed version is "{installedVersion}".',
      websiteTitle: "Dependency version mismatch",
      websiteDescription: `A plugin's peer dependency expected version does not match the version of the installed package.

Please install a version of the peer dependency that meets the plugin's requirements.`,
    },
    PLUGIN_DEPENDENCY_FAILED_LOAD: {
      number: 203,
      messageTemplate: 'Plugin "{pluginId}" dependency could not be loaded.',
      websiteTitle: "Plugin dependency could not be loaded",
      websiteDescription: `The loading of a plugin's dependent plugin failed.`,
    },
  },
  HOOKS: {
    INVALID_HOOK_FACTORY_PATH: {
      number: 300,
      messageTemplate:
        'Plugin "{pluginId}" hook factory for "{hookCategoryName}" is not a valid file:// URL: {path}.',
      websiteTitle: "Plugin hook factory is not a valid file URL",
      websiteDescription: `The loading of a plugin's hook factory failed as the import path is not a valid file:// URL.`,
    },
  },
  TASK_DEFINITIONS: {
    INVALID_FILE_ACTION: {
      number: 400,
      messageTemplate: "Invalid file action: {action} is not a valid file URL",
      websiteTitle: "Invalid file action",
      websiteDescription: `The setAction function was called with a string parameter that is not a valid file URL. A valid file URL must start with 'file://'.

Please ensure that you are providing a correct file URL.`,
    },
    NO_ACTION: {
      number: 401,
      messageTemplate: "The task {task} doesn't have an action",
      websiteTitle: "Task missing action",
      websiteDescription: `A task was defined without an action.

Please ensure that an action is defined for each task.`,
    },
    POSITIONAL_ARG_AFTER_VARIADIC: {
      number: 402,
      messageTemplate:
        "Cannot add the positional argument {name} after a variadic one",
      websiteTitle: "Invalid task definition",
      websiteDescription:
        "A variadic argument must always be the last positional argument in a task definition.",
    },
    REQUIRED_ARG_AFTER_OPTIONAL: {
      number: 403,
      messageTemplate:
        "Cannot add required positional argument {name} after an optional one",
      websiteTitle: "Invalid task definition",
      websiteDescription:
        "Required positional arguments must be defined before optional ones in a task definition.",
    },
    TASK_NOT_FOUND: {
      number: 404,
      messageTemplate: "Task {task} not found",
      websiteTitle: "Task not found",
      websiteDescription: "The provided task name does not match any task.",
    },
    SUBTASK_WITHOUT_PARENT: {
      number: 405,
      messageTemplate:
        "Task {task} not found when attempting to define subtask {subtask}. If you intend to only define subtasks, please first define {task} as an empty task",
      websiteTitle: "Subtask without parent",
      websiteDescription:
        "The parent task of the subtask being defined was not found. If you intend to only define subtasks, please first define the parent task as an empty task.",
    },
    TASK_ALREADY_DEFINED: {
      number: 406,
      messageTemplate:
        "{actorFragment} trying to define the task {task} but it is already defined{definedByFragment}",
      websiteTitle: "Task already defined",
      websiteDescription:
        "The task is already defined. Please ensure that tasks are uniquely named to avoid conflicts.",
    },
    EMPTY_TASK_ID: {
      number: 407,
      messageTemplate: "Task id cannot be an empty string or an empty array",
      websiteTitle: "Empty task id",
      websiteDescription:
        "The task id cannot be an empty string or an empty array. Please ensure that the array of task names is not empty.",
    },
    TASK_OPTION_ALREADY_DEFINED: {
      number: 408,
      messageTemplate:
        "{actorFragment} trying to define task {task} with the option {option} but it is already defined as a global option by plugin {globalOptionPluginId}",
      websiteTitle: "Task option already defined",
      websiteDescription:
        "The task option is already defined as a global option by another plugin. Please ensure that task options are uniquely named to avoid conflicts.",
    },
    TASK_OVERRIDE_OPTION_ALREADY_DEFINED: {
      number: 409,
      messageTemplate:
        "{actorFragment} trying to override the option {option} of the task {task} but it is already defined",
      websiteTitle: "Task override option already defined",
      websiteDescription:
        "An attempt is being made to override an option that has already been defined. Please ensure that the option is not defined before trying to override it.",
    },
    EMPTY_TASK: {
      number: 410,
      messageTemplate: "Can't run the empty task {task}",
      websiteTitle: "Empty task",
      websiteDescription:
        "The task is empty. Please ensure that tasks have at least one action.",
    },
    INVALID_ACTION_URL: {
      number: 411,
      messageTemplate:
        "Unable to import the module specified by the action {action} of task {task}",
      websiteTitle: "Invalid action URL",
      websiteDescription:
        "The action URL is invalid. Please ensure that the URL is correct.",
    },
    INVALID_ACTION: {
      number: 412,
      messageTemplate:
        "The action resolved from {action} in task {task} is not a function",
      websiteTitle: "Invalid action",
      websiteDescription:
        "The action of the task is not a function. Make sure that the file pointed to by the action URL exports a function as the default export.",
    },
    MISSING_VALUE_FOR_TASK_ARGUMENT: {
      number: 413,
      messageTemplate:
        'Missing value for the argument named "{argument}" in the task "{task}"',
      websiteTitle: "Missing value for the task argument",
      websiteDescription: `You tried to run a task, but one of the values of its arguments was missing.

Please double check how you invoked Hardhat or ran your task.`,
    },
    INVALID_VALUE_FOR_TYPE: {
      number: 414,
      messageTemplate:
        "Invalid value {value} for argument {name} of type {type} in the task {task}",
      websiteTitle: "Invalid argument type",
      websiteDescription: `One of your task arguments has an invalid type.

Please double check your task arguments.`,
    },
    UNRECOGNIZED_TASK_OPTION: {
      number: 415,
      messageTemplate: "Invalid option {option} for the task {task}",
      websiteTitle: "Invalid option value",
      websiteDescription: `One of the options for your task is invalid.

Please double check your arguments.`,
    },
  },
  ARGUMENTS: {
    INVALID_VALUE_FOR_TYPE: {
      number: 500,
      messageTemplate:
        "Invalid value {value} for argument {name} of type {type}",
      websiteTitle: "Invalid argument type",
      websiteDescription: `One of your Hardhat or task arguments has an invalid type.

Please double check your arguments.`,
    },
    RESERVED_NAME: {
      number: 501,
      messageTemplate: "Argument name {name} is reserved",
      websiteTitle: "Reserved argument name",
      websiteDescription: `One of your Hardhat or task arguments has a reserved name.

Please double check your arguments.`,
    },
    DUPLICATED_NAME: {
      number: 502,
      messageTemplate: "Argument name {name} is already in use",
      websiteTitle: "Argument name already in use",
      websiteDescription: `One of your Hardhat or task argument names is already in use.

Please double check your arguments.`,
    },
    INVALID_NAME: {
      number: 503,
      messageTemplate: `Argument name "{name}" is invalid. It must consist only of alphanumeric characters and cannot start with a number.`,
      websiteTitle: "Invalid argument name",
      websiteDescription: `One of your Hardhat or task argument names is invalid.

Please double check your arguments.`,
    },
    UNRECOGNIZED_OPTION: {
      number: 504,
      messageTemplate:
        "Invalid option {option}. It is neither a valid global option nor associated with any task. Did you forget to add the task first, or did you misspell it?",
      websiteTitle: "Invalid option value",
      websiteDescription: `One of your Hardhat options is invalid.

Please double check your arguments.`,
    },
    MISSING_VALUE_FOR_ARGUMENT: {
      number: 505,
      messageTemplate: 'Missing value for the task argument named "{argument}"',
      websiteTitle: "Missing value for the task argument",
      websiteDescription: `You tried to run a task, but one of the values of its arguments was missing.

Please double check how you invoked Hardhat or ran your task.`,
    },
    UNUSED_ARGUMENT: {
      number: 506,
      messageTemplate:
        "The argument with value {value} was not consumed because it is not associated with any task.",
      websiteTitle: "Argument was not consumed",
      websiteDescription: `You tried to run a task, but one of your arguments was not consumed.

Please double check how you invoked Hardhat or ran your task.`,
    },
    MISSING_CONFIG_FILE: {
      number: 507,
      messageTemplate:
        'The global option "--config" was passed, but no file path was provided.',
      websiteTitle: "Missing configuration file path",
      websiteDescription: `A path to the configuration file is expected after the global option "--config", but none was provided.

Please double check your arguments.`,
    },
    CANNOT_COMBINE_INIT_AND_CONFIG_PATH: {
      number: 508,
      messageTemplate:
        'The global option "--config" cannot be used with the "init" command',
      websiteTitle:
        'The global option "--config" cannot be used with the "init" command',
      websiteDescription: `The global option "--config" cannot be used with the "init" command.

Please double check your arguments.`,
    },
  },
  BUILTIN_TASKS: {
    RUN_FILE_NOT_FOUND: {
      number: 600,
      messageTemplate: `Script {script} doesn't exist`,
      websiteTitle: "Script doesn't exist",
      websiteDescription: `Tried to use \`hardhat run\` to execute a nonexistent script.

Please double check your script's path.`,
    },
    RUN_SCRIPT_ERROR: {
      number: 601,
      messageTemplate: `Error running script {script}: {error}`,
      websiteTitle: "Error running script",
      websiteDescription: `Running a script resulted in an error.

Please check Hardhat's output for more details.`,
    },
    TEST_TASK_ESM_TESTS_RUN_TWICE: {
      number: 602,
      messageTemplate: `Your project uses ESM and you've programmatically run your tests twice. This is not supported yet.`,
      websiteTitle: "Running tests twice in an ESM project",
      websiteDescription:
        'You have run your tests twice programmatically and your project is an ESM project (you have `"type": "module"` in your `package.json`, or some of your files have the `.mjs` extension). This is not supported by Mocha yet (https://github.com/mochajs/mocha/issues/2706).',
    },
  },
  NETWORK: {
    INVALID_URL: {
      number: 700,
      messageTemplate: "Invalid URL {value} for network or forking.",
      websiteTitle: "Invalid URL for network or forking",
      websiteDescription: `You are trying to connect to a network with an invalid network or forking URL.

Please check that you are sending a valid URL string for the network or forking \`URL\` parameter.`,
    },
    INVALID_REQUEST_PARAMS: {
      number: 701,
      messageTemplate:
        "Invalid request arguments: only array parameters are supported.",
      websiteTitle: "Invalid method parameters",
      websiteDescription:
        "The JSON-RPC request parameters are invalid. You are trying to make an EIP-1193 request with object parameters, but only array parameters are supported. Ensure that the 'params' parameter is correctly specified as an array in your JSON-RPC request.",
    },
    INVALID_JSON_RESPONSE: {
      number: 702,
      messageTemplate: "Invalid JSON-RPC response received: {response}",
      websiteTitle: "Invalid JSON-RPC response",
      websiteDescription: `One of your JSON-RPC requests received an invalid response.

Please make sure your node is running, and check your internet connection and networks config.`,
    },
    CONNECTION_REFUSED: {
      number: 703,
      messageTemplate: `Cannot connect to the network {network}.
Please make sure your node is running, and check your internet connection and networks config`,
      websiteTitle: "Cannot connect to the network",
      websiteDescription: `Cannot connect to the network.

Please make sure your node is running, and check your internet connection and networks config.`,
    },
    NETWORK_TIMEOUT: {
      number: 704,
      messageTemplate: `Network connection timed out.
Please check your internet connection and networks config`,
      websiteTitle: "Network timeout",
      websiteDescription: `One of your JSON-RPC requests timed out.

Please make sure your node is running, and check your internet connection and networks config.`,
    },
    NETWORK_NOT_FOUND: {
      number: 705,
      messageTemplate: `The network {networkName} is not defined in your networks config.`,
      websiteTitle: "Network not found",
      websiteDescription: `The network you are trying to connect to is not found.

Please double check that the network is correctly defined in your networks config.`,
    },
    INVALID_CHAIN_TYPE: {
      number: 706,
      messageTemplate:
        "The provided chain type {chainType} does not match the network's chain type {networkChainType} for network {networkName}.",
      websiteTitle: "Invalid chain type",
      websiteDescription: `The chain type does not match the network's chain type.

If you want to use a different chain type, please update your networks config.`,
    },

    INVALID_CONFIG_OVERRIDE: {
      number: 707,
      messageTemplate: `Invalid config override:
{errors}`,
      websiteTitle: "Invalid config override",
      websiteDescription: `The configuration override you provided is invalid.`,
    },
  },
  KEYSTORE: {
    INVALID_KEYSTORE_FILE_FORMAT: {
      number: 800,
      messageTemplate: "Invalid keystore format",
      websiteTitle: "Invalid keystore format",
      websiteDescription: "The provided JSON is not a valid keystore file",
    },
    INVALID_READLINE_OUTPUT: {
      number: 801,
      messageTemplate: "Expected readline output to be defined",
      websiteTitle: "Expected readline output to be defined",
      websiteDescription: "Expected readline output to be defined",
    },
    USERINTERRUPTION_NOT_IMPLEMENTED: {
      number: 802,
      messageTemplate: "User interruption method not implemented",
      websiteTitle: "User interruption method not implemented",
      websiteDescription:
        "Within the Keystore plugin, some direct user interruptions are not implemented. They are not expected to be invoked.",
    },
  },
  NETWORK_HELPERS: {
    ONLY_ALLOW_0X_PREFIXED_STRINGS: {
      number: 900,
      messageTemplate: `Only hex-encoded strings prefixed with "0x" are accepted`,
      websiteTitle: `Only hex-encoded strings prefixed with "0x" are accepted`,
      websiteDescription: `Only hex-encoded strings prefixed with "0x" are accepted`,
    },
    CANNOT_CONVERT_TO_RPC_QUANTITY: {
      number: 901,
      messageTemplate: `The value "{value}" cannot be converted into an RPC quantity`,
      websiteTitle: "Cannot converted into an RPC quantity",
      websiteDescription: "The value cannot be converted into an RPC quantity",
    },
    INVALID_HEX_STRING: {
      number: 902,
      messageTemplate: `"{value}" is not a valid hex string`,
      websiteTitle: "Invalid hex string",
      websiteDescription: "The value is not a valid hex string",
    },
    INVALID_TX_HASH: {
      number: 903,
      messageTemplate: `"{value}" is not a valid transaction hash`,
      websiteTitle: "Invalid transaction hash",
      websiteDescription: "The value is not a valid transaction hash",
    },
    INVALID_ADDRESS: {
      number: 904,
      messageTemplate: `"{value}" is not a valid address`,
      websiteTitle: "Invalid address",
      websiteDescription: "The value is not a valid address",
    },
    INVALID_CHECKSUM_ADDRESS: {
      number: 905,
      messageTemplate: `Address "{value}" has an invalid checksum`,
      websiteTitle: "Invalid checksum address",
      websiteDescription: "The address has an invalid checksum",
    },
    BLOCK_NUMBER_SMALLER_THAN_CURRENT: {
      number: 906,
      messageTemplate: `The block number "{newValue}" is smaller than the current block number "{currentValue}"`,
      websiteTitle: "Block number smaller than the current block number",
      websiteDescription:
        "The block number is smaller than the current block number",
    },
    EVM_SNAPSHOT_VALUE_NOT_A_STRING: {
      number: 907,
      messageTemplate: `The value returned by evm_snapshot should be a string`,
      websiteTitle: "The evm_snapshot value should be a string",
      websiteDescription:
        "The value returned by evm_snapshot should be a string",
    },
    EVM_REVERT_VALUE_NOT_A_BOOLEAN: {
      number: 908,
      messageTemplate: `The value returned by evm_revert should be a boolean`,
      websiteTitle: "The evm_revert value should be a boolean",
      websiteDescription:
        "The value returned by evm_revert should be a boolean",
    },
    INVALID_SNAPSHOT: {
      number: 909,
      messageTemplate: `Trying to restore an invalid snapshot.`,
      websiteTitle: "Trying to restore an invalid snapshot.",
      websiteDescription: "Trying to restore an invalid snapshot.",
    },
    EXPECTED_NON_NEGATIVE_NUMBER: {
      number: 910,
      messageTemplate: `Invalid input: expected a non-negative number but "{value}" was given.`,
      websiteTitle: "Invalid input, expected a non-negative number",
      websiteDescription: "Invalid input, expected a non-negative number",
    },
    CANNOT_CONVERT_NEGATIVE_NUMBER_TO_RPC_QUANTITY: {
      number: 911,
      messageTemplate: `Cannot convert negative number "{value}" to RPC quantity`,
      websiteTitle: "Cannot convert negative number to RPC quantity",
      websiteDescription: "Cannot convert negative number to RPC quantity",
    },
    FIXTURE_ANONYMOUS_FUNCTION_ERROR: {
      number: 912,
      messageTemplate: `Anonymous functions cannot be used as fixtures.

You probably did something like this:

    loadFixture(async () => ... );

Instead, define a fixture function and refer to that same function in each call to loadFixture.

Learn more at (https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures)`,
      websiteTitle: "Anonymous functions cannot be used as fixtures",
      websiteDescription: "Anonymous functions cannot be used as fixtures",
    },
    FIXTURE_SNAPSHOT_ERROR: {
      number: 913,
      messageTemplate: `There was an error reverting the snapshot of the fixture.

This might be caused by using hardhat_reset and loadFixture calls in a testcase.`,
      websiteTitle: "Error while reverting snapshot",
      websiteDescription: "Error while reverting snapshot",
    },
  },
  SOLIDITY: {
    RESOLVING_INCORRECT_FILE_AS_PROJECT_FILE: {
      number: 1000,
      messageTemplate:
        "File {file} is being resolved as a project file, but it's not part of the project.",
      websiteTitle: "Solidity project file is outside the project",
      websiteDescription: `Tried to resolve a file as a project file, but it's not part of the project.`,
    },
    RESOLVING_NONEXISTENT_PROJECT_FILE: {
      number: 1001,
      messageTemplate:
        "File {file} is being resolved as a project file, but it doesn't exist.",
      websiteTitle: "Solidity project file doesn't exist",
      websiteDescription: `Tried to resolve a file as a project file, but it doesn't exist.`,
    },
    IMPORTED_FILE_DOESNT_EXIST: {
      number: 1002,
      messageTemplate: 'The import "{importPath} from "{from}" doesn\'t exist.',
      websiteTitle: "Imported file doesn't exist",
      websiteDescription: `An imported file doesn't exist.`,
    },
    IMPORTED_FILE_WITH_ICORRECT_CASING: {
      number: 1003,
      messageTemplate:
        'The import "{importPath} from "{from}" exists, but its casing is incorrect. The correct casing is "{correctCasing}".',
      websiteTitle: "Imported file with incorrect casing",
      websiteDescription: `Hardhat enforces that you import your files with the correct casing (as stored in the filesystem).

This error is thrown when you import a file with the wrong casing under a case insensitve filesystem.`,
    },
    IMPORTED_NPM_DEPENDENCY_NOT_INSTALLED: {
      number: 1004,
      messageTemplate:
        'The import "{importPath}" from "{from}" is trying to use an uinstalled npm dependency.',
      websiteTitle: "Uninstaleld npm solidity dependency",
      websiteDescription: `One of your files is traying to import a dependency using npm, but it hasn't been installed`,
    },
    IMPORTED_NPM_DEPENDENCY_THAT_USES_EXPORTS: {
      number: 1005,
      messageTemplate:
        'The import "{importPath}" from "{from}" is trying to use an npm dependency that uses pacakge#exports, which is not supported by Hardhat.',
      websiteTitle:
        "Using a npm solidity dependency with pacakge.json#exports is not supported",
      websiteDescription: `One of your files is traying to import a dependency using npm, but it uses pacakge.json#exports, which Hardhat doesn't support`,
    },
    USER_REMAPPING_WITH_NPM_CONTEXT: {
      number: 1006,
      messageTemplate:
        'The remapping "{remapping}" has a context starting with "npm/", which is forbidden. Hardhat doesn\'t allow changing the behaviour of npm package\'s imports.',
      websiteTitle: "Remapping imports in npm packages is not allowed",
      websiteDescription: `This error happened because you are trying to change how the imports within an npm package, which is not allowed.
      
While Hardhat supports user-defined remappings, it doesn't support remapping the behavior of npm packages to ensure that everything what's imported via npm uses the same npm resolution logic.`,
    },
    REMAPPING_WITH_INVALID_SYNTAX: {
      number: 1007,
      messageTemplate: `The remapping "{remapping}" is invalid.`,
      websiteTitle: "Invalid remapping",
      websiteDescription: `You are trying to set a user remapping, but it's syntax is invalid.
      
Please double check your remmpaings' syntax.`,
    },
    REMAPPING_TO_UNINSTALLED_PACKAGE: {
      number: 1008,
      messageTemplate: `The remapping "{remapping}" is trying to use the npm package "{package}", which is not installed`,
      websiteTitle: "Remapping into an uninstaleld npm package",
      websiteDescription: `You are trying to set a user remapping that uses an npm pacakge as target, but it's not installed.
      
Please make sure to install the package or fix the remapping.`,
    },
    REMAPPING_TO_PACKAGE_USING_EXPORTS: {
      number: 1009,
      messageTemplate: `The remapping "{remapping}" is using the npm package "{package}", which uses pacakge.json#exports, which is not supported by Hardhat`,
      websiteTitle:
        "Remapping into an npm package that uses pacakge.json#exports",
      websiteDescription: `You are trying to set a user remapping that uses an npm pacakge as target, but it uses pacakge.json#exports, which Hardhat doesn't support.`,
    },
    REMAPPING_NPM_PACKAGE_AS_MONOREPO: {
      number: 1010,
      messageTemplate: `The remapping "{remapping}" targets the npm pacakge "{pacakge}" as if it were part of this repository, but version "{version}" is installed instead`,
      websiteTitle:
        "Remapping into a monorepo package but found an npm package instead",
      websiteDescription: `You are trying to set a remapping setting a monorepo package as target, but Hardhat found the pacakge to be installed from the npm regristry instead.`,
    },
    REMAPPING_HARDHAT_PROJECT_AS_MONOREPO_PACKAGE: {
      number: 1011,
      messageTemplate: `The remapping "{remapping}" is trying to set the npm package "{package}" as target, but that's the project is the Hardhat project, so it shouldn't be remapped through npm/, but as internal project remappings.`,
      websiteTitle: `Remapping into the project using npm`,
      websiteDescription: `You are trying to set a remapping whose target uses the npm/ syntax, but is within your Hardhat project.
      
Please don't use npm/... as target, but use normal internal project remapping istead.`,
    },
    REMAPPING_INCORRECT_VERSION: {
      number: 1012,
      messageTemplate: `The remapping "{remapping}" is trying to set the npm package "{package}" version "{expectedVersion}" as target, but found version "{actualVersion}" instead.`,
      websiteTitle: `Remapping into incorrect npm package version`,
      websiteDescription: `You are trying to set a remapping into an npm package, but the version that you are using is not the currently installed one.
      
Please change your remapping to match the installed version, or installed the correct one.`,
    },
    INVALID_NPM_IMPORT: {
      number: 1013,
      messageTemplate: `The import "{imporPath}" in "{from}" is treated as an npm import as it's first directory doesn't exist in your project, but it's syntax is not that of a valid npm import either.`,
      websiteTitle: `Invalid npm import`,
      websiteDescription: `You are trying to import a file that is not a valid npm import. Please double check that you are using the correct syntax.`,
    },
    INVALID_VERSION: {
      number: 1014,
      messageTemplate: `Solidity version {version} is invalid or hasn't been released yet.

If you are certain it has been released, run "npx hardhat clean --global" and try again`,
      websiteTitle: "Invalid or unreleased `solc` version",
      websiteDescription: `The Solidity version in your config is invalid or hasn't been released yet.

If you are certain it has been released, run \`npx hardhat clean --global\` and try again.`,
    },
    DOWNLOAD_FAILED: {
      number: 1015,
      messageTemplate:
        "Couldn't download compiler version {remoteVersion}. Please check your internet connection and try again.",
      websiteTitle: "`solc` download failed",
      websiteDescription: `Couldn't download \`solc\`.

Please check your internet connection and try again.`,
    },
    VERSION_LIST_DOWNLOAD_FAILED: {
      number: 1016,
      messageTemplate:
        "Couldn't download compiler version list. Please check your internet connection and try again.",
      websiteTitle: "Couldn't obtain `solc` version list",
      websiteDescription: `Couldn't download \`solc\`'s version list.

Please check your internet connection and try again.`,
    },
    INVALID_DOWNLOAD: {
      number: 1017,
      messageTemplate: `Couldn't download compiler version {remoteVersion}: Checksum verification failed.

Please check your internet connection and try again.

If this error persists, run "npx hardhat clean --global".`,
      websiteTitle: "Downloaded `solc` checksum verification failed",
      websiteDescription: `Hardhat downloaded a version of the Solidity compiler, and its checksum verification failed.

Please check your internet connection and try again.

If this error persists, run \`npx hardhat clean --global\`.`,
    },
    CANT_RUN_NATIVE_COMPILER: {
      number: 1018,
      messageTemplate: `A native version of solc failed to run.

If you are running MacOS, try installing Apple Rosetta.

If this error persists, run "npx hardhat clean --global".`,
      websiteTitle: "Failed to run native solc",
      websiteDescription: `Hardhat successfully downloaded a native version of solc but it doesn't run.

If you are running MacOS, try installing Apple Rosetta.

If this error persists, run "npx hardhat clean --global".`,
    },
    CANT_RUN_SOLCJS_COMPILER: {
      number: 1019,
      messageTemplate: `A wasm version of solc failed to run.

If this error persists, run "npx hardhat clean --global".`,
      websiteTitle: "Failed to run solcjs",
      websiteDescription: `Hardhat successfully downloaded a WASM version of solc but it doesn't run.

If you are running MacOS, try installing Apple Rosetta.

If this error persists, run "npx hardhat clean --global".`,
    },
  },
} as const;
