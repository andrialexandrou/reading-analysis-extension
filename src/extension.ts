// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import analyzer from './analyzer';

class TreeDataProvider {
    constructor(treeData) {
        this._treeData = treeData;
    }
    
    getTreeItem(element) {
        return element;
    }
    
    getChildren(element) {
        if (!element) {
            return this._treeData;
        }
        return [];
    }
}

function treeNodeSelected(node) {
    console.log(`Selected node: ${node.label}`);
}

function showDetail() {
	vscode.window.showInformationMessage('hello')
}

function getOpenTextDocument() {
	return vscode.window.activeTextEditor?.document.getText();
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('ACTIVATED')

    const textData = getOpenTextDocument();

    const disposable = vscode.commands.registerCommand('reading-analysis-extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!', textData);
		console.log('again', textData)
	});
	context.subscriptions.push(disposable);

    let result
    try {
        result = analyzer(textData);
    } catch (e) {
        console.log(e)
    }
    console.log('result', result)

    const treeData = []
    
    ;['adverbs', 'passiveVoice', 'complex', 'hardSentences', 'veryHardSentences']
    .forEach((item, index) => {
        treeData.push({
            label: `${result[item].label}: ${result[item].count}`,
            id: (index + 1).toString(),
            description: `${result[item].ideal} maximum`
        })
    })
    const treeDataProvider = new TreeDataProvider(treeData);
    const treeView = vscode.window.createTreeView('reading-analysis-view', {
        treeDataProvider
    });
	vscode.window.createTreeView('reading-analysis-view', { treeDataProvider });
	vscode.commands.registerCommand('reading-analysis-view', treeNodeSelected);
	vscode.commands.registerCommand('reading-analysis-extension.showDetail', showDetail);
    context.subscriptions.push(treeView);

}

// This method is called when your extension is deactivated
export function deactivate() {}
