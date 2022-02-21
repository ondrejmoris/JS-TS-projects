console.log("Iam server");
process.stdout.write("ahoooj");

type MyRequest = {
  type: "initialize" | "multiply";
  data: [number, number] | string;
};

type MyResponse = {
  type: "OK" | "Error";
  data: number | string;
};

function mluti(data: [number, number]): number {
  return data[0] * data[1];
}

function paraseRequest(request: MyRequest): MyResponse {
  if (request.type === "initialize") {
    return { type: "OK", data: "its ok" };
  }
  if (request.type === "multiply") {
    if (Array.isArray(request.data)) {
      return { type: "OK", data: mluti(request.data) };
    }
  }
  return { type: "Error", data: "Undefined request!" };
}

process.stdin.on("data", (data: Buffer) => {
  console.log(paraseRequest(JSON.parse(Buffer.from(data).toString())));
});
