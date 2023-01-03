// import * as vscode from 'vscode';
// import * as path from 'path';
// import { assert } from 'chai';
import { IGraphResponse } from 'jfrog-client-js';
import { DescriptorIssuesData } from '../../main/cache/issuesCache';
// import { DescriptorTreeNode } from '../../main/treeDataProviders/issuesTree/descriptorTree/descriptorTreeNode';
// import { DescriptorUtils } from '../../main/treeDataProviders/utils/descriptorUtils';
// import { RootNode } from '../../main/treeDataProviders/dependenciesTree/dependenciesRoot/rootTree';

// import { IImpactedPath } from 'jfrog-ide-webview';
// import { PackageType } from '../../main/types/projectType';
// import { DependenciesTreeNode } from '../../main/treeDataProviders/dependenciesTree/dependenciesTreeNode';

/**
 * Test functionality of @class DescriptorUtils.
 */
describe('Descriptor Utils Tests', () => {
    // let tmpDir: vscode.Uri = vscode.Uri.file(path.join(__dirname, '..', 'resources', 'scanResponses'));

    // function createGraph() : RootNode {
    //     let root: RootNode = new RootNode("", PackageType.Unknown);

    //     return root;
    // }

    // function createDummyDependency() : DependenciesTreeNode [

    // ]

    describe('Calculate data from DependenciesTreeNode tests', () => {
        // let fullGraph: RootNode = createGraph();

        [
            {
                testName: 'No issues',
                data: {} as IGraphResponse
            }
        ].forEach(testCase => {
            it('create impacted paths for - ' + testCase.testName, () => {
                createAndValidateImpactedPaths(testCase.data);
            });
        });

        function createAndValidateImpactedPaths(response: IGraphResponse) {
            // let results: Map<string,IImpactedPath> = DescriptorUtils.createImpactedPaths(fullGraph,response);
            response;
        }

        [
            {
                testName: 'No issues',
                data: 'path'
            }
        ].forEach(testCase => {
            it('get dependencies graph - ' + testCase.testName, () => {
                getAndValidateDependenciesGraph(testCase.data);
            });
        });

        function getAndValidateDependenciesGraph(descriptorPath: string) {
            // let graph: RootNode | undefined = DescriptorUtils.getDependencyGraph(fullGraph,descriptorPath);
            descriptorPath;
        }
    });

    describe('Populate descriptor data tests', () => {
        [
            {
                testName: 'No issues',
                data: {} as DescriptorIssuesData
            },
            {
                testName: 'Vul issues',
                data: {} as DescriptorIssuesData
            },
            {
                testName: 'Violation issues',
                data: {} as DescriptorIssuesData
            }
        ].forEach(testCase => {
            it('populate and validate - ' + testCase.testName, () => {
                populateAndValidateDescriporNode(testCase.data);
            });
        });

        function populateAndValidateDescriporNode(data: DescriptorIssuesData) {
            // let descriptorNode: DescriptorTreeNode = new DescriptorTreeNode(data.fullpath);
            data;
            // let issueCount: number = DescriptorUtils.populateDescriptorData(descriptorNode, data);
            // assert.equal(issueCount, 0);
        }
    });
});
