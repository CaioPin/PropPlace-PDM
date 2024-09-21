type ErroComStatus = { status: number };

function pegaStatusDeErro(erro: unknown): ErroComStatus | undefined {
  if (typeof erro === "object" && erro !== null && "status" in erro) {
    const erroComStatus = erro as { status: unknown; };

    if (typeof erroComStatus.status === "number") {
      return {status: erroComStatus.status};
    }
  }
  return undefined;
}

export { pegaStatusDeErro };
