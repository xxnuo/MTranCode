import { commands, ExtensionContext } from "vscode";
import { changeTargetLanguage, changeTranslateSource, openOutputPannel, toggleBrowseMode, toggleEnableHover, toggleMultiLineMerge, toggleTempBrowseMode } from "./changeTargetLanguage";
import { quickTranslationCommand, selectAllComment, selectAllText, translateAllComment, translateAllText } from "./file";
import { nameVariableCommand, replaceRange, replaceSelections } from "./replaceSelections";
import { addSelection, clipboard, selectLastHover } from "./select";

export function registerCommands(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('mtrancode.select', selectLastHover),
        commands.registerCommand('mtrancode._addSelection', addSelection),
        commands.registerCommand('mtrancode.selectAllText', selectAllText),
        commands.registerCommand('mtrancode.translateAllText', translateAllText),
        commands.registerCommand('mtrancode.selectAllComment', selectAllComment),
        commands.registerCommand('mtrancode.translateAllComment', translateAllComment),
        commands.registerCommand('mtrancode.clipboard', clipboard), // delete
        commands.registerCommand('mtrancode._replaceRange', replaceRange),
        commands.registerCommand('mtrancode.replaceSelections', replaceSelections), // add context
        commands.registerCommand('mtrancode._toggleMultiLineMerge', toggleMultiLineMerge),
        commands.registerCommand('mtrancode.changeTranslateSource', changeTranslateSource),
        commands.registerCommand('mtrancode._openOutputPannel', openOutputPannel),
        commands.registerCommand('mtrancode.toggleEnableHover', toggleEnableHover),
        commands.registerCommand('mtrancode.toggleBrowseMode', toggleBrowseMode), // add keyboard
        commands.registerCommand('mtrancode.toggleDocumentBrowseMode', toggleTempBrowseMode), // add keyboard & add context
        commands.registerCommand('mtrancode.openDocumentBrowseMode', toggleTempBrowseMode), // add keyboard & add context
        commands.registerCommand('mtrancode.closeDocumentBrowseMode', toggleTempBrowseMode), // add keyboard & add context
        commands.registerCommand('mtrancode.changeTargetLanguage', changeTargetLanguage),
        commands.registerCommand('mtrancode.translateForCopilotChat', quickTranslationCommand), // add context
        commands.registerCommand('mtrancode.nameVariable', nameVariableCommand), // add keyboard
    );
}
