
import { initTranslate } from '../../src/translate/manager';
import got from 'got';
import { getConfig } from '../../src/configuration';
import { TranslateExtensionProvider } from '../../src/translate/translateExtension';

// Mock vscode
jest.mock('vscode', () => {
    class MockEventEmitter {
        event = jest.fn();
        fire = jest.fn();
        dispose = jest.fn();
    }
    return {
        env: { language: 'en' },
        window: {
            createOutputChannel: jest.fn(),
            showWarningMessage: jest.fn()
        },
        workspace: {
            onDidChangeConfiguration: jest.fn(),
            getConfiguration: jest.fn()
        },
        EventEmitter: MockEventEmitter,
        Disposable: {
            from: jest.fn()
        }
    };
}, { virtual: true });

// Mock configuration
jest.mock('../../src/configuration', () => ({
    getConfig: jest.fn(),
    onConfigChange: jest.fn()
}));

// Mock got
jest.mock('got', () => {
    return {
        __esModule: true,
        default: {
            get: jest.fn(),
            post: jest.fn()
        }
    };
});

// Mock TranslateExtensionProvider
jest.mock('../../src/translate/translateExtension', () => {
    return {
        TranslateExtensionProvider: jest.fn().mockImplementation(() => ({
            init: jest.fn()
        }))
    };
});

import { window } from 'vscode';

describe('initTranslate', () => {
    let mockContext: any;
    let mockInit: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockContext = {
            workspaceState: {
                get: jest.fn(),
                update: jest.fn()
            }
        };
        // Setup mockInit for each test
        mockInit = jest.fn();
        (TranslateExtensionProvider as unknown as jest.Mock).mockImplementation(() => ({
            init: mockInit
        }));
    });

    it('should use MTranServer when health check passes', async () => {
        (getConfig as jest.Mock).mockImplementation((key, def) => {
            if (key === 'source') return 'MTranServer';
            if (key === 'MTranServer.apiUrl') return 'http://localhost:8989';
            return def;
        });
        (got.get as jest.Mock).mockResolvedValue({});

        await initTranslate(mockContext);

        expect(got.get).toHaveBeenCalledWith('http://localhost:8989/health', expect.anything());
        expect(mockInit).toHaveBeenCalledWith('MTranServer');
        expect(window.showWarningMessage).not.toHaveBeenCalled();
    });

    it('should fallback to Google when health check fails', async () => {
        (getConfig as jest.Mock).mockImplementation((key, def) => {
            if (key === 'source') return 'MTranServer';
            if (key === 'MTranServer.apiUrl') return 'http://localhost:8989';
            return def;
        });
        (got.get as jest.Mock).mockRejectedValue(new Error('Fail'));

        await initTranslate(mockContext);

        expect(got.get).toHaveBeenCalledWith('http://localhost:8989/health', expect.anything());
        expect(mockInit).toHaveBeenCalledWith('Google');
        expect(window.showWarningMessage).toHaveBeenCalledWith('MTranServer service connection failed, using default engine (Google).');
    });

    it('should use configured source if not MTranServer', async () => {
        (getConfig as jest.Mock).mockImplementation((key, def) => {
            if (key === 'source') return 'Bing';
            return def;
        });

        await initTranslate(mockContext);

        expect(got.get).not.toHaveBeenCalled();
        expect(mockInit).toHaveBeenCalledWith('Bing');
    });
});
