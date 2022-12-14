import * as vscode from 'vscode';
import { ExtensionComponent } from '../extensionComponent';
import { TreesManager } from '../treeDataProviders/treesManager';
import { AbstractCodeActionProvider } from './abstractCodeActionProvider';
// import { GoCodeActionProvider } from './goCodeActionProvider';
// import { MavenCodeActionProvider } from './mavenCodeActionProvider';
// import { NpmCodeActionProvider } from './npmCodeActionProvider';
// import { PypiCodeActionProvider } from './pypiCodeActionProvider';
// import { YarnCodeActionProvider } from './yarnCodeActionProvider';
// import { ApplicabilityCodeActionProvider } from './applicabilityActionProvider';

import { AbstractFileActionProvider } from './abstractFileActionProvider';
import { DescriptorActionProvider } from './descriptorActionProvider';

/**
 * In case of project descriptor (i.e package.json) open, perform:
 * 1. Populate the 'Problems' view with top severities of the project dependencies.
 * 2. Provide vulnerabilities icons on the left gutter white line under a dependency in the project descriptor.
 *
 * In case of source code file open, perform:
 * 1. Populate the 'Problems' view with top severities of the CVEs vulnerabilities.
 * 2. Provide red, yellow, green or white line under a vulnerable line in the source code file.
 */
export class DiagnosticsManager implements ExtensionComponent {
    private _codeActionProviders: (AbstractCodeActionProvider /*| ApplicabilityCodeActionProvider */ | AbstractFileActionProvider)[] = [];

    constructor(treesManager: TreesManager) {
        let diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection();
        this._codeActionProviders
            .push
            // new NpmCodeActionProvider(diagnosticCollection, treesManager),
            // new YarnCodeActionProvider(diagnosticCollection, treesManager),
            // new PypiCodeActionProvider(diagnosticCollection, treesManager),
            // new GoCodeActionProvider(diagnosticCollection, treesManager),
            // new MavenCodeActionProvider(diagnosticCollection, treesManager),
            // new ApplicabilityCodeActionProvider(diagnosticCollection, treesManager)
            ();

        this._codeActionProviders.push(new DescriptorActionProvider(diagnosticCollection, treesManager));
    }

    public activate(context: vscode.ExtensionContext) {
        this._codeActionProviders.forEach(codeActionProvider => codeActionProvider.activate(context));
    }
}
