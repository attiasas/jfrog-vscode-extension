import * as os from 'os';

import { ConnectionManager } from '../../connect/connectionManager';
import { LogManager } from '../../log/logManager';
import { AnalyzeIssue, AnalyzerScanResponse, AnalyzeScanRequest, FileRegion } from './analyzerModels';
import { BinaryRunner } from './binaryRunner';
import { Severity } from '../../types/severity';
import { Translators } from '../../utils/translators';

export interface SecretsScanResponse {
    filesWithIssues: SecretsFileIssues[];
}

export interface SecretsFileIssues {
    full_path: string;
    issues: SecretsIssue[];
}

export interface SecretsIssue {
    ruleId: string;
    severity: Severity;
    ruleName: string;
    fullDescription?: string;
    locations: FileRegion[];
}

export class SecretsRunner extends BinaryRunner {
    private static readonly BINARY_NAME: string = 'secrets_scanner';

    constructor(connectionManager: ConnectionManager, abortCheckInterval: number, logManager: LogManager) {
        super(
            connectionManager,
            abortCheckInterval,
            logManager
            // path.join(ScanUtils.getHomePath(), TerraformRunner.BINARY_FOLDER, TerraformRunner.getBinaryName())
        );
    }

    protected validateSupported(): boolean {
        if (os.platform() !== 'linux' && os.platform() !== 'darwin' && os.platform() !== 'win32') {
            this._logManager.logMessage("Eos scan is not supported on '" + os.platform() + "' os", 'DEBUG');
            return false;
        }
        return super.validateSupported();
    }

    /** @override */
    protected static getBinaryName(): string {
        let name: string = SecretsRunner.BINARY_NAME;
        switch (os.platform()) {
            case 'linux':
                return name + '_ubuntu';
            case 'darwin':
                return name + '_macos';
            case 'win32':
                return name + '.exe';
        }
        return name;
    }

    /** @override */
    public async runBinary(abortSignal: AbortSignal, yamlConfigPath: string): Promise<void> {
        await this.executeBinary(abortSignal, ['sec', yamlConfigPath]);
    }

    /**
     * Scan for Terraform issues
     * @param abortController - the controller that signals abort for the operation
     * @param requests - requests to run
     * @returns the response generated from the scan
     */
    public async scan(abortController: AbortController, directory: string): Promise<SecretsScanResponse> {
        let request: AnalyzeScanRequest = {
            type: 'secrets-scan',
            roots: [directory]
        } as AnalyzeScanRequest;
        return await this.run(abortController, true, request).then(runResult => this.generateScanResponse(runResult));
    }

    /**
     * Generate response from the run results
     * @param run - the run results generated from the binary
     * @returns the response generated from the scan run
     */
    public generateScanResponse(response?: AnalyzerScanResponse): SecretsScanResponse {
        if (!response) {
            return {} as SecretsScanResponse;
        }
        let iacResponse: SecretsScanResponse = {
            filesWithIssues: []
        } as SecretsScanResponse;

        for (const run of response.runs) {
            // Prepare
            let rulesFullDescription: Map<string, string> = new Map<string, string>();
            for (const rule of run.tool.driver.rules) {
                if (rule.fullDescription) {
                    rulesFullDescription.set(rule.id, rule.fullDescription.text);
                }
            }
            // Generate response data
            run.results?.forEach(analyzeIssue => this.generateIssueData(iacResponse, analyzeIssue, rulesFullDescription.get(analyzeIssue.ruleId)));
        }
        return iacResponse;
    }

    /**
     * Generate the data for a specific analyze issue (the file object, the issue in the file object and all the location objects of this issue).
     * If the issue also contains codeFlow generate the needed information for it as well
     * @param iacResponse - the response of the scan that holds all the file objects
     * @param analyzeIssue - the issue to handle and generate information base on it
     * @param fullDescription - the description of the analyzeIssue
     */
    public generateIssueData(iacResponse: SecretsScanResponse, analyzeIssue: AnalyzeIssue, fullDescription?: string) {
        analyzeIssue.locations.forEach(location => {
            let fileWithIssues: SecretsFileIssues = this.getOrCreateSecretsFileIssues(iacResponse, location.physicalLocation.artifactLocation.uri);
            let fileIssue: SecretsIssue = this.getOrCreateSecretsIssue(fileWithIssues, analyzeIssue, fullDescription);
            fileIssue.locations.push(location.physicalLocation.region);
        });
    }

    /**
     * Get or create issue in a given file if not exists
     * @param fileWithIssues - the file with the issues
     * @param analyzeIssue - the issue to search or create
     * @param fullDescription - the description of the issue
     * @returns - the eos issue
     */
    private getOrCreateSecretsIssue(fileWithIssues: SecretsFileIssues, analyzeIssue: AnalyzeIssue, fullDescription?: string): SecretsIssue {
        let potential: SecretsIssue | undefined = fileWithIssues.issues.find(issue => issue.ruleId === analyzeIssue.ruleId);
        if (potential) {
            return potential;
        }
        let fileIssue: SecretsIssue = {
            ruleId: analyzeIssue.ruleId,
            severity: Translators.levelToSeverity(analyzeIssue.level),
            ruleName: analyzeIssue.message.text,
            fullDescription: fullDescription,
            locations: []
        } as SecretsIssue;
        fileWithIssues.issues.push(fileIssue);
        return fileIssue;
    }

    /**
     * Get or create file with issues if not exists in the response
     * @param response - the response that holds the files
     * @param uri - the files to search or create
     * @returns - file with issues
     */
    private getOrCreateSecretsFileIssues(response: SecretsScanResponse, uri: string): SecretsFileIssues {
        let potential: SecretsFileIssues | undefined = response.filesWithIssues.find(fileWithIssues => fileWithIssues.full_path === uri);
        if (potential) {
            return potential;
        }
        let fileWithIssues: SecretsFileIssues = {
            full_path: uri,
            issues: []
        } as SecretsFileIssues;
        response.filesWithIssues.push(fileWithIssues);

        return fileWithIssues;
    }
}
