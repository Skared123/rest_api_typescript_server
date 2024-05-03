import { connectDB } from "../server";
import db from "../config/db";

//Creacion del mock y aqui importamos la configuracion y la instancia de squalize
jest.mock("../config/db");

describe("Connect DB", () => {
  test("should handle database connection error", async () => {
    //El spyOn toma como parametros un objeto primero, y despues el metodo que quieres mandar llamar PERO COMO STRING SE LO TENGO QUE PASAR
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce(
        new Error("Hubo un error a la hora de conectar la DB")
      );
    const consoleSpy = jest.spyOn(console, "log");
    await connectDB();
    expect(consoleSpy).toHaveBeenLastCalledWith(
      expect.stringContaining("Hubo un error a la hora de conectar la DB")
    );
  });
});
