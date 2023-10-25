import React, { createRef, useEffect, useRef, useState } from 'react';
import { createCamelEditor, createUrl, createWebSocketAndStartClient, performInit } from '../common';
import { ExtensionHostKind, registerExtension } from 'vscode/extensions';

import javaSytaxUrl from  '../assets/java.tmLanguage.json?url'


import { buildWorkerDefinition } from 'monaco-editor-workers';
buildWorkerDefinition('../../node_modules/monaco-editor-workers/dist/workers/', new URL('', window.location.href).href, false);


const CodeEditor = ({ setJavaCode }) => {

  const editorRef = useRef()
  const ref = createRef()

  const defaultContent = `import org.apache.camel.builder.RouteBuilder;

    public class RouteBuilderImpl extends RouteBuilder {
    
        @Override
        public void configure() throws Exception {
    
            //Write your route here
    
        }
    }`.trim()

  let camelLspSocket;
  let javaLSPSocket;

  useEffect(() => {
    const currentEditor = editorRef.current

    if (ref.current != null) {
      const start = async () => {
        await performInit(true)
        const { editor } = await createCamelEditor({
          htmlElement: ref.current,
          content: defaultContent
        })

        editorRef.current = editor

        editor.onDidChangeModelContent(_ => {
          setJavaCode(editor.getValue())
        })

        camelLspSocket = createWebSocketAndStartClient(createUrl('localhost', 8025, '/camel-language-server'))
        javaLSPSocket = createWebSocketAndStartClient(createUrl('localhost', 8080, '/ws/javaLSP'))
        registerExtension({
          name: 'camel-client',
          publisher: 'jximi',
          version: '1.0.0',
          engines: {
            vscode: '^1.78.0'
          },
          contributes: {
            languages: [{
              id: 'java',
              aliases: [
                'Java'
              ],
              extensions: [
                '.java',
              ]
            }]
          }
        }, ExtensionHostKind.LocalProcess)
        
        const result = registerExtension({
          name: 'java-client',
          publisher: 'jximi',
          version: '1.0.0',
          engines: {
            vscode: '^1.78.0'
          },
          contributes: {
            grammars: [
              {
                language: 'java',
                scopeName: 'source.java',
                path: '/syntaxes/java.tmLanguage.json'
              }
            ],
            languages: [
              {
                id: 'java',
                extensions: [
                  ".java"
                ],
                aliases: [
                  "Java"
                ],
              }
            ],
            "configuration": {
              "title": "Java configuration",
              "properties": {
                "java.home": {
                  "type": "string",
                  "description": "Absolute path to your Java home directory"
                },
                "java.classPath": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Relative paths from workspace root to .jar files, .zip files, or folders that should be included in the Java class path"
                },
                "java.docPath": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Relative paths from workspace root to .jar files or .zip files containing source code, or to folders that should be included in the Java doc path"
                },
                "java.externalDependencies": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "pattern": "^[^:]+:[^:]+:[^:]+(:[^:]+:[^:]+)?$"
                  },
                  "description": "External dependencies of the form groupId:artifactId:version or groupId:artifactId:packaging:version:scope"
                },
                "java.testMethod": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Command to run one test method, for example [\"mvn\", \"test\", \"-Dtest=${class}#${method}\""
                },
                "java.debugTestMethod": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Command to debug one test method, for example [\"mvn\", \"test\", \"-Dmaven.surefire.debug\", \"-Dtest=${class}#${method}\". The test should start paused, listening for the debugger on port 5005."
                },
                "java.testClass": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Command to run all tests in a class, for example [\"mvn\", \"test\", \"-Dtest=${class}\""
                },
                "java.addExports": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "List of modules to allow access to, for example [\"jdk.compiler/com.sun.tools.javac.api\"]"
                },
                "java.trace.server": {
                  "scope": "window",
                  "type": "string",
                  "enum": [
                    "off",
                    "messages",
                    "verbose"
                  ],
                  "default": "off",
                  "description": "Traces the communication between VSCode and the language server."
                }
              }
            },
            "configurationDefaults": {
              "[java]": {
                "editor.formatOnSave": true
              }
            }
          }
        }, ExtensionHostKind.LocalProcess)
        result.registerFileUrl('/syntaxes/java.tmLanguage.json', javaSytaxUrl)
      }
      start()

      return () => {
        currentEditor?.dispose()
      }
    }
  }, [])


  return <div>
    <div ref={ref} style={{ height: '50vh' }} />
  </div>
};

export default CodeEditor;