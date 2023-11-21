import { Request, Response, Router } from "express";
const router = Router();

import { getZone, getAllZones, registerZone, updateZone, deleteZone } from "./controllers/ZonaController";
import { login, getUserPrivate ,getPosto, getAllPostos, SignUp, updatePosto, deletePosto } from "./controllers/PostoController";
import { getMedicamento, getAllMedicamentos, registerMedicamento, updateMedicamento, deleteMedicamento } from "./controllers/MedicamentoController";

import { authMiddleware } from "./middlewares/authMiddleware";

//Zona
router.get("/getZone/:id", getZone);
router.get("/getAllZones", getAllZones);
router.post("/register-zone", registerZone);
router.put("/update-zone/:id", updateZone);
router.delete("/delete-zone/:id", deleteZone);

//Posto
router.get("/getPosto/:id", getPosto);
router.get("/getAllPostos", getAllPostos);
router.get("/private/access", authMiddleware, getUserPrivate);
router.post("/signUp/:zonaId", SignUp);
router.post("/login", login);
router.put("/update-posto/:id/:zonaId", updatePosto);
router.delete("/delete-posto/:id", deletePosto);

//Medicamento
router.get("/getMedicamento/:id", getMedicamento);
router.get("/getAllMedicamentos/", getAllMedicamentos);
router.post("/register-medicamento/:postoId", registerMedicamento);
router.put("/update-medicamento/:id/:postoId", updateMedicamento);
router.delete("/delete-medicamento/:id", deleteMedicamento);

export { router };