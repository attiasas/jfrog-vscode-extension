import { IAnalysisStep, ISecretsPage, PageType } from 'jfrog-ide-webview';
import * as vscode from 'vscode';
import { FileRegion } from '../../../scanLogic/scanRunners/analyzerModels';
import { CodeFileTreeNode } from './codeFileTreeNode';
import { CodeIssueTreeNode } from './codeIssueTreeNode';
import { SeverityUtils } from '../../../types/severity';
import { SecretsIssue } from '../../../scanLogic/scanRunners/secretsScan';

/**
 * Describe a Secrets issue
 */
export class SecretTreeNode extends CodeIssueTreeNode {
    private _fullDescription?: string;
    private _snippet?: string;

    constructor(issue: SecretsIssue, location: FileRegion, parent: CodeFileTreeNode) {
        super(
            issue.ruleId,
            parent,
            new vscode.Range(
                new vscode.Position(location.startLine, location.startColumn),
                new vscode.Position(location.endLine, location.endColumn)
            ),
            issue.severity,
            issue.ruleName
        );
        this._snippet = location.snippet?.text;
        this._fullDescription = issue.fullDescription;
    }

    public get snippet(): string | undefined {
        return this._snippet;
    }

    public get fullDescription(): string | undefined {
        return this._fullDescription;
    }

    /**
     * Get the CVE details page of the issue
     */
    public getDetailsPage(): ISecretsPage {
        return {
            pageType: PageType.Secrets,
            header: this.label,
            severity: SeverityUtils.toWebviewSeverity(this.severity),
            location: {
                file: this.parent.fileFullPath,
                snippet: this._snippet,
                row: this.regionWithIssue.start.line + 1,
                column: this.regionWithIssue.start.character
            } as IAnalysisStep,
            description: this._fullDescription
        } as ISecretsPage;
    }
}
