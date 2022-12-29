import { IDependencyPage } from 'jfrog-ide-webview';
import * as vscode from 'vscode';
import { Severity } from '../../../types/severity';
import { CveTreeNode } from '../descriptorTree/cveTreeNode';
import { CodeFileTreeNode } from './codeFileTreeNode';
import { CodeIssueTreeNode } from './codeIssueTreeNode';

/**
 * Describe a cve applicable evidence issue
 */
export class ApplicableTreeNode extends CodeIssueTreeNode {
    constructor(issueId: string, private _node: CveTreeNode, parent: CodeFileTreeNode, regionWithIssue: vscode.Range, severity?: Severity) {
        super(issueId, parent, regionWithIssue, severity);
    }

    /**
     * Get the cve details page of the issue
     */
    public getDetailsPage(): IDependencyPage {
        return this._node.getDetailsPage();
    }
}
