import * as vscode from 'vscode';

import { CacheManager } from '../../main/cache/cacheManager';
import { TestMemento } from './utils/testMemento.test';

/**
 * Test functionality of @class CacheManager and  @class IssuesCache.
 */
describe('Scan Cache Manager Tests', () => {
    //
    let cacheManager: CacheManager = new CacheManager();

    before(() => {
        cacheManager.activate({
            workspaceState: new TestMemento() as vscode.Memento
        } as vscode.ExtensionContext);
    });

    it('Data has issues/information', () => {
        //
    });

    it('No data', () => {
        //
    });

    it('With data', () => {
        //
    });
});
