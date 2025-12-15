import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Dart Auto Extension está activa');

	// Escucha cuando se crean archivos con el FileSystemWatcher
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		workspaceFolders.forEach(folder => {
			// Vigilar todos los archivos creados sin extensión
			const watcher = vscode.workspace.createFileSystemWatcher(
				new vscode.RelativePattern(folder, '**/*'),
				false, // no ignorar creates
				true,  // ignorar changes
				true   // ignorar deletes
			);

			watcher.onDidCreate(async (uri) => {
				await handleFileCreation(uri);
			});

			context.subscriptions.push(watcher);
		});
	}

	// También escuchar el evento onWillCreateFiles (para algunos casos)
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

	// Comando manual para convertir archivos
	const convertCommand = vscode.commands.registerCommand(
		'dart-auto-extension.convertToDart',
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No hay ningún archivo abierto');
				return;
			}

			const currentPath = editor.document.uri.fsPath;
			const fileName = path.basename(currentPath);

			if (fileName.includes('.')) {
				vscode.window.showInformationMessage('El archivo ya tiene extensión');
				return;
			}

			const newPath = currentPath + '.dart';

			try {
				await vscode.workspace.fs.rename(
					editor.document.uri,
					vscode.Uri.file(newPath)
				);
				vscode.window.showInformationMessage(`Archivo renombrado a ${path.basename(newPath)}`);
			} catch (error) {
				vscode.window.showErrorMessage(`Error al renombrar: ${error}`);
			}
		}
	);

	context.subscriptions.push(convertCommand);
}

/**
 * Maneja la creación de archivos y agrega extensión .dart si es necesario
 */
async function handleFileCreation(uri: vscode.Uri): Promise<void> {
	if (!isDartWorkspace()) {
		return;
	}

	const filePath = uri.fsPath;
	const fileName = path.basename(filePath);

	// Comprueba si el archivo no tiene extensión
	const hasExtension = fileName.includes('.');

	if (hasExtension || fileName.length === 0) {
		return;
	}

	// Esperar un poco para que el archivo se cree completamente (por seguridad)
	await new Promise(resolve => setTimeout(resolve, 100));

	// si el archivo existe
	try {
		await vscode.workspace.fs.stat(uri);
	} catch {
		// si no existe
		return;
	}

	// Crear la nueva ruta con la extensión .dart
	const newPath = filePath + '.dart';
	const newUri = vscode.Uri.file(newPath);

	try {
		// Verificar si ya existe un archivo con ese nombre
		try {
			await vscode.workspace.fs.stat(newUri);
			console.log(`El archivo ${newPath} ya existe, no se puede renombrar`);
			return;
		} catch {
			// El archivo no existe, podemos continuar
		}

		// Renombrar el archivo
		await vscode.workspace.fs.rename(uri, newUri);
		console.log(`Archivo renombrado: ${fileName} → ${fileName}.dart`);

		// Abrir el archivo renombrado si no hay editor activo
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor || activeEditor.document.uri.fsPath === filePath) {
			const document = await vscode.workspace.openTextDocument(newUri);
			await vscode.window.showTextDocument(document);
		}
	} catch (error) {
		console.error('Error al renombrar archivo:', error);
	}
}

/**
 * Verifica si el workspace actual es un proyecto Dart/Flutter
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

	// Verificar si existe pubspec.yaml en alguna carpeta
	for (const folder of workspaceFolders) {
		const pubspecPath = path.join(folder.uri.fsPath, 'pubspec.yaml');
		try {
			if (fs.existsSync(pubspecPath)) {
				return true;
			}
		} catch {
			// Ignorar errores
		}
	}

	// Verificar si hay documentos Dart abiertos
	const hasDartDoc = vscode.workspace.textDocuments.some(
		doc => doc.languageId === 'dart' || doc.fileName.endsWith('.dart')
	);

	return hasDartDoc;
}

export function deactivate() {
	console.log('Dart Auto Extension ha sido desactivada');
}