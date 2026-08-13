// shared/api/__tests__/api-error.test.ts
import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { parseApiError } from "../api-error";

function makeAxiosError(data: { message?: string; code?: string }, status: number) {
  return new AxiosError(
    "Request failed",
    "ERR_BAD_REQUEST",
    undefined,
    undefined,
    {
      status,
      statusText: "",
      headers: {},
      config: { headers: new AxiosHeaders() },
      data,
    } as AxiosError["response"]
  );
}

describe("parseApiError", () => {
  // 1 test. codigo conocido -> mensaje amigable mapeado
  it("mapea un codigo conocido del backend a su mensaje amigable", () => {
    const error = makeAxiosError({ code: "EMAIL_TAKEN", message: "duplicate key" }, 409);
    expect(parseApiError(error)).toEqual({
      message: "Ya existe una cuenta registrada con ese email.",
      status: 409,
      code: "EMAIL_TAKEN",
    });
  });

  // 2 test. codigo desconocido -> fallback al mensaje crudo del backend
  it("usa el mensaje crudo del backend cuando el codigo no esta mapeado", () => {
    const error = makeAxiosError({ code: "UNKNOWN_CODE", message: "algo raro paso" }, 400);
    expect(parseApiError(error).message).toBe("algo raro paso");
  });

  // 3 test. sin response de axios (error de red) -> mensaje generico
  it("devuelve un mensaje generico ante un Error comun", () => {
    expect(parseApiError(new Error("boom"))).toEqual({ message: "boom", status: 0 });
  });

  // 4 test. valor no reconocido -> mensaje desconocido
  it("devuelve mensaje desconocido para valores no reconocidos", () => {
    expect(parseApiError("algo").message).toBe("Error desconocido");
  });
});
