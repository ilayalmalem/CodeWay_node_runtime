const Terminal = require("./terminal.class.js").Terminal;
const { spawn } = require('child_process');

let terminalServer = new Terminal({
    role: "server",
    shell: (process.platform === "win32") ? "cmd.exe" : "bash",
    port: process.env.port_id
});

process.stdout.write('done')

terminalServer.onclosed = (code, signal) => {
    console.log("Terminal closed - "+code+", "+signal);
};

terminalServer.onopened = () => {
    console.log(`Connected to remote server shiuld be in container_id of ${terminalServer.containerId}`);
};
terminalServer.onresized = (cols, rows) => {
    console.log("Resized terminal to "+cols+"x"+rows);
};
terminalServer.ondisconnected = () => {
    console.log("Remote disconnected");
};