#!/usr/bin/env node
import * as __rspack_external_node_child_process_27f17141 from "node:child_process";
import * as __rspack_external_node_events_0a6aefe7 from "node:events";
import * as __rspack_external_node_fs_5ea92f0c from "node:fs";
import * as __rspack_external_node_path_c5b9b54f from "node:path";
import * as __rspack_external_node_process_786449bf from "node:process";
var __webpack_modules__ = {};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
}
__webpack_require__.m = __webpack_modules__;
(()=>{
    __webpack_require__.add = function(modules) {
        Object.assign(__webpack_require__.m, modules);
    };
})();
__webpack_require__.add({
    "node:child_process" (module) {
        module.exports = __rspack_external_node_child_process_27f17141;
    },
    "node:events" (module) {
        module.exports = __rspack_external_node_events_0a6aefe7;
    },
    "node:fs" (module) {
        module.exports = __rspack_external_node_fs_5ea92f0c;
    },
    "node:path" (module) {
        module.exports = __rspack_external_node_path_c5b9b54f;
    },
    "node:process" (module) {
        module.exports = __rspack_external_node_process_786449bf;
    },
    "../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/index.js" (__unused_rspack_module, exports, __webpack_require__) {
        const { Argument } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/argument.js");
        const { Command } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/command.js");
        const { CommanderError, InvalidArgumentError } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/error.js");
        const { Help } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/help.js");
        const { Option } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/option.js");
        exports.program = new Command();
        exports.createCommand = (name)=>new Command(name);
        exports.createOption = (flags, description)=>new Option(flags, description);
        exports.createArgument = (name, description)=>new Argument(name, description);
        exports.Command = Command;
        exports.Option = Option;
        exports.Argument = Argument;
        exports.Help = Help;
        exports.CommanderError = CommanderError;
        exports.InvalidArgumentError = InvalidArgumentError;
        exports.InvalidOptionArgumentError = InvalidArgumentError;
    },
    "../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/argument.js" (__unused_rspack_module, exports, __webpack_require__) {
        const { InvalidArgumentError } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/error.js");
        class Argument {
            constructor(name, description){
                this.description = description || '';
                this.variadic = false;
                this.parseArg = void 0;
                this.defaultValue = void 0;
                this.defaultValueDescription = void 0;
                this.argChoices = void 0;
                switch(name[0]){
                    case '<':
                        this.required = true;
                        this._name = name.slice(1, -1);
                        break;
                    case '[':
                        this.required = false;
                        this._name = name.slice(1, -1);
                        break;
                    default:
                        this.required = true;
                        this._name = name;
                        break;
                }
                if (this._name.length > 3 && '...' === this._name.slice(-3)) {
                    this.variadic = true;
                    this._name = this._name.slice(0, -3);
                }
            }
            name() {
                return this._name;
            }
            _concatValue(value, previous) {
                if (previous === this.defaultValue || !Array.isArray(previous)) return [
                    value
                ];
                return previous.concat(value);
            }
            default(value, description) {
                this.defaultValue = value;
                this.defaultValueDescription = description;
                return this;
            }
            argParser(fn) {
                this.parseArg = fn;
                return this;
            }
            choices(values) {
                this.argChoices = values.slice();
                this.parseArg = (arg, previous)=>{
                    if (!this.argChoices.includes(arg)) throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(', ')}.`);
                    if (this.variadic) return this._concatValue(arg, previous);
                    return arg;
                };
                return this;
            }
            argRequired() {
                this.required = true;
                return this;
            }
            argOptional() {
                this.required = false;
                return this;
            }
        }
        function humanReadableArgName(arg) {
            const nameOutput = arg.name() + (true === arg.variadic ? '...' : '');
            return arg.required ? '<' + nameOutput + '>' : '[' + nameOutput + ']';
        }
        exports.Argument = Argument;
        exports.humanReadableArgName = humanReadableArgName;
    },
    "../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/command.js" (__unused_rspack_module, exports, __webpack_require__) {
        const EventEmitter = __webpack_require__("node:events").EventEmitter;
        const childProcess = __webpack_require__("node:child_process");
        const path = __webpack_require__("node:path");
        const fs = __webpack_require__("node:fs");
        const process1 = __webpack_require__("node:process");
        const { Argument, humanReadableArgName } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/argument.js");
        const { CommanderError } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/error.js");
        const { Help } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/help.js");
        const { Option, DualOptions } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/option.js");
        const { suggestSimilar } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/suggestSimilar.js");
        class Command extends EventEmitter {
            constructor(name){
                super();
                this.commands = [];
                this.options = [];
                this.parent = null;
                this._allowUnknownOption = false;
                this._allowExcessArguments = true;
                this.registeredArguments = [];
                this._args = this.registeredArguments;
                this.args = [];
                this.rawArgs = [];
                this.processedArgs = [];
                this._scriptPath = null;
                this._name = name || '';
                this._optionValues = {};
                this._optionValueSources = {};
                this._storeOptionsAsProperties = false;
                this._actionHandler = null;
                this._executableHandler = false;
                this._executableFile = null;
                this._executableDir = null;
                this._defaultCommandName = null;
                this._exitCallback = null;
                this._aliases = [];
                this._combineFlagAndOptionalValue = true;
                this._description = '';
                this._summary = '';
                this._argsDescription = void 0;
                this._enablePositionalOptions = false;
                this._passThroughOptions = false;
                this._lifeCycleHooks = {};
                this._showHelpAfterError = false;
                this._showSuggestionAfterError = true;
                this._outputConfiguration = {
                    writeOut: (str)=>process1.stdout.write(str),
                    writeErr: (str)=>process1.stderr.write(str),
                    getOutHelpWidth: ()=>process1.stdout.isTTY ? process1.stdout.columns : void 0,
                    getErrHelpWidth: ()=>process1.stderr.isTTY ? process1.stderr.columns : void 0,
                    outputError: (str, write)=>write(str)
                };
                this._hidden = false;
                this._helpOption = void 0;
                this._addImplicitHelpCommand = void 0;
                this._helpCommand = void 0;
                this._helpConfiguration = {};
            }
            copyInheritedSettings(sourceCommand) {
                this._outputConfiguration = sourceCommand._outputConfiguration;
                this._helpOption = sourceCommand._helpOption;
                this._helpCommand = sourceCommand._helpCommand;
                this._helpConfiguration = sourceCommand._helpConfiguration;
                this._exitCallback = sourceCommand._exitCallback;
                this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
                this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
                this._allowExcessArguments = sourceCommand._allowExcessArguments;
                this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
                this._showHelpAfterError = sourceCommand._showHelpAfterError;
                this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
                return this;
            }
            _getCommandAndAncestors() {
                const result = [];
                for(let command = this; command; command = command.parent)result.push(command);
                return result;
            }
            command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
                let desc = actionOptsOrExecDesc;
                let opts = execOpts;
                if ('object' == typeof desc && null !== desc) {
                    opts = desc;
                    desc = null;
                }
                opts = opts || {};
                const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
                const cmd = this.createCommand(name);
                if (desc) {
                    cmd.description(desc);
                    cmd._executableHandler = true;
                }
                if (opts.isDefault) this._defaultCommandName = cmd._name;
                cmd._hidden = !!(opts.noHelp || opts.hidden);
                cmd._executableFile = opts.executableFile || null;
                if (args) cmd.arguments(args);
                this._registerCommand(cmd);
                cmd.parent = this;
                cmd.copyInheritedSettings(this);
                if (desc) return this;
                return cmd;
            }
            createCommand(name) {
                return new Command(name);
            }
            createHelp() {
                return Object.assign(new Help(), this.configureHelp());
            }
            configureHelp(configuration) {
                if (void 0 === configuration) return this._helpConfiguration;
                this._helpConfiguration = configuration;
                return this;
            }
            configureOutput(configuration) {
                if (void 0 === configuration) return this._outputConfiguration;
                Object.assign(this._outputConfiguration, configuration);
                return this;
            }
            showHelpAfterError(displayHelp = true) {
                if ('string' != typeof displayHelp) displayHelp = !!displayHelp;
                this._showHelpAfterError = displayHelp;
                return this;
            }
            showSuggestionAfterError(displaySuggestion = true) {
                this._showSuggestionAfterError = !!displaySuggestion;
                return this;
            }
            addCommand(cmd, opts) {
                if (!cmd._name) throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
                opts = opts || {};
                if (opts.isDefault) this._defaultCommandName = cmd._name;
                if (opts.noHelp || opts.hidden) cmd._hidden = true;
                this._registerCommand(cmd);
                cmd.parent = this;
                cmd._checkForBrokenPassThrough();
                return this;
            }
            createArgument(name, description) {
                return new Argument(name, description);
            }
            argument(name, description, fn, defaultValue) {
                const argument = this.createArgument(name, description);
                if ('function' == typeof fn) argument.default(defaultValue).argParser(fn);
                else argument.default(fn);
                this.addArgument(argument);
                return this;
            }
            arguments(names) {
                names.trim().split(/ +/).forEach((detail)=>{
                    this.argument(detail);
                });
                return this;
            }
            addArgument(argument) {
                const previousArgument = this.registeredArguments.slice(-1)[0];
                if (previousArgument && previousArgument.variadic) throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
                if (argument.required && void 0 !== argument.defaultValue && void 0 === argument.parseArg) throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
                this.registeredArguments.push(argument);
                return this;
            }
            helpCommand(enableOrNameAndArgs, description) {
                if ('boolean' == typeof enableOrNameAndArgs) {
                    this._addImplicitHelpCommand = enableOrNameAndArgs;
                    return this;
                }
                enableOrNameAndArgs = enableOrNameAndArgs ?? 'help [command]';
                const [, helpName, helpArgs] = enableOrNameAndArgs.match(/([^ ]+) *(.*)/);
                const helpDescription = description ?? 'display help for command';
                const helpCommand = this.createCommand(helpName);
                helpCommand.helpOption(false);
                if (helpArgs) helpCommand.arguments(helpArgs);
                if (helpDescription) helpCommand.description(helpDescription);
                this._addImplicitHelpCommand = true;
                this._helpCommand = helpCommand;
                return this;
            }
            addHelpCommand(helpCommand, deprecatedDescription) {
                if ('object' != typeof helpCommand) {
                    this.helpCommand(helpCommand, deprecatedDescription);
                    return this;
                }
                this._addImplicitHelpCommand = true;
                this._helpCommand = helpCommand;
                return this;
            }
            _getHelpCommand() {
                const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand('help'));
                if (hasImplicitHelpCommand) {
                    if (void 0 === this._helpCommand) this.helpCommand(void 0, void 0);
                    return this._helpCommand;
                }
                return null;
            }
            hook(event, listener) {
                const allowedValues = [
                    'preSubcommand',
                    'preAction',
                    'postAction'
                ];
                if (!allowedValues.includes(event)) throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
                if (this._lifeCycleHooks[event]) this._lifeCycleHooks[event].push(listener);
                else this._lifeCycleHooks[event] = [
                    listener
                ];
                return this;
            }
            exitOverride(fn) {
                if (fn) this._exitCallback = fn;
                else this._exitCallback = (err)=>{
                    if ('commander.executeSubCommandAsync' !== err.code) throw err;
                };
                return this;
            }
            _exit(exitCode, code, message) {
                if (this._exitCallback) this._exitCallback(new CommanderError(exitCode, code, message));
                process1.exit(exitCode);
            }
            action(fn) {
                const listener = (args)=>{
                    const expectedArgsCount = this.registeredArguments.length;
                    const actionArgs = args.slice(0, expectedArgsCount);
                    if (this._storeOptionsAsProperties) actionArgs[expectedArgsCount] = this;
                    else actionArgs[expectedArgsCount] = this.opts();
                    actionArgs.push(this);
                    return fn.apply(this, actionArgs);
                };
                this._actionHandler = listener;
                return this;
            }
            createOption(flags, description) {
                return new Option(flags, description);
            }
            _callParseArg(target, value, previous, invalidArgumentMessage) {
                try {
                    return target.parseArg(value, previous);
                } catch (err) {
                    if ('commander.invalidArgument' === err.code) {
                        const message = `${invalidArgumentMessage} ${err.message}`;
                        this.error(message, {
                            exitCode: err.exitCode,
                            code: err.code
                        });
                    }
                    throw err;
                }
            }
            _registerOption(option) {
                const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
                if (matchingOption) {
                    const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
                    throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
                }
                this.options.push(option);
            }
            _registerCommand(command) {
                const knownBy = (cmd)=>[
                        cmd.name()
                    ].concat(cmd.aliases());
                const alreadyUsed = knownBy(command).find((name)=>this._findCommand(name));
                if (alreadyUsed) {
                    const existingCmd = knownBy(this._findCommand(alreadyUsed)).join('|');
                    const newCmd = knownBy(command).join('|');
                    throw new Error(`cannot add command '${newCmd}' as already have command '${existingCmd}'`);
                }
                this.commands.push(command);
            }
            addOption(option) {
                this._registerOption(option);
                const oname = option.name();
                const name = option.attributeName();
                if (option.negate) {
                    const positiveLongFlag = option.long.replace(/^--no-/, '--');
                    if (!this._findOption(positiveLongFlag)) this.setOptionValueWithSource(name, void 0 === option.defaultValue ? true : option.defaultValue, 'default');
                } else if (void 0 !== option.defaultValue) this.setOptionValueWithSource(name, option.defaultValue, 'default');
                const handleOptionValue = (val, invalidValueMessage, valueSource)=>{
                    if (null == val && void 0 !== option.presetArg) val = option.presetArg;
                    const oldValue = this.getOptionValue(name);
                    if (null !== val && option.parseArg) val = this._callParseArg(option, val, oldValue, invalidValueMessage);
                    else if (null !== val && option.variadic) val = option._concatValue(val, oldValue);
                    if (null == val) val = option.negate ? false : option.isBoolean() || option.optional ? true : '';
                    this.setOptionValueWithSource(name, val, valueSource);
                };
                this.on('option:' + oname, (val)=>{
                    const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
                    handleOptionValue(val, invalidValueMessage, 'cli');
                });
                if (option.envVar) this.on('optionEnv:' + oname, (val)=>{
                    const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
                    handleOptionValue(val, invalidValueMessage, 'env');
                });
                return this;
            }
            _optionEx(config, flags, description, fn, defaultValue) {
                if ('object' == typeof flags && flags instanceof Option) throw new Error('To add an Option object use addOption() instead of option() or requiredOption()');
                const option = this.createOption(flags, description);
                option.makeOptionMandatory(!!config.mandatory);
                if ('function' == typeof fn) option.default(defaultValue).argParser(fn);
                else if (fn instanceof RegExp) {
                    const regex = fn;
                    fn = (val, def)=>{
                        const m = regex.exec(val);
                        return m ? m[0] : def;
                    };
                    option.default(defaultValue).argParser(fn);
                } else option.default(fn);
                return this.addOption(option);
            }
            option(flags, description, parseArg, defaultValue) {
                return this._optionEx({}, flags, description, parseArg, defaultValue);
            }
            requiredOption(flags, description, parseArg, defaultValue) {
                return this._optionEx({
                    mandatory: true
                }, flags, description, parseArg, defaultValue);
            }
            combineFlagAndOptionalValue(combine = true) {
                this._combineFlagAndOptionalValue = !!combine;
                return this;
            }
            allowUnknownOption(allowUnknown = true) {
                this._allowUnknownOption = !!allowUnknown;
                return this;
            }
            allowExcessArguments(allowExcess = true) {
                this._allowExcessArguments = !!allowExcess;
                return this;
            }
            enablePositionalOptions(positional = true) {
                this._enablePositionalOptions = !!positional;
                return this;
            }
            passThroughOptions(passThrough = true) {
                this._passThroughOptions = !!passThrough;
                this._checkForBrokenPassThrough();
                return this;
            }
            _checkForBrokenPassThrough() {
                if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) throw new Error(`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`);
            }
            storeOptionsAsProperties(storeAsProperties = true) {
                if (this.options.length) throw new Error('call .storeOptionsAsProperties() before adding options');
                if (Object.keys(this._optionValues).length) throw new Error('call .storeOptionsAsProperties() before setting option values');
                this._storeOptionsAsProperties = !!storeAsProperties;
                return this;
            }
            getOptionValue(key) {
                if (this._storeOptionsAsProperties) return this[key];
                return this._optionValues[key];
            }
            setOptionValue(key, value) {
                return this.setOptionValueWithSource(key, value, void 0);
            }
            setOptionValueWithSource(key, value, source) {
                if (this._storeOptionsAsProperties) this[key] = value;
                else this._optionValues[key] = value;
                this._optionValueSources[key] = source;
                return this;
            }
            getOptionValueSource(key) {
                return this._optionValueSources[key];
            }
            getOptionValueSourceWithGlobals(key) {
                let source;
                this._getCommandAndAncestors().forEach((cmd)=>{
                    if (void 0 !== cmd.getOptionValueSource(key)) source = cmd.getOptionValueSource(key);
                });
                return source;
            }
            _prepareUserArgs(argv, parseOptions) {
                if (void 0 !== argv && !Array.isArray(argv)) throw new Error('first parameter to parse must be array or undefined');
                parseOptions = parseOptions || {};
                if (void 0 === argv && void 0 === parseOptions.from) {
                    if (process1.versions?.electron) parseOptions.from = 'electron';
                    const execArgv = process1.execArgv ?? [];
                    if (execArgv.includes('-e') || execArgv.includes('--eval') || execArgv.includes('-p') || execArgv.includes('--print')) parseOptions.from = 'eval';
                }
                if (void 0 === argv) argv = process1.argv;
                this.rawArgs = argv.slice();
                let userArgs;
                switch(parseOptions.from){
                    case void 0:
                    case 'node':
                        this._scriptPath = argv[1];
                        userArgs = argv.slice(2);
                        break;
                    case 'electron':
                        if (process1.defaultApp) {
                            this._scriptPath = argv[1];
                            userArgs = argv.slice(2);
                        } else userArgs = argv.slice(1);
                        break;
                    case 'user':
                        userArgs = argv.slice(0);
                        break;
                    case 'eval':
                        userArgs = argv.slice(1);
                        break;
                    default:
                        throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
                }
                if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
                this._name = this._name || 'program';
                return userArgs;
            }
            parse(argv, parseOptions) {
                const userArgs = this._prepareUserArgs(argv, parseOptions);
                this._parseCommand([], userArgs);
                return this;
            }
            async parseAsync(argv, parseOptions) {
                const userArgs = this._prepareUserArgs(argv, parseOptions);
                await this._parseCommand([], userArgs);
                return this;
            }
            _executeSubCommand(subcommand, args) {
                args = args.slice();
                let launchWithNode = false;
                const sourceExt = [
                    '.js',
                    '.ts',
                    '.tsx',
                    '.mjs',
                    '.cjs'
                ];
                function findFile(baseDir, baseName) {
                    const localBin = path.resolve(baseDir, baseName);
                    if (fs.existsSync(localBin)) return localBin;
                    if (sourceExt.includes(path.extname(baseName))) return;
                    const foundExt = sourceExt.find((ext)=>fs.existsSync(`${localBin}${ext}`));
                    if (foundExt) return `${localBin}${foundExt}`;
                }
                this._checkForMissingMandatoryOptions();
                this._checkForConflictingOptions();
                let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
                let executableDir = this._executableDir || '';
                if (this._scriptPath) {
                    let resolvedScriptPath;
                    try {
                        resolvedScriptPath = fs.realpathSync(this._scriptPath);
                    } catch (err) {
                        resolvedScriptPath = this._scriptPath;
                    }
                    executableDir = path.resolve(path.dirname(resolvedScriptPath), executableDir);
                }
                if (executableDir) {
                    let localFile = findFile(executableDir, executableFile);
                    if (!localFile && !subcommand._executableFile && this._scriptPath) {
                        const legacyName = path.basename(this._scriptPath, path.extname(this._scriptPath));
                        if (legacyName !== this._name) localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
                    }
                    executableFile = localFile || executableFile;
                }
                launchWithNode = sourceExt.includes(path.extname(executableFile));
                let proc;
                if ('win32' !== process1.platform) if (launchWithNode) {
                    args.unshift(executableFile);
                    args = incrementNodeInspectorPort(process1.execArgv).concat(args);
                    proc = childProcess.spawn(process1.argv[0], args, {
                        stdio: 'inherit'
                    });
                } else proc = childProcess.spawn(executableFile, args, {
                    stdio: 'inherit'
                });
                else {
                    args.unshift(executableFile);
                    args = incrementNodeInspectorPort(process1.execArgv).concat(args);
                    proc = childProcess.spawn(process1.execPath, args, {
                        stdio: 'inherit'
                    });
                }
                if (!proc.killed) {
                    const signals = [
                        'SIGUSR1',
                        'SIGUSR2',
                        'SIGTERM',
                        'SIGINT',
                        'SIGHUP'
                    ];
                    signals.forEach((signal)=>{
                        process1.on(signal, ()=>{
                            if (false === proc.killed && null === proc.exitCode) proc.kill(signal);
                        });
                    });
                }
                const exitCallback = this._exitCallback;
                proc.on('close', (code)=>{
                    code = code ?? 1;
                    if (exitCallback) exitCallback(new CommanderError(code, 'commander.executeSubCommandAsync', '(close)'));
                    else process1.exit(code);
                });
                proc.on('error', (err)=>{
                    if ('ENOENT' === err.code) {
                        const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : 'no directory for search for local subcommand, use .executableDir() to supply a custom directory';
                        const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
                        throw new Error(executableMissing);
                    }
                    if ('EACCES' === err.code) throw new Error(`'${executableFile}' not executable`);
                    if (exitCallback) {
                        const wrappedError = new CommanderError(1, 'commander.executeSubCommandAsync', '(error)');
                        wrappedError.nestedError = err;
                        exitCallback(wrappedError);
                    } else process1.exit(1);
                });
                this.runningCommand = proc;
            }
            _dispatchSubcommand(commandName, operands, unknown) {
                const subCommand = this._findCommand(commandName);
                if (!subCommand) this.help({
                    error: true
                });
                let promiseChain;
                promiseChain = this._chainOrCallSubCommandHook(promiseChain, subCommand, 'preSubcommand');
                promiseChain = this._chainOrCall(promiseChain, ()=>{
                    if (!subCommand._executableHandler) return subCommand._parseCommand(operands, unknown);
                    this._executeSubCommand(subCommand, operands.concat(unknown));
                });
                return promiseChain;
            }
            _dispatchHelpCommand(subcommandName) {
                if (!subcommandName) this.help();
                const subCommand = this._findCommand(subcommandName);
                if (subCommand && !subCommand._executableHandler) subCommand.help();
                return this._dispatchSubcommand(subcommandName, [], [
                    this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? '--help'
                ]);
            }
            _checkNumberOfArguments() {
                this.registeredArguments.forEach((arg, i)=>{
                    if (arg.required && null == this.args[i]) this.missingArgument(arg.name());
                });
                if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) return;
                if (this.args.length > this.registeredArguments.length) this._excessArguments(this.args);
            }
            _processArguments() {
                const myParseArg = (argument, value, previous)=>{
                    let parsedValue = value;
                    if (null !== value && argument.parseArg) {
                        const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
                        parsedValue = this._callParseArg(argument, value, previous, invalidValueMessage);
                    }
                    return parsedValue;
                };
                this._checkNumberOfArguments();
                const processedArgs = [];
                this.registeredArguments.forEach((declaredArg, index)=>{
                    let value = declaredArg.defaultValue;
                    if (declaredArg.variadic) {
                        if (index < this.args.length) {
                            value = this.args.slice(index);
                            if (declaredArg.parseArg) value = value.reduce((processed, v)=>myParseArg(declaredArg, v, processed), declaredArg.defaultValue);
                        } else if (void 0 === value) value = [];
                    } else if (index < this.args.length) {
                        value = this.args[index];
                        if (declaredArg.parseArg) value = myParseArg(declaredArg, value, declaredArg.defaultValue);
                    }
                    processedArgs[index] = value;
                });
                this.processedArgs = processedArgs;
            }
            _chainOrCall(promise, fn) {
                if (promise && promise.then && 'function' == typeof promise.then) return promise.then(()=>fn());
                return fn();
            }
            _chainOrCallHooks(promise, event) {
                let result = promise;
                const hooks = [];
                this._getCommandAndAncestors().reverse().filter((cmd)=>void 0 !== cmd._lifeCycleHooks[event]).forEach((hookedCommand)=>{
                    hookedCommand._lifeCycleHooks[event].forEach((callback)=>{
                        hooks.push({
                            hookedCommand,
                            callback
                        });
                    });
                });
                if ('postAction' === event) hooks.reverse();
                hooks.forEach((hookDetail)=>{
                    result = this._chainOrCall(result, ()=>hookDetail.callback(hookDetail.hookedCommand, this));
                });
                return result;
            }
            _chainOrCallSubCommandHook(promise, subCommand, event) {
                let result = promise;
                if (void 0 !== this._lifeCycleHooks[event]) this._lifeCycleHooks[event].forEach((hook)=>{
                    result = this._chainOrCall(result, ()=>hook(this, subCommand));
                });
                return result;
            }
            _parseCommand(operands, unknown) {
                const parsed = this.parseOptions(unknown);
                this._parseOptionsEnv();
                this._parseOptionsImplied();
                operands = operands.concat(parsed.operands);
                unknown = parsed.unknown;
                this.args = operands.concat(unknown);
                if (operands && this._findCommand(operands[0])) return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
                if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) return this._dispatchHelpCommand(operands[1]);
                if (this._defaultCommandName) {
                    this._outputHelpIfRequested(unknown);
                    return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
                }
                if (this.commands.length && 0 === this.args.length && !this._actionHandler && !this._defaultCommandName) this.help({
                    error: true
                });
                this._outputHelpIfRequested(parsed.unknown);
                this._checkForMissingMandatoryOptions();
                this._checkForConflictingOptions();
                const checkForUnknownOptions = ()=>{
                    if (parsed.unknown.length > 0) this.unknownOption(parsed.unknown[0]);
                };
                const commandEvent = `command:${this.name()}`;
                if (this._actionHandler) {
                    checkForUnknownOptions();
                    this._processArguments();
                    let promiseChain;
                    promiseChain = this._chainOrCallHooks(promiseChain, 'preAction');
                    promiseChain = this._chainOrCall(promiseChain, ()=>this._actionHandler(this.processedArgs));
                    if (this.parent) promiseChain = this._chainOrCall(promiseChain, ()=>{
                        this.parent.emit(commandEvent, operands, unknown);
                    });
                    promiseChain = this._chainOrCallHooks(promiseChain, 'postAction');
                    return promiseChain;
                }
                if (this.parent && this.parent.listenerCount(commandEvent)) {
                    checkForUnknownOptions();
                    this._processArguments();
                    this.parent.emit(commandEvent, operands, unknown);
                } else if (operands.length) {
                    if (this._findCommand('*')) return this._dispatchSubcommand('*', operands, unknown);
                    if (this.listenerCount('command:*')) this.emit('command:*', operands, unknown);
                    else if (this.commands.length) this.unknownCommand();
                    else {
                        checkForUnknownOptions();
                        this._processArguments();
                    }
                } else if (this.commands.length) {
                    checkForUnknownOptions();
                    this.help({
                        error: true
                    });
                } else {
                    checkForUnknownOptions();
                    this._processArguments();
                }
            }
            _findCommand(name) {
                if (!name) return;
                return this.commands.find((cmd)=>cmd._name === name || cmd._aliases.includes(name));
            }
            _findOption(arg) {
                return this.options.find((option)=>option.is(arg));
            }
            _checkForMissingMandatoryOptions() {
                this._getCommandAndAncestors().forEach((cmd)=>{
                    cmd.options.forEach((anOption)=>{
                        if (anOption.mandatory && void 0 === cmd.getOptionValue(anOption.attributeName())) cmd.missingMandatoryOptionValue(anOption);
                    });
                });
            }
            _checkForConflictingLocalOptions() {
                const definedNonDefaultOptions = this.options.filter((option)=>{
                    const optionKey = option.attributeName();
                    if (void 0 === this.getOptionValue(optionKey)) return false;
                    return 'default' !== this.getOptionValueSource(optionKey);
                });
                const optionsWithConflicting = definedNonDefaultOptions.filter((option)=>option.conflictsWith.length > 0);
                optionsWithConflicting.forEach((option)=>{
                    const conflictingAndDefined = definedNonDefaultOptions.find((defined)=>option.conflictsWith.includes(defined.attributeName()));
                    if (conflictingAndDefined) this._conflictingOption(option, conflictingAndDefined);
                });
            }
            _checkForConflictingOptions() {
                this._getCommandAndAncestors().forEach((cmd)=>{
                    cmd._checkForConflictingLocalOptions();
                });
            }
            parseOptions(argv) {
                const operands = [];
                const unknown = [];
                let dest = operands;
                const args = argv.slice();
                function maybeOption(arg) {
                    return arg.length > 1 && '-' === arg[0];
                }
                let activeVariadicOption = null;
                while(args.length){
                    const arg = args.shift();
                    if ('--' === arg) {
                        if (dest === unknown) dest.push(arg);
                        dest.push(...args);
                        break;
                    }
                    if (activeVariadicOption && !maybeOption(arg)) {
                        this.emit(`option:${activeVariadicOption.name()}`, arg);
                        continue;
                    }
                    activeVariadicOption = null;
                    if (maybeOption(arg)) {
                        const option = this._findOption(arg);
                        if (option) {
                            if (option.required) {
                                const value = args.shift();
                                if (void 0 === value) this.optionMissingArgument(option);
                                this.emit(`option:${option.name()}`, value);
                            } else if (option.optional) {
                                let value = null;
                                if (args.length > 0 && !maybeOption(args[0])) value = args.shift();
                                this.emit(`option:${option.name()}`, value);
                            } else this.emit(`option:${option.name()}`);
                            activeVariadicOption = option.variadic ? option : null;
                            continue;
                        }
                    }
                    if (arg.length > 2 && '-' === arg[0] && '-' !== arg[1]) {
                        const option = this._findOption(`-${arg[1]}`);
                        if (option) {
                            if (option.required || option.optional && this._combineFlagAndOptionalValue) this.emit(`option:${option.name()}`, arg.slice(2));
                            else {
                                this.emit(`option:${option.name()}`);
                                args.unshift(`-${arg.slice(2)}`);
                            }
                            continue;
                        }
                    }
                    if (/^--[^=]+=/.test(arg)) {
                        const index = arg.indexOf('=');
                        const option = this._findOption(arg.slice(0, index));
                        if (option && (option.required || option.optional)) {
                            this.emit(`option:${option.name()}`, arg.slice(index + 1));
                            continue;
                        }
                    }
                    if (maybeOption(arg)) dest = unknown;
                    if ((this._enablePositionalOptions || this._passThroughOptions) && 0 === operands.length && 0 === unknown.length) {
                        if (this._findCommand(arg)) {
                            operands.push(arg);
                            if (args.length > 0) unknown.push(...args);
                            break;
                        } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
                            operands.push(arg);
                            if (args.length > 0) operands.push(...args);
                            break;
                        } else if (this._defaultCommandName) {
                            unknown.push(arg);
                            if (args.length > 0) unknown.push(...args);
                            break;
                        }
                    }
                    if (this._passThroughOptions) {
                        dest.push(arg);
                        if (args.length > 0) dest.push(...args);
                        break;
                    }
                    dest.push(arg);
                }
                return {
                    operands,
                    unknown
                };
            }
            opts() {
                if (this._storeOptionsAsProperties) {
                    const result = {};
                    const len = this.options.length;
                    for(let i = 0; i < len; i++){
                        const key = this.options[i].attributeName();
                        result[key] = key === this._versionOptionName ? this._version : this[key];
                    }
                    return result;
                }
                return this._optionValues;
            }
            optsWithGlobals() {
                return this._getCommandAndAncestors().reduce((combinedOptions, cmd)=>Object.assign(combinedOptions, cmd.opts()), {});
            }
            error(message, errorOptions) {
                this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
                if ('string' == typeof this._showHelpAfterError) this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
                else if (this._showHelpAfterError) {
                    this._outputConfiguration.writeErr('\n');
                    this.outputHelp({
                        error: true
                    });
                }
                const config = errorOptions || {};
                const exitCode = config.exitCode || 1;
                const code = config.code || 'commander.error';
                this._exit(exitCode, code, message);
            }
            _parseOptionsEnv() {
                this.options.forEach((option)=>{
                    if (option.envVar && option.envVar in process1.env) {
                        const optionKey = option.attributeName();
                        if (void 0 === this.getOptionValue(optionKey) || [
                            'default',
                            'config',
                            'env'
                        ].includes(this.getOptionValueSource(optionKey))) if (option.required || option.optional) this.emit(`optionEnv:${option.name()}`, process1.env[option.envVar]);
                        else this.emit(`optionEnv:${option.name()}`);
                    }
                });
            }
            _parseOptionsImplied() {
                const dualHelper = new DualOptions(this.options);
                const hasCustomOptionValue = (optionKey)=>void 0 !== this.getOptionValue(optionKey) && ![
                        'default',
                        'implied'
                    ].includes(this.getOptionValueSource(optionKey));
                this.options.filter((option)=>void 0 !== option.implied && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option)).forEach((option)=>{
                    Object.keys(option.implied).filter((impliedKey)=>!hasCustomOptionValue(impliedKey)).forEach((impliedKey)=>{
                        this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], 'implied');
                    });
                });
            }
            missingArgument(name) {
                const message = `error: missing required argument '${name}'`;
                this.error(message, {
                    code: 'commander.missingArgument'
                });
            }
            optionMissingArgument(option) {
                const message = `error: option '${option.flags}' argument missing`;
                this.error(message, {
                    code: 'commander.optionMissingArgument'
                });
            }
            missingMandatoryOptionValue(option) {
                const message = `error: required option '${option.flags}' not specified`;
                this.error(message, {
                    code: 'commander.missingMandatoryOptionValue'
                });
            }
            _conflictingOption(option, conflictingOption) {
                const findBestOptionFromValue = (option)=>{
                    const optionKey = option.attributeName();
                    const optionValue = this.getOptionValue(optionKey);
                    const negativeOption = this.options.find((target)=>target.negate && optionKey === target.attributeName());
                    const positiveOption = this.options.find((target)=>!target.negate && optionKey === target.attributeName());
                    if (negativeOption && (void 0 === negativeOption.presetArg && false === optionValue || void 0 !== negativeOption.presetArg && optionValue === negativeOption.presetArg)) return negativeOption;
                    return positiveOption || option;
                };
                const getErrorMessage = (option)=>{
                    const bestOption = findBestOptionFromValue(option);
                    const optionKey = bestOption.attributeName();
                    const source = this.getOptionValueSource(optionKey);
                    if ('env' === source) return `environment variable '${bestOption.envVar}'`;
                    return `option '${bestOption.flags}'`;
                };
                const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
                this.error(message, {
                    code: 'commander.conflictingOption'
                });
            }
            unknownOption(flag) {
                if (this._allowUnknownOption) return;
                let suggestion = '';
                if (flag.startsWith('--') && this._showSuggestionAfterError) {
                    let candidateFlags = [];
                    let command = this;
                    do {
                        const moreFlags = command.createHelp().visibleOptions(command).filter((option)=>option.long).map((option)=>option.long);
                        candidateFlags = candidateFlags.concat(moreFlags);
                        command = command.parent;
                    }while (command && !command._enablePositionalOptions);
                    suggestion = suggestSimilar(flag, candidateFlags);
                }
                const message = `error: unknown option '${flag}'${suggestion}`;
                this.error(message, {
                    code: 'commander.unknownOption'
                });
            }
            _excessArguments(receivedArgs) {
                if (this._allowExcessArguments) return;
                const expected = this.registeredArguments.length;
                const s = 1 === expected ? '' : 's';
                const forSubcommand = this.parent ? ` for '${this.name()}'` : '';
                const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
                this.error(message, {
                    code: 'commander.excessArguments'
                });
            }
            unknownCommand() {
                const unknownName = this.args[0];
                let suggestion = '';
                if (this._showSuggestionAfterError) {
                    const candidateNames = [];
                    this.createHelp().visibleCommands(this).forEach((command)=>{
                        candidateNames.push(command.name());
                        if (command.alias()) candidateNames.push(command.alias());
                    });
                    suggestion = suggestSimilar(unknownName, candidateNames);
                }
                const message = `error: unknown command '${unknownName}'${suggestion}`;
                this.error(message, {
                    code: 'commander.unknownCommand'
                });
            }
            version(str, flags, description) {
                if (void 0 === str) return this._version;
                this._version = str;
                flags = flags || '-V, --version';
                description = description || 'output the version number';
                const versionOption = this.createOption(flags, description);
                this._versionOptionName = versionOption.attributeName();
                this._registerOption(versionOption);
                this.on('option:' + versionOption.name(), ()=>{
                    this._outputConfiguration.writeOut(`${str}\n`);
                    this._exit(0, 'commander.version', str);
                });
                return this;
            }
            description(str, argsDescription) {
                if (void 0 === str && void 0 === argsDescription) return this._description;
                this._description = str;
                if (argsDescription) this._argsDescription = argsDescription;
                return this;
            }
            summary(str) {
                if (void 0 === str) return this._summary;
                this._summary = str;
                return this;
            }
            alias(alias) {
                if (void 0 === alias) return this._aliases[0];
                let command = this;
                if (0 !== this.commands.length && this.commands[this.commands.length - 1]._executableHandler) command = this.commands[this.commands.length - 1];
                if (alias === command._name) throw new Error("Command alias can't be the same as its name");
                const matchingCommand = this.parent?._findCommand(alias);
                if (matchingCommand) {
                    const existingCmd = [
                        matchingCommand.name()
                    ].concat(matchingCommand.aliases()).join('|');
                    throw new Error(`cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`);
                }
                command._aliases.push(alias);
                return this;
            }
            aliases(aliases) {
                if (void 0 === aliases) return this._aliases;
                aliases.forEach((alias)=>this.alias(alias));
                return this;
            }
            usage(str) {
                if (void 0 === str) {
                    if (this._usage) return this._usage;
                    const args = this.registeredArguments.map((arg)=>humanReadableArgName(arg));
                    return [].concat(this.options.length || null !== this._helpOption ? '[options]' : [], this.commands.length ? '[command]' : [], this.registeredArguments.length ? args : []).join(' ');
                }
                this._usage = str;
                return this;
            }
            name(str) {
                if (void 0 === str) return this._name;
                this._name = str;
                return this;
            }
            nameFromFilename(filename) {
                this._name = path.basename(filename, path.extname(filename));
                return this;
            }
            executableDir(path) {
                if (void 0 === path) return this._executableDir;
                this._executableDir = path;
                return this;
            }
            helpInformation(contextOptions) {
                const helper = this.createHelp();
                if (void 0 === helper.helpWidth) helper.helpWidth = contextOptions && contextOptions.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
                return helper.formatHelp(this, helper);
            }
            _getHelpContext(contextOptions) {
                contextOptions = contextOptions || {};
                const context = {
                    error: !!contextOptions.error
                };
                let write;
                write = context.error ? (arg)=>this._outputConfiguration.writeErr(arg) : (arg)=>this._outputConfiguration.writeOut(arg);
                context.write = contextOptions.write || write;
                context.command = this;
                return context;
            }
            outputHelp(contextOptions) {
                let deprecatedCallback;
                if ('function' == typeof contextOptions) {
                    deprecatedCallback = contextOptions;
                    contextOptions = void 0;
                }
                const context = this._getHelpContext(contextOptions);
                this._getCommandAndAncestors().reverse().forEach((command)=>command.emit('beforeAllHelp', context));
                this.emit('beforeHelp', context);
                let helpInformation = this.helpInformation(context);
                if (deprecatedCallback) {
                    helpInformation = deprecatedCallback(helpInformation);
                    if ('string' != typeof helpInformation && !Buffer.isBuffer(helpInformation)) throw new Error('outputHelp callback must return a string or a Buffer');
                }
                context.write(helpInformation);
                if (this._getHelpOption()?.long) this.emit(this._getHelpOption().long);
                this.emit('afterHelp', context);
                this._getCommandAndAncestors().forEach((command)=>command.emit('afterAllHelp', context));
            }
            helpOption(flags, description) {
                if ('boolean' == typeof flags) {
                    if (flags) this._helpOption = this._helpOption ?? void 0;
                    else this._helpOption = null;
                    return this;
                }
                flags = flags ?? '-h, --help';
                description = description ?? 'display help for command';
                this._helpOption = this.createOption(flags, description);
                return this;
            }
            _getHelpOption() {
                if (void 0 === this._helpOption) this.helpOption(void 0, void 0);
                return this._helpOption;
            }
            addHelpOption(option) {
                this._helpOption = option;
                return this;
            }
            help(contextOptions) {
                this.outputHelp(contextOptions);
                let exitCode = process1.exitCode || 0;
                if (0 === exitCode && contextOptions && 'function' != typeof contextOptions && contextOptions.error) exitCode = 1;
                this._exit(exitCode, 'commander.help', '(outputHelp)');
            }
            addHelpText(position, text) {
                const allowedValues = [
                    'beforeAll',
                    'before',
                    'after',
                    'afterAll'
                ];
                if (!allowedValues.includes(position)) throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
                const helpEvent = `${position}Help`;
                this.on(helpEvent, (context)=>{
                    let helpStr;
                    helpStr = 'function' == typeof text ? text({
                        error: context.error,
                        command: context.command
                    }) : text;
                    if (helpStr) context.write(`${helpStr}\n`);
                });
                return this;
            }
            _outputHelpIfRequested(args) {
                const helpOption = this._getHelpOption();
                const helpRequested = helpOption && args.find((arg)=>helpOption.is(arg));
                if (helpRequested) {
                    this.outputHelp();
                    this._exit(0, 'commander.helpDisplayed', '(outputHelp)');
                }
            }
        }
        function incrementNodeInspectorPort(args) {
            return args.map((arg)=>{
                if (!arg.startsWith('--inspect')) return arg;
                let debugOption;
                let debugHost = '127.0.0.1';
                let debugPort = '9229';
                let match;
                if (null !== (match = arg.match(/^(--inspect(-brk)?)$/))) debugOption = match[1];
                else if (null !== (match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/))) {
                    debugOption = match[1];
                    if (/^\d+$/.test(match[3])) debugPort = match[3];
                    else debugHost = match[3];
                } else if (null !== (match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/))) {
                    debugOption = match[1];
                    debugHost = match[3];
                    debugPort = match[4];
                }
                if (debugOption && '0' !== debugPort) return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
                return arg;
            });
        }
        exports.Command = Command;
    },
    "../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/error.js" (__unused_rspack_module, exports) {
        class CommanderError extends Error {
            constructor(exitCode, code, message){
                super(message);
                Error.captureStackTrace(this, this.constructor);
                this.name = this.constructor.name;
                this.code = code;
                this.exitCode = exitCode;
                this.nestedError = void 0;
            }
        }
        class InvalidArgumentError extends CommanderError {
            constructor(message){
                super(1, 'commander.invalidArgument', message);
                Error.captureStackTrace(this, this.constructor);
                this.name = this.constructor.name;
            }
        }
        exports.CommanderError = CommanderError;
        exports.InvalidArgumentError = InvalidArgumentError;
    },
    "../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/help.js" (__unused_rspack_module, exports, __webpack_require__) {
        const { humanReadableArgName } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/argument.js");
        class Help {
            constructor(){
                this.helpWidth = void 0;
                this.sortSubcommands = false;
                this.sortOptions = false;
                this.showGlobalOptions = false;
            }
            visibleCommands(cmd) {
                const visibleCommands = cmd.commands.filter((cmd)=>!cmd._hidden);
                const helpCommand = cmd._getHelpCommand();
                if (helpCommand && !helpCommand._hidden) visibleCommands.push(helpCommand);
                if (this.sortSubcommands) visibleCommands.sort((a, b)=>a.name().localeCompare(b.name()));
                return visibleCommands;
            }
            compareOptions(a, b) {
                const getSortKey = (option)=>option.short ? option.short.replace(/^-/, '') : option.long.replace(/^--/, '');
                return getSortKey(a).localeCompare(getSortKey(b));
            }
            visibleOptions(cmd) {
                const visibleOptions = cmd.options.filter((option)=>!option.hidden);
                const helpOption = cmd._getHelpOption();
                if (helpOption && !helpOption.hidden) {
                    const removeShort = helpOption.short && cmd._findOption(helpOption.short);
                    const removeLong = helpOption.long && cmd._findOption(helpOption.long);
                    if (removeShort || removeLong) {
                        if (helpOption.long && !removeLong) visibleOptions.push(cmd.createOption(helpOption.long, helpOption.description));
                        else if (helpOption.short && !removeShort) visibleOptions.push(cmd.createOption(helpOption.short, helpOption.description));
                    } else visibleOptions.push(helpOption);
                }
                if (this.sortOptions) visibleOptions.sort(this.compareOptions);
                return visibleOptions;
            }
            visibleGlobalOptions(cmd) {
                if (!this.showGlobalOptions) return [];
                const globalOptions = [];
                for(let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent){
                    const visibleOptions = ancestorCmd.options.filter((option)=>!option.hidden);
                    globalOptions.push(...visibleOptions);
                }
                if (this.sortOptions) globalOptions.sort(this.compareOptions);
                return globalOptions;
            }
            visibleArguments(cmd) {
                if (cmd._argsDescription) cmd.registeredArguments.forEach((argument)=>{
                    argument.description = argument.description || cmd._argsDescription[argument.name()] || '';
                });
                if (cmd.registeredArguments.find((argument)=>argument.description)) return cmd.registeredArguments;
                return [];
            }
            subcommandTerm(cmd) {
                const args = cmd.registeredArguments.map((arg)=>humanReadableArgName(arg)).join(' ');
                return cmd._name + (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') + (cmd.options.length ? ' [options]' : '') + (args ? ' ' + args : '');
            }
            optionTerm(option) {
                return option.flags;
            }
            argumentTerm(argument) {
                return argument.name();
            }
            longestSubcommandTermLength(cmd, helper) {
                return helper.visibleCommands(cmd).reduce((max, command)=>Math.max(max, helper.subcommandTerm(command).length), 0);
            }
            longestOptionTermLength(cmd, helper) {
                return helper.visibleOptions(cmd).reduce((max, option)=>Math.max(max, helper.optionTerm(option).length), 0);
            }
            longestGlobalOptionTermLength(cmd, helper) {
                return helper.visibleGlobalOptions(cmd).reduce((max, option)=>Math.max(max, helper.optionTerm(option).length), 0);
            }
            longestArgumentTermLength(cmd, helper) {
                return helper.visibleArguments(cmd).reduce((max, argument)=>Math.max(max, helper.argumentTerm(argument).length), 0);
            }
            commandUsage(cmd) {
                let cmdName = cmd._name;
                if (cmd._aliases[0]) cmdName = cmdName + '|' + cmd._aliases[0];
                let ancestorCmdNames = '';
                for(let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent)ancestorCmdNames = ancestorCmd.name() + ' ' + ancestorCmdNames;
                return ancestorCmdNames + cmdName + ' ' + cmd.usage();
            }
            commandDescription(cmd) {
                return cmd.description();
            }
            subcommandDescription(cmd) {
                return cmd.summary() || cmd.description();
            }
            optionDescription(option) {
                const extraInfo = [];
                if (option.argChoices) extraInfo.push(`choices: ${option.argChoices.map((choice)=>JSON.stringify(choice)).join(', ')}`);
                if (void 0 !== option.defaultValue) {
                    const showDefault = option.required || option.optional || option.isBoolean() && 'boolean' == typeof option.defaultValue;
                    if (showDefault) extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
                }
                if (void 0 !== option.presetArg && option.optional) extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
                if (void 0 !== option.envVar) extraInfo.push(`env: ${option.envVar}`);
                if (extraInfo.length > 0) return `${option.description} (${extraInfo.join(', ')})`;
                return option.description;
            }
            argumentDescription(argument) {
                const extraInfo = [];
                if (argument.argChoices) extraInfo.push(`choices: ${argument.argChoices.map((choice)=>JSON.stringify(choice)).join(', ')}`);
                if (void 0 !== argument.defaultValue) extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
                if (extraInfo.length > 0) {
                    const extraDescripton = `(${extraInfo.join(', ')})`;
                    if (argument.description) return `${argument.description} ${extraDescripton}`;
                    return extraDescripton;
                }
                return argument.description;
            }
            formatHelp(cmd, helper) {
                const termWidth = helper.padWidth(cmd, helper);
                const helpWidth = helper.helpWidth || 80;
                const itemIndentWidth = 2;
                const itemSeparatorWidth = 2;
                function formatItem(term, description) {
                    if (description) {
                        const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
                        return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
                    }
                    return term;
                }
                function formatList(textArray) {
                    return textArray.join('\n').replace(/^/gm, ' '.repeat(itemIndentWidth));
                }
                let output = [
                    `Usage: ${helper.commandUsage(cmd)}`,
                    ''
                ];
                const commandDescription = helper.commandDescription(cmd);
                if (commandDescription.length > 0) output = output.concat([
                    helper.wrap(commandDescription, helpWidth, 0),
                    ''
                ]);
                const argumentList = helper.visibleArguments(cmd).map((argument)=>formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument)));
                if (argumentList.length > 0) output = output.concat([
                    'Arguments:',
                    formatList(argumentList),
                    ''
                ]);
                const optionList = helper.visibleOptions(cmd).map((option)=>formatItem(helper.optionTerm(option), helper.optionDescription(option)));
                if (optionList.length > 0) output = output.concat([
                    'Options:',
                    formatList(optionList),
                    ''
                ]);
                if (this.showGlobalOptions) {
                    const globalOptionList = helper.visibleGlobalOptions(cmd).map((option)=>formatItem(helper.optionTerm(option), helper.optionDescription(option)));
                    if (globalOptionList.length > 0) output = output.concat([
                        'Global Options:',
                        formatList(globalOptionList),
                        ''
                    ]);
                }
                const commandList = helper.visibleCommands(cmd).map((cmd)=>formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd)));
                if (commandList.length > 0) output = output.concat([
                    'Commands:',
                    formatList(commandList),
                    ''
                ]);
                return output.join('\n');
            }
            padWidth(cmd, helper) {
                return Math.max(helper.longestOptionTermLength(cmd, helper), helper.longestGlobalOptionTermLength(cmd, helper), helper.longestSubcommandTermLength(cmd, helper), helper.longestArgumentTermLength(cmd, helper));
            }
            wrap(str, width, indent, minColumnWidth = 40) {
                const indents = ' \\f\\t\\v\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff';
                const manualIndent = new RegExp(`[\\n][${indents}]+`);
                if (str.match(manualIndent)) return str;
                const columnWidth = width - indent;
                if (columnWidth < minColumnWidth) return str;
                const leadingStr = str.slice(0, indent);
                const columnText = str.slice(indent).replace('\r\n', '\n');
                const indentString = ' '.repeat(indent);
                const zeroWidthSpace = '\u200B';
                const breaks = `\\s${zeroWidthSpace}`;
                const regex = new RegExp(`\n|.{1,${columnWidth - 1}}([${breaks}]|$)|[^${breaks}]+?([${breaks}]|$)`, 'g');
                const lines = columnText.match(regex) || [];
                return leadingStr + lines.map((line, i)=>{
                    if ('\n' === line) return '';
                    return (i > 0 ? indentString : '') + line.trimEnd();
                }).join('\n');
            }
        }
        exports.Help = Help;
    },
    "../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/option.js" (__unused_rspack_module, exports, __webpack_require__) {
        const { InvalidArgumentError } = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/error.js");
        class Option {
            constructor(flags, description){
                this.flags = flags;
                this.description = description || '';
                this.required = flags.includes('<');
                this.optional = flags.includes('[');
                this.variadic = /\w\.\.\.[>\]]$/.test(flags);
                this.mandatory = false;
                const optionFlags = splitOptionFlags(flags);
                this.short = optionFlags.shortFlag;
                this.long = optionFlags.longFlag;
                this.negate = false;
                if (this.long) this.negate = this.long.startsWith('--no-');
                this.defaultValue = void 0;
                this.defaultValueDescription = void 0;
                this.presetArg = void 0;
                this.envVar = void 0;
                this.parseArg = void 0;
                this.hidden = false;
                this.argChoices = void 0;
                this.conflictsWith = [];
                this.implied = void 0;
            }
            default(value, description) {
                this.defaultValue = value;
                this.defaultValueDescription = description;
                return this;
            }
            preset(arg) {
                this.presetArg = arg;
                return this;
            }
            conflicts(names) {
                this.conflictsWith = this.conflictsWith.concat(names);
                return this;
            }
            implies(impliedOptionValues) {
                let newImplied = impliedOptionValues;
                if ('string' == typeof impliedOptionValues) newImplied = {
                    [impliedOptionValues]: true
                };
                this.implied = Object.assign(this.implied || {}, newImplied);
                return this;
            }
            env(name) {
                this.envVar = name;
                return this;
            }
            argParser(fn) {
                this.parseArg = fn;
                return this;
            }
            makeOptionMandatory(mandatory = true) {
                this.mandatory = !!mandatory;
                return this;
            }
            hideHelp(hide = true) {
                this.hidden = !!hide;
                return this;
            }
            _concatValue(value, previous) {
                if (previous === this.defaultValue || !Array.isArray(previous)) return [
                    value
                ];
                return previous.concat(value);
            }
            choices(values) {
                this.argChoices = values.slice();
                this.parseArg = (arg, previous)=>{
                    if (!this.argChoices.includes(arg)) throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(', ')}.`);
                    if (this.variadic) return this._concatValue(arg, previous);
                    return arg;
                };
                return this;
            }
            name() {
                if (this.long) return this.long.replace(/^--/, '');
                return this.short.replace(/^-/, '');
            }
            attributeName() {
                return camelcase(this.name().replace(/^no-/, ''));
            }
            is(arg) {
                return this.short === arg || this.long === arg;
            }
            isBoolean() {
                return !this.required && !this.optional && !this.negate;
            }
        }
        class DualOptions {
            constructor(options){
                this.positiveOptions = new Map();
                this.negativeOptions = new Map();
                this.dualOptions = new Set();
                options.forEach((option)=>{
                    if (option.negate) this.negativeOptions.set(option.attributeName(), option);
                    else this.positiveOptions.set(option.attributeName(), option);
                });
                this.negativeOptions.forEach((value, key)=>{
                    if (this.positiveOptions.has(key)) this.dualOptions.add(key);
                });
            }
            valueFromOption(value, option) {
                const optionKey = option.attributeName();
                if (!this.dualOptions.has(optionKey)) return true;
                const preset = this.negativeOptions.get(optionKey).presetArg;
                const negativeValue = void 0 !== preset ? preset : false;
                return option.negate === (negativeValue === value);
            }
        }
        function camelcase(str) {
            return str.split('-').reduce((str, word)=>str + word[0].toUpperCase() + word.slice(1));
        }
        function splitOptionFlags(flags) {
            let shortFlag;
            let longFlag;
            const flagParts = flags.split(/[ |,]+/);
            if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) shortFlag = flagParts.shift();
            longFlag = flagParts.shift();
            if (!shortFlag && /^-[^-]$/.test(longFlag)) {
                shortFlag = longFlag;
                longFlag = void 0;
            }
            return {
                shortFlag,
                longFlag
            };
        }
        exports.Option = Option;
        exports.DualOptions = DualOptions;
    },
    "../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/lib/suggestSimilar.js" (__unused_rspack_module, exports) {
        const maxDistance = 3;
        function editDistance(a, b) {
            if (Math.abs(a.length - b.length) > maxDistance) return Math.max(a.length, b.length);
            const d = [];
            for(let i = 0; i <= a.length; i++)d[i] = [
                i
            ];
            for(let j = 0; j <= b.length; j++)d[0][j] = j;
            for(let j = 1; j <= b.length; j++)for(let i = 1; i <= a.length; i++){
                let cost = 1;
                cost = a[i - 1] === b[j - 1] ? 0 : 1;
                d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
            }
            return d[a.length][b.length];
        }
        function suggestSimilar(word, candidates) {
            if (!candidates || 0 === candidates.length) return '';
            candidates = Array.from(new Set(candidates));
            const searchingOptions = word.startsWith('--');
            if (searchingOptions) {
                word = word.slice(2);
                candidates = candidates.map((candidate)=>candidate.slice(2));
            }
            let similar = [];
            let bestDistance = maxDistance;
            const minSimilarity = 0.4;
            candidates.forEach((candidate)=>{
                if (candidate.length <= 1) return;
                const distance = editDistance(word, candidate);
                const length = Math.max(word.length, candidate.length);
                const similarity = (length - distance) / length;
                if (similarity > minSimilarity) {
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        similar = [
                            candidate
                        ];
                    } else if (distance === bestDistance) similar.push(candidate);
                }
            });
            similar.sort((a, b)=>a.localeCompare(b));
            if (searchingOptions) similar = similar.map((candidate)=>`--${candidate}`);
            if (similar.length > 1) return `\n(Did you mean one of ${similar.join(', ')}?)`;
            if (1 === similar.length) return `\n(Did you mean ${similar[0]}?)`;
            return '';
        }
        exports.suggestSimilar = suggestSimilar;
    }
});
const commander = __webpack_require__("../../node_modules/.pnpm/commander@12.1.0/node_modules/commander/index.js");
const { program: esm_program, createCommand: createCommand, createArgument: createArgument, createOption: createOption, CommanderError: CommanderError, InvalidArgumentError: InvalidArgumentError, InvalidOptionArgumentError: InvalidOptionArgumentError, Command: Command, Argument: Argument, Option: Option, Help: Help } = commander;
const API = {
    GetChunkGraphAI: '/api/graph/chunks/graph/ai',
    GetChunkByIdAI: '/api/graph/chunk/id/ai',
    GetModuleDetails: '/api/graph/module/details',
    GetModuleByName: '/api/graph/module/name',
    GetModuleIssuerPath: '/api/graph/module/issuer_path',
    GetPackageInfo: '/api/package/info',
    GetPackageDependency: '/api/package/dependency',
    GetOverlayAlerts: '/api/alerts/overlay',
    GetLoaderChartData: '/api/loader/chart/data',
    GetDirectoriesLoaders: '/api/loader/directories',
    GetBuildSummary: '/api/build/summary',
    GetAssets: '/api/assets/list',
    GetEntrypoints: '/api/entrypoints/list',
    GetBuildConfig: '/api/build/config',
    GetErrors: '/api/errors/list',
    GetModuleExports: '/api/module/exports',
    GetSideEffects: '/api/module/side-effects'
};
const external_node_fs_ = __webpack_require__("node:fs");
const external_node_path_ = __webpack_require__("node:path");
let jsonDataCache = null;
let dataFilePath = null;
function datasource_getDataFileFromArgs() {
    const args = process.argv.slice(2);
    const dataFileIndex = args.indexOf('--data-file');
    if (-1 !== dataFileIndex && args[dataFileIndex + 1]) return external_node_path_["default"].resolve(args[dataFileIndex + 1]);
    return null;
}
function loadJsonData(filePath) {
    if (jsonDataCache && dataFilePath === filePath) return jsonDataCache;
    if (!external_node_fs_["default"].existsSync(filePath)) throw new Error(`Data file not found: ${filePath}`);
    try {
        const content = external_node_fs_["default"].readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        jsonDataCache = data;
        dataFilePath = filePath;
        return data;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load data file: ${message}`);
    }
}
function getChunksFromJson(data, pageNumber = 1, pageSize = 100) {
    const chunkGraph = data?.data?.chunkGraph;
    if (!chunkGraph) return {
        total: 0,
        pageNumber: 1,
        pageSize,
        totalPages: 0,
        items: []
    };
    const chunks = chunkGraph.chunks || [];
    const assets = chunkGraph.assets || [];
    const allChunks = chunks.map((chunk)=>{
        const chunkAssets = assets.filter((asset)=>asset.chunks?.includes(chunk.id));
        const totalSize = chunkAssets.reduce((sum, asset)=>sum + (asset.size || 0), 0);
        const chunkId = 'string' == typeof chunk.id ? Number(chunk.id) : chunk.id;
        return {
            id: chunkId,
            name: chunk.name || `chunk-${chunk.id}`,
            size: totalSize || chunk.size || 0,
            modules: chunk.modules || [],
            assets: chunkAssets.map((a)=>({
                    name: a.path || a.name || '',
                    size: a.size || 0
                }))
        };
    });
    const total = allChunks.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = allChunks.slice(startIndex, endIndex);
    return {
        total,
        pageNumber,
        pageSize,
        totalPages,
        items: paginated
    };
}
function getChunkByIdFromJson(data, chunkId) {
    const chunksResult = getChunksFromJson(data, 1, Number.MAX_SAFE_INTEGER);
    const chunks = chunksResult.items;
    const targetId = 'string' == typeof chunkId ? Number(chunkId) : chunkId;
    return chunks.find((chunk)=>chunk.id === targetId || String(chunk.id) === String(chunkId));
}
function getModulesFromJson(data) {
    const moduleGraph = data?.data?.moduleGraph;
    if (!moduleGraph) return [];
    const modules = moduleGraph.modules || [];
    return modules.map((module)=>({
            id: module.id,
            path: module.path || module.webpackId || module.name || '',
            name: module.webpackId || module.name || module.path || '',
            webpackId: module.webpackId,
            size: module.size || {},
            issuerPath: module.issuerPath || [],
            dependencies: module.dependencies || [],
            imported: module.imported || [],
            chunks: module.chunks || [],
            isEntry: module.isEntry || false,
            bailoutReason: module.bailoutReason,
            kind: module.kind,
            concatenationModules: module.concatenationModules
        }));
}
function getModulesByPathFromJson(data, modulePath) {
    const modules = getModulesFromJson(data);
    const lowerPath = modulePath.toLowerCase();
    return modules.filter((module)=>module.path?.toLowerCase().includes(lowerPath) || module.name?.toLowerCase().includes(lowerPath) || module.webpackId?.toLowerCase().includes(lowerPath)).map((module)=>({
            id: module.id,
            path: module.path,
            name: module.name,
            webpackId: module.webpackId
        }));
}
function getModuleByIdFromJson(data, moduleId) {
    const modules = getModulesFromJson(data);
    return modules.find((module)=>module.id === Number(moduleId));
}
function getModuleIssuerPathFromJson(data, moduleId) {
    const moduleGraph = data?.data?.moduleGraph;
    if (!moduleGraph) return [];
    const modules = moduleGraph.modules || [];
    const module = modules.find((m)=>m.id === Number(moduleId));
    if (!module) return [];
    const dependencies = moduleGraph.dependencies || [];
    const issuerPath = [];
    const visited = new Set();
    const findIssuers = (targetModuleId)=>{
        if (visited.has(targetModuleId)) return;
        visited.add(targetModuleId);
        const issuers = dependencies.filter((dep)=>dep.module === targetModuleId).map((dep)=>dep.issuer).filter(Boolean);
        for (const issuerId of issuers){
            const issuer = modules.find((m)=>m.id === issuerId);
            if (issuer) {
                issuerPath.push({
                    id: issuer.id,
                    path: issuer.path || issuer.webpackId || '',
                    name: issuer.webpackId || issuer.name || ''
                });
                findIssuers(issuerId);
            }
        }
    };
    findIssuers(Number(moduleId));
    return issuerPath.reverse();
}
function getPackagesFromJson(data) {
    const packageGraph = data?.data?.packageGraph;
    if (!packageGraph) return [];
    const packages = packageGraph.packages || [];
    return packages.map((pkg)=>({
            id: pkg.id,
            name: pkg.name,
            version: pkg.version,
            size: pkg.size || {},
            duplicates: pkg.duplicates || [],
            root: pkg.root
        }));
}
function getPackageDependenciesFromJson(data, pageNumber = 1, pageSize = 100) {
    const packageGraph = data?.data?.packageGraph;
    if (!packageGraph) return {
        total: 0,
        pageNumber: 1,
        pageSize,
        totalPages: 0,
        items: []
    };
    const dependencies = packageGraph.dependencies || [];
    const total = dependencies.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = dependencies.slice(startIndex, endIndex);
    return {
        total,
        pageNumber,
        pageSize,
        totalPages,
        items: paginated
    };
}
function getOverlayAlertsFromJson(data) {
    const errors = data?.data?.errors || [];
    return errors.map((error)=>({
            id: error.id,
            code: error.code,
            title: error.title,
            description: error.description,
            level: error.level,
            category: error.category,
            type: error.type
        }));
}
function getLoaderChartDataFromJson(data) {
    const loader = data?.data?.loader;
    if (!loader) return [];
    if (Array.isArray(loader)) return loader;
    return loader.chartData || loader.data || [];
}
function getDirectoriesLoadersFromJson(data) {
    const loader = data?.data?.loader;
    if (!loader) return [];
    if (Array.isArray(loader)) return loader;
    return loader.directories || loader.directoriesData || [];
}
function getBuildSummaryFromJson(data) {
    const summary = data?.data?.summary;
    if (!summary) return null;
    return {
        costs: summary.costs || [],
        totalCost: summary.costs?.reduce((sum, cost)=>sum + (cost.costs || 0), 0) || 0
    };
}
function getAssetsFromJson(data) {
    const chunkGraph = data?.data?.chunkGraph;
    if (!chunkGraph) return [];
    return chunkGraph.assets || [];
}
function getEntrypointsFromJson(data) {
    const chunkGraph = data?.data?.chunkGraph;
    if (!chunkGraph) return [];
    return chunkGraph.entrypoints || [];
}
function getBuildConfigFromJson(data) {
    const configs = data?.data?.configs;
    if (!configs || !configs.length) return null;
    return configs[0]?.config || null;
}
function getErrorsFromJson(data) {
    const errors = data?.data?.errors || [];
    return errors.map((error)=>({
            id: error.id,
            code: error.code,
            title: error.title,
            description: error.description,
            level: error.level,
            category: error.category,
            type: error.type,
            link: error.link,
            error: error.error,
            stack: error.stack,
            packages: error.packages
        }));
}
function getModuleExportsFromJson(data) {
    const moduleGraph = data?.data?.moduleGraph;
    if (!moduleGraph) return [];
    return moduleGraph.exports || [];
}
function getSideEffectsFromJson(data, pageNumber = 1, pageSize = 100) {
    const moduleGraph = data?.data?.moduleGraph;
    if (!moduleGraph) return {
        total: 0,
        pageNumber: 1,
        pageSize,
        totalPages: 0,
        nodeModules: {
            count: 0,
            topPackages: []
        },
        userCode: {
            count: 0,
            totalPages: 0,
            modules: []
        },
        all: []
    };
    const modules = moduleGraph.modules || [];
    const sideEffectModules = modules.filter((module)=>module.bailoutReason).map((module)=>({
            id: module.id,
            path: module.path || module.webpackId || module.name || '',
            bailoutReason: module.bailoutReason,
            size: module.size || {},
            chunks: module.chunks || []
        }));
    const nodeModules = [];
    const userCode = [];
    const packageStats = new Map();
    for (const module of sideEffectModules){
        const modulePath = module.path || '';
        const isNodeModule = modulePath.includes('node_modules');
        if (isNodeModule) {
            nodeModules.push(module);
            const match = modulePath.match(/node_modules[/\\](?:\.pnpm[/\\][^/\\]+[/\\]node_modules[/\\])?([^/\\]+)/);
            if (match) {
                const pkgName = match[1];
                const stats = packageStats.get(pkgName) || {
                    count: 0,
                    totalSize: 0,
                    modules: []
                };
                stats.count += 1;
                stats.totalSize += module.size?.parsedSize || module.size?.sourceSize || 0;
                stats.modules.push(module);
                packageStats.set(pkgName, stats);
            }
        } else userCode.push(module);
    }
    const topPackages = Array.from(packageStats.entries()).map(([name, stats])=>({
            name,
            count: stats.count,
            totalSize: stats.totalSize,
            modules: stats.modules
        })).sort((a, b)=>b.totalSize - a.totalSize);
    const total = sideEffectModules.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedAll = sideEffectModules.slice(startIndex, endIndex);
    const userCodeTotal = userCode.length;
    const userCodeTotalPages = Math.ceil(userCodeTotal / pageSize);
    const userCodeStartIndex = (pageNumber - 1) * pageSize;
    const userCodeEndIndex = userCodeStartIndex + pageSize;
    const paginatedUserCode = userCode.slice(userCodeStartIndex, userCodeEndIndex);
    return {
        total,
        pageNumber,
        pageSize,
        totalPages,
        nodeModules: {
            count: nodeModules.length,
            topPackages: topPackages.slice(0, 10)
        },
        userCode: {
            count: userCodeTotal,
            totalPages: userCodeTotalPages,
            modules: paginatedUserCode
        },
        all: paginatedAll
    };
}
async function sendRequestFromJson(api, params = {}) {
    const filePath = datasource_getDataFileFromArgs();
    if (!filePath) throw new Error('No data file specified. Use --data-file <path>');
    const data = loadJsonData(filePath);
    switch(api){
        case API.GetChunkGraphAI:
            {
                const pageNumber = params.pageNumber ?? 1;
                const pageSize = params.pageSize ?? 100;
                return getChunksFromJson(data, pageNumber, pageSize);
            }
        case API.GetChunkByIdAI:
            return getChunkByIdFromJson(data, params.chunkId);
        case API.GetModuleDetails:
            return getModuleByIdFromJson(data, params.moduleId);
        case API.GetModuleByName:
            return getModulesByPathFromJson(data, params.moduleName);
        case API.GetModuleIssuerPath:
            return getModuleIssuerPathFromJson(data, params.moduleId);
        case API.GetPackageInfo:
            return getPackagesFromJson(data);
        case API.GetPackageDependency:
            {
                const pageNumber = params.pageNumber ?? 1;
                const pageSize = params.pageSize ?? 100;
                return getPackageDependenciesFromJson(data, pageNumber, pageSize);
            }
        case API.GetOverlayAlerts:
            return getOverlayAlertsFromJson(data);
        case API.GetLoaderChartData:
            return getLoaderChartDataFromJson(data);
        case API.GetDirectoriesLoaders:
            return getDirectoriesLoadersFromJson(data);
        case API.GetBuildSummary:
            return getBuildSummaryFromJson(data);
        case API.GetAssets:
            return getAssetsFromJson(data);
        case API.GetEntrypoints:
            return getEntrypointsFromJson(data);
        case API.GetBuildConfig:
            return getBuildConfigFromJson(data);
        case API.GetErrors:
            return getErrorsFromJson(data);
        case API.GetModuleExports:
            return getModuleExportsFromJson(data);
        case API.GetSideEffects:
            {
                const pageNumber = params.pageNumber ?? 1;
                const pageSize = params.pageSize ?? 100;
                return getSideEffectsFromJson(data, pageNumber, pageSize);
            }
        default:
            throw new Error(`Unknown API: ${api}`);
    }
}
const sendRequest = async (api, params = {})=>sendRequestFromJson(api, params);
const closeAllSockets = ()=>{};
const getMedianChunkSize = (list)=>{
    const sorted = [
        ...list
    ].sort((a, b)=>a.size - b.size);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) return (sorted[middle - 1].size + sorted[middle].size) / 2;
    return sorted[middle].size;
};
const getTopThirdLoadersByCosts = (loaders)=>{
    const sorted = [
        ...loaders
    ].sort((a, b)=>b.costs - a.costs);
    const count = Math.ceil(sorted.length / 3);
    return sorted.slice(0, count);
};
const getAllChunks = async (pageNumber, pageSize)=>{
    const params = {};
    if (void 0 !== pageNumber) params.pageNumber = pageNumber;
    if (void 0 !== pageSize) params.pageSize = pageSize;
    return sendRequest(API.GetChunkGraphAI, params);
};
const getPackageInfo = async ()=>sendRequest(API.GetPackageInfo, {});
const getPackageInfoFiltered = async ()=>{
    const info = await getPackageInfo();
    return info.map((pkg)=>({
            id: pkg.id,
            name: pkg.name,
            version: pkg.version,
            size: pkg.size,
            duplicates: pkg.duplicates
        }));
};
const getPackageInfoByPackageName = async (packageName)=>{
    const info = await getPackageInfo();
    return info.filter((pkg)=>pkg.name === packageName);
};
const getPackageDependency = async (pageNumber, pageSize)=>{
    const params = {};
    if (void 0 !== pageNumber) params.pageNumber = pageNumber;
    if (void 0 !== pageSize) params.pageSize = pageSize;
    return sendRequest(API.GetPackageDependency, params);
};
const getRuleInfo = async ()=>sendRequest(API.GetOverlayAlerts, {});
const getLoaderTimeForAllFiles = async ()=>sendRequest(API.GetLoaderChartData, {});
const getLongLoadersByCosts = async ()=>getTopThirdLoadersByCosts(await getLoaderTimeForAllFiles());
const getLoaderTimes = async ()=>sendRequest(API.GetDirectoriesLoaders, {});
const getBuildSummary = async ()=>sendRequest(API.GetBuildSummary, {});
const getAssets = async ()=>sendRequest(API.GetAssets, {});
const getEntrypoints = async ()=>sendRequest(API.GetEntrypoints, {});
const getBuildConfig = async ()=>sendRequest(API.GetBuildConfig, {});
const getErrors = async ()=>sendRequest(API.GetErrors, {});
const getModuleExports = async ()=>sendRequest(API.GetModuleExports, {});
const getSideEffects = async (pageNumber, pageSize)=>{
    const params = {};
    if (void 0 !== pageNumber) params.pageNumber = pageNumber;
    if (void 0 !== pageSize) params.pageSize = pageSize;
    return sendRequest(API.GetSideEffects, params);
};
function requireArg(value, name) {
    if (!value) throw new Error(`Missing ${name}.`);
    return value;
}
function parseNumber(value, name) {
    if (void 0 === value) return;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) throw new Error(`Invalid ${name}: ${value}`);
    return parsed;
}
function parsePositiveInt(value, name, range = {}) {
    if (void 0 === value) return;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) throw new Error(`Invalid ${name}: ${value}`);
    if (void 0 !== range.min && parsed < range.min) throw new Error(`${name} must be >= ${range.min}.`);
    if (void 0 !== range.max && parsed > range.max) throw new Error(`${name} must be <= ${range.max}.`);
    return parsed;
}
function printResult(result, compact = false) {
    if (void 0 === result) return;
    const spacing = compact ? 0 : 2;
    console.log(JSON.stringify(result, null, spacing));
}
const Constants = {
    JSExtension: '.js',
    CSSExtension: '.css',
    HtmlExtension: '.html',
    ImgExtensions: [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.webp',
        '.avif'
    ],
    MediaExtensions: [
        '.mp4',
        '.webm',
        '.ogg',
        '.mp3',
        '.wav',
        '.flac',
        '.aac'
    ],
    FontExtensions: [
        '.woff',
        '.woff2',
        '.ttf',
        '.otf',
        '.eot'
    ],
    MapExtensions: [
        '.js.map',
        '.css.map'
    ]
};
const extname = (filename)=>{
    const baseName = filename.split('?')[0];
    const matches = baseName.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
    return matches ? `.${matches[1]}` : '';
};
const isAssetMatchExtension = (asset, ext)=>asset.path.slice(-ext.length) === ext || extname(asset.path) === ext;
const isAssetMatchExtensions = (asset, exts)=>Array.isArray(exts) && exts.some((ext)=>isAssetMatchExtension(asset, ext));
const filterAssetsByExtensions = (assets, exts)=>{
    if ('string' == typeof exts) return assets.filter((e)=>isAssetMatchExtension(e, exts));
    if (Array.isArray(exts)) return assets.filter((e)=>isAssetMatchExtensions(e, exts));
    return assets;
};
const filterAssets = (assets, filterOrExtensions)=>{
    if (!filterOrExtensions) return assets;
    if ('function' == typeof filterOrExtensions) return assets.filter(filterOrExtensions);
    return filterAssetsByExtensions(assets, filterOrExtensions);
};
const isInitialAsset = (asset, chunks)=>{
    const assetChunkIds = asset.chunks || [];
    if (!assetChunkIds.length) return false;
    const initialSet = new Set((chunks || []).filter((c)=>c.initial).map((c)=>c.id));
    return assetChunkIds.some((id)=>initialSet.has(Number(id)));
};
const getAssetsSizeInfo = (assets, chunks, { withFileContent = false, filterOrExtensions } = {})=>{
    let filtered = assets.filter((e)=>!isAssetMatchExtensions(e, Constants.MapExtensions));
    filtered = filterAssets(filtered, filterOrExtensions);
    return {
        count: filtered.length,
        size: filtered.reduce((t, c)=>t + (c.size || 0), 0),
        files: filtered.map((e)=>({
                path: e.path,
                size: e.size || 0,
                gzipSize: e.gzipSize,
                initial: isInitialAsset(e, chunks),
                content: withFileContent ? e.content : void 0
            }))
    };
};
const getInitialAssetsSizeInfo = (assets, chunks, options = {})=>getAssetsSizeInfo(assets, chunks, {
        ...options,
        filterOrExtensions: (asset)=>isInitialAsset(asset, chunks)
    });
const diffSize = (bSize, cSize)=>{
    const isEqual = bSize === cSize;
    const percent = isEqual ? 0 : 0 === bSize ? 100 : Math.abs(cSize - bSize) / bSize * 100;
    const state = isEqual ? 'Equal' : bSize > cSize ? 'Down' : 'Up';
    return {
        percent,
        state
    };
};
const diffAssetsByExtensions = (baseline, current, filterOrExtensions, isInitial = false)=>{
    const { size: bSize, count: bCount } = isInitial ? getInitialAssetsSizeInfo(baseline.assets, baseline.chunks, {
        filterOrExtensions
    }) : getAssetsSizeInfo(baseline.assets, baseline.chunks, {
        filterOrExtensions
    });
    const { size: cSize, count: cCount } = isInitial ? getInitialAssetsSizeInfo(current.assets, current.chunks, {
        filterOrExtensions
    }) : getAssetsSizeInfo(current.assets, current.chunks, {
        filterOrExtensions
    });
    const { percent, state } = diffSize(bSize, cSize);
    return {
        size: {
            baseline: bSize,
            current: cSize
        },
        count: {
            baseline: bCount,
            current: cCount
        },
        percent,
        state
    };
};
const getAssetsDiffResult = (baseline, current)=>({
        all: {
            total: diffAssetsByExtensions(baseline, current)
        },
        js: {
            total: diffAssetsByExtensions(baseline, current, Constants.JSExtension),
            initial: diffAssetsByExtensions(baseline, current, Constants.JSExtension, true)
        },
        css: {
            total: diffAssetsByExtensions(baseline, current, Constants.CSSExtension),
            initial: diffAssetsByExtensions(baseline, current, Constants.CSSExtension, true)
        },
        imgs: {
            total: diffAssetsByExtensions(baseline, current, Constants.ImgExtensions)
        },
        html: {
            total: diffAssetsByExtensions(baseline, current, Constants.HtmlExtension)
        },
        media: {
            total: diffAssetsByExtensions(baseline, current, Constants.MediaExtensions)
        },
        fonts: {
            total: diffAssetsByExtensions(baseline, current, Constants.FontExtensions)
        },
        others: {
            total: diffAssetsByExtensions(baseline, current, (asset)=>!isAssetMatchExtensions(asset, [
                    Constants.JSExtension,
                    Constants.CSSExtension,
                    Constants.HtmlExtension
                ].concat(Constants.ImgExtensions, Constants.MediaExtensions, Constants.FontExtensions, Constants.MapExtensions)))
        }
    });
async function listAssets() {
    const assets = await getAssets();
    return {
        ok: true,
        data: assets,
        description: 'List all assets with size information.'
    };
}
async function diffAssets(baselineInput, currentInput) {
    const baselinePath = external_node_path_["default"].resolve(requireArg(baselineInput, 'baseline'));
    const currentPath = external_node_path_["default"].resolve(requireArg(currentInput, 'current'));
    const baselineData = loadJsonData(baselinePath);
    const currentData = loadJsonData(currentPath);
    const baselineGraph = baselineData?.data?.chunkGraph;
    const currentGraph = currentData?.data?.chunkGraph;
    if (!baselineGraph) throw new Error(`Invalid baseline file: ${baselinePath}`);
    if (!currentGraph) throw new Error(`Invalid current file: ${currentPath}`);
    const diff = getAssetsDiffResult(baselineGraph, currentGraph);
    return {
        ok: true,
        data: {
            note: 'Diff compares asset count and size across extensions; initial = entry-loaded assets only.',
            baseline: baselinePath,
            current: currentPath,
            diff
        },
        description: 'Diff asset counts and sizes between two rsdoctor-data.json files (baseline vs current).'
    };
}
async function getMediaAssets() {
    const chunksResult = await getAllChunks(1, Number.MAX_SAFE_INTEGER);
    const chunksResultTyped = chunksResult;
    const chunks = Array.isArray(chunksResultTyped) ? chunksResultTyped : chunksResultTyped.items || chunksResult;
    return {
        ok: true,
        data: {
            guidance: 'Media asset optimization guidance.',
            chunks
        },
        description: 'Media asset optimization guidance.'
    };
}
function registerAssetCommands(program, execute) {
    const assetProgram = program.command('assets').description('Asset operations');
    assetProgram.command('list').description('List all assets with size information.').action(function() {
        return execute(()=>listAssets());
    });
    assetProgram.command('diff').description('Diff asset counts and sizes between two rsdoctor-data.json files (baseline vs current).').requiredOption('--baseline <path>', 'Path to baseline rsdoctor-data.json').requiredOption('--current <path>', 'Path to current rsdoctor-data.json').action(function() {
        const options = this.opts();
        return execute(()=>diffAssets(options.baseline, options.current));
    });
    assetProgram.command('media').description('Media asset optimization guidance.').action(function() {
        return execute(()=>getMediaAssets());
    });
}
async function getSummary() {
    const summary = await getBuildSummary();
    return {
        ok: true,
        data: summary,
        description: 'Get build summary with costs (build time analysis).'
    };
}
async function listEntrypoints() {
    const entrypoints = await getEntrypoints();
    return {
        ok: true,
        data: entrypoints,
        description: 'List all entrypoints in the bundle.'
    };
}
async function getConfig() {
    const config = await getBuildConfig();
    return {
        ok: true,
        data: config,
        description: 'Get build configuration (rspack/webpack config).'
    };
}
async function executeStep1() {
    const [rules, packages, chunksResult] = await Promise.all([
        getRuleInfo(),
        getPackageInfo(),
        getAllChunks(1, Number.MAX_SAFE_INTEGER)
    ]);
    const chunksResultTyped = chunksResult;
    const chunks = Array.isArray(chunksResultTyped) ? chunksResultTyped : chunksResultTyped.items || [];
    const rulesArray = rules;
    const duplicateRule = rulesArray?.find((rule)=>rule.description?.includes('E1001'));
    const packagesArray = packages;
    const similarRules = [
        [
            'lodash',
            'lodash-es',
            'string_decode'
        ],
        [
            'dayjs',
            'moment',
            'date-fns',
            'js-joda'
        ],
        [
            'antd',
            'material-ui',
            'semantic-ui-react',
            'arco-design'
        ],
        [
            'axios',
            'node-fetch'
        ],
        [
            'redux',
            'mobx',
            'zustand',
            'recoil',
            'jotai'
        ],
        [
            'chalk',
            'colors',
            'picocolors',
            'kleur'
        ],
        [
            'fs-extra',
            'graceful-fs'
        ]
    ];
    const similarMatches = similarRules.map((group)=>{
        const found = group.filter((pkg)=>packagesArray.some((p)=>p.name.toLowerCase() === pkg.toLowerCase()));
        return found.length > 1 ? found : null;
    }).filter((match)=>null !== match);
    const mediaAssets = {
        guidance: 'Media asset optimization guidance.',
        chunks
    };
    const chunksArray = chunks;
    const median = chunksArray.length ? getMedianChunkSize(chunksArray) : 0;
    const operator = 1.3;
    const minSizeMB = 1;
    const minSizeBytes = 1024 * minSizeMB * 1024;
    const oversized = chunksArray.filter((chunk)=>chunk.size > median * operator && chunk.size >= minSizeBytes);
    return {
        duplicatePackages: {
            ok: true,
            data: {
                rule: duplicateRule ?? null,
                totalRules: rulesArray?.length ?? 0,
                note: duplicateRule ? void 0 : 'No E1001 duplicate package rule found in current analysis.'
            }
        },
        similarPackages: {
            ok: true,
            data: {
                similarPackages: similarMatches,
                totalPackages: packagesArray.length,
                note: similarMatches.length ? void 0 : 'No similar package groups detected in current analysis.'
            }
        },
        mediaAssets: {
            ok: true,
            data: mediaAssets
        },
        largeChunks: {
            ok: true,
            data: {
                median,
                operator,
                minSizeMB,
                oversized
            }
        }
    };
}
async function optimizeBundle(stepInput, sideEffectsPageNumberInput, sideEffectsPageSizeInput) {
    const step = stepInput ? parsePositiveInt(stepInput, 'step', {
        min: 1,
        max: 2
    }) : void 0;
    if (1 === step) {
        const step1Data = await executeStep1();
        return {
            ok: true,
            data: {
                step: 1,
                ...step1Data,
                note: 'Step 1 completed. Use --step 2 to get side effects modules.'
            },
            description: 'Step 1: Basic bundle optimization analysis (duplicate packages, similar packages, media assets, large chunks).'
        };
    }
    if (2 === step) {
        const pageNumber = parsePositiveInt(sideEffectsPageNumberInput, 'sideEffectsPageNumber', {
            min: 1
        }) ?? 1;
        const pageSize = parsePositiveInt(sideEffectsPageSizeInput, 'sideEffectsPageSize', {
            min: 1,
            max: 1000
        }) ?? 100;
        const sideEffectsData = await sendRequest(API.GetSideEffects, {
            pageNumber,
            pageSize
        });
        return {
            ok: true,
            data: {
                step: 2,
                sideEffectsModules: {
                    ok: true,
                    data: sideEffectsData
                },
                pagination: {
                    pageNumber,
                    pageSize
                },
                note: 'Step 2 completed. Side effects modules analysis with pagination.'
            },
            description: 'Step 2: Side effects modules analysis (categorized by node_modules and user code, with package statistics).'
        };
    }
    const defaultPageNumber = parsePositiveInt(sideEffectsPageNumberInput, 'sideEffectsPageNumber', {
        min: 1
    }) ?? 1;
    const defaultPageSize = parsePositiveInt(sideEffectsPageSizeInput, 'sideEffectsPageSize', {
        min: 1,
        max: 1000
    }) ?? 100;
    const [step1Data, sideEffectsData] = await Promise.all([
        executeStep1(),
        sendRequest(API.GetSideEffects, {
            pageNumber: defaultPageNumber,
            pageSize: defaultPageSize
        })
    ]);
    return {
        ok: true,
        data: {
            ...step1Data,
            sideEffectsModules: {
                ok: true,
                data: sideEffectsData
            }
        },
        description: 'Combined bundle optimization inputs: duplicate packages, similar packages, media assets, large chunks, and side effects modules, add give the advice to optimize the bundle.'
    };
}
function registerOptimizeCommand(commandGroup, execute) {
    commandGroup.command('optimize').description('Combined bundle optimization inputs: duplicate packages, similar packages, media assets, large chunks, and side effects modules. Supports step-by-step execution for better performance.').option('--step <step>', 'Execution step: 1 (basic analysis) or 2 (side effects). If not specified, executes both steps.').option('--side-effects-page-number <pageNumber>', 'Page number for side effects (default: 1, only used in step 2)').option('--side-effects-page-size <pageSize>', 'Page size for side effects (default: 100, max: 1000, only used in step 2)').action(function() {
        const options = this.opts();
        return execute(()=>optimizeBundle(options.step, options.sideEffectsPageNumber, options.sideEffectsPageSize));
    });
}
function registerBuildCommands(program, execute) {
    const buildProgram = program.command('build').description('Build operations');
    buildProgram.command('summary').description('Get build summary with costs (build time analysis).').action(function() {
        return execute(()=>getSummary());
    });
    buildProgram.command('entrypoints').description('List all entrypoints in the bundle.').action(function() {
        return execute(()=>listEntrypoints());
    });
    buildProgram.command('config').description('Get build configuration (rspack/webpack config).').action(function() {
        return execute(()=>getConfig());
    });
    registerOptimizeCommand(buildProgram, execute);
    const bundleProgram = program.command('bundle').description('Bundle operations');
    registerOptimizeCommand(bundleProgram, execute);
}
async function listChunks(pageNumberInput, pageSizeInput) {
    const pageNumber = parsePositiveInt(pageNumberInput, 'pageNumber', {
        min: 1
    }) ?? 1;
    const pageSize = parsePositiveInt(pageSizeInput, 'pageSize', {
        min: 1,
        max: 1000
    }) ?? 100;
    const chunks = await getAllChunks(pageNumber, pageSize);
    return {
        ok: true,
        data: chunks,
        description: 'List all chunks (id, name, size, modules).'
    };
}
async function getChunkById(chunkIdInput) {
    const chunkId = parseNumber(chunkIdInput, 'id');
    if (void 0 === chunkId) throw new Error('Chunk id is required');
    const chunk = await sendRequest(API.GetChunkByIdAI, {
        chunkId
    });
    if (!chunk) throw new Error(`Chunk ${chunkId} not found`);
    return {
        ok: true,
        data: chunk
    };
}
async function findLargeChunks() {
    const chunksResult = await getAllChunks(1, Number.MAX_SAFE_INTEGER);
    const chunks = chunksResult.items || (Array.isArray(chunksResult) ? chunksResult : []);
    if (!chunks.length) throw new Error('No chunks found.');
    const median = getMedianChunkSize(chunks);
    const operator = 1.3;
    const minSizeMB = 1;
    const minSizeBytes = 1024 * minSizeMB * 1024;
    const oversized = chunks.filter((chunk)=>chunk.size > median * operator && chunk.size >= minSizeBytes);
    return {
        ok: true,
        data: {
            median,
            operator,
            minSizeMB,
            oversized
        },
        description: 'Find oversized chunks (>30% over median size and >= 1MB) to prioritize splitChunks suggestions.'
    };
}
function registerChunkCommands(program, execute) {
    const chunkProgram = program.command('chunks').description('Chunk operations');
    chunkProgram.command('list').description('List all chunks (id, name, size, modules).').option('--page-number <pageNumber>', 'Page number (default: 1)').option('--page-size <pageSize>', 'Page size (default: 100, max: 1000)').action(function() {
        const options = this.opts();
        return execute(()=>listChunks(options.pageNumber, options.pageSize));
    });
    chunkProgram.command('by-id').description('Get chunk detail by numeric id.').requiredOption('--id <id>', 'Chunk id').action(function() {
        const options = this.opts();
        return execute(()=>getChunkById(options.id));
    });
    chunkProgram.command('large').description('Find oversized chunks (>30% over median size and >= 1MB) to prioritize splitChunks suggestions.').action(function() {
        return execute(()=>findLargeChunks());
    });
}
async function listErrors() {
    const errors = await getErrors();
    return {
        ok: true,
        data: errors,
        description: 'Get all errors and warnings from the build.'
    };
}
async function getErrorsByCode(codeInput) {
    const errorCode = requireArg(codeInput, 'code');
    const errors = await getErrors();
    const filtered = errors.filter((error)=>error.code === errorCode);
    return {
        ok: true,
        data: filtered,
        description: 'Get errors filtered by error code (e.g., E1001, E1004).'
    };
}
async function getErrorsByLevel(levelInput) {
    const errorLevel = requireArg(levelInput, 'level');
    const errors = await getErrors();
    const filtered = errors.filter((error)=>error.level === errorLevel);
    return {
        ok: true,
        data: filtered,
        description: 'Get errors filtered by level (error, warn, info).'
    };
}
function registerErrorCommands(program, execute) {
    const errorProgram = program.command('errors').description('Error operations');
    errorProgram.command('list').description('Get all errors and warnings from the build.').action(function() {
        return execute(()=>listErrors());
    });
    errorProgram.command('by-code').description('Get errors filtered by error code (e.g., E1001, E1004).').requiredOption('--code <code>', 'Error code').action(function() {
        const options = this.opts();
        return execute(()=>getErrorsByCode(options.code));
    });
    errorProgram.command('by-level').description('Get errors filtered by level (error, warn, info).').requiredOption('--level <level>', 'Error level (error/warn/info)').action(function() {
        const options = this.opts();
        return execute(()=>getErrorsByLevel(options.level));
    });
}
async function getHotFiles(pageNumberInput, pageSizeInput, minCostsInput) {
    const pageNumber = parsePositiveInt(pageNumberInput, 'pageNumber', {
        min: 1
    }) ?? 1;
    const pageSize = parsePositiveInt(pageSizeInput, 'pageSize', {
        min: 1,
        max: 1000
    }) ?? 100;
    const minCosts = parseNumber(minCostsInput, 'minCosts');
    const hotFiles = await getLongLoadersByCosts();
    let filtered = hotFiles;
    if (void 0 !== minCosts) filtered = hotFiles.filter((item)=>(item.costs ?? 0) >= minCosts);
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);
    return {
        ok: true,
        data: {
            total,
            pageNumber,
            pageSize,
            totalPages,
            minCosts: minCosts ?? null,
            items: paginated
        },
        description: 'Top third slowest loader/file pairs to surface expensive transforms.'
    };
}
async function getDirectories(pageNumberInput, pageSizeInput, minTotalCostsInput) {
    const pageNumber = parsePositiveInt(pageNumberInput, 'pageNumber', {
        min: 1
    }) ?? 1;
    const pageSize = parsePositiveInt(pageSizeInput, 'pageSize', {
        min: 1,
        max: 1000
    }) ?? 100;
    const minTotalCosts = parseNumber(minTotalCostsInput, 'minTotalCosts');
    const directories = await getLoaderTimes();
    let filtered = directories;
    if (void 0 !== minTotalCosts) filtered = directories.filter((item)=>(item.totalCosts ?? 0) >= minTotalCosts);
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);
    return {
        ok: true,
        data: {
            total,
            pageNumber,
            pageSize,
            totalPages,
            minTotalCosts: minTotalCosts ?? null,
            items: paginated
        },
        description: 'Loader times grouped by directory.'
    };
}
function registerLoaderCommands(program, execute) {
    const loaderProgram = program.command('loaders').description('Loader operations');
    loaderProgram.command('hot-files').description('Top third slowest loader/file pairs to surface expensive transforms.').option('--page-number <pageNumber>', 'Page number (default: 1)').option('--page-size <pageSize>', 'Page size (default: 100, max: 1000)').option('--min-costs <minCosts>', 'Minimum costs threshold (filter by minimum costs)').action(function() {
        const options = this.opts();
        return execute(()=>getHotFiles(options.pageNumber, options.pageSize, options.minCosts));
    });
    loaderProgram.command('directories').description('Loader times grouped by directory.').option('--page-number <pageNumber>', 'Page number (default: 1)').option('--page-size <pageSize>', 'Page size (default: 100, max: 1000)').option('--min-total-costs <minTotalCosts>', 'Minimum total costs threshold (filter by minimum total costs)').action(function() {
        const options = this.opts();
        return execute(()=>getDirectories(options.pageNumber, options.pageSize, options.minTotalCosts));
    });
}
async function getModuleById(moduleIdInput) {
    const moduleId = requireArg(moduleIdInput, 'id');
    const module = await sendRequest(API.GetModuleDetails, {
        moduleId
    });
    return {
        ok: true,
        data: module,
        description: 'Get module detail by id (webpack/rspack).'
    };
}
async function getModuleByPath(modulePathInput) {
    const modulePath = requireArg(modulePathInput, 'path');
    const matches = await sendRequest(API.GetModuleByName, {
        moduleName: modulePath
    }) || [];
    if (!matches.length) throw new Error(`No module found for "${modulePath}"`);
    if (matches.length > 1) return {
        ok: true,
        data: {
            match: 'multiple',
            options: matches,
            note: 'Multiple modules matched. Re-run with modules:by-id using the chosen id.'
        },
        description: 'Get module detail by name or path; if multiple match, list them.'
    };
    const moduleInfo = await sendRequest(API.GetModuleDetails, {
        moduleId: matches[0].id
    });
    return {
        ok: true,
        data: {
            match: 'single',
            module: moduleInfo
        },
        description: 'Get module detail by name or path; if multiple match, list them.'
    };
}
async function getModuleIssuerPath(moduleIdInput) {
    const moduleId = requireArg(moduleIdInput, 'id');
    const issuerPath = await sendRequest(API.GetModuleIssuerPath, {
        moduleId
    });
    return {
        ok: true,
        data: {
            moduleId,
            issuerPath
        },
        description: 'Trace issuer/import chain for a module.'
    };
}
async function modules_getModuleExports() {
    const exports = await sendRequest(API.GetModuleExports, {});
    return {
        ok: true,
        data: exports,
        description: 'Get module exports information.'
    };
}
async function modules_getSideEffects(pageNumberInput, pageSizeInput) {
    const pageNumber = parsePositiveInt(pageNumberInput, 'pageNumber', {
        min: 1
    }) ?? 1;
    const pageSize = parsePositiveInt(pageSizeInput, 'pageSize', {
        min: 1,
        max: 1000
    }) ?? 100;
    const sideEffects = await sendRequest(API.GetSideEffects, {
        pageNumber,
        pageSize
    });
    return {
        ok: true,
        data: sideEffects,
        description: 'Get modules with side effects based on bailoutReason from rsdoctor-data.json. bailoutReason indicates why modules cannot be tree-shaken (e.g., "side effects", "dynamic import", "unknown exports"). Results are categorized by node_modules and user code, with package statistics.'
    };
}
function registerModuleCommands(program, execute) {
    const moduleProgram = program.command('modules').description('Module operations');
    moduleProgram.command('by-id').description('Get module detail by id (webpack/rspack).').requiredOption('--id <id>', 'Module id').action(function() {
        const options = this.opts();
        return execute(()=>getModuleById(options.id));
    });
    moduleProgram.command('by-path').description('Get module detail by name or path; if multiple match, list them.').requiredOption('--path <path>', 'Module name or path').action(function() {
        const options = this.opts();
        return execute(()=>getModuleByPath(options.path));
    });
    moduleProgram.command('issuer').description('Trace issuer/import chain for a module.').requiredOption('--id <id>', 'Module id').action(function() {
        const options = this.opts();
        return execute(()=>getModuleIssuerPath(options.id));
    });
    moduleProgram.command('exports').description('Get module exports information.').action(function() {
        return execute(()=>modules_getModuleExports());
    });
    moduleProgram.command('side-effects').description('Get modules with side effects based on bailoutReason from rsdoctor-data.json, categorized by node_modules and user code, with package statistics. bailoutReason indicates why modules cannot be tree-shaken (e.g., "side effects", "dynamic import", "unknown exports").').option('--page-number <pageNumber>', 'Page number (default: 1)').option('--page-size <pageSize>', 'Page size (default: 100, max: 1000)').action(function() {
        const options = this.opts();
        return execute(()=>modules_getSideEffects(options.pageNumber, options.pageSize));
    });
}
async function listPackages(pageNumberInput, pageSizeInput) {
    const pageNumber = parsePositiveInt(pageNumberInput, 'pageNumber', {
        min: 1
    }) ?? 1;
    const pageSize = parsePositiveInt(pageSizeInput, 'pageSize', {
        min: 1,
        max: 1000
    }) ?? 100;
    const allPackages = await getPackageInfoFiltered();
    const total = allPackages.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = allPackages.slice(startIndex, endIndex);
    return {
        ok: true,
        data: {
            total,
            pageNumber,
            pageSize,
            totalPages,
            items
        },
        description: 'List packages with size/duplication info.'
    };
}
async function getPackageByName(packageNameInput) {
    const packageName = requireArg(packageNameInput, 'name');
    const packages = await getPackageInfoByPackageName(packageName);
    return {
        ok: true,
        data: packages,
        description: 'Get package entries by name.'
    };
}
async function getPackageDependencies(pageNumberInput, pageSizeInput) {
    const pageNumber = parsePositiveInt(pageNumberInput, 'pageNumber', {
        min: 1
    }) ?? 1;
    const pageSize = parsePositiveInt(pageSizeInput, 'pageSize', {
        min: 1,
        max: 100
    }) ?? 100;
    const dependencies = await getPackageDependency(pageNumber, pageSize);
    return {
        ok: true,
        data: dependencies,
        description: 'Get package dependency graph.'
    };
}
async function detectDuplicatePackages() {
    const rules = await getRuleInfo();
    const duplicateRule = rules?.find((rule)=>rule.description?.includes('E1001'));
    return {
        ok: true,
        data: {
            rule: duplicateRule ?? null,
            totalRules: rules?.length ?? 0,
            note: duplicateRule ? void 0 : 'No E1001 duplicate package rule found in current analysis.'
        },
        description: 'Detect duplicate packages using E1001 overlay rule if present.'
    };
}
async function detectSimilarPackages() {
    const packages = await getPackageInfo();
    const rules = [
        [
            'lodash',
            'lodash-es',
            'string_decode'
        ],
        [
            'dayjs',
            'moment',
            'date-fns',
            'js-joda'
        ],
        [
            'antd',
            'material-ui',
            'semantic-ui-react',
            'arco-design'
        ],
        [
            'axios',
            'node-fetch'
        ],
        [
            'redux',
            'mobx',
            'zustand',
            'recoil',
            'jotai'
        ],
        [
            'chalk',
            'colors',
            'picocolors',
            'kleur'
        ],
        [
            'fs-extra',
            'graceful-fs'
        ]
    ];
    const matches = rules.map((group)=>{
        const found = group.filter((pkg)=>packages.some((p)=>p.name.toLowerCase() === pkg.toLowerCase()));
        return found.length > 1 ? found : null;
    }).filter((match)=>null !== match);
    return {
        ok: true,
        data: {
            similarPackages: matches,
            totalPackages: packages.length,
            note: matches.length ? void 0 : 'No similar package groups detected in current analysis.'
        },
        description: 'Detect similar packages (lodash/lodash-es etc.).'
    };
}
function registerPackageCommands(program, execute) {
    const packageProgram = program.command('packages').description('Package operations');
    packageProgram.command('list').description('List packages with size/duplication info.').option('--page-number <pageNumber>', 'Page number (default: 1)').option('--page-size <pageSize>', 'Page size (default: 100, max: 1000)').action(function() {
        const options = this.opts();
        return execute(()=>listPackages(options.pageNumber, options.pageSize));
    });
    packageProgram.command('by-name').description('Get package entries by name.').requiredOption('--name <name>', 'Package name').action(function() {
        const options = this.opts();
        return execute(()=>getPackageByName(options.name));
    });
    packageProgram.command('dependencies').description('Get package dependency graph.').option('--page-number <pageNumber>', 'Page number (default: 1)').option('--page-size <pageSize>', 'Page size (default: 100, max: 1000)').action(function() {
        const options = this.opts();
        return execute(()=>getPackageDependencies(options.pageNumber, options.pageSize));
    });
    packageProgram.command('duplicates').description('Detect duplicate packages using E1001 overlay rule if present.').action(function() {
        return execute(()=>detectDuplicatePackages());
    });
    packageProgram.command('similar').description('Detect similar packages (lodash/lodash-es etc.).').action(function() {
        return execute(()=>detectSimilarPackages());
    });
}
async function listRules() {
    const rules = await getRuleInfo();
    return {
        ok: true,
        data: rules,
        description: 'Get rule scan results (overlay alerts).'
    };
}
function registerRuleCommands(program, execute) {
    const ruleProgram = program.command('rules').description('Rule operations');
    ruleProgram.command('list').description('Get rule scan results (overlay alerts).').action(function() {
        return execute(()=>listRules());
    });
}
async function server_getPort() {
    const filePath = datasource_getDataFileFromArgs();
    return {
        ok: true,
        data: {
            mode: 'json',
            dataFile: filePath,
            note: 'Using JSON data file mode. No server required.'
        },
        description: 'Get the JSON data file path used by the skill.'
    };
}
function registerServerCommands(program, execute) {
    const serverProgram = program.command('server').description('Server operations');
    serverProgram.command('port').description('Get the JSON data file path used by the skill.').action(function() {
        return execute(()=>server_getPort());
    });
}
function findRuleByCode(rules, code) {
    return rules.find((rule)=>rule.code === code || rule.description?.includes(code));
}
async function detectSideEffectsOnlyImports() {
    const rules = await getRuleInfo();
    const rule = findRuleByCode(rules, 'E1007');
    return {
        ok: true,
        data: {
            rule: rule ?? null,
            totalRules: rules?.length ?? 0,
            note: rule ? void 0 : 'No E1007 side-effects-only import violations found in current analysis.'
        },
        description: 'Detect modules pulled in solely for side effects (E1007). These indicate tree-shaking failures caused by missing/incorrect "sideEffects" field in package.json or bare `import "module"` patterns. Rspack\'s sideEffects optimization can eliminate entire modules only when the package declares "sideEffects": false (or a glob list) in package.json. Reference: https://www.rspack.dev/guide/optimization/tree-shaking'
    };
}
async function detectCjsRequire() {
    const rules = await getRuleInfo();
    const rule = findRuleByCode(rules, 'E1008');
    return {
        ok: true,
        data: {
            rule: rule ?? null,
            totalRules: rules?.length ?? 0,
            note: rule ? void 0 : 'No E1008 CJS require violations found in current analysis.'
        },
        description: 'Detect `require()` calls that prevent tree-shaking (E1008). Bare `require("module")` forces the entire module to be bundled because the bundler cannot statically determine which exports are used. Rspack tree-shaking requires ES module syntax (import/export); CJS require() bypasses usedExports and innerGraph analysis entirely. Fix by using destructured require or ESM imports. Reference: https://www.rspack.dev/guide/optimization/tree-shaking'
    };
}
async function detectEsmResolvedToCjs() {
    const rules = await getRuleInfo();
    const rule = findRuleByCode(rules, 'E1009');
    return {
        ok: true,
        data: {
            rule: rule ?? null,
            totalRules: rules?.length ?? 0,
            note: rule ? void 0 : 'No E1009 ESM-resolved-to-CJS violations found in current analysis.'
        },
        description: 'Detect ESM imports resolved to CJS despite the package providing an ESM entry (E1009). This prevents tree-shaking and inflates bundle size because Rspack\'s usedExports and providedExports optimizations only work on ES module graphs. Fix by adding "module" to resolve.mainFields or "import" to resolve.conditionNames in bundler config. Reference: https://www.rspack.dev/guide/optimization/tree-shaking'
    };
}
async function getTreeShakingSummary() {
    const [rules, sideEffects] = await Promise.all([
        getRuleInfo(),
        getSideEffects()
    ]);
    const e1007 = findRuleByCode(rules, 'E1007') ?? null;
    const e1008 = findRuleByCode(rules, 'E1008') ?? null;
    const e1009 = findRuleByCode(rules, 'E1009') ?? null;
    const totalViolations = [
        e1007,
        e1008,
        e1009
    ].filter(Boolean).length;
    return {
        ok: true,
        data: {
            violations: {
                e1007SideEffectsOnlyImports: e1007,
                e1008CjsRequire: e1008,
                e1009EsmToCjs: e1009
            },
            totalViolations,
            sideEffects,
            totalRules: rules?.length ?? 0
        },
        description: "Comprehensive tree-shaking health summary. Aggregates all three rule violations (E1007 side-effects-only imports, E1008 bare require() calls, E1009 ESM-resolved-to-CJS) together with per-module bailout reasons from the build graph. Rspack enables tree-shaking in production mode via usedExports, sideEffects, providedExports, and innerGraph — violations in this report indicate where those optimizations are being blocked. Use this as the starting point when diagnosing unexpected bundle size growth. Reference: https://www.rspack.dev/guide/optimization/tree-shaking"
    };
}
async function getBailoutModules(pageNumberInput, pageSizeInput) {
    const pageNumber = parsePositiveInt(pageNumberInput, 'pageNumber', {
        min: 1
    }) ?? 1;
    const pageSize = parsePositiveInt(pageSizeInput, 'pageSize', {
        min: 1,
        max: 1000
    }) ?? 100;
    const sideEffects = await getSideEffects(pageNumber, pageSize);
    return {
        ok: true,
        data: sideEffects,
        description: 'List modules that cannot be tree-shaken, grouped by bailout reason. bailoutReason explains exactly why the bundler kept a module: "side effects" means package.json declares the package has side effects or the field is missing; "dynamic import" means the module is loaded via import() and its exports are unknown at build time; "unknown exports" means the module uses non-static export patterns (e.g. module.exports = ...) that the bundler cannot analyze statically. In Rspack, the innerGraph and providedExports optimizations are disabled for such modules, preventing dead-code elimination even in production mode. Results are split into node_modules packages and user code with per-package statistics. Fixing node_modules entries usually requires patching "sideEffects" in the upstream package or adding it to bundler sideEffects config; fixing user code requires converting to named ESM exports. Reference: https://www.rspack.dev/guide/optimization/tree-shaking'
    };
}
async function getExportsAnalysis() {
    const exports = await getModuleExports();
    return {
        ok: true,
        data: exports,
        description: "Analyze module exports to identify tree-shaking opportunities. Shows which exports exist across all modules so you can cross-reference with actual import usage. Exports that are never imported are candidates for removal. Re-exported barrel files (index.ts that re-exports everything) are a common cause of poor tree-shaking because the bundler must retain all transitive exports unless every consumer uses named imports exclusively. Rspack's providedExports and re-export analysis can redirect imports through re-export chains directly to source modules — but only when all exports use static ESM syntax. Mark side-effect-free calls with /*#__PURE__*/ to help the minimizer remove them safely. Reference: https://www.rspack.dev/guide/optimization/tree-shaking"
    };
}
function registerTreeShakingCommands(program, execute) {
    const treeShakingProgram = program.command('tree-shaking').description("Tree-shaking analysis operations (E1007, E1008, E1009). Tree shaking removes unused exports to reduce bundle size. It requires ES modules (import/export syntax), production mode, and correct sideEffects config. Rspack applies usedExports, sideEffects, providedExports, and innerGraph optimizations automatically in production. Reference: https://www.rspack.dev/guide/optimization/tree-shaking");
    treeShakingProgram.command('side-effects-only').description('Detect modules pulled in solely for side effects (E1007). Indicates tree-shaking failures from missing/incorrect "sideEffects" in package.json or bare `import "module"` patterns.').action(function() {
        return execute(()=>detectSideEffectsOnlyImports());
    });
    treeShakingProgram.command('cjs-require').description("Detect bare `require()` calls that prevent tree-shaking (E1008). Fix by using destructured require or ESM imports.").action(function() {
        return execute(()=>detectCjsRequire());
    });
    treeShakingProgram.command('esm-to-cjs').description("Detect ESM imports resolved to CJS despite an ESM entry being available (E1009). Fix via resolve.mainFields or resolve.conditionNames bundler config.").action(function() {
        return execute(()=>detectEsmResolvedToCjs());
    });
    treeShakingProgram.command('summary').description("Comprehensive tree-shaking health summary: all rule violations (E1007/E1008/E1009) plus per-module bailout reasons. Use this as the starting point when diagnosing unexpected bundle size growth.").action(function() {
        return execute(()=>getTreeShakingSummary());
    });
    treeShakingProgram.command('bailout-reasons').description("List modules that cannot be tree-shaken grouped by bailout reason (side effects / dynamic import / unknown exports). Results are split into node_modules and user code with per-package statistics.").option('--page-number <pageNumber>', 'Page number (default: 1)').option('--page-size <pageSize>', 'Page size (default: 100, max: 1000)').action(function() {
        const options = this.opts();
        return execute(()=>getBailoutModules(options.pageNumber, options.pageSize));
    });
    treeShakingProgram.command('exports-analysis').description("Analyze module exports to identify unused exports and barrel-file anti-patterns that hurt tree-shaking. Cross-reference with actual import usage to find removal candidates.").action(function() {
        return execute(()=>getExportsAnalysis());
    });
}
const command_program = new Command();
command_program.name('rsdoctor-skill').description('Rsdoctor skill CLI').option('--data-file <path>', 'Path to rsdoctor-data.json file (required)').option('--compact', 'Compact JSON output').showHelpAfterError().showSuggestionAfterError();
const command_execute = async (handler)=>{
    const opts = command_program.opts();
    const compact = true === opts.compact || 'true' === opts.compact;
    const spacing = compact ? 0 : 2;
    try {
        const result = await handler();
        if (result && 'object' == typeof result && 'ok' in result) {
            console.log(JSON.stringify(result, null, spacing));
            if (!result.ok) process.exit(1);
        } else printResult(result, compact);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(JSON.stringify({
            ok: false,
            error: message
        }, null, spacing));
        process.exit(1);
    }
};
registerChunkCommands(command_program, command_execute);
registerModuleCommands(command_program, command_execute);
registerPackageCommands(command_program, command_execute);
registerRuleCommands(command_program, command_execute);
registerAssetCommands(command_program, command_execute);
registerLoaderCommands(command_program, command_execute);
registerBuildCommands(command_program, command_execute);
registerErrorCommands(command_program, command_execute);
registerServerCommands(command_program, command_execute);
registerTreeShakingCommands(command_program, command_execute);
async function run() {
    if (process.argv.length <= 2) command_program.help({
        error: true
    });
    await command_program.parseAsync(process.argv);
    closeAllSockets();
}
run().catch((error)=>{
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
});
export { __webpack_require__ };
