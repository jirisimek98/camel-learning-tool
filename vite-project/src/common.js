import { editor, languages } from 'monaco-editor';
import { createConfiguredEditor, createModelReference } from 'vscode/monaco';
import '@codingame/monaco-vscode-theme-defaults-default-extension';
import '@codingame/monaco-vscode-json-default-extension';
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import getLanguageServiceOverride from 'vscode/service-override/languages'
import { initServices, MonacoLanguageClient } from 'monaco-languageclient';
import { CloseAction, ErrorAction } from 'vscode-languageclient';
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';
import { Uri } from 'vscode';

import * as vscode from 'vscode'

export const createLanguageClient = (transports) => {
    return new MonacoLanguageClient({
        name: 'Camel Language Client',
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['java'],
            // disable the default error handler
            errorHandler: {
                error: () => ({ action: ErrorAction.Continue }),
                closed: () => ({ action: CloseAction.DoNotRestart })
            },
            synchronize: {
                fileEvents: [vscode.workspace.createFileSystemWatcher('**')]
            }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: () => {
                return Promise.resolve(transports);
            }
        }
    });
};

export const createUrl = (hostname, port, path, searchParams = {}, secure = false) => {
    const protocol = secure ? 'wss' : 'ws';
    const url = new URL(`${protocol}://${hostname}:${port}${path}`);

    for (let [key, value] of Object.entries(searchParams)) {
        if (value instanceof Array) {
            value = value.join(',');
        }
        if (value) {
            url.searchParams.set(key, value);
        }
    }

    return url.toString();
};

export const createWebSocketAndStartClient = (url) => {
    const webSocket = new WebSocket(url);
    webSocket.onopen = () => {
        const socket = toSocket(webSocket);
        const reader = new WebSocketMessageReader(socket);
        const writer = new WebSocketMessageWriter(socket);
        const languageClient = createLanguageClient({
            reader,
            writer
        });
        languageClient.start();
        vscode.languages.getLanguages().then(console.log)

        reader.onClose(() => languageClient.stop());
    };
    return webSocket;
};

export const createDefaultJsonContent = () => {
    return `{
    "$schema": "http://json.schemastore.org/coffeelint",
    "line_endings": "unix"
}`;
};


export const performInit = async (vscodeApiInit) => {
    if (vscodeApiInit === true) {
        await initServices({
            userServices: {
                ...getThemeServiceOverride(),
                ...getTextmateServiceOverride(),
                ...getConfigurationServiceOverride(Uri.file('/workspace')),
                ...getKeybindingsServiceOverride(),
                ...getLanguageServiceOverride()
            },
            debugLogging: true
        });
    }
};

export const createCamelEditor = async (config) => {
    // create the model
    const uri = Uri.parse('/workspace/RouteBuilderImpl.java');
    const modelRef = await createModelReference(uri, config.content);
    modelRef.object.setLanguageId('java');

    // create monaco editor
    const editor = createConfiguredEditor(config.htmlElement, {
        model: modelRef.object.textEditorModel,
        glyphMargin: true,
        lightbulb: {
            enabled: true
        },
        automaticLayout: true
    });

    const result = {
        editor,
        uri,
        modelRef
    };
    return Promise.resolve(result);
};