import { EmpresaModel } from "../pages/admin/empresas/model/empresa.model";
import { UserModel } from "../pages/admin/users/model/user.model";

export class DataContract {
  data!: UserModel[] | EmpresaModel[];
  total!: number;
  page!: number;
  limit!: number;
}
