import { UserModel } from "../pages/admin/users/model/user.model";

export class DataContract {
  data!: UserModel[];
  total!: number;
  page!: number;
  limit!: number;
}
