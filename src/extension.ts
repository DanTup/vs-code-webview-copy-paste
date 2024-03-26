import * as vs from 'vscode';
import * as express from 'express';

export async function activate(context: vs.ExtensionContext) {
	await vs.commands.executeCommand("workbench.action.closeAllEditors");

	// Create an editor with some text to copy/paste.
	const doc = await vs.workspace.openTextDocument({ language: "text", content: "Sample text to copy/paste\n\n".repeat(10) });
	await vs.window.showTextDocument(doc);


	// Set up a simple HTTP server to serve the app.
	const app = express()
	const port = 3000

	app.get('/', (_req, res) => {
		res.send(`
			<html>
			<head>
			</head>
			<body bgcolor="#999999">
				<h1>Inner Frame Content</h1>

				<input type="text" width="400" />
			</body>
			</html>
			`)
	})

	const server = app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})

	context.subscriptions.push({
		dispose: () => {
			server.close();
			server.closeAllConnections();
		}
	})


	// Create a webview.
	const panel = vs.window.createWebviewPanel("myWebView", "My WebView", vs.ViewColumn.Beside, {
		enableScripts: true,
		localResourceRoots: [],
		retainContextWhenHidden: true,
	});
	panel.webview.html = `
			<html>
			<head>
			</head>
			<body bgcolor="#666666">
				<h1>WebView HTML Content</h1>
				<iframe id="myFrame" src="http://localhost:3000/" frameborder="0" width="600" height="600" allow2222="clipboard-read; clipboard-write"></iframe>
			</body>
			</html>
			`;

}

export function deactivate() { }
