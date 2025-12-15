import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Dart Auto Extension is active');

	// Listen when files are created with FileSystemWatcher
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		workspaceFolders.forEach(folder => {
			// Watch all files created without extension in any lib folder
			const watcher = vscode.workspace.createFileSystemWatcher(
				new vscode.RelativePattern(folder, '**/lib/**/*'),
				false, // don't ignore creates
				true,  // ignore changes
				true   // ignore deletes
			);

			watcher.onDidCreate(async (uri) => {
				await handleFileCreation(uri);
			});

			context.subscriptions.push(watcher);
		});
	}

	// Also listen to the onWillCreateFiles event (for some cases)
	const willCreateDisposable = vscode.workspace.onWillCreateFiles(async (event) => {
		if (!isDartWorkspace()) {
			return;
		}

		const edits: { oldUri: vscode.Uri; newUri: vscode.Uri }[] = [];

		for (const fileUri of event.files) {
			const fileName = path.basename(fileUri.fsPath);
			const hasExtension = fileName.includes('.');

			if (!hasExtension && fileName.length > 0) {
				const newUri = vscode.Uri.file(fileUri.fsPath + '.dart');
				edits.push({ oldUri: fileUri, newUri });
			}
		}

		if (edits.length > 0) {
			event.waitUntil(
				new Promise<vscode.WorkspaceEdit>(async (resolve) => {
					const workspaceEdit = new vscode.WorkspaceEdit();
					for (const edit of edits) {
						workspaceEdit.renameFile(edit.oldUri, edit.newUri, {
							overwrite: false,
							ignoreIfExists: true
						});
					}
					resolve(workspaceEdit);
				})
			);
		}
	});

	context.subscriptions.push(willCreateDisposable);

	// Manual command to convert files
	const convertCommand = vscode.commands.registerCommand(
		'dart-auto-extension.convertToDart',
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No file is open');
				return;
			}

			const currentPath = editor.document.uri.fsPath;
			const fileName = path.basename(currentPath);

			if (fileName.includes('.')) {
				vscode.window.showInformationMessage('File already has an extension');
				return;
			}

			const newPath = currentPath + '.dart';

			try {
				await vscode.workspace.fs.rename(
					editor.document.uri,
					vscode.Uri.file(newPath)
				);
				vscode.window.showInformationMessage(`File renamed to ${path.basename(newPath)}`);
			} catch (error) {
				vscode.window.showErrorMessage(`Error renaming: ${error}`);
			}
		}
	);

	context.subscriptions.push(convertCommand);
}

/**
 * Handles file creation and adds .dart extension if necessary
 */
async function handleFileCreation(uri: vscode.Uri): Promise<void> {
	if (!isDartWorkspace()) {
		return;
	}

	const filePath = uri.fsPath;
	const fileName = path.basename(filePath);

	// Check if the file has no extension
	const hasExtension = fileName.includes('.');

	if (hasExtension || fileName.length === 0) {
		return;
	}

	// Wait a bit for the file to be fully created (for safety)
	await new Promise(resolve => setTimeout(resolve, 100));

	// Check if the file exists
	try {
		await vscode.workspace.fs.stat(uri);
	} catch {
		// If it doesn't exist
		return;
	}

	// Create the new path with the .dart extension
	const newPath = filePath + '.dart';
	const newUri = vscode.Uri.file(newPath);

	try {
		// Check if a file with that name already exists
		try {
			await vscode.workspace.fs.stat(newUri);
			console.log(`File ${newPath} already exists, cannot rename`);
			return;
		} catch {
			// File doesn't exist, we can continue
		}

		// Rename the file
		await vscode.workspace.fs.rename(uri, newUri);
		console.log(`File renamed: ${fileName} → ${fileName}.dart`);

		// Open the renamed file if there's no active editor
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor || activeEditor.document.uri.fsPath === filePath) {
			const document = await vscode.workspace.openTextDocument(newUri);
			await vscode.window.showTextDocument(document);
		}
	} catch (error) {
		console.error('Error renaming file:', error);
	}
}

/**
 * Checks if the current workspace is a Dart/Flutter project
 */
function isDartWorkspace(): boolean {
	const config = vscode.workspace.getConfiguration('dartAutoExtension');
	const enabled = config.get<boolean>('enabled', true);

	if (!enabled) {
		return false;
	}

	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (!workspaceFolders) {
		return false;
	}

	// Check if pubspec.yaml exists in any folder
	for (const folder of workspaceFolders) {
		const pubspecPath = path.join(folder.uri.fsPath, 'pubspec.yaml');
		try {
			if (fs.existsSync(pubspecPath)) {
				return true;
			}
		} catch {
			// Ignore errors
		}
	}

	// Check if there are open Dart documents
	const hasDartDoc = vscode.workspace.textDocuments.some(
		doc => doc.languageId === 'dart' || doc.fileName.endsWith('.dart')
	);

	return hasDartDoc;
}

export function deactivate() {
	console.log('Dart Auto Extension has been deactivated');
}