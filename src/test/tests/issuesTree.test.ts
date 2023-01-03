import * as vscode from 'vscode';
import * as path from 'path';
import { IssuesRootTreeNode } from '../../main/treeDataProviders/issuesTree/issuesRootTreeNode';
// import { FileTreeNode } from '../../main/treeDataProviders/issuesTree/fileTreeNode';
// import { IssueTreeNode } from '../../main/treeDataProviders/issuesTree/issueTreeNode';
// import { Severity } from '../../main/types/severity';
import { assert } from 'chai';
import { FileTreeNode } from '../../main/treeDataProviders/issuesTree/fileTreeNode';
import { Severity } from '../../main/types/severity';

/**
 * Test functionality of @class IssuesRootTreeNode.
 */
describe('Issues Tree Tests', () => {
    let testWorkspace: vscode.WorkspaceFolder = {
        uri: vscode.Uri.file(path.join(__dirname, '..', 'resources')),
        name: 'pom.xml-test',
        index: 0
    } as vscode.WorkspaceFolder;

    let root: IssuesRootTreeNode;

    describe('Tree Root Tests', () => {
        beforeEach(() => {
            root = new IssuesRootTreeNode(testWorkspace);
        });

        it('Root title test', () => {
            // No title
            assert.equal(root.description, '', 'Title expected to be empty');
            root.apply();
            assert.notInclude(root.tooltip, 'Status: ');
            // With title
            const title: string = 'test';
            root.title = title;
            root.apply();
            assert.equal(root.description, title);
            assert.include(root.tooltip, 'Status: ' + title);
        });

        it('Root timestamp test', () => {
            // time stamp is related to the childs! put this in validate function
        });

        it('No files', () => {
            assert.isEmpty(root.children);
        });

        it('One file no issues', () => {
            assert.isEmpty(root.children);
        });

        it('One file with issues', () => {
            assert.isEmpty(root.children);
        });

        it('Multiple files with issues', () => {
            assert.isEmpty(root.children);
        });
    });

    describe('File Node Tests', () => {
        beforeEach(() => {
            root = new IssuesRootTreeNode(testWorkspace);
        });

        [
            {
                test: 'Node without reason',
                data: FileTreeNode.createFailedScanNode('folder/path'),
                expectedName: 'path - [Fail to scan]'
            },
            {
                test: 'Node with reason',
                data: FileTreeNode.createFailedScanNode('path', 'reason'),
                expectedName: 'path - reason'
            }
        ].forEach(testCase => {
            it('Failed scan file test - ' + testCase.test, () => {
                assert.exists(testCase.data);
                assert.deepEqual(testCase.data.severity, Severity.Unknown);

                assert.equal(testCase.data.name, testCase.expectedName);
                root.addChild(testCase.data);
                root.apply();
                assert.equal(testCase.data.name, testCase.expectedName);
            });
        });

        it('timestamp test', () => {
            // tooltip include Last... and not
        });

        [
            {
                test: 'No issues',
                data: { path: 'path', issues: [] },
                expectedSeverity: Severity.Unknown,
                expectedDescription: ""
            },
            {
                test: 'One issue',
                data: { path: 'path', issues: [Severity.Low] },
                expectedSeverity: Severity.Low,
                expectedDescription: ""
            },
            {
                test: 'Multiple issues',
                data: { path: 'path', issues: [Severity.Low, Severity.Low, Severity.NotApplicableCritical, Severity.High] },
                expectedSeverity: Severity.High,
                expectedDescription: ""
            }
        ].forEach(testCase => {
            it('Children test - ' + testCase.test, () => {
                //
            });
        });
    });

    // function validateRoot(numFiles: number) {
    //     assert.equal(root.children.length,numFiles);

    //     // tooltip with/out title "Last..."
    //     // with /out time stamp
    // }

    // function createDummyFile(fullPath: string) : FileTreeNode {
    //     return new (class extends FileTreeNode {
    //         _issues: IssueTreeNode[] = [];
    //         constructor(fullPath: string, parent?: IssuesRootTreeNode, timeStamp?: number) {
    //             super(fullPath, parent, timeStamp);
    //         }
    //         /** @override */
    //         public get issues(): IssueTreeNode[] {
    //             return this._issues;
    //         }
    //     })(fullPath);
    // }

    // function createDummyIssue(id: string, severity: Severity): IssueTreeNode {
    //     return new IssueTreeNode(id,severity,id);
    // }
});
