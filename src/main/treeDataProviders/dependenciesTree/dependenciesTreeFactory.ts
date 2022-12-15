import { IUsageFeature } from 'jfrog-client-js';
import * as vscode from 'vscode';
import { ConnectionManager } from '../../connect/connectionManager';
import { ProjectDetails } from '../../types/projectDetails';
import { PackageType } from '../../types/projectType';
import { GoUtils } from '../../utils/goUtils';
import { MavenUtils } from '../../utils/mavenUtils';
import { NpmUtils } from '../../utils/npmUtils';
import { NugetUtils } from '../../utils/nugetUtils';
import { PypiUtils } from '../../utils/pypiUtils';
// import { ScanUtils } from '../../utils/scanUtils';
import { YarnUtils } from '../../utils/yarnUtils';
import { TreesManager } from '../treesManager';
import { DependenciesTreeNode } from './dependenciesTreeNode';

export class DependenciesTreesFactory {
    public static async createDependenciesTrees(
        projectDescriptors: Map<PackageType, vscode.Uri[]>,
        workspaceFolders: vscode.WorkspaceFolder[],
        componentsToScan: ProjectDetails[],
        treesManager: TreesManager,
        parent: DependenciesTreeNode
    ) {
        if (!treesManager.connectionManager.areXrayCredentialsSet()) {
            return;
        }

        this.sendUsageReport(projectDescriptors, treesManager.connectionManager);
        // let tasks: Promise<void>[] = [];
        // tasks.push(GoUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Go), componentsToScan, treesManager, parent, quickScan),
        // NpmUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Npm), componentsToScan, treesManager, parent, quickScan),
        // YarnUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Yarn), componentsToScan, treesManager, parent, quickScan),
        // PypiUtils.createDependenciesTrees(
        //     projectDescriptors.get(PackageType.Python),
        //     workspaceFolders,
        //     componentsToScan,
        //     treesManager,
        //     parent,
        //     quickScan
        // ),
        // MavenUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Maven), componentsToScan, treesManager, parent, quickScan),
        // NugetUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Nuget), componentsToScan, treesManager, parent, quickScan)
        // );
        await GoUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Go), componentsToScan, treesManager, parent);
        await NpmUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Npm), componentsToScan, treesManager, parent, false);
        await YarnUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Yarn), componentsToScan, treesManager, parent, false);
        await PypiUtils.createDependenciesTrees(
            projectDescriptors.get(PackageType.Python),
            workspaceFolders,
            componentsToScan,
            treesManager,
            parent,
            false
        );
        await MavenUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Maven), componentsToScan, treesManager, parent, false);
        await NugetUtils.createDependenciesTrees(projectDescriptors.get(PackageType.Nuget), componentsToScan, treesManager, parent, false);

        // await Promise.all(tasks);
    }

    /**
     * Sends usage report for all techs we found project descriptors of.
     * @param projectDescriptors - map of all project descriptors by their tech.
     * @param connectionManager - manager containing Artifactory details if configured.
     */
    private static async sendUsageReport(projectDescriptors: Map<PackageType, vscode.Uri[]>, connectionManager: ConnectionManager) {
        let featureArray: IUsageFeature[] = [];
        for (const [techEnum, descriptors] of projectDescriptors.entries()) {
            // Only add to usage if found descriptors for tech.
            if (!!descriptors) {
                const featureName: string = PackageType[techEnum].toLowerCase() + '-deps';
                featureArray.push({ featureId: featureName });
            }
        }
        await connectionManager.sendUsageReport(featureArray);
    }
}
