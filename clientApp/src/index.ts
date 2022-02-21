import { spawn } from "child_process";

const server = spawn("cmd.exe", [
  "/c",
  "C:/repository/JSprojects/serverApp/node_modules/.bin/ts-node.cmd",
  "C:/repository/JSprojects/serverApp/src/index.ts",
]);

server.stdin.write(
  Buffer.from(JSON.stringify({ type: "initialize", data: "zdravim" }))
);

server.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

server.stderr.on("data", (data) => {
  console.log(data);
});

server.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
